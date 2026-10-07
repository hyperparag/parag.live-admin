import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import Swal from "sweetalert2";
import style from "../../styles/moduleCss/postDetailsModal.module.css";

const VerificationDetails = ({ request, reload, setReload }) => {
  const usersStringfy = Cookies.get("token");

  const localDate = new Date(request?.createdAt);
  const time = localDate?.toLocaleTimeString();
  const date = localDate?.toLocaleDateString();

  const review = (status, note) => {
    axios
      .patch(
        `  https://paraglive-backend.vercel.app/api/verification/${request?._id}`,
        { status, note },
        {
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      )
      .then((response) => {
        if (response.data.status == "success") {
          Swal.fire(
            status == "verified" ? "Approved!" : "Rejected!",
            "Verification request has been updated.",
            "success",
          );
        }
        setReload(!reload);
        document.getElementById("my-modal-20").checked = false;
      });
  };

  const remove = () => {
    Swal.fire({
      title: "Delete this request permanently?",
      text: "This also deletes the submitted ID photos. It cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it forever",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(
          `  https://paraglive-backend.vercel.app/api/verification/${request?._id}`,
          {
            headers: {
              authorization: `Bearer ${usersStringfy}`,
            },
          },
        )
        .then((response) => {
          if (response.data.status == "success") {
            const removed = response.data.data?.imagesRemoved ?? 0;
            Swal.fire(
              "Deleted!",
              `Request removed${removed ? ` along with ${removed} image(s)` : ""}.`,
              "success",
            );
          } else {
            Swal.fire(
              "Could not delete",
              response.data.message || "Please try again.",
              "error",
            );
          }
          setReload(!reload);
          document.getElementById("my-modal-20").checked = false;
        })
        .catch((error) => {
          Swal.fire(
            "Could not delete",
            error?.response?.data?.message || "Please try again.",
            "error",
          );
        });
    });
  };

  const approve = () => {
    Swal.fire({
      title: "Approve this verification request?",
      text: "The user will be marked as verified.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        review("verified", "");
      }
    });
  };

  const reject = () => {
    Swal.fire({
      title: "Reject this verification request?",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Let the user know why this was rejected...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    }).then((result) => {
      if (result.isConfirmed) {
        review("rejected", result.value);
      }
    });
  };

  return (
    <div>
      <input type='checkbox' id='my-modal-20' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box w-11/12 max-w-5xl h-4/5 max-h-screen bg-white'>
          <div>
            <h1 className='text-red-400 text-2xl'>Verification Request</h1>
            <hr />
            <br />
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Name :</span>{" "}
              {request?.user?.[0]?.firstName +
                " " +
                request?.user?.[0]?.lastName}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Email :</span>{" "}
              {request?.user?.[0]?.email}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Status :</span> {request?.status}
            </p>
            <p className='text-black text-xs mb-1'>
              <span className='font-bold'> Submitted at :</span> {time}, {date}
            </p>
            {request?.note ? (
              <p className='text-black text-xs mb-1'>
                <span className='font-bold'> Note :</span> {request?.note}
              </p>
            ) : (
              ""
            )}

            <br />
            <h1 className='text-red-400 text-2xl'>Submitted Documents</h1>
            <hr />
            <br />
            <div className={style.imageContainer}>
              {request?.images?.map((src, index) => (
                <img className={style.img} key={index} src={src} />
              ))}
            </div>
          </div>

          <div className='modal-action'>
            <label
              htmlFor='my-modal-20'
              className='bg-blue-700 px-3 py-1 text-white font-bold rounded cursor-pointer'
            >
              Close
            </label>
            {request?.status == "pending" && (
              <>
                <button>
                  <label
                    onClick={reject}
                    className='bg-red-600 px-3 py-1 text-white cursor-pointer font-bold rounded'
                  >
                    Reject
                  </label>
                </button>
                <button>
                  <label
                    onClick={approve}
                    className='bg-green-600 px-3 py-2 text-white cursor-pointer font-bold rounded'
                  >
                    Approve
                  </label>
                </button>
              </>
            )}
            {/* Permanent removal, for clearing out fake requests once they have
                been rejected. Only offered after a decision has been made, so a
                pending request cannot be deleted by accident. */}
            {request?.status && request?.status != "pending" && (
              <button>
                <label
                  onClick={remove}
                  className='bg-red-800 px-3 py-1 text-white cursor-pointer font-bold rounded'
                >
                  Delete Permanently
                </label>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationDetails;
