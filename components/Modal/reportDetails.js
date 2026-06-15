import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Swal from "sweetalert2";
import style from "../../styles/moduleCss/postDetailsModal.module.css";

const ReportDetails = ({ report, reload, setReload }) => {
  const cities = report?.reportedPost?.[0]?.cities?.map((a) => (
    <li key={a}>{a}</li>
  ));

  const usersStringfy = Cookies.get("token");

  const read = async (id) => {
    if (report.isRead == true) {
      return;
    } else {
      await axios
        .patch(
          `http://localhost:5000/api/reports/${id}`,
          { isRead: true },
          {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          },
        )
        .then((response) => {
          setReload(!reload);
        });
    }
  };

  const localDate = new Date(report?.createdAt);
  const time = localDate?.toLocaleTimeString();
  const date = localDate?.toLocaleDateString();

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
          .delete(`http://localhost:5000/api/products/${id}`, {
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
      <input type='checkbox' id='my-modal-16' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box w-11/12 max-w-5xl h-4/5 max-h-screen bg-white'>
          <div>
            <h1 className='text-red-400 text-2xl'>Report Details</h1>
            <hr />
            <br />
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Subject :</span> {report?.subject}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Report :</span> {report?.reportDesc}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Reported at :</span> {time}, {date}
            </p>
          </div>
          <br />
          <br />
          <br />
          <div>
            <h1 className='text-red-400 text-2xl'>Reported Ads Details</h1>
            <hr />
            <br />
            {report?.reportedPost?.[0] ? (
              <>
                {" "}
                {report?.reportedPost?.[0]?.isPremium ? (
                  <button className='bg-green-400 px-1 text-white'>
                    Paid Ad{" "}
                  </button>
                ) : (
                  <button>Free Ad</button>
                )}
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Name :</span>{" "}
                  {report?.reportedPost?.[0]?.name}
                </p>
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Email :</span>{" "}
                  {report?.reportedPost?.[0]?.email}
                </p>
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Phone :</span>{" "}
                  {report?.reportedPost?.[0]?.phone}
                </p>
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Age :</span>{" "}
                  {report?.reportedPost?.[0]?.age}
                </p>
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Category :</span>{" "}
                  {report?.reportedPost?.[0]?.category +
                    " > " +
                    report?.reportedPost?.[0]?.subCategory}
                </p>
                <p className='text-black text-xs mb-1'>
                  <span className='font-bold'> Description :</span>{" "}
                  {report?.reportedPost?.[0]?.description}
                </p>
                <div className={style.imageContainer}>
                  <img
                    className={style.img}
                    src={report?.reportedPost?.[0]?.imgOne}
                  ></img>
                  {report?.reportedPost?.[0]?.imgTwo ? (
                    <img
                      className={style.img}
                      src={report?.reportedPost?.[0]?.imgTwo}
                    ></img>
                  ) : (
                    ""
                  )}
                  {report?.reportedPost?.[0]?.imgThree ? (
                    <img
                      className={style.img}
                      src={report?.reportedPost?.[0]?.imgThree}
                    ></img>
                  ) : (
                    ""
                  )}
                  {report?.reportedPost?.[0]?.imgFour ? (
                    <img
                      className={style.img}
                      src={report?.reportedPost?.[0]?.imgFour}
                    ></img>
                  ) : (
                    ""
                  )}
                </div>
                <div className='py-4 font-normal text-black text-xs'>
                  <span className='font-bold text-black'>Selected Area : </span>{" "}
                  {report?.reportedPost?.[0]?.city ? (
                    report?.city
                  ) : (
                    <div className={style.cityList}>{cities?.length}</div>
                  )}
                </div>
                <button>
                  <label
                    htmlFor='my-modal-16'
                    className='bg-red-600 px-3 py-1 text-white cursor-pointer font-bold rounded'
                    onClick={() => deleteUser(report?.reportedPost?.[0]?._id)}
                  >
                    Delete Post{" "}
                  </label>
                </button>
              </>
            ) : (
              "Post is Deleted"
            )}

            <br />
            <br />
            <br />
            <h1 className='text-red-400 text-2xl'>Reported Ad Owner Details</h1>
            <hr />
            <br />
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Name :</span>{" "}
              {report?.reportedUser?.[0]?.firstName +
                " " +
                report?.reportedUser?.[0]?.lastName}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Email :</span>{" "}
              {report?.reportedUser?.[0]?.email}
            </p>
            {report?.reportedUser?.[0]?.address?.city ? (
              <p className='text-black text-xs mb-1'>
                <span className='font-bold'> Address :</span>{" "}
                {report?.reportedUser?.[0]?.address?.city},
                {" " + report?.reportedUser?.[0]?.address?.zipCode},
                {" " + report?.reportedUser?.[0]?.address?.regionName},
                {" " + report?.reportedUser?.[0]?.address?.country}
              </p>
            ) : (
              ""
            )}

            <div className='mb-2'>
              {report?.reportedUser?.[0]?.avater == "avater" ? (
                <img
                  className={style.postImage}
                  style={{ height: "150px" }}
                  src='/user.png'
                />
              ) : (
                <img
                  className={style.postImage}
                  style={{ height: "150px" }}
                  src={report?.reportedUser?.[0]?.avater}
                />
              )}
            </div>
            <button>
              <label
                htmlFor='my-modal-16'
                className='bg-red-600 px-3 py-1 text-white cursor-pointer font-bold rounded'
              >
                Ban User
              </label>
            </button>
            <br />
            <br />
            <br />
            <br />
            <h1 className='text-red-400 text-2xl'>Reporter Details</h1>
            <hr />
            <br />
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Name :</span>{" "}
              {report?.reporter?.[0]?.firstName +
                " " +
                report?.reporter?.[0]?.lastName}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Email :</span>{" "}
              {report?.reporter?.[0]?.email}
            </p>
            {report?.reporter?.[0]?.address?.city ? (
              <p className='text-black text-xs mb-1'>
                <span className='font-bold'> Address :</span>{" "}
                {report?.reporter?.[0]?.address?.city},
                {" " + report?.reporter?.[0]?.address?.zipCode},
                {" " + report?.reporter?.[0]?.address?.regionName},
                {" " + report?.reporter?.[0]?.address?.country}
              </p>
            ) : (
              ""
            )}

            <div>
              {report?.reporter?.[0]?.avater == "avater" ? (
                <img
                  className={style.postImage}
                  style={{ height: "150px" }}
                  src='/user.png'
                />
              ) : (
                <img
                  className={style.postImage}
                  style={{ height: "150px" }}
                  src={report?.reporter?.[0]?.avater}
                />
              )}
            </div>
          </div>

          <div className='modal-action'>
            <label
              htmlFor='my-modal-16'
              className='bg-blue-400 px-3 py-1 text-white font-bold rounded cursor-pointer'
              onClick={() => read(report?._id)}
            >
              Cancel
            </label>
            <button>
              <label
                htmlFor='my-modal-16'
                className='bg-green-600 px-3 py-2 text-white cursor-pointer font-bold rounded'
                onClick={() => read(report?._id)}
              >
                Done
              </label>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
