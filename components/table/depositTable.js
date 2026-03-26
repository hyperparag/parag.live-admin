import { Table, Tag, Tooltip } from "antd";
import React, { useContext, useState } from "react";
import AddCredit from "../Modal/addCredit";

const DepositTable = ({ totalOrder, reload, setReload, startIndex }) => {
  const [newUser, setNewUser] = useState({});
  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Email",
      dataIndex: "invoice",
      key: "name",

      render: (_, { invoice, id }) => (
        <>
          <Tag className="cursor-pointer" color={"purple"}>
            {invoice}
          </Tag>
        </>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "name",
      key: "name",
      //responsive: ["md"],
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
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (_, { status, id }) => (
        <>
          {status == "pending" && (
            <Tag color={"#A52A2A"}>{status.toUpperCase()}</Tag>
          )}
          {status == "completed" && (
            <Tag color={"#368BC1"}>{status.toUpperCase()}</Tag>
          )}
          {status == "shipping" && (
            <Tag color={"#E45E9D"}>{status.toUpperCase()}</Tag>
          )}
          {status == "delivered" && (
            <Tag color={"#006400"}>{status.toUpperCase()}</Tag>
          )}
          {status == "cancel" && (
            <Tag color={"#9D00FF"}>{status.toUpperCase()}</Tag>
          )}
          {status == "later" && (
            <Tag color={"#696"}>{status.toUpperCase()}</Tag>
          )}
          {status == "return" && (
            <Tag color={"#696"}>{status.toUpperCase()}</Tag>
          )}
        </>
      ),
      //responsive: ["md"],
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",

      render: (_, { id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor="my-modal-21"
              className="text-white bg-green-600 cursor-pointer  border-0 px-2"
            >
              Give Credit
            </label>
          </button>
        </>
      ),
    },
  ];
  const findData = (id) => {
    const ag = totalOrder.find((a) => a.userId == id);
    setNewUser(ag);
  };
  const data = [];
  const datr = totalOrder?.map((a, index) =>
    data.push({
      key: `${a._id}`,
      index: `${index + startIndex}`,
      invoice: `${a?.email}`,
      name: `${a?.trxid}`,
      provider: `${a?.provider}`,
      amount: `৳ ${a?.amount}`,
      status: `${a?.status}`,
      id: `${a?.userId}`,
    })
  );

  return (
    <div>
      <AddCredit
        user={newUser}
        setReload={setReload}
        reload={reload}
      ></AddCredit>
      <Table
        columns={columns}
        pagination={false}
        dataSource={data}
        scroll={{
          x: 240,
        }}
      />
    </div>
  );
};

export default DepositTable;
