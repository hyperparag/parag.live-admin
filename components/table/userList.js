import React, { useEffect, useState } from "react";
import { Input, Modal, Pagination, Table } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
const { Search } = Input;

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className='smallOrderTable2'>
        <div className='flex justify-center'>
          {record?.profilePicture?.split("=")[0] == "avater" ? (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={"/user.png"}
              width='100px'
              height='60px'
            />
          ) : (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={record?.profilePicture.split("=")[0]}
              width='100px'
              height='60px'
            />
          )}
          {record?.profilePicture?.split("=")[1] == "avater" ? (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={"/user.png"}
              width='100px'
              height='60px'
            />
          ) : (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={record?.profilePicture?.split("=")[1]}
              width='100px'
              height='60px'
            />
          )}
        </div>

        <div>
          <h6>
            <strong className='text-black fw-bold'>Credits</strong> :{" "}
            {record?.credit}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Full Title</strong> :{" "}
            {record?.firstName}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Email</strong> :{" "}
            {record?.email}
          </h6>

          <h6>
            <strong className='text-black fw-bold'>Phone</strong> :{" "}
            {record?.contact}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Created Time</strong> :{" "}
            {record?.createdAt}
          </h6>
        </div>
      </div>
    </div>
  ),
};

const UserList = ({ setnewUser, datas }) => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showHeader, setShowHeader] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [reload, setReload] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [users, setUser] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [startIndex, setIndex] = useState(1);

  const usersStringfy = Cookies.get("token");

  // Bonus payouts to the selected users.
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [bonus, setBonus] = useState({ amount: "", type: "earn", note: "" });
  const [bonusSending, setBonusSending] = useState(false);

  const sendBonus = async () => {
    setBonusSending(true);
    try {
      const res = await axios.post(
        "https://paraglive-backend.vercel.app/api/users/bonus",
        { userIds: selectedRowKeys, ...bonus },
        { headers: { authorization: `Bearer ${usersStringfy}` } },
      );
      Swal.fire("Sent!", res.data.message, "success");
      setBonusOpen(false);
      setBonus({ amount: "", type: "earn", note: "" });
      setSelectedRowKeys([]);
      setReload(!reload);
    } catch (error) {
      Swal.fire(
        "Could not send",
        error?.response?.data?.message || "Please try again.",
        "error",
      );
    } finally {
      setBonusSending(false);
    }
  };

  const rowSelection = { selectedRowKeys, onChange: setSelectedRowKeys };

  useEffect(() => {
    setLoading(true);
    getUser();
  }, [keyword, page, reload, pageSize]);

  async function getUser() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/users?page=${page}&q=${keyword}&size=${pageSize}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );
      const data = response.data.users;
      setIndex(response.data.startIndex);

      setUser(data);
      setLoading(false);
      // total page dashboaord theke ante hobe
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios

          .delete(`https://paraglive-backend.vercel.app/api/users/${id}`, {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reload);
          });
      }
    });
  };
  const onSearch = (value) => setKeyword(value);

  const findData = (id) => {
    const ag = users.find((a) => a._id == id);
    setnewUser(ag);
  };

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      fixed: "left",
    },
    {
      title: "First Name",

      dataIndex: "firstName",
      key: "name",
      fixed: "left",
    },

    {
      title: "Last Name",

      dataIndex: "lastName",
      key: "1",
    },

    {
      title: "Credits",

      dataIndex: "credit",
      key: "4",
      sorter: (a, b) => a.credit - b.credit,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "2",
    },
    {
      title: "Phone",
      dataIndex: "contact",
      key: "3",
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "3",
    },

    {
      title: "Avater",
      dataIndex: "profilePicture",
      key: "5",

      render: (_, { profilePicture }) => (
        <img className='w-12 h-12 rounded-full' src={profilePicture} />
      ),
    },
    {
      title: "Login",
      key: "operation",

      render: (_, { id }) => (
        <>
          <button className='bg-blue-600 text-white px-2 border-0 '>
            <Link className='hover:text-white' href={`/user/${id}`}>
              Login
            </Link>
          </button>
        </>
      ),
    },

    {
      title: "Give Credit",
      key: "operation",
      fixed: "right",

      render: (_, { id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-21'
              className='text-white bg-green-600 cursor-pointer  border-0 px-2'
            >
              Give Credit
            </label>
          </button>
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",

      render: (_, { id }) => (
        <>
          <button
            className='bg-red-600 text-white px-2 border-0'
            onClick={() => deleteUser(id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Name",
      width: 100,
      dataIndex: "fullname",
      key: "fullname",
      fixed: "left",
    },
    {
      title: "Credits",
      width: 200,
      dataIndex: "credit",
      key: "4",
      sorter: (a, b) => a.credit - b.credit,
    },
    {
      title: "Credit",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, { id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-21'
              className='text-white bg-green-600 cursor-pointer  border-0 px-2'
            >
              +Credit
            </label>
          </button>
        </>
      ),
    },
  ];

  const data = [];
  const datr = users?.map((a, index) =>
    data.push({
      key: `${a?._id}`,
      index: `${index + startIndex}`,
      firstName: `${a?.firstName?.slice(0, 25)}`,
      lastName: `${a?.lastName?.slice(0, 15)}`,
      fullname: `${a?.firstName + a?.lastName}`,
      city: `${a?.city + "" + a?.cities}`,
      credit: `${a?.credit.toFixed(2)}`,

      email: `${a?.email}`,
      contact: `${a?.phone}`,
      createdAt: `${
        a?.createdAt?.split("T")[0] +
        " " +
        a?.createdAt?.split("T")[1]?.split(".")[0]
      }`,
      status: `${a?.isPremium}`,
      profilePicture: `${a?.avater}`,

      id: `${a._id}`,
    }),
  );

  const scroll = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }
  const tableColumns = columns2.map((item) => ({
    ...item,
    ellipsis,
  }));
  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
  }

  const tableProps = {
    bordered,
    loading,
    size,
    expandable,
    showHeader,
    scroll,
    tableLayout,
  };

  const onChange = (page) => {
    setPage(page);
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
  };

  return (
    <div className='w-full'>
      <Search placeholder='name or email' onSearch={onSearch} enterButton />
      <div className='my-3 flex flex-wrap items-center gap-3'>
        <button
          disabled={selectedRowKeys.length === 0}
          onClick={() => setBonusOpen(true)}
          className='bg-green-600 text-white px-4 py-1 rounded font-semibold disabled:opacity-40 disabled:cursor-not-allowed'
        >
          Send bonus to selected
        </button>
        <span className='text-black text-sm'>
          {selectedRowKeys.length > 0
            ? `${selectedRowKeys.length} user(s) selected`
            : "Tick users in the list to send them a bonus."}
        </span>
      </div>
      <Modal
        title='Send bonus'
        open={bonusOpen}
        onCancel={() => setBonusOpen(false)}
        onOk={sendBonus}
        okText='Send'
        confirmLoading={bonusSending}
        okButtonProps={{ disabled: !bonus.amount }}
      >
        <p className='text-black mb-2'>
          Sending to <b>{selectedRowKeys.length}</b> selected user(s).
        </p>
        <label className='text-black block mb-1'>Bonus type</label>
        <select
          className='w-full border rounded p-2 mb-3 bg-white text-black'
          value={bonus.type}
          onChange={(e) => setBonus({ ...bonus, type: e.target.value })}
        >
          <option value='earn'>
            Earnings (user can convert it to posting credit)
          </option>
          <option value='credit'>Posting credit (usable right away)</option>
        </select>
        <label className='text-black block mb-1'>Amount per user ($)</label>
        <input
          type='number'
          min='0.01'
          step='0.01'
          className='w-full border rounded p-2 mb-3 bg-white text-black'
          value={bonus.amount}
          onChange={(e) => setBonus({ ...bonus, amount: e.target.value })}
        />
        <label className='text-black block mb-1'>Note (shown to the user)</label>
        <input
          type='text'
          maxLength={200}
          className='w-full border rounded p-2 bg-white text-black'
          placeholder='e.g. Thanks for being a top poster'
          value={bonus.note}
          onChange={(e) => setBonus({ ...bonus, note: e.target.value })}
        />
      </Modal>
      <>
        <Table
          rowSelection={rowSelection}
          className={style.tableLG}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{
            x: 1500,
          }}
          pagination={false}
        />
        <Table
          rowSelection={rowSelection}
          {...tableProps}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          className={style.tableSM}
        />
        <Pagination
          className='block flex justify-center mt-5'
          current={page}
          onChange={onChange}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={datas?.allUsers}
        />
      </>
    </div>
  );
};

export default UserList;
