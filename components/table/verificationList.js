import React, { useEffect, useState } from "react";
import { Pagination, Table, Tag } from "antd";
import Cookies from "js-cookie";
import axios from "axios";

const VerificationList = ({ setstate, reload, state }) => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [pages, setPage] = useState(0);
  const [current, setCurrent] = useState(1);

  const usersStringfy = Cookies.get("token");

  async function getRequests() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/verification?page=${current}`,
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
  }, [reload, current]);

  const findData = (id) => {
    const request = requests.find((a) => a._id == id);
    setstate({ ...state, verificationRequest: request });
  };

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
        <button onClick={() => findData(id)}>
          <label
            htmlFor='my-modal-20'
            className='text-white bg-green-600 cursor-pointer border-0 px-2'
          >
            View
          </label>
        </button>
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
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
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
