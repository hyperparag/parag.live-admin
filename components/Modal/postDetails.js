import React, { useEffect, useState } from "react";
import style from "../../styles/moduleCss/postDetailsModal.module.css";
import { AiOutlineRight } from "react-icons/ai";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const PostDetails = ({ id, setReload, reload }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  
  async function getPost() {
    fetch(`  https://paraglive-backend.vercel.app/api/products/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result, "details modal");
        setData(result?.data?.[0]);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    } else if (id == undefined) {
      return;
    } else {
      getPost();
    }
  }, [id]);

  const cities = data?.cities?.map((a, index) => <li key={index}>{a}</li>);

  const localDate = new Date(data?.createdAt);
  const time = localDate?.toLocaleTimeString();
  const date = localDate?.toLocaleDateString();
  const usersStringfy = Cookies.get("token");

  const approve = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `  https://paraglive-backend.vercel.app/api/products/approved/${id}`,
            { isApproved: true },
            {
              headers: {
                authorization: `Bearer ${usersStringfy}`,
              },
            },
          )
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire(
                "Approved!",
                "Post has been shown in Running Post.",
                "success",
              );
            }
            setReload(!reload);
          });
      }
    });
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`  https://paraglive-backend.vercel.app/api/products/${id}`, {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          })
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            setReload(!reload);
          });
      }
    });
  };

  return (
    <div>
      <input type='checkbox' id='my-modal-5' className='modal-toggle' />
      <div className='modal'>
        {loading ? (
          <img src='/upload.gif' />
        ) : (
          <div className='modal-box w-11/12 max-w-5xl h-4/5 max-h-screen bg-white'>
            {data?.isPremium ? (
              <div className='flex justify-between'>
                <div className='badge badge-success text-white font-bold p-5'>
                  Paid
                </div>

                <label
                  htmlFor='my-modal-5'
                  className='text-2xl font-bold text-red-600 cursor-pointer'
                >
                  X
                </label>
              </div>
            ) : (
              <div className='flex justify-between'>
                <div className='badge badge-error text-white font-bold p-5'>
                  Free{" "}
                </div>
                <p className='text-2xl font-bold text-red-600'>X</p>
              </div>
            )}

            <div className={style.imageContainer}>
              <img className='h-[25px]' src={data?.imgOne}></img>
              {data?.imgTwo != "empty" ? (
                <img className={style.img} src={data?.imgTwo}></img>
              ) : (
                ""
              )}
              {data?.imgThree != "empty" ? (
                <img className={style.img} src={data?.imgThree}></img>
              ) : (
                ""
              )}
              {data?.imgFour != "empty" ? (
                <img className={style.img} src={data?.imgFour}></img>
              ) : (
                ""
              )}
            </div>
            <h3 className='text-lg text-black'>
              {" "}
              <span className='font-bold text-black'>Title : </span>{" "}
              {data?.name}
            </h3>
            <h3 className='text-lg text-black'>
              {" "}
              <span className='font-bold text-black'>Category : </span>{" "}
              {data?.category} <AiOutlineRight className='inline' />{" "}
              {data?.subCategory}
            </h3>
            <p className='py-4 font-normal text-black'>
              <span className='font-bold text-black'>Description : </span>{" "}
              {data?.description}
            </p>

            <div className='py-4 font-normal text-black'>
              <span className='font-bold text-black'>Selected Area : </span>{" "}
              {data?.city ? (
                data?.city
              ) : (
                <div className={style.cityList}>{cities}</div>
              )}
            </div>
            <p className='font-normal text-black'>
              <span className='font-bold text-black'>Posted at : </span> {time},{" "}
              {date}
            </p>
            <br></br>
            <hr />
            <h1 className=' text-lg text-red-400 font-bold'>Poster Details</h1>

            <p className='mt-2 font-normal text-black'>
              <span className='font-bold text-black'> Name : </span>{" "}
              {data?.owner?.[0]?.firstName} {data?.owner?.[0]?.lastName}{" "}
            </p>
            <p className='mt-2 font-normal text-black'>
              <span className='font-bold text-black'> Email : </span>{" "}
              {data?.owner?.[0]?.email}
            </p>
            <p className='mt-2 font-normal text-black'>
              <span className='font-bold text-black'> Phone : </span>{" "}
              {data?.phone}
            </p>
            <p className='mt-2 font-normal text-black'>
              <span className='font-bold text-black'> Age : </span> {data?.age}
            </p>
            <p className='mt-2 font-normal text-black'>
              <span className='font-bold text-black'> Location : </span>{" "}
              {data?.owner?.[0]?.address?.city},{" "}
              {data?.owner?.[0]?.address?.country}
            </p>
            <div className='modal-action'>
              <label
                htmlFor='my-modal-5'
                className='bg-blue-700 px-3 py-1 text-white font-bold rounded cursor-pointer'
              >
                Cancel
              </label>
              <button onClick={() => deleteUser(data._id)}>
                <label
                  htmlFor='my-modal-5'
                  className='bg-red-600 px-3 py-2 text-white cursor-pointer font-bold rounded'
                >
                  Delete{" "}
                </label>
              </button>

              {data?.isApproved ? (
                ""
              ) : (
                <button onClick={() => approve(data._id)}>
                  <label
                    htmlFor='my-modal-5'
                    className='bg-green-600 px-3 py-2 text-white cursor-pointer font-bold rounded'
                  >
                    Approve{" "}
                  </label>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
