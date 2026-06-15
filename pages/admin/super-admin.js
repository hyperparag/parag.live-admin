import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UsergroupAddOutlined,
  TransactionOutlined,
  DashboardOutlined,
  LinkOutlined,
  Wri,
} from "@ant-design/icons";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import ApprovedPosts from "../../components/table/approvedPosts";
import PendingPosts from "../../components/table/pendingPosts";
import UserList from "../../components/table/userList";
import axios from "axios";
import Cookies from "js-cookie";
import AdminCharts from "../../components/charts/adminCharts";
import Links from "../../components/links/links";
import PostDetails from "../../components/Modal/postDetails";
import Profile from "../../components/Profile/profile";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import Link from "next/link";
import AddBlog from "../../components/blog/addBlog";
import BlogsList from "../../components/blog/blogsList";
import BlogDetails from "../../components/Modal/blogDetails";
import ReportList from "../../components/table/reportList";
import VerificationList from "../../components/table/verificationList";
// import ReportDetails from "../../components/Modal/reportDetails";
import SideLinks from "../../components/table/sideLinks";
import AddCredit from "../../components/Modal/addCredit";
import TableRecharge from "../../components/table/rechargeTable";
import {
  HiClipboardDocumentList,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import { FcTodoList } from "react-icons/fc";
import { MdOutlinePlaylistPlay, MdVerifiedUser } from "react-icons/md";
import { FaBloggerB } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { HiOutlineClipboardList } from "react-icons/hi";

import { Layout, Menu, theme } from "antd";
import DataCards from "../../components/charts/dataCards";
import ReportDetails from "../../components/Modal/reportDetails";
import VerificationDetails from "../../components/Modal/verificationDetails";
import RainbowAds from "../../components/rainbow-ads";
import ResponsiveAds from "../../components/responsive-ads";
import Deposit from "../../components/deposit/Deposit";

const { Header, Sider, Content } = Layout;

const initialState = {
  tab: "",
  approvedPosts: [],
  pendingPosts: [],
  monthList: {},
  userList: [],
  reportlist: [],
  verificationRequest: {},
};

const SuperAdmin = () => {
  const [current, setCurrent] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const [admin, setAdmin] = useState();

  const logout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  const [state, setstate] = useState(initialState);
  const [isloading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState();
  const [user, setUser] = useState();
  const [newUser, setnewUser] = useState();
  const [reload, setReload] = useState(false);
  const [blogId, setBlogId] = useState();
  const [allDatas, setAllData] = useState();
  const [blogLoading, setBlogLoading] = useState(false);

  const onClick = (e) => {
    setstate({ ...state, tab: e });
  };

  const usersStringfy = Cookies.get("token");

  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      if (user.role !== "superAdmin") {
        router.push("/login");
      }
      setAdmin(user);
      return;
    }
  }, []);

  async function allData() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/allData`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );

      setAllData(response.data);

      setIsLoading(false);
      // total page dashboaord theke ante hobe
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    allData();
    const user = jwt_decode(usersStringfy);
    setUser(user);
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  let content;
  if (state.tab == "") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'>Dashboard</h1>
        <div className='m-1 '>
          <DataCards data={allDatas} />
        </div>
      </div>
    );
  }
  if (state.tab == "runningPosts") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'>Running Posts</h1>
        <div className='m-5'>
          <ApprovedPosts setNewPost={setNewPost} datas={allDatas} />
        </div>
      </div>
    );
  }
  if (state.tab == "pendingPosts") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Pending Posts</h1>
        <div className='m-5'>
          <PendingPosts setNewPost={setNewPost} />
        </div>
      </div>
    );
  }
  if (state.tab == "userlist") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'>
          {" "}
          User List ({allDatas?.allUsers})
        </h1>
        <div className='m-5'>
          <UserList setnewUser={setnewUser} datas={allDatas} />
        </div>
      </div>
    );
  }
  if (state.tab == "links") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Important Links</h1>
        <div className='m-5'>
          <Links users={state.userList} />
        </div>
      </div>
    );
  }
  if (state.tab == "profile") {
    content = (
      <div>
        <Profile user={user} />
      </div>
    );
  }
  if (state.tab == "deposit") {
    content = (
      <div>
        {" "}
        <h1 className='text-2xl font-bold m-5 text-black'> Deposits</h1>
        <div className='m-1'>
          <Deposit setnewUser={setnewUser} />
        </div>
      </div>
    );
  }
  if (state.tab == "addBlog") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Add Blog</h1>
        <div className='m-1'>
          <AddBlog />
        </div>
      </div>
    );
  }
  if (state.tab == "blogList") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'>
          {" "}
          Blog List ({allDatas?.allBlogs})
        </h1>
        <div className='m-5'>
          <BlogsList
            setBlogId={setBlogId}
            reload={reload}
            setBlogLoading={setBlogLoading}
          />
        </div>
      </div>
    );
  }
  if (state.tab == "sideLinks") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Side Links List</h1>
        <div className='m-5'>
          <SideLinks />
        </div>
      </div>
    );
  }
  if (state.tab == "rainbow") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Rainbow Ads</h1>
        <div className='m-5'>
          <RainbowAds />
        </div>
      </div>
    );
  }
  if (state.tab == "responsive") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Responsive Ads </h1>
        <div className='m-5'>
          <ResponsiveAds />
        </div>
      </div>
    );
  }
  if (state.tab == "reports") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'> Reports List</h1>
        <div className='m-5'>
          <ReportList setstate={setstate} state={state} reload={reload} />
        </div>
      </div>
    );
  }

  if (state.tab == "verification") {
    content = (
      <div>
        <h1 className='text-2xl font-bold m-5 text-black'>
          Verification Requests
        </h1>
        <div className='m-5'>
          <VerificationList setstate={setstate} state={state} reload={reload} />
        </div>
      </div>
    );
  }

  if (state.tab == "transaction") {
    content = (
      <div>
        <h1 className='text-2xl font-bold sm:m-5 text-black'>
          {" "}
          Transaction History
        </h1>
        <div className='sm:m-5'>
          <TableRecharge />
        </div>
      </div>
    );
  }
  function getItem(label, icon, key, children) {
    return {
      label,
      key,
      icon,
      children,
    };
  }
  const items = [
    getItem("Dashboard", <DashboardOutlined className='icons' />, ""),
    getItem("Deposit", <TransactionOutlined className='icons' />, "deposit"),
    getItem("Posts", <HiClipboardDocumentList className='icons' />, "sub2", [
      getItem(
        "Running Posts",
        <FcTodoList className='icons' />,
        "runningPosts",
      ),
      getItem(
        "Pending Posts",
        <MdOutlinePlaylistPlay className='icons' />,
        "pendingPosts",
      ),
    ]),

    getItem("Users", <UsergroupAddOutlined className='icons' />, "userlist"),

    getItem("Ads", <LinkOutlined className='icons' />, "sub4", [
      getItem("Header Ads", <LinkOutlined className='icons' />, "links"),
      getItem(
        "Side Ads",
        <BsLayoutTextSidebar className='icons' />,
        "sideLinks",
      ),
      getItem(
        "Responsive Ads",
        <BsLayoutTextSidebar className='icons' />,
        "responsive",
      ),
      getItem(
        "Rainbow Ads",
        <BsLayoutTextSidebar className='icons' />,
        "rainbow",
      ),
    ]),

    getItem("Blog", <FaBloggerB className='icons' />, "sub3", [
      getItem(
        "Add Blog",
        <HiOutlinePencilSquare className='icons' />,
        "addBlog",
      ),
      getItem(
        "Blog List",
        <HiOutlineClipboardList className='icons' />,
        "blogList",
      ),
    ]),
    getItem("Reports", <GoReport className='icons' />, "reports"),
    getItem(
      "Verification Requests",
      <MdVerifiedUser className='icons' />,
      "verification",
    ),
  ];

  return (
    <>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Admin Panel</title>
      </Head>

      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className='logo'>
            {collapsed ? (
              <h1 className='text-2xl'>PRG</h1>
            ) : (
              <h1 className='text-2xl'>PARAG</h1>
            )}
          </div>
          <Menu
            className={`bg-white border-0 m-0 `}
            onClick={(e) => onClick(e.key)}
            selectedKeys={[current]}
            mode='inline'
            items={items}
          />
        </Sider>
        <Layout className='site-layout'>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <div className='flex items-center justify-between w-full '>
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: () => setCollapsed(!collapsed),
                },
              )}

              <div className='dropdown dropdown-end mt-2 mr-5'>
                <div className='avatar online'>
                  <div className='w-10 rounded-full cursor-pointer'>
                    {admin?.avater == "avater" ? (
                      <img tabIndex={0} src={"/user.png"} />
                    ) : (
                      <img tabIndex={0} src={admin?.avater} />
                    )}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content menu shadow bg-white rounded border-red-600 border w-52'
                >
                  <li className='hover:bg-red-400 text-black '>
                    <button
                      onClick={() => setstate({ ...state, tab: "profile" })}
                      className='h-10'
                    >
                      My Profile
                    </button>
                  </li>
                  <Link href={`/`}>
                    {" "}
                    <li className='hover:bg-red-400 text-black'>
                      <button onClick={() => logout()} className='h-10'>
                        logout{" "}
                      </button>
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
          </Header>

          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,

              background: colorBgContainer,
            }}
          >
            {isloading ? (
              <div className='h-96 flex justify-center items-center'>
                <img className='w-24' src='/upload.gif' />
              </div>
            ) : (
              <> {content}</>
            )}
          </Content>
          <PostDetails
            id={newPost}
            setReload={setReload}
            reload={reload}
          ></PostDetails>

          <BlogDetails
            setReload={setReload}
            reload={reload}
            blog={blogId}
            blogLoading={blogLoading}
          ></BlogDetails>
          <AddCredit
            user={newUser}
            setReload={setReload}
            reload={reload}
          ></AddCredit>
          <ReportDetails
            report={state.reportlist}
            setReload={setReload}
            reload={reload}
          ></ReportDetails>
          <VerificationDetails
            request={state.verificationRequest}
            setReload={setReload}
            reload={reload}
          ></VerificationDetails>
        </Layout>
      </Layout>
    </>
  );
};
export default SuperAdmin;
