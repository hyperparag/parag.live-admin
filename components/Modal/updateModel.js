import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import style from "../../styles/moduleCss/profile.module.css";

const initialState = {
  city: "",
  zipCode: "",
  regionName: "",
  country: "",
};
const UpdateModel = ({ data, token }) => {
  const [state, setState] = useState(initialState);

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  const submit = async () => {
    const datas = { ...state };

    const options = {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    await axios
      .patch(
        `https://paraglive-backend.vercel.app/api/users/address/${data?._id}`,
        datas,
        options,
      )
      .then((res) => {
        if (res.data.status == "success") {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Your address has successfully updated",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };
  return (
    <div>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal modal-bottom sm:modal-middle bg-transparent '>
        <div className='modal-box bg-red-200'>
          <div className='flex justify-between'>
            {data?.address == undefined ? (
              <h3 className='font-bold text-black text-lg'>Add Address</h3>
            ) : (
              <h3 className='font-bold text-black text-lg'>Update Adress</h3>
            )}
            <label htmlFor='my-modal-3' className='font-bold cursor-pointer'>
              X
            </label>
          </div>
          <div>
            <div className={style.profileContainer}>
              <label className={style.labels}>
                City :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "city", payload: e.target.value })
                  }
                  type='text'
                  placeholder={state.userData?.firstName}
                  className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                />
              </label>
              <label className={style.labels}>
                ZipCode :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "zipCode", payload: e.target.value })
                  }
                  type='text'
                  placeholder={state.userData?.firstName}
                  className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                />
              </label>
              <label className={style.labels}>
                Region Name :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "regionName", payload: e.target.value })
                  }
                  type='text'
                  placeholder={state.userData?.firstName}
                  className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                />
              </label>
              <label className={style.labels}>
                Country :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "country", payload: e.target.value })
                  }
                  type='text'
                  placeholder={state.userData?.firstName}
                  className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                />
              </label>
            </div>
          </div>

          <div className='modal-action'>
            <button
              onClick={() => submit()}
              className=' bg-green-300 px-2 py-1 rounded text-black font-bold hover:text-white hover:bg-blue-300 cursor-pointer'
            >
              {" "}
              <label htmlFor='my-modal-3'>Submit </label>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;
