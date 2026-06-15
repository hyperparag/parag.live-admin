import React, { useEffect, useState } from "react";
import { Button, Dropdown, Pagination, Table, Input } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import Cookies from "js-cookie";
const { Search } = Input;
import axios from "axios";
import Swal from "sweetalert2";
import categoryFilter from "../../public/category.json";

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className={style.smalltable}>
        <div className='flex'>
          {record?.profilePicture?.split("=")[0] == "avater" ? (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={User}
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
        </div>

        <div>
          <>
            <strong className='text-black fw-bold'>Category</strong> :{" "}
            {record?.category}
          </>
          <h6>
            <strong className='text-black fw-bold'>Writer</strong> :{" "}
            {record?.email}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Status</strong> :{" "}
            {record?.status}
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

const BlogsList = ({ setBlogId, reload, setBlogLoading }) => {
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
  const [newPosts, setNewPosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [reloads, setReload] = useState(false);
  const [current, setCurrent] = useState(1);

  const usersStringfy = Cookies.get("token");

  async function getUser() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blogs/admin?page=${current}&q=${keyword}&cat=${category}&subCat=${subCategory}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );

      setNewPosts(response.data);
      setLoading(false);
    } catch (error) {
      setNewPosts([]);
      setLoading(false);
      console.error(error);
    }
  }

  const onChange = (page) => {
    setCurrent(page);
  };

  useEffect(() => {
    setLoading(true);
    getUser();
  }, [current, category, subCategory, keyword, reloads]);

  const subcategory = categoryFilter.find((a) => a.name == category);

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
          .delete(`http://localhost:5000/api/blogs/${id}`, {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reloads);
          });
      }
    });
  };
  const findData = async (id) => {
    setBlogLoading(true);
    const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${usersStringfy}`,
      },
    });

    setBlogId(response?.data?.data?.blogs[0]);
    setBlogLoading(false);
  };

  const columns = [
    {
      title: "Title",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-15'
              className='bg-green-100 cursor-pointer  border-0 px-2'
            >
              {name}
            </label>
          </button>
        </>
      ),
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "2",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "8",
      width: 100,
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      key: "3",
      width: 100,
    },
    {
      title: "Written By",
      dataIndex: "email",
      key: "3",
      width: 100,
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
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (_, { name, id }) => (
        <>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-15'
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

  const data = [];
  const datr = newPosts?.data?.blogs?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.title.slice(0, 25)}`,

      email: `${a?.writer}`,
      category: `${a?.category} > ${a?.subCategory}`,
      status: `${a?.status}`,
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
    loading,
    size,
    expandable,
    showHeader,
    scroll,
    tableLayout,
  };

  const deleteMany = () => {
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
          .post(`http://localhost:5000/api/blogs/deleteMany`, ids)
          .then((response) => {
            if (response.data.deletedCount) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reloads);
            setStatus("");
            setCategory("");
          });
      }
    });
  };

  const updateMany = () => {
    const data = selectedRowKeys;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`http://localhost:5000/api/blogs/updatedMany`, {
            data,
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire(
                "Approved!",
                "Post has been shown in Running Post.",
                "success",
              );
            }

            setReload(!reloads);
            setStatus("");
            setCategory("");
          });
      }
    });
  };

  const updatedpublishMany = () => {
    const data = selectedRowKeys;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`http://localhost:5000/api/blogs/updatedpublishMany`, {
            data,
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire(
                "Approved!",
                "Post has been shown in Running Post.",
                "success",
              );
            }

            setReload(!reloads);
            setStatus("");
            setCategory("");
          });
      }
    });
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
        <button
          type='primary'
          onClick={updatedpublishMany}
          disabled={!hasSelected}
          loading={loading}
          className='bg-green-400  px-5 text-white  border rounded'
          size='medium'
        >
          {" "}
          Publish
        </button>
      ),
      key: "0",
    },
    {
      label: (
        <button
          onClick={updateMany}
          disabled={!hasSelected}
          loading={loading}
          className='bg-blue-400 px-5 text-white  border rounded'
          size='medium'
        >
          {" "}
          Pause
        </button>
      ),
      key: "2",
    },
    {
      label: (
        <button
          type='primary'
          onClick={deleteMany}
          disabled={!hasSelected}
          loading={loading}
          className='bg-red-600  px-5 text-white border rounded'
          size='medium'
        >
          {" "}
          Delete Selected
        </button>
      ),
      key: "1",
    },
  ];

  const changeCategory = (e) => {
    setCategory(e.target.value);
    setCurrent(1);
  };

  const changeSubCategory = (e) => {
    setSubCategory(e.target.value);
    setCurrent(1);
  };
  const onSearch = (e) => {
    setKeyWord(e);
  };

  return (
    <div className='w-full'>
      {/* {loading ? (
        <img className="block m-auto w-24 " src="/upload.gif" />
      ) : (
        <> */}
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
            onChange={(e) => changeCategory(e)}
          >
            <option value={""}>--Select Category--</option>
            <option value={" "}>All</option>
            {categoryFilter?.map((a) => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
        <label>
          <select
            className=' bg-white border rounded p-1 sm:p-2'
            onChange={(e) => changeSubCategory(e)}
          >
            <option value={""}>--Select Sub Category--</option>
            <option value={" "}>All</option>
            {subcategory?.children?.map((a) => (
              <>
                <option value={a.name}>{a.name}</option>
              </>
            ))}
          </select>
        </label>
        <Search
          className='w-4/12 ml-auto'
          placeholder='input search text'
          onSearch={onSearch}
          enterButton
        />
      </div>

      <span>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
      </span>

      <Table
        loading={loading}
        rowSelection={rowSelection}
        className={style.tableLG}
        columns={columns}
        dataSource={data}
        scroll={{
          x: 1500,
          y: 900,
        }}
        pagination={false}
      />
      <Table
        rowSelection={rowSelection}
        {...tableProps}
        pagination={{ pageSize: 5 }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
        className={style.tableSM}
      />
      <Pagination
        className='flex justify-center mt-10'
        defaultCurrent={current}
        pageSize={6}
        onChange={onChange}
        showSizeChanger={false}
        total={newPosts?.page}
      />
    </div>
  );
};

export default BlogsList;
