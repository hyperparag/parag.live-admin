import { Pagination, Table, Tabs } from "antd";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiUserCircle } from "react-icons/bi";
import Footer from "../../components/footer/footer2";
import Header from "../../components/header/header";
import style from "../../styles/moduleCss/blog.module.css";
import PostDetails from "../../components/Modal/postDetails";

const UserDashboard = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const [loading, setLoading] = useState(false);
  const [users, setUser] = useState();
  const [ads, setAds] = useState([]);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [current, setCurrent] = useState(1);
  const [postLoading, setPostLoading] = useState(false);
  const [reload, setReload] = useState(false);

  async function getUser() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/users/${id}`,

        {
          method: "GET",
        },
      );
      const data = response.data.data.user;
      setUser(data);
      setLoading(false);

      // posts(data, data?._id);
    } catch (error) {
      console.error(error);
    }
  }

  async function posts(id) {
    setPostLoading(true);
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/products/admin-user/${id}?page=${current}`,
        {
          method: "GET",
        },
      );
      const posts = response.data;

      setAds(posts);
      setPostLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function transactions() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/transaction/user?q=${id}`,
        {
          method: "GET",
        },
      );

      setRechargeHistory(response.data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    posts("", id);
  }, [current]);

  useEffect(() => {
    setLoading(true);
    if (id) {
      getUser();
      posts(id);
      transactions(id);
    }
    if (!id) {
      return;
    }
  }, [router?.query]);

  const onChange = (page) => {
    setCurrent(page);
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
          <Link target='_blank' href={`/my-post/${id}`}>
            <label
              htmlFor='my-modal-5'
              className='text-blue-400 cursor-pointer  border-0 px-2'
            >
              {name}
            </label>
          </Link>
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
      width: 150,
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
      title: "Status",
      dataIndex: "status",
      key: "4",
      width: 150,
      render: (_, { status }) => (
        <>
          {status == "false" ? (
            <button className='bg-red-200 border-0 px-2'>Free</button>
          ) : (
            <button className='bg-green-200  border-0 px-2'>Paid</button>
          )}
        </>
      ),
    },
  ];
  //https://adbacklist.com/post/details/Adult/65c8df9bbd8d942032395311?city=Auburn&sub=Adult%20Jobs

  const data = [];
  const datr = ads?.data?.product?.map((a) =>
    data.push({
      key: `${a._id}`,
      name: `${a.name}`,
      city: `${a?.city ? a?.city.length : a?.cities.length} city/cities`,

      email: `${a?.category + ">" + a?.subCategory}`,
      createdAt: `${
        new Date(a.createdAt).toLocaleDateString() +
        " " +
        new Date(a.createdAt).toLocaleTimeString()
      }`,
      status: `${a?.isPremium}`,
      id: `${a._id}`,
    }),
  );

  const items = [
    {
      key: "1",
      label: `My Profile`,
      children: (
        <div className=' flex justify-center'>
          <div className=''>
            {users?.avater == "avater" ? (
              <BiUserCircle className='text-6xl' />
            ) : (
              <Image
                src={users?.avater}
                className='w-[400px] h-[300px]'
                width={1000}
                height={1000}
                alt='image'
              />
            )}
            <div className='flex justify-between'>
              {" "}
              <p className='text-red-600  text-sm sm:text-xl font-bold border p-2 border-green-400 w-10/12 sm:w-6/12'>
                Your Credits : ${users?.credit?.toFixed(2)}
              </p>{" "}
            </div>
            <p className='text-sm sm:text-3xl'>
              Name : {users?.firstName} {users?.lastName}{" "}
            </p>
            <br />
            <p className='text-sm sm:text-3xl'>Email : {users?.email} </p>
            <br />
            {users?.address == "" ? (
              <p className='text-sm sm:text-3xl'>No Address Found</p>
            ) : (
              <p className='text-sm sm:text-3xl'>
                Address : {users?.address?.city}, {users?.address?.zipCode},{" "}
                {users?.address?.regionName}, {users?.address?.country},
              </p>
            )}
            <br />
            <div className='border border-blue-300 p-3 rounded'>
              <p className='text-sm sm:text-xl font-bold mb-2'>Referrals</p>
              <p className='text-sm sm:text-lg'>
                Code :{" "}
                <span className='font-mono tracking-widest'>
                  {users?.referralCode || "not issued yet"}
                </span>
              </p>
              <p className='text-sm sm:text-lg'>
                Earned : ${Number(users?.referralEarnings ?? 0).toFixed(2)}
                {" "}| Converted to credit : $
                {Number(users?.referralConverted ?? 0).toFixed(2)}
                {" "}| Available : $
                {(
                  Number(users?.referralEarnings ?? 0) -
                  Number(users?.referralConverted ?? 0)
                ).toFixed(2)}
              </p>
              <p className='text-sm sm:text-lg'>
                Referred by :{" "}
                {users?.referredBy ? String(users.referredBy) : "nobody"}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: `Ads List`,
      children: (
        <div className='m-10'>
          {ads?.data?.product?.length == 0 ? (
            <p className='text-3xl text-center '>No Data Found</p>
          ) : (
            <>
              {postLoading ? (
                <div>
                  <img className='block m-auto' width={80} src='/upload.gif' />
                </div>
              ) : (
                <div className='overflow-x-auto text-black'>
                  <p className='font-bold'>Total Posts : {ads?.page}</p>

                  <Table
                    className={style.tableLG}
                    columns={columns}
                    dataSource={data}
                    scroll={{
                      x: 1500,
                      y: 900,
                    }}
                    pagination={false}
                  />
                </div>
              )}
            </>
          )}

          <div className='m-auto mt-10 flex justify-center'>
            <Pagination
              defaultCurrent={current}
              pageSize={10}
              onChange={onChange}
              showSizeChanger={false}
              total={ads?.page}
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: `Recharge History`,
      children: (
        <div className='m-10'>
          {rechargeHistory?.length == 0 ? (
            <p className='text-3xl text-center '>No Data Found</p>
          ) : (
            <div className='overflow-x-auto text-black'>
              <table className='table table-compact w-10/12 m-auto'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Invoice</th>
                    <th>Status</th>
                    <th>Date of Recharge</th>
                    <th>Time of Recharge</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rechargeHistory?.map((a, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{a?.invoice}</td>
                      <td>{a?.isCompleted}</td>
                      <td>{a?.createdAt?.split("T")[0]}</td>
                      <td>{new Date(a?.createdAt).toLocaleTimeString()}</td>
                      <td>${a?.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header />
      {loading ? (
        <button className='btn bg-transparent border-0 loading lowercase w-full m-auto'>
          loading
        </button>
      ) : (
        <div className='bg-white text-6xl'>
          {users ? (
            <>
              <Tabs
                size={"large"}
                defaultActiveKey='1'
                centered
                items={items}
              />
            </>
          ) : (
            <button className='btn bg-white border-0 text-xl loading '>
              Loading...
            </button>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default UserDashboard;
