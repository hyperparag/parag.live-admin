import React, { useEffect, useState } from "react";
import { Button, Table, Dropdown, Space, Pagination } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import categoryFilter from "../../public/category.json";
import Swal from "sweetalert2";

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className={style.smalltable}>
        <div className='flex'>
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
            <strong className='text-black fw-bold'>Status</strong> :{" "}
            {record?.status == "false" ? (
              <button className='bg-red-200 border-0 px-2'>Free</button>
            ) : (
              <button className='bg-green-200  border-0 px-2'>Paid</button>
            )}
          </h6>
          <>
            <strong className='text-black fw-bold'>Full Title</strong> :{" "}
            {record?.fullname}
          </>
          <h6>
            <strong className='text-black fw-bold'>Category</strong> :{" "}
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

const ApprovedPosts = ({ setNewPost, datas }) => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showHeader, setShowHeader] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [ellipsis, setEllipsis] = useState(false);
  const [reload, setReload] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [newPosts, setNewPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [current, setCurrent] = useState(1);
  const [postCategory, setCategory] = useState("");
  const [postSubCategory, setSubCategory] = useState("");
  const [filtredCount, setFiltredCount] = useState();
  const [pageSize, setPageSize] = useState(10);

  const usersStringfy = Cookies.get("token");

  useEffect(() => {
    setLoading(true);
    getPosts();
  }, [current, postCategory, postSubCategory, reload, pageSize]);

  async function getPosts() {
    fetch(
      `https://paraglive-backend.vercel.app/api/products/admin?page=${current}&size=${pageSize}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${usersStringfy}`,
        },
      },
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status == "success") {
          console.log(result);
          let post = result.data.products;
          setFiltredCount(result.totalPost);
          setPosts(post);
          setLoading(false);
        } else {
          setPosts([]);
          setFiltredCount(0);
          setLoading(false);
        }
      });
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
          .delete(`https://paraglive-backend.vercel.app/api/products/${id}`, {
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

  const findData = (id) => {
    setNewPost(id);
  };

  const deleteMany = () => {
    setLoading(true);
    const ids = selectedRowKeys;

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
          .post(
            `https://paraglive-backend.vercel.app/api/products/deleteMany`,
            ids,
            { headers: { authorization: `Bearer ${usersStringfy}` } },
          )
          .then((response) => {
            if (response.data.deletedCount) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reload);
            setLoading(false);
          });
      }
    });
  };

  const updateMany = () => {
    setLoading(true);
    const ids = selectedRowKeys;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`https://paraglive-backend.vercel.app/api/products/many`, ids, {
            headers: { authorization: `Bearer ${usersStringfy}` },
          })
          .then((response) => {
            if (response.data.status == 200) {
              Swal.fire("Updated!", "Your file has been updated.", "success");
            }
            setReload(!reload);
            setLoading(false);
          });
      }
    });
  };

  const columns = [
    {
      title: "Title",
      width: 250,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-5'
              className='text-blue-400 cursor-pointer  border-0 px-2'
            >
              {name}
            </label>
          </button>
        </>
      ),
    },
    {
      title: "Posted In",
      width: 200,
      dataIndex: "city",
      key: "1",
    },
    {
      title: "Category",
      dataIndex: "email",
      key: "2",
      width: 250,
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
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      width: 160,
      render: (_, { reason }) => {
        if (!reason || reason === "undefined" || reason === "null") {
          return <span className='text-gray-600'>&mdash;</span>;
        }
        const label =
          reason === "duplicate"
            ? "Duplicate post"
            : reason === "banned-word"
              ? "Flagged wording"
              : reason === "suspicious-link"
                ? "Flagged link"
                : reason;
        const colour =
          reason === "duplicate" ? "bg-yellow-200" : "bg-orange-200";
        return <span className={`${colour} px-2 py-1 rounded`}>{label}</span>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "4",
      width: 150,
      render: (_, { status }) => (
        <>
          {status != "false" ? (
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
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-5'
              className='text-blue-400 cursor-pointer  border-0 px-2'
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

  const onChange = (page) => {
    setCurrent(page);
  };

  const onShowSizeChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };

  const data = [];
  const datr = posts?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.name.slice(0, 25)}`,
      sortname: `${a.name.slice(0, 15)}`,
      fullname: `${a.name.slice(0, 35)}`,
      city: `${
        a?.city ? a?.city + "city" : a?.cities?.length + " " + "city/s"
      }`,

      email: `${a?.category + ">" + a?.subCategory}`,
      contact: `${a?.phone}`,
      createdAt: `${
        a?.createdAt?.split("T")[0] +
        " " +
        a?.createdAt?.split("T")[1]?.split(".")[0]
      }`,
      status: `${a?.isPremium}`,
      reason: a?.moderationReason ?? "",
      profilePicture: `${
        a?.imgOne + "=" + a?.imgTwo + "=" + a?.imgThree + "=" + a?.imgFour
      }`,

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

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const items = [
    {
      label: (
        <Button
          type='secondary'
          onClick={updateMany}
          disabled={!hasSelected}
          loading={loading}
          className='bg-green-600 font-bold rounded-lg text-white'
          size='medium'
        >
          {" "}
          Approve Selected
        </Button>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type='primary'
          onClick={deleteMany}
          disabled={!hasSelected}
          loading={loading}
          className='bg-blue-400 border rounded'
          size='medium'
        >
          {" "}
          Delete Selected
        </Button>
      ),
      key: "1",
    },
  ];

  const subcategory = categoryFilter.find((a) => a.name == postCategory);

  return (
    <div className='w-full'>
      <div className='flex flex-col-reverse my-2 sm:flex-row sm:items-center'>
        <div>
          <Dropdown
            disabled={!hasSelected}
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <Button
              onClick={(e) => e.preventDefault()}
              loading={loading}
              size='large'
              className=' bg-white border rounded p-1 sm:p-2'
            >
              Select Action
            </Button>
          </Dropdown>

          <br />
        </div>
        <label>
          <select
            className=' bg-white border rounded p-1 sm:p-2'
            onChange={(e) => {
              (setCategory(e.target.value), setSubCategory(""));
            }}
          >
            <option value={""}>--Select Category--</option>
            <option value={""}>All</option>
            {categoryFilter?.map((a) => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
        {/* <label>
          <select
            className=' bg-white border rounded p-1 sm:p-2'
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value={""}>--Select Sub Category--</option>
            <option value={""}>All</option>
            {subcategory?.children?.map((a) => (
              <>
                <option value={a.name}>{a.name}</option>
              </>
            ))}
          </select>
        </label> */}
      </div>
      <span>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        {postCategory ? (
          <p>
            Total Post Found in {postCategory} : {filtredCount}
          </p>
        ) : (
          ` Showing all posts ${filtredCount}`
        )}
      </span>

      <>
        <Table
          rowSelection={rowSelection}
          className={style.tableLG}
          columns={columns}
          loading={loading}
          dataSource={data}
          //scroll={{
          //  x: 1500,
          //  y: 900,
          //}}
          pagination={false}
        />
        <Table
          {...tableProps}
          pagination={false}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          loading={loading}
          className={style.tableSM}
        />
        <Pagination
          className='block flex justify-center mt-5'
          current={current}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          pageSize={pageSize}
          total={filtredCount}
        />
      </>
    </div>
  );
};

export default ApprovedPosts;
