import React, { useEffect, useState } from "react";
import { Pagination, Table } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className='smallOrderTable2'>
        <div className='flex justify-center'>
          {record?.profilePicture?.split("=")[0] == "avater" ? (
            <img className={style.smTableImage} src={User} height='60px' />
          ) : (
            <img
              className={style.smTableImage}
              src={record?.profilePicture.split("=")[0]}
              width='100px'
              height='60px'
            />
          )}
          {record?.profilePicture?.split("=")[1] == "avater" ? (
            <img className={style.smTableImage} src={User} height='60px' />
          ) : (
            <img
              className={style.smTableImage}
              src={record?.profilePicture?.split("=")[1]}
              width='100px'
              height='60px'
            />
          )}
          {record?.profilePicture?.split("=")[2] == "avater" ? (
            <img className={style.smTableImage} src={User} height='60px' />
          ) : (
            <img
              className={style.smTableImage}
              src={record?.profilePicture?.split("=")[2]}
              width='100px'
              height='60px'
            />
          )}
          {record?.profilePicture?.split("=")[3] == "avater" ? (
            <img className={style.smTableImage} src={User} height='60px' />
          ) : (
            <img
              className={style.smTableImage}
              src={record?.profilePicture?.split("=")[3]}
              width='100px'
              height='60px'
            />
          )}
        </div>

        <div>
          <h6>
            <strong className='text-black fw-bold'>Full Title</strong> :{" "}
            {record?.fullname}
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
          <p>
            <strong className='text-black fw-bold'>Posted In</strong> :{" "}
            {record?.city}
          </p>
        </div>
      </div>
    </div>
  ),
};

const Tables = ({ posts, setReload, reload }) => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showHeader, setShowHeader] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const usersStringfy = Cookies.get("token");
  const columns = [
    {
      title: "Title",
      width: 150,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Posted In",
      width: 200,
      dataIndex: "city",
      key: "1",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "2",
      width: 150,
    },
    {
      title: "Phone",
      dataIndex: "contact",
      key: "3",
      width: 150,
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "3",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "4",
      width: 150,
      render: (_, { status }) => (
        <>
          {status == "false" ? (
            <button className='bg-red-200 border-0 px-2'>Free</button>
          ) : (
            <button className='bg-green-200  border-0 px-2'>Paid</button>
          )}
        </>
      ),
    },
    {
      title: "Image",
      dataIndex: "profilePicture",
      key: "5",
      width: 450,
      render: (_, { profilePicture }) => (
        <div className='flex'>
          {profilePicture?.split("=")[0] == "avater" ? (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={User}
              height='40px'
            />
          ) : (
            <img
              className={style.tableimage}
              src={profilePicture.split("=")[0]}
              width='100px'
              height='40px'
            />
          )}
          {profilePicture?.split("=")[1] == "avater" ? (
            <img className={style.tableimage} src={User} height='60px' />
          ) : (
            <img
              className={style.tableimage}
              src={profilePicture?.split("=")[1]}
            />
          )}
          {profilePicture?.split("=")[2] == "avater" ? (
            <img
              className='img-60 rounded-full lazyloaded blur-up'
              src={User}
              height='60px'
            />
          ) : (
            <img
              className={style.tableimage}
              src={profilePicture?.split("=")[2]}
              width='100px'
              height='60px'
            />
          )}
          {profilePicture?.split("=")[3] == "avater" ? (
            <img className={style.tableimage} src={User} height='60px' />
          ) : (
            <img
              className={style.tableimage}
              src={profilePicture?.split("=")[3]}
              width='100px'
              height='60px'
            />
          )}
        </div>
      ),
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 80,
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
      title: "Title",
      width: 100,
      dataIndex: "sortname",
      key: "name",
      fixed: "left",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "4",
      width: 150,
      render: (_, { status }) => (
        <>
          {status == "false" ? (
            <button className='bg-red-200 border-0 px-2'>Free</button>
          ) : (
            <button className='bg-green-200  border-0 px-2'>Paid</button>
          )}
        </>
      ),
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 50,
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
          .delete(`  https://paraglive-backend.vercel.app/api/products/${id}`, {
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

  const data = [];
  const datr = posts?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.name.slice(0, 25)}`,
      sortname: `${a.name.slice(0, 15)}`,
      fullname: `${a.name}`,
      city: `${a?.city + "" + a?.cities.slice(0, 5)}`,

      email: `${a?.email}`,
      contact: `${a?.phone}`,
      createdAt: `${
        a?.createdAt?.split("T")[0] +
        " " +
        a?.createdAt?.split("T")[1]?.split(".")[0]
      }`,
      status: `${a?.isPremium}`,
      profilePicture: `${
        a?.imgOne + "=" + a?.imgTwo + "=" + a?.imgThree + "=" + a?.imgFour
      }`,

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

  return (
    <div className='w-full'>
      <>
        <Table
          className={style.tableLG}
          columns={columns}
          dataSource={data}
          scroll={{
            x: 1500,
            y: 500,
          }}
          pagination={{ pageSize: 4 }}
        />
        <Table
          {...tableProps}
          pagination={{ pageSize: 4 }}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          className={style.tableSM}
        />
      </>
    </div>
  );
};

export default Tables;
