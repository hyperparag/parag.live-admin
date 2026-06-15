import React, { useEffect, useState } from "react";
import { Button, Table, Dropdown, Upload, Input } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { BsPlusCircleFill } from "react-icons/bs";
import Swal from "sweetalert2";
import { PlusOutlined } from "@ant-design/icons";

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className={style.smalltable}>
        <div className='flex'>
          {!record?.profilePicture ? (
            <img className={style.smTableImage} src={User} height='60px' />
          ) : (
            <img
              className='w-24'
              src={record?.profilePicture}
              width='100px'
              height='60px'
            />
          )}
        </div>

        <div>
          <h6>
            <strong className='text-black fw-bold'>Category</strong> :{" "}
            {record?.email}
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

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SideLinks = () => {
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
  const [addloading, addlinkloading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [category, setCategory] = useState("");

  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [cat, setCat] = useState("");

  const [type, setType] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [ads, setAds] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [reload, setReload] = useState(false);

  const ad = ads.filter((a) =>
    category ? a.category == category : a.category,
  );

  useEffect(() => {
    fetch(`/category.json`)
      .then((res) => res.json())
      .then((data) => setCategoryFilter(data));
    getAds();
  }, [reload]);

  async function getAds() {
    try {
      const response = await axios.get(`http://localhost:5000/api/sideads`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${usersStringfy}`,
        },
      });
      const data = response.data.ads;

      setAds(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  const usersStringfy = Cookies.get("token");

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
          .delete(`http://localhost:5000/api/sideads/${id}`)
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reload);
            setLoading(false);
          });
      }
    });
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
          .post(`http://localhost:5000/api/sideads/deleteMany`, ids)
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
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Link",
      width: 150,
      dataIndex: "city",
      key: "1",
    },
    {
      title: "Category",
      dataIndex: "email",
      key: "2",
      width: 150,
    },

    {
      title: "Image",
      dataIndex: "profilePicture",
      key: "5",
      width: 150,
      render: (_, { profilePicture }) => (
        <div className='flex'>
          {!profilePicture ? (
            <img
              className='img-60 rounded-circle lazyloaded blur-up'
              src={User}
              height='40px'
            />
          ) : (
            <img
              className={style.tableimage}
              src={profilePicture}
              width='100px'
              height='40px'
            />
          )}
        </div>
      ),
    },

    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 40,
      render: (_, { id }) => (
        <>
          <button
            className='bg-blue-600 text-white px-2 border-0'
            onClick={() => editSidebar(id)}
          >
            Edit
          </button>
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 40,
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

  const data = [];
  const datr = ad?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.title.slice(0, 25)}`,
      city: `${a?.link}`,

      email: `${a?.category}`,

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

  const handleSubmit = (e) => {
    addlinkloading(true);

    const formData = new FormData();
    formData.append("images", fileList[0].originFileObj);
    fetch("http://localhost:5000/api/extraimage/files", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          const data = {
            title,
            image: result.url,
            link,
            category: cat,
          };
          fetch("http://localhost:5000/api/sideads", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${usersStringfy}`,
            },
            body: JSON.stringify(data),
          })
            .then((res) => res.json())
            .then((data) => {
              addlinkloading(false);
              if (data) {
                Swal.fire({
                  position: "top-center",
                  icon: "success",
                  title: "Your work has been saved",
                  showConfirmButton: false,
                  timer: 2000,
                }).then(setReload(!reload));
                global.document.getElementById("my-modal-11").checked = false;
                setFileList([]);
              }
            });
        }
      });
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
          width: "250px",
        }}
      >
        Upload
      </div>
    </div>
  );

  const editSidebar = (id) => {
    const selected = ad.find((a) => a._id == id);
    setSelectedData(selected);
    global.document.getElementById("my-modal-25").checked = true;
    setFileList([]);
  };

  const handleUpdate = async () => {
    addlinkloading(true);

    const data = {
      title: title ? title : selectedData.title,
      link: link ? link : selectedData.link,
      category: cat == "" ? selectedData.category : cat,
    };

    const formData = new FormData();

    fileList[0] &&
      (formData.append("images", fileList[0].originFileObj),
      await fetch("http://localhost:5000/api/extraimage/files", {
        method: "POST",
        body: formData,
      })
        .then((e) => e.json())
        .then((e) => {
          data.image = e.url;
        }));

    fetch(`http://localhost:5000/api/sideads/${selectedData._id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${usersStringfy}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        addlinkloading(false);
        if (data) {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 2000,
          }).then(setReload(!reload));
          global.document.getElementById("my-modal-25").checked = false;
          setFileList([]);
        }
      });
  };

  return (
    <div className='w-full'>
      <hr></hr>
      <div className='my-5'>
        <label htmlFor='my-modal-11'>
          <BsPlusCircleFill className='text-3xl text-orange-600 cursor-pointer sm:text-6xl block m-auto' />{" "}
        </label>
        <p className='text-center'>Add Side Links</p>

        {/* Put this part before </body> tag */}
        <input type='checkbox' id='my-modal-11' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative bg-white'>
            {addloading ? (
              <img width={100} className='block m-auto' src='/upload.gif'></img>
            ) : (
              <div>
                <label
                  htmlFor='my-modal-11'
                  className='btn btn-sm btn-circle absolute right-2 top-2'
                >
                  ✕
                </label>
                <Upload
                  className='modalImage'
                  listType='picture-card'
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Input
                  placeholder='Title'
                  onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <br />
                <Input
                  placeholder='Link'
                  onChange={(e) => setLink(e.target.value)}
                />
                <br />
                <br />
                <select
                  className=' w-full bg-white border rounded p-1 sm:p-2'
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option value={""}>--Select Category--</option>
                  {categoryFilter?.map((a) => (
                    <option value={a.name}>{a.name}</option>
                  ))}
                </select>

                <button
                  className='bg-blue-300  text-white hover:bg-blue-600 rounded mt-2'
                  onClick={() => handleSubmit()}
                >
                  {" "}
                  <label
                    className='bg-blue-300 hover:bg-blue-600 px-2'
                    htmlFor='my-modal-11'
                  >
                    Submit
                  </label>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* update part*/}
        <input type='checkbox' id='my-modal-25' className='modal-toggle' />
        <div className='modal'>
          <div className='modal-box relative bg-white'>
            {addloading ? (
              <img width={100} className='block m-auto' src='/upload.gif'></img>
            ) : (
              <div>
                <label
                  htmlFor='my-modal-25'
                  className='btn btn-sm btn-circle absolute right-2 top-2'
                >
                  ✕
                </label>
                <Upload
                  className='modalImage'
                  listType='picture-card'
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                <Input
                  placeholder={selectedData?.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <br />
                <Input
                  placeholder={selectedData?.link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <br />
                <br />
                <select
                  className=' w-full bg-white border rounded p-1 sm:p-2'
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option selected value={""}>
                    {selectedData?.category}
                  </option>
                  <option value={""}>--Select Category--</option>

                  {categoryFilter?.map((a) => (
                    <option value={a.name}>{a.name}</option>
                  ))}
                </select>

                <button
                  className='bg-blue-300  text-white hover:bg-blue-600 rounded mt-2'
                  onClick={() => handleUpdate()}
                >
                  {" "}
                  <label
                    className='bg-blue-300 hover:bg-blue-600 px-2'
                    htmlFor='my-modal-25'
                  >
                    Submit
                  </label>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr></hr>
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
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""}>--Select Category--</option>
            {categoryFilter?.map((a) => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
      </div>
      <span>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
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
          pagination={{ pageSize: 5 }}
        />
        <Table
          {...tableProps}
          pagination={{ pageSize: 5 }}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={hasData ? data : []}
          scroll={scroll}
          className={style.tableSM}
        />
      </>
    </div>
  );
};

export default SideLinks;
