import { Card, Col, Row } from "antd";
import React from "react";

const DataCards = ({ data }) => {
  return (
    <div className="bg-gray-100 sm:p-10 p-2">
      <Row gutter={16}>
        <Col className="sm:w-[305px] w-full">
          <Card
            title="Total Users"
            bordered={false}
            className="bg-red-400 text-white font-bold text-2xl"
          >
            {data?.allUsers} <small>users</small>
          </Card>
        </Col>
        <Col className="sm:w-[305px] w-full">
          <Card
            title="Total Credits"
            bordered={false}
            className="bg-cyan-500 text-white font-bold text-2xl  sm:mt-0 mt-10"
          >
            ${data?.allCredits?.toFixed()} <small>dollars</small>
          </Card>
        </Col>
        <Col className="sm:w-[305px] w-full">
          <Card
            title="Blogs"
            bordered={false}
            className="bg-purple-500 text-white font-bold text-2xl sm:mt-0 mt-10"
          >
            {data?.allBlogs} <small>blogs</small>
          </Card>
        </Col>

        <Col className="sm:w-[305px] w-full">
          <Card
            title="Posts"
            bordered={false}
            className="bg-blue-400 text-white font-bold text-2xl  mt-10"
          >
            {data?.allPost} <small>posts</small>
          </Card>
        </Col>
        <Col className="sm:w-[305px] w-full">
          <Card
            title="Premium Posts"
            bordered={false}
            className="bg-green-400 text-white font-bold text-2xl  mt-10"
          >
            {data?.premiumPost} <small>posts</small>
          </Card>
        </Col>

        <Col className="sm:w-[305px] w-full">
          <Card
            title="Today Posts"
            bordered={false}
            className="bg-yellow-800 text-white font-bold text-2xl mt-10"
          >
            {data?.today} <small>posts</small>
          </Card>
        </Col>

        <Col className="sm:w-[305px] w-full">
          <Card
            title="Today Transactions"
            bordered={false}
            className="bg-yellow-500 text-white font-bold text-2xl mt-10"
          >
            {data?.allTodayTrans} <small>transactions</small>
          </Card>
        </Col>

        <Col className="sm:w-[305px] w-full">
          <Card
            title="Today Transactions Amount"
            bordered={false}
            className="bg-fuchsia-500 text-white font-bold text-2xl mt-10"
          >
            ${data?.todayTransAmount} <small>dollars</small>
          </Card>
        </Col>
        <Col className="sm:w-[305px] w-full">
          <Card
            title="Total Transactions Amount"
            bordered={false}
            className="bg-gray-500 text-white font-bold text-2xl mt-10"
          >
            ${data?.totalTransctions} <small>dollars</small>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataCards;
