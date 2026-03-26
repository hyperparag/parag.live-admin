import axios from "axios";
import React, { useEffect, useState } from "react";
import DepositTable from "../table/depositTable";
import { Input, Pagination } from "antd";
const { Search } = Input;

const Deposit = ({ setnewUser }) => {
  const [deposits, setDeposits] = useState([]);
  const [total, setTotal] = useState(1);
  const [current, setCurrent] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  async function totalDeposit() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/deposit?email=${email}&size=${pageSize}&page=${current}`,
      );

      setDeposits(response.data.deposits);
      setTotal(response.data.total);
      setStartIndex(response.data.startIndex);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    totalDeposit();
  }, [current, pageSize, email, reload]);

  const onChange = (page) => {
    setCurrent(page);
  };
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
  };

  const pageSizeOptions = [10, 20, 30, 50, 100];
  const onSearch = (value) => {
    setEmail(value);
  };

  return (
    <div>
      {loading ? (
        <div>
          <img className='m-auto' width={200} src='/upload.gif' />
        </div>
      ) : (
        <div>
          <Search
            placeholder='Email'
            onSearch={onSearch}
            enterButton
            allowClear
          />
          <DepositTable
            reload={reload}
            setReload={setReload}
            startIndex={startIndex}
            totalOrder={deposits}
            setnewUser={setnewUser}
          />
          <Pagination
            className='block flex justify-center mt-5'
            current={current}
            onChange={onChange}
            defaultPageSize={pageSize}
            defaultCurrent={1}
            total={total}
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} deposits`
            }
            onShowSizeChange={onShowSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
};

export default Deposit;
