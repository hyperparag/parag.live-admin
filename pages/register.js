import React, { useEffect, useState } from "react";
import style from "../styles/moduleCss/sign.module.css";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import Link from "next/link";
import Footer from "../components/footer/footer2";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  month: "",
  password: "",
  isDelete: false,
  address: {
    country: "",
    regionName: "",
    zipCode: "",
    city: "",
  },
  confirmPass: "",
  passError: "",
  emailError: "",
};

const Register = () => {
  const router = useRouter();
  // const { location } = Location();
  const [state, setState] = useState(initialState);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  useEffect(() => {
    if (state.password !== state.confirmPass) {
      setState({ ...state, passError: "Password didnt matched" });
    } else {
      setState({ ...state, passError: "" });
    }
  }, [state.confirmPass, state.password]);

  const register = async () => {
    setIsLoading(true);
    let data = { ...state };

    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" });
    data["month"] = month;
    // data.address["country"] = location?.country
    // data.address["regionName"] = location?.regionName
    // data.address["zipCode"] = location?.zip
    // data.address["city"] = location?.city

    await axios
      .post("http://localhost:5000/api/users", data)
      .then((response) => {
        if (response.data.message == "success") {
          setIsLoading(false);
          router.push("/login");
        } else {
          setState({ ...state, emailError: "Something went wrong" });
        }
      })
      .catch((error) => {
        setState({ ...state, emailError: error.response.data.error });
      });
  };

  return (
    <div>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Register</title>
      </Head>
      <div className={style.container}>
        <img
          alt='cityxdate'
          title='cityxdate'
          width={250}
          className='m-auto pb-5 '
          src='/logo.png'
        />
        <h1 className='flex justify-center text-3xl font-bold mb-5'>
          Registration
        </h1>

        <div className={style.inputBox}>
          <span>
            <BiUser />
          </span>
          <input
            type='text'
            placeholder='First Name'
            className={style.input}
            onChange={(e) =>
              dispatch({ type: "firstName", payload: e.target.value })
            }
          />
        </div>
        <div className={style.inputBox}>
          <span>
            <BiUser />
          </span>
          <input
            type='text'
            placeholder='Last Name'
            className={style.input}
            onChange={(e) =>
              dispatch({ type: "lastName", payload: e.target.value })
            }
          />
        </div>
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
        <div className={style.inputBox}>
          <span>
            <AiFillLock />
          </span>
          <input
            type='password'
            placeholder='Confirm Password'
            className={style.input}
            onChange={(e) =>
              dispatch({ type: "confirmPass", payload: e.target.value })
            }
          />
        </div>
        <p className='text-xs text-red-600 text-center'>{state.passError}</p>
        <p className='text-xs text-red-600 text-center'>{state.emailError}</p>

        <div className={style.inputBox}>
          {isLoading == true ? (
            <button className='btn btn-outline btn-success  hover:text-white btn-wide'>
              <img width={50} src='/login.gif' />
            </button>
          ) : (
            <button
              className='btn btn-outline btn-error text-2xl hover:text-green-200 btn-wide '
              onClick={() => register()}
            >
              Register
            </button>
          )}
        </div>

        <p className='text-2xl flex justify-center mt-5'>
          Already Registered ?{" "}
          <Link className='text-blue-600 underline' href={`/login`}>
            Login
          </Link>{" "}
        </p>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Register;
