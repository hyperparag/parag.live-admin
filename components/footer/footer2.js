import React, { useEffect, useState } from 'react';
import style from "../../styles/moduleCss/footer.module.css"
import { AiFillFacebook , AiFillTwitterSquare
 } from "react-icons/ai";
import Link from 'next/link';
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode"

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
        <div  className={` mt-0 pt-0 mb-10 `}>
              
        </div>
    );
};

export default Footer;