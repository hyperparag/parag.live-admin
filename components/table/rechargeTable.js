import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import style from "../../styles/moduleCss/dashboard.module.css";
import axios from "axios";
const { Search } = Input;

const defaultExpandable = {
  expandedRowRender: (record) => (
    <div>
      <div className='smallOrderTable2'>
        <div>
          <h6>
            <strong className='text-black fw-bold'>User Email</strong> :{" "}
            {record?.email}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Date </strong> :{" "}
            {record?.date}
          </h6>
          <h6>
            <strong className='text-black fw-bold'>Status</strong> :{" "}
            {record?.via}
          </h6>

          <h6>
            <strong className='text-black fw-bold'>Amount</strong> :
            <button className='bg-red-300 text-black px-2 border-0'>
              ${record.amount}
            </button>
          </h6>
        </div>
      </div>
    </div>
  ),
};

const TableRecharge = () => {
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
  const [keyword, setKeyword] = useState("");
  const [transaction, setTransaction] = useState([]);

  async function getUser() {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/transaction?q=${keyword}`,
        {
          method: "GET",
        },
      );
      const data = response.data.data;
      setTransaction(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUser();
  }, [keyword]);

  const onSearch = (value) => setKeyword(value);

  const columns = [
    {
      title: "Invoice",
      width: 200,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 150,
      key: "2",
    },

    {
      title: "Amount",
      dataIndex: "amount",
      key: "3",
      width: 150,
      sorter: (a, b) => a.amount - b.amount,
      render: (_, { amount }) => (
        <>
          <button className='bg-green-300 text-black px-2 border-0'>
            ${amount}
          </button>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "via",
      key: "2",
      width: 150,
      render: (_, { via }) => (
        <>
          {via == "pending" ? (
            <button className='bg-red-300 text-black px-2 border-0'>
              {via}
            </button>
          ) : (
            <button className='bg-green-300 text-black px-2 border-0'>
              {via}
            </button>
          )}
        </>
      ),
    },
    {
      title: "User Email",
      dataIndex: "email",
      width: 250,
      key: "1",
    },
  ];

  const columns2 = [
    {
      title: "Invoice",
      width: 50,
      dataIndex: "name",
      key: "name",
      // fixed: "left",
      render: (_, { name }) => (
        <>
          <p className='text-xs text-black sm:px-2 border-0'>{name}</p>
        </>
      ),
    },
  ];

  const data = [];
  const datr = transaction?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.invoice}`,
      date: `${a.date}`,
      via: `${a.isCompleted}`,
      amount: `${a?.amount}`,
      email: `${a?.userId?.email}`,
    }),
  );

  const scroll = {};
  if (yScroll) {
    scroll.y = 840;
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
    size,
    expandable,
    showHeader,
    scroll,
    tableLayout,
  };

  return (
    <div className='w-full'>
      <Search
        placeholder='invoice , email or date'
        onSearch={onSearch}
        enterButton
      />
      <br></br>
      <br></br>

      {loading ? (
        <img className='block m-auto w-24 ' src='/upload.gif' />
      ) : (
        <>
          {" "}
          <Table
            className={style.tableLG}
            columns={columns}
            dataSource={data}
            scroll={{
              x: 1500,
              y: 800,
            }}
            pagination={{ pageSize: 8 }}
          />
          <Table
            {...tableProps}
            pagination={{ pageSize: 8 }}
            columns={tableColumns}
            dataSource={hasData ? data : []}
            scroll={scroll}
            className={style.tableSM}
          />
        </>
      )}
    </div>
  );
};

export default TableRecharge;
