import React, { useState } from "react";
import style from "../styles/moduleCss/sign.module.css";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import Link from "next/link";
import Footer from "../components/footer/footer2";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Head from "next/head";

const initialState = {
  email: "",
  password: "",
  passError: "",
  emailError: "",
};

const Home = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { ...state, isLoading: true };

    await axios
      .post("http://localhost:5000/api/users/login", data)

      .then((response) => {
        setIsLoading(false);

        if (response?.data?.message == "success") {
          if (response?.data?.user?.role == "superAdmin") {
            Cookies.set("token", response.data.token);
            setState({ ...state, emailError: "" });

            if (router?.asPath == "/") {
              router.push(`/admin/super-admin`);
            } else {
              setTimeout(() => {
                router.reload(router?.asPath);
              }, 500);
            }
            setIsLoading(false);
          } else {
            setState({ ...state, emailError: "Something went wrong" });
          }
        } else {
          setState({ ...state, emailError: "Something went wrong" });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setState({ ...state, emailError: error?.response?.data?.message });
      });
  };

  return (
    <div>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Login</title>
      </Head>
      <div className={style.container}>
        <p className='text-4xl text-red-600 text-center font-bold'>PARAG</p>
        <h1 className='flex justify-center text-3xl font-bold mb-5'>Login</h1>
        <form onSubmit={login}>
          <div className={style.inputBox}>
            <span>
              <AiOutlineMail />
            </span>
            <input
              type='text'
              placeholder='Email'
              className={style.input}
              onChange={(e) =>
                dispatch({ type: "email", payload: e.target.value })
              }
            />
          </div>
          <div className={style.inputBox}>
            <span>
              <AiFillLock />
            </span>
            <input
              type='password'
              placeholder='Password'
              className={style.input}
              onChange={(e) =>
                dispatch({ type: "password", payload: e.target.value })
              }
            />
          </div>
          <p className='text-xs text-red-600 text-center'>{state.emailError}</p>
          <div className={style.inputBox}>
            {isLoading == true ? (
              <button className='btn btn-outline btn-success  hover:text-white btn-wide'>
                <img width={50} src='/login.gif' />
              </button>
            ) : (
              <button
                className='btn btn-outline btn-success text-2xl hover:text-white btn-wide '
                type='submit'
              >
                login
              </button>
            )}
          </div>
        </form>
        {/*<p className="text-2xl flex justify-center mt-5">
          New here ?{" "}
          <Link className="text-blue-600 underline" href={`/register`}>
            Register
          </Link>{" "}
        </p>*/}
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;
