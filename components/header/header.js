import Link from "next/link";
import React, { useEffect, useState } from "react";
import style from "../../styles/moduleCss/header.module.css";
import { BsList } from "react-icons/bs";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState();
  const [links, setLinks] = useState();

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      setUser(user);
    }
    getUser();
  }, []);

  const logout = () => {
    Cookies.remove("token");
  };

  async function getUser() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/links`,
        {
          method: "GET",
        },
      );
      const data = response.data.links[0];

      setLinks(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={`${style.header} , sticky top-0 z-50`}>
      <h1 className='text-3xl flex items-center text-red-600 underline font-bold'>
        <Link href={"/admin/super-admin"}>Back to Admin Panel</Link>
      </h1>
    </div>
  );
};

export default Header;
