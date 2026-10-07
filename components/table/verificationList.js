import React, { useEffect, useState } from "react";
import { Button, Dropdown, Pagination, Table, Tag } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const VerificationList = ({ setstate, reload, state }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [pages, setPage] = useState(0);
  const [current, setCurrent] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [localReload, setLocalReload] = useState(false);

  const usersStringfy = Cookies.get("token");

  async function getRequests() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/verification?page=${current}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );
      const data = response.data.data.requests;
      setPage(response.data.data.totalRequests);
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    getRequests();
  }, [reload, current, localReload]);

  const findData = (id) => {
    const request = requests.find((a) => a._id == id);
    setstate({ ...state, verificationRequest: request });
  };

  const removeRequest = (id) => {
    Swal.fire({
      title: "Delete this request permanently?",
      text: "This also deletes the submitted ID photos. It cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it forever",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(
          `  https://paraglive-backend.vercel.app/api/verification/${id}`,
          { headers: { authorization: `Bearer ${usersStringfy}` } },
        )
        .then((response) => {
          if (response.data.status == "success") {
            Swal.fire("Deleted!", "The request has been removed.", "success");
          } else {
            Swal.fire(
              "Could not delete",
              response.data.message || "Please try again.",
              "error",
            );
          }
          setLocalReload((v) => !v);
        })
        .catch((error) => {
          Swal.fire(
            "Could not delete",
            error?.response?.data?.message || "Please try again.",
            "error",
          );
        });
    });
  };

  const removeSelected = () => {
    if (selectedRowKeys.length === 0) {
      Swal.fire("Nothing selected", "Pick some requests first.", "info");
      return;
    }

    Swal.fire({
      title: `Delete ${selectedRowKeys.length} request(s) permanently?`,
      text: "This also deletes their submitted ID photos. It cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them forever",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .post(
          "  https://paraglive-backend.vercel.app/api/verification/deleteMany",
          selectedRowKeys,
          { headers: { authorization: `Bearer ${usersStringfy}` } },
        )
        .then((response) => {
          if (response.data.status == "success") {
            Swal.fire(
              "Deleted!",
              `${response.data.data?.deletedCount ?? 0} request(s) removed.`,
              "success",
            );
          } else {
            Swal.fire(
              "Could not delete",
              response.data.message || "Please try again.",
              "error",
            );
          }
          setSelectedRowKeys([]);
          setLocalReload((v) => !v);
        })
        .catch((error) => {
          Swal.fire(
            "Could not delete",
            error?.response?.data?.message || "Please try again.",
            "error",
          );
        });
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const bulkItems = [
    {
      label: (
        <Button onClick={removeSelected} danger>
          Delete Selected
        </Button>
      ),
      key: "0",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Submitted At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <>
          {status == "pending" && (
            <Tag color={"#A52A2A"}>{status.toUpperCase()}</Tag>
          )}
          {status == "verified" && (
            <Tag color={"#006400"}>{status.toUpperCase()}</Tag>
          )}
          {status == "rejected" && (
            <Tag color={"#9D00FF"}>{status.toUpperCase()}</Tag>
          )}
        </>
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (_, { id }) => (
        <div className='flex gap-2'>
          <button onClick={() => findData(id)}>
            <label
              htmlFor='my-modal-20'
              className='text-white bg-green-600 cursor-pointer border-0 px-2'
            >
              View
            </label>
          </button>
          <button
            onClick={() => removeRequest(id)}
            className='text-white bg-red-700 cursor-pointer border-0 px-2'
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const data = [];
  requests?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a?.user?.[0]?.firstName ?? ""} ${a?.user?.[0]?.lastName ?? ""}`,
      email: `${a?.user?.[0]?.email ?? ""}`,
      status: `${a?.status}`,
      createdAt: `${
        a?.createdAt?.split("T")[0] +
        " " +
        a?.createdAt?.split("T")[1]?.split(".")[0]
      }`,
      id: `${a._id}`,
    }),
  );

  const onChange = (page) => {
    setCurrent(page);
  };

  return (
    <div className='w-full'>
      <div className='mb-3 flex justify-end'>
        <Dropdown menu={{ items: bulkItems }} trigger={["click"]}>
          <Button disabled={selectedRowKeys.length === 0}>
            Bulk actions ({selectedRowKeys.length})
          </Button>
        </Dropdown>
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={false}
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
    </div>
  );
};

export default VerificationList;
