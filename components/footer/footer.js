import React, { useEffect, useState } from "react";
import style from "../../styles/moduleCss/footer.module.css";
import { AiFillFacebook, AiFillTwitterSquare } from "react-icons/ai";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Link from "next/link";

const Footer = () => {
  const [user, setUser] = useState();

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      setUser(user);
    }
  }, []);

  return (
    <div>
      <footer className="main-footer">
        
      </footer>
    </div>
  );
};

export default Footer;
