import React, { useEffect, useState } from "react";
import { Button, Table, Dropdown, Input, Pagination, Select } from "antd";
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
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("large");
  const [expandable, setExpandable] = useState(defaultExpandable);
  const [showHeader, setShowHeader] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState(undefined);
  const [ellipsis, setEllipsis] = useState(false);
  const [reload, setReload] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState(undefined);
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [current, setCurrent] = useState(1);
  const [postCategory, setCategory] = useState("");
  const [postSubCategory, setSubCategory] = useState("");
  const [filtredCount, setFiltredCount] = useState();
  const [date, setDate] = useState("");

  const usersStringfy = Cookies.get("token");

  async function getPosts() {
    fetch(
      `https://paraglive-backend.vercel.app/api/products?page=${current}&cat=${postCategory}&subCat=${postSubCategory}&searchText=${search}&date=${date}`,
      {
        method: "GET",
      },
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status == "success") {
          let post = result.data;
          setFiltredCount(result.totalPost);
          setPosts(post);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
  }

  useEffect(() => {
    setLoading(true);
    getPosts();
  }, [current, reload, postCategory, postSubCategory, search, date]);

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

  const handleSearch = (e) => {
    if (e === undefined) {
      setSearch("");
    } else {
      setSearch(e);
    }
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

  const data = [];
  const datr = posts?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.name.slice(0, 25)}`,
      sortname: `${a.name.slice(0, 15)}`,
      fullname: `${a.name.slice(0, 35)}`,
      city: `${a?.cityCount + " " + "city/s"}`,

      email: `${a?.category + ">" + a?.subCategory}`,
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
      key: "0",
    },
  ];

  const subcategory = categoryFilter.find((a) => a.name == postCategory);

  const hangleCourse = (e) => {
    if (e === undefined) {
      setCategory("");
    } else {
      setCategory(e);
    }
  };
  const hangleSub = (e) => {
    if (e === undefined) {
      setSubCategory("");
    } else {
      setSubCategory(e);
    }
  };

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

        <Select
          showSearch
          allowClear
          className='w-full sm:w-2/12 '
          placeholder='Select Category'
          optionFilterProp='children'
          onChange={hangleCourse}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={categoryFilter.map((a) => ({
            label: a.name,
            value: a.name,
          }))}
        />

        <Select
          showSearch
          allowClear
          className='w-full sm:w-2/12 '
          placeholder='Select Category'
          optionFilterProp='children'
          onChange={hangleSub}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={subcategory?.children?.map((a) => ({
            label: a.name,
            value: a.name,
          }))}
        />

        <label>
          <select
            className='bg-white border rounded p-1 sm:p-2'
            onChange={(e) => setDate(e.target.value)}
          >
            <option value={""}>All</option>
            <option value={"today"}>Today</option>
            <option value={"yesterday"}>Yesterday</option>
            <option value={"last3days"}>last 3 days</option>
            <option value={"last7days"}>last 7 days</option>
            <option value={"thismonth"}>This Month</option>
            <option value={"lastmonth"}>Last Month</option>
            <option value={"last6month"}>Last 6 Months</option>
            <option value={"thisYear"}>This Year </option>
            <option value={"lastYear"}>Last Year</option>
          </select>
        </label>
        <Search
          allowClear
          className='w-full sm:w-4/12 ml-auto'
          placeholder='Search by title'
          onSearch={handleSearch}
          enterButton
        />
      </div>
      <span>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        {postCategory ? (
          <p>
            Total Post Found in {postCategory} : {filtredCount}
          </p>
        ) : (
          `Showing all posts ${filtredCount}`
        )}
      </span>

      <>
        <Table
          rowSelection={rowSelection}
          className={style.tableLG}
          columns={columns}
          loading={loading}
          dataSource={data}
          scroll={{
            x: 1500,
            y: 900,
          }}
          pagination={false}
        />
        <Table
          {...tableProps}
          pagination={false}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          className={style.tableSM}
        />
        <Pagination
          className='block flex justify-center mt-5'
          current={current}
          onChange={onChange}
          showSizeChanger={false}
          defaultCurrent={1}
          total={filtredCount}
        />
      </>
    </div>
  );
};

export default ApprovedPosts;
