import { Table, Tag } from "antd";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import AddCredit from "../Modal/addCredit";

const API = "  https://paraglive-backend.vercel.app/api/deposit";

const DepositTable = ({ totalOrder, reload, setReload, startIndex }) => {
  const [newUser, setNewUser] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const token = Cookies.get("token");
  const headers = { authorization: `Bearer ${token}` };

  // Credited deposits stay as the record of what was paid; everything else
  // (fake or mistaken submissions) can be removed.
  const isDeletable = (status) => status !== "completed";

  const removeDeposits = (ids) => {
    Swal.fire({
      title: ids.length > 1 ? `Delete ${ids.length} deposits?` : "Delete this deposit?",
      text: "It will be removed from the list. This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        if (ids.length === 1) {
          await axios.delete(`${API}/${ids[0]}`, { headers });
        } else {
          await axios.post(`${API}/delete-many`, { ids }, { headers });
        }
        Swal.fire("Deleted!", "The deposit was removed.", "success");
        setSelectedRowKeys([]);
        setReload(!reload);
      } catch (error) {
        Swal.fire(
          "Could not delete",
          error?.response?.data?.message || "Please try again.",
          "error",
        );
      }
    });
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Email",
      dataIndex: "invoice",
      key: "email",
      render: (_, { invoice }) => (
        <Tag className='cursor-pointer' color={"purple"}>
          {invoice}
        </Tag>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "name",
      key: "trx",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Currency",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Referral",
      dataIndex: "referral",
      key: "referral",
      render: (code) => (code ? <Tag color='gold'>{code}</Tag> : "-"),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        const colors = {
          pending: "#A52A2A",
          completed: "#006400",
          cancel: "#9D00FF",
          later: "#696",
        };
        return (
          <Tag color={colors[status] || "#368BC1"}>
            {String(status).toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, { key, status }) => (
        <div className='flex gap-2'>
          {status !== "completed" && (
            <label
              htmlFor='my-modal-21'
              onClick={() => findData(key)}
              className='text-white bg-green-600 cursor-pointer border-0 px-2 whitespace-nowrap'
            >
              Give Credit
            </label>
          )}
          {isDeletable(status) && (
            <button
              onClick={() => removeDeposits([key])}
              className='text-white bg-red-600 cursor-pointer border-0 px-2'
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  // Pick the exact deposit that was clicked. This used to look the row up by
  // user id, so a user with several deposits always credited the first one.
  const findData = (depositId) => {
    const found = totalOrder.find((a) => a._id == depositId);
    setNewUser(found);
  };

  const data = (totalOrder || []).map((a, index) => ({
    key: `${a._id}`,
    index: `${index + startIndex}`,
    invoice: `${a?.email}`,
    name: `${a?.trxid}`,
    provider: `${a?.provider}`,
    referral: a?.referralCode,
    amount: `$ ${a?.amount}`,
    status: `${a?.status}`,
  }));

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({ disabled: !isDeletable(record.status) }),
  };

  return (
    <div>
      <AddCredit user={newUser} setReload={setReload} reload={reload} />
      {selectedRowKeys.length > 0 && (
        <div className='my-2 flex items-center gap-3'>
          <span className='text-black'>
            {selectedRowKeys.length} selected
          </span>
          <button
            onClick={() => removeDeposits(selectedRowKeys)}
            className='bg-red-600 text-white px-3 py-1 rounded'
          >
            Delete selected
          </button>
        </div>
      )}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        pagination={false}
        dataSource={data}
        scroll={{
          x: 700,
        }}
      />
    </div>
  );
};

export default DepositTable;
