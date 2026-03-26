import React, { useState } from "react";
import { Input, Space } from "antd";
const { Search } = Input;
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const AddCredit = ({ user, setReload, reload }) => {
  const [laoding, setLoading] = useState(false);

  const usersStringfy = Cookies.get("token");

  const onSearch = (value) => {
    value.preventDefault();
    setLoading(true);
    const id = user?.userId ?? user?._id;
    const number = value.target.num.value;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Added it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `https://paraglive-backend.vercel.app/api/users/add-credit/${id}?isUpdate=${
              user?.userId ? `${user?._id}` : ""
            }`,
            {
              credit: number,
            },
          )
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Added!", "You have added credit", "success", ``);
              value.target.reset();
            }
            setLoading(false);
            setReload(!reload);
            global.document.getElementById("my-modal-21").checked = false;
          });
      }
    });
  };

  return (
    <div>
      <input type='checkbox' id='my-modal-21' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box w-11/12 max-w-5xl sm:w-8/12  max-h-screen bg-white'>
          <p className='text-3xl text-red-600 text-center'>
            Warning! Do you really wanna give this user credits ?
          </p>
          <br />

          {user?.avater == "avater" ? (
            <img width={100} className='block m-auto' src='/user.png' />
          ) : (
            <img width={100} className='block m-auto' src={user?.avater}></img>
          )}

          <p className='text-black text-xl text-center'>
            Name : {user?.userName}
          </p>
          <p className='text-black text-xl text-center'>
            Email : {user?.email}
          </p>
          {/*<Search
            className="w-48 block m-auto"
            enterButton="Submit"
            size="medium"
            type="number"
            onSearch={onSearch}
          />*/}
          <form className='m-auto flex justify-center mt-2' onSubmit={onSearch}>
            <input
              name='num'
              className='w-[150px] p-1 bg-gray-200 text-red-600 font-bold'
            />
            {laoding ? (
              <button
                type='submit'
                className='bg-green-500 text-white p-1 px-7 font-bold'
              >
                <img className='w-[20px]' src='/upload.gif' />
              </button>
            ) : (
              <button
                type='submit'
                className='bg-green-500 text-white p-1 px-3 font-bold'
              >
                Submit
              </button>
            )}
          </form>
          <br />
          <br />
          <br />
          <label
            htmlFor='my-modal-21'
            className='bg-blue-400 px-3 py-1 mr-5 text-white cursor-pointer font-bold rounded'
          >
            Cancel
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddCredit;
