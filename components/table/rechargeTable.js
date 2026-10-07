import React, { useEffect, useState } from "react";
import { Input, Table, Tag } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
const { Search } = Input;

// Every kind of money movement the ledger records, with how to show it.
export const KIND_LABELS = {
  recharge: { label: "Credit purchase", color: "green" },
  "admin-credit": { label: "Credit given by admin", color: "cyan" },
  "ad-spend": { label: "Ad spend", color: "volcano" },
  repost: { label: "Repost", color: "orange" },
  "referral-bonus": { label: "Referral earning", color: "purple" },
  "referral-convert": { label: "Earnings converted to credit", color: "blue" },
  "earn-bonus": { label: "Earn bonus", color: "gold" },
};

const TableRecharge = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function load() {
    setLoading(true);
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/transaction`,
        {
          params: { q: keyword, kind, page, size: pageSize },
          headers: { authorization: `Bearer ${Cookies.get("token")}` },
        },
      );
      setRows(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error(error);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [keyword, kind, page, pageSize]);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Type",
      dataIndex: "kind",
      key: "kind",
      render: (k) => {
        const meta = KIND_LABELS[k] || { label: k, color: "default" };
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount, { flow }) => (
        <b className={flow === "debit" ? "text-red-600" : "text-green-700"}>
          {flow === "debit" ? "-" : "+"}${Number(amount).toFixed(2)}
        </b>
      ),
    },
    {
      title: "Reference",
      dataIndex: "invoice",
      key: "invoice",
      render: (invoice, { note }) => (
        <span className='text-xs'>
          {invoice}
          {note ? ` · ${note}` : ""}
        </span>
      ),
    },
  ];

  const data = rows.map((a) => ({
    key: a._id,
    createdAt: a.createdAt,
    user: a?.userId?.email || "-",
    kind: a.kind,
    flow: a.flow,
    amount: a.amount,
    invoice: a.invoice,
    note: a.note,
  }));

  return (
    <div className='w-full'>
      <div className='flex flex-col sm:flex-row gap-2 mb-4'>
        <Search
          placeholder='user email or invoice'
          onSearch={(v) => {
            setPage(1);
            setKeyword(v);
          }}
          allowClear
          enterButton
        />
        <select
          className='bg-white border rounded p-2 text-black'
          value={kind}
          onChange={(e) => {
            setPage(1);
            setKind(e.target.value);
          }}
        >
          <option value=''>All types</option>
          {Object.entries(KIND_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 700 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, s) => {
            setPage(p);
            setPageSize(s);
          },
        }}
      />
    </div>
  );
};

export default TableRecharge;
