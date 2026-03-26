import Link from "next/link";
import { BsList } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import style from "../../styles/moduleCss/services.module.css";
import { useRouter } from "next/router";

const Drawer = (data) => {
  const router = useRouter()
  const [cities, setCities] = useState();
  const [city, setCity] = useState();
  const [user, setUser] = useState();
  


  useEffect(() => {
    fetch(`/country.json`)
      .then((res) => res.json())
      .then((data) => setCities(data));
  }, []);

  useEffect(() => {
    if (!cities) {
      return;
    }

    const ag = cities?.find((a) => a.name == data?.name[0]);
    const ak = ag?.children?.find((a) => a.name == data?.name[1]);
    const as = ak?.children?.map((a) => a?.name);

    setCity(as);
  }, [cities]);

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      setUser(user);
      return;
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    
  };




  const Headers = () => {
    return (
      <div className={style.top}>
        <div className="flex justify-center items-center">

        {
          router.asPath == "/dashboard" ? <label htmlFor="my-drawer-2" className="drawer-button">
          <BsList className="text-3xl mr-5 cursor-pointer" />
        </label> :    <label htmlFor="my-drawer" className="drawer-button">
            <BsList className="text-3xl mr-5 cursor-pointer" />
          </label>
        }
       
      


          <Link href="/" className="brand-link d-inline-block">
            <img
               src="/logo.png"
              alt="brand-image"
           
              className={style.brandimage}
            />
          </Link>
          <div>
            <div className={style.postMenu}>
              <Link
                href=" /user/post/"
                className="post-profile__btn flex items-center flex-shrink-0 p-l-5 p-r-10"
              >
                <div className="icon d-inline-flex align-items-center justify-content-center m-r-5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>plus</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.0799 0.0908203C6.57155 0.0908203 6.15945 0.502921 6.15945 1.01127V5.30673H1.86399C1.35564 5.30673 0.943537 5.71883 0.943537 6.22718C0.943537 6.73554 1.35564 7.14764 1.86399 7.14764H6.15945V11.4431C6.15945 11.9514 6.57155 12.3635 7.0799 12.3635C7.58825 12.3635 8.00036 11.9514 8.00036 11.4431V7.14764H12.2958C12.8042 7.14764 13.2163 6.73554 13.2163 6.22718C13.2163 5.71883 12.8042 5.30673 12.2958 5.30673H8.00036V1.01127C8.00036 0.502922 7.58825 0.0908203 7.0799 0.0908203Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="color-white lh-normal">Post Ad</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={style.locationMenu}>
          {data?.name?.[0] ? (
            <p>
              {data?.name?.[2]}, {data?.name?.[1]} ,{data?.name?.[0]}
            </p>
          ): " "}
          {
            router.asPath.includes("/dashboard") && <>     {
              data.avater == "avater" ? <img className={style.avater} src="user.png" /> : 
                <img className={style.avater} src={data.avater} />
              
            }</>
          }

     
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    return (
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
        <div className={style.postMenu2}>
              <Link
                href=" /user/post/"
                className="post-profile__btn flex items-center flex-shrink-0 p-l-5 p-r-10"
              >
                <div className="icon d-inline-flex align-items-center justify-content-center m-r-5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>plus</title>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.0799 0.0908203C6.57155 0.0908203 6.15945 0.502921 6.15945 1.01127V5.30673H1.86399C1.35564 5.30673 0.943537 5.71883 0.943537 6.22718C0.943537 6.73554 1.35564 7.14764 1.86399 7.14764H6.15945V11.4431C6.15945 11.9514 6.57155 12.3635 7.0799 12.3635C7.58825 12.3635 8.00036 11.9514 8.00036 11.4431V7.14764H12.2958C12.8042 7.14764 13.2163 6.73554 13.2163 6.22718C13.2163 5.71883 12.8042 5.30673 12.2958 5.30673H8.00036V1.01127C8.00036 0.502922 7.58825 0.0908203 7.0799 0.0908203Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="color-white lh-normal">Post Ad</span>
              </Link>
            </div>
          {user?._id ? (
            <>
              {" "}
              <li className={style.itemLast}>
                {" "}
                <Link href="/dashboard" className="link no-underline">
                  Dashboard
                </Link>
              </li>
            </>
          ) : (
            <>
              {" "}
              <li className={style.itemLast}>
                <Link href="/login" className="link no-underline">
                  Login
                </Link>
              </li>
              <li className={style.itemLast}>
                <Link href="/register" className="link no-underline">
                  Register
                </Link>
              </li>
            </>
          )}
          {data?.name?.length == 3 && (
            <div className="bg-gray-200 text-black">
              <p className="text-red-600 font-bold">Nearest Cities</p>
              {city?.map((a) => (
                <p className="mt-2 ml-2 underline">
                  <Link href={`/${data?.name[0]}/${data?.name[1]}/${a}`}>
                    {a}
                  </Link>
                </p>
              ))}
            </div>
          )}
          {data?.name?.length == 5 && (
            <div className="bg-gray-200 text-black">
              <p className="text-orange-600">Nearest Cities</p>
              {city?.map((a) => (
                <p className="mt-2 ml-2 underline">
                  <Link
                    href={`/post/${data?.name[0]}/${data?.name[1]}/${a}/${data?.name[3]}/${data?.name[4]}`}
                  >
                    {a}
                  </Link>
                </p>
              ))}
            </div>
          )}

          {user?._id && (
            <li className={`${style.itemLast}, mt-auto`}>
              <button
                className="bg-red-600 p-1 border rounded border-0 text-white font-bold"
                onClick={logout}
              >
                   <Link href="/login">
                   Logout
          </Link>
                
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return {
    Sidebar,
    Headers,
  };
};

export default Drawer;
