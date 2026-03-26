import React, { useEffect, useState } from "react";
import { Pagination, Table } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className={style.smalltable}>
        <div>
          <>
            <strong className='text-black fw-bold'>Description</strong> :{" "}
            {record?.category}
          </>

          <h6>
            <strong className='text-black fw-bold'>Created Time</strong> :{" "}
            {record?.createdAt}
          </h6>
        </div>
      </div>
    </div>
  ),
};

const ReportList = ({ setstate, reload, state }) => {
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
  const [reports, setReports] = useState([]);
  const [pages, setPage] = useState(9);
  const [current, setCurrent] = useState(1);

  const usersStringfy = Cookies.get("token");

  async function getUser() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/reports?page=${current}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );
      const data = response.data.data.reports;
      // setPage(response.data.data.totalPost)
      setReports(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUser();
  }, [reload, current]);

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
          .delete(`https://paraglive-backend.vercel.app/api/reports/${id}`, {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            const newReports = reports.filter((a) => a._id !== id);
            setNewPosts(newReports);
          });
      }
    });
  };
  const findData = (id) => {
    const newReports = reports.find((a) => a._id == id);
    setstate({ ...state, reportlist: newReports });
  };

  const columns = [
    {
      title: "Subject",
      width: 40,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-16'
              className='bg-green-100 cursor-pointer  border-0 px-2'
            >
              {name}
            </label>
          </button>
        </>
      ),
    },

    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "3",
      width: 40,
    },

    {
      title: "Description",
      dataIndex: "category",
      key: "2",
      width: 100,
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 40,
      render: (_, { status }) => (
        <>
          {status == "false" ? (
            <button className='bg-red-600 text-white px-2 border-0'>
              unread
            </button>
          ) : (
            <button className='bg-green-600 text-white px-2 border-0'>
              read
            </button>
          )}
        </>
      ),
    },
  ];
  const columns2 = [
    {
      title: "Subject",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-16'
              className='bg-green-100 cursor-pointer  border-0 px-2'
            >
              {name}
            </label>
          </button>
        </>
      ),
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 50,
      render: (_, { status }) => (
        <>
          {status == "false" ? (
            <button className='bg-red-600 text-white px-2 border-0'>
              unread
            </button>
          ) : (
            <button className='bg-green-600 text-white px-2 border-0'>
              read
            </button>
          )}
        </>
      ),
    },
  ];

  const data = [];
  const datr = reports?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a?.subject?.slice(0, 25)}`,
      status: `${a?.isRead}`,
      email: `${a?.writer}`,
      category: `${a?.reportDesc?.slice(0, 65)}`,
      createdAt: `${
        a?.createdAt?.split("T")[0] +
        " " +
        a?.createdAt?.split("T")[1]?.split(".")[0]
      }`,
      profilePicture: `${a?.image}`,
      id: `${a._id}`,
    }),
  );

  const scroll = {};
  if (yScroll) {
    scroll.y = 940;
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
    setCurrent(page);
  };

  return (
    <div className='w-full'>
      <>
        <Table
          className={style.tableLG}
          columns={columns}
          loading={loading}
          dataSource={data}
          scroll={{
            x: 1500,
            y: 500,
          }}
          pagination={false}
        />
        <Table
          {...tableProps}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          className={style.tableSM}
        />
        <Pagination
          className='block flex justify-center mt-5'
          current={current}
          onChange={onChange}
          defaultPageSize={10}
          defaultCurrent={1}
          showSizeChanger={false}
          total={pages}
        />
      </>
    </div>
  );
};

export default ReportList;
