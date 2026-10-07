import { compressImage } from "../../utils/compressImage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../../styles/moduleCss/profile.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { MdCloudDone } from "react-icons/md";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Modal from "../Modal/modal";
import Modals from "../Modal/modal";
import UpdateModel from "../Modal/updateModel";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avater: "",
  edit: false,
  userData: [],
  limit: "",
  selected: "",
  oldPassword: "",
  newPass: "",
  newConPass: "",
  passError: "",
};

const Profile = ({ user, onAvatarChange }) => {
  const [state, setState] = useState(initialState);
  const [imagLoading, setIsLoadingimgS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [dummyimgs, setDummyimgs] = useState([{ img: "/user.png" }]);

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  async function getUser(user) {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/users/${user._id}`,
      );
      const data = response.data.data.user;
      setLoading(false);
      setState({ ...state, userData: data });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    getUser(user);
  }, []);

  // oldPassword

  const imgUpload = async (e) => {
    if (!image) {
      Swal.fire({ icon: "warning", title: "Choose a picture first" });
      return;
    }
    setIsLoadingimgS(true);
    try {
      const formData = new FormData();
      formData.append("images", (await compressImage(image)).file);
      const res = await fetch(
        "  https://paraglive-backend.vercel.app/api/image/upload-file",
        { method: "POST", body: formData },
      );
      const result = await res.json();
      if (!res.ok || !result?.payload?.url) throw new Error("upload failed");
      setState((prev) => ({
        ...prev,
        avater: result.payload.url,
        selected: "no",
      }));
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "The picture could not be uploaded",
        text: "Please try again.",
      });
    } finally {
      setIsLoadingimgS(false);
    }
  };

  // image handler
  const _handleImgChange = (e, i) => {
    e.preventDefault();
    let reader = new FileReader();
    const image = e.target.files[0];
    if (!image) {
      return;
    }

    // Oversized images are compressed to 50KB when uploaded.
    setState({ ...state, selected: "yes" });
    // Keep the chosen file here: it used to be captured by an onBlur handler
    // that does not reliably fire, so the upload ran with no file at all.
    setImage(image);

    reader.onload = () => {
      dummyimgs[i].img = reader.result;
      setFile({ file: file });
      setDummyimgs(dummyimgs);
    };
    reader.readAsDataURL(image);
  };
  const usersStringfy = Cookies.get("token");
  // updata profile

  const updateProfile = async () => {
    const firstName = state.firstName;
    const lastName = state.lastName;
    const phone = state.phone;
    const avater = state.avater;

    const data = { firstName, lastName, phone, avater };

    const options = {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${usersStringfy}`,
      },
    };

    try {
      const res = await axios.patch(
        `  https://paraglive-backend.vercel.app/api/users/${state.userData._id}`,
        data,
        options,
      );
      if (res.data.status == "success") {
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        // Show what was just saved, rather than the values from page load.
        setDummyimgs([{ img: "/user.png" }]);
        setImage(undefined);
        if (avater && onAvatarChange) onAvatarChange(avater);
        setState((prev) => ({
          ...prev,
          edit: false,
          selected: "",
          firstName: "",
          lastName: "",
          phone: "",
          avater: "",
          userData: res.data.data?.user
            ? { ...prev.userData, ...res.data.data.user }
            : prev.userData,
        }));
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Could not save your profile" });
    }
  };

  const updatePassword = async () => {
    if (state.newConPass !== state.newPass) {
      setState({ ...state, passError: "New Passwords are not matched" });
      return;
    } else {
      setState({ ...state, passError: "" });
    }

    const password = state.newPass;
    const oldPassword = state.oldPassword;
    const data = { password, oldPassword };
    const options = {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${usersStringfy}`,
      },
    };

    await axios
      .patch(
        `  https://paraglive-backend.vercel.app/api/users/password/${state.userData._id}`,
        data,
        options,
      )
      .then((res) => {
        if (res.data.status == "failed") {
          Swal.fire({
            position: "top-center",
            icon: "failed",
            title: "Old pass is wrong",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (res.data.status == "success") {
          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          }).then(
            setState({
              ...state,
              oldPassword: "",
              newConPass: "",
              newPass: "",
              passError: "",
            }),
          );
        }
      });
  };

  const valid =
    state.userData?.address?.city == "" &&
    state.userData?.address?.zipCode == "" &&
    state.userData?.address?.country == "" &&
    state.userData?.address?.regionName == "";

  return (
    <>
      {state.edit ? (
        <div className='flex justify-between items-center'>
          <button className='text-2xl font-bold m-5 text-black flex items-center'>
            Update Profile
            <FaPencilAlt className='ml-2 text-red-600' />
          </button>
          <p
            onClick={() => setState({ ...state, edit: false })}
            className='m-5 cursor-pointer flex items-center'
          >
            Cancel
            <AiOutlineClose className='text-red-600' />
          </p>
        </div>
      ) : (
        <button className='text-2xl font-bold m-5 text-black flex items-center'>
          {" "}
          Profile
        </button>
      )}
      {loading ? (
        <div className={style.container}>
          {" "}
          <img width={100} className='m-auto' src='/upload.gif' />{" "}
        </div>
      ) : (
        <>
          <div>
            <div className={style.container}>
              {state.edit ? (
                <>
                  <div className={style.imageContainer}>
                    <div className={style.inputs}>
                      {dummyimgs.map((res, i) => {
                        return (
                          <li key={i}>
                            <div className={style.inputBox}>
                              <input
                                className={style.upload}
                                type='file'
                                onChange={(e) => _handleImgChange(e, i)}
                              />
                              <img
                                alt=''
                                src={res.img}
                                className={style.image}
                              />
                            </div>
                            {state.limit ? (
                              <p className='text-red-600 flex '>
                                {state.limit}
                              </p>
                            ) : (
                              <>
                                {" "}
                                {state.selected == "yes" ? (
                                  <div className={style.buttonBox}>
                                    {imagLoading ? (
                                      <img
                                        className={style.loader}
                                        src='/upload.gif'
                                      />
                                    ) : (
                                      <>
                                        <button>
                                          <TiTick
                                            onClick={imgUpload}
                                            className='text-6xl text-green-300 '
                                          />
                                        </button>{" "}
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    {state.selected == "no" && (
                                      <div className={style.buttonBox}>
                                        <button>
                                          <MdCloudDone className='text-6xl text-green-300 ' />
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </li>
                        );
                      })}
                    </div>
                  </div>

                  <div className={style.profileContainer}>
                    <label className={style.labels}>
                      First Name :
                      <br />
                      <input
                        onChange={(e) =>
                          dispatch({
                            type: "firstName",
                            payload: e.target.value,
                          })
                        }
                        type='text'
                        placeholder={state.userData?.firstName}
                        className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                      />
                    </label>
                    <label className={style.labels}>
                      Last Name :
                      <br />
                      <input
                        onChange={(e) =>
                          dispatch({
                            type: "lastName",
                            payload: e.target.value,
                          })
                        }
                        type='text'
                        placeholder={state.userData?.lastName}
                        className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                      />
                    </label>

                    <label className={style.labels}>
                      Phone :
                      <br />
                      <input
                        onChange={(e) =>
                          dispatch({ type: "phone", payload: e.target.value })
                        }
                        type='text'
                        placeholder={state.userData?.phone}
                        className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning w-full `}
                      />
                    </label>
                    <button
                      className={style.updateButton}
                      onClick={() => updateProfile()}
                    >
                      Update
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={style.imageContainer}>
                    {state.userData.avater == "avater" ? (
                      <img src='/user.png' />
                    ) : (
                      <img src={state.userData.avater} />
                    )}
                  </div>

                  <div className={style.profileContainer}>
                    <label className={style.labels}>
                      First Name :
                      <br />
                      <p className={style.readOnlyInputs}>
                        {state.userData?.firstName}
                      </p>
                    </label>

                    <label className={style.labels}>
                      Last Name :
                      <br />
                      <p className={style.readOnlyInputs}>
                        {state.userData?.lastName}
                      </p>
                    </label>
                    <label className={style.labels}>
                      Email :
                      <br />
                      <p className={style.readOnlyInputs}>
                        {state.userData?.email}
                      </p>
                    </label>
                    {state.userData.phone && (
                      <label className={style.labels}>
                        Phone :
                        <br />
                        <p className={style.readOnlyInputs}>
                          {state.userData?.phone}
                        </p>
                      </label>
                    )}
                    {state.userData.phone ? (
                      <button
                        onClick={() => setState({ ...state, edit: true })}
                        className={style.editButton2}
                      >
                        Edit <FaPencilAlt className='ml-2 text-white' />
                      </button>
                    ) : (
                      <button
                        onClick={() => setState({ ...state, edit: true })}
                        className={style.editButton}
                      >
                        Edit <FaPencilAlt className='ml-2 text-white' />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <br />

          <br />
          {/* {state.edit ? (
            ""
          ) : (
            <div className={style.container}>
              <div className="flex items-center justify-between">
                <h1 className="text-xs sm:text-2xl text-black font-bold">
                  Address :
                </h1>
                <label htmlFor="my-modal-3" className="flex cursor-pointer">
                  Update
                  <FaPencilAlt className="ml-2  text-xl text-red-600" />
                </label>
              </div>

              <br></br>

              {!valid ? (
                <div className={style.profileContainer}>
                  <label className={style.labels}>
                    City :
                    <br />
                    <p className={style.readOnlyInputs}>
                      {state.userData?.address?.city}
                    </p>
                  </label>

                  <label className={style.labels}>
                    ZipCode :
                    <br />
                    <p className={style.readOnlyInputs}>
                      {state.userData?.address?.zipCode}
                    </p>
                  </label>
                  <label className={style.labels}>
                    Region Name
                    <br />
                    <p className={style.readOnlyInputs}>
                      {state.userData?.address?.regionName}
                    </p>
                  </label>

                  <label className={style.labels}>
                    Country :
                    <br />
                    <p className={style.readOnlyInputs}>
                      {state.userData?.address?.country}
                    </p>
                  </label>
                </div>
              ) : (
                <div>
                  <label htmlFor="my-modal-6">
                    <AiOutlinePlusCircle className="text-6xl m-auto text-red-600 cursor-pointer" />
                  </label>

                  <Modals data={state.userData} token={usersStringfy} />
                </div>
              )}
              <UpdateModel data={state.userData} token={usersStringfy} />
            </div>
          )} */}
          <br />

          <br />
          <div className={style.container}>
            <h1 className='text-xs sm:text-2xl text-black font-bold mb-12'>
              Change Password :
            </h1>
            <div className={style.profileContainer}>
              <label className={style.labels}>
                Current Password :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "oldPassword", payload: e.target.value })
                  }
                  type='text'
                  placeholder='Current Password'
                  className={`${style.readOnlyInputs} , bg-gray-50  input-bordered input-success w-full `}
                />
              </label>
              <label className={style.labels}>
                New Password :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "newPass", payload: e.target.value })
                  }
                  type='text'
                  placeholder='New Password'
                  className={`${style.readOnlyInputs} , bg-gray-50  input-bordered input-success w-full `}
                />
              </label>
              <label className={style.labels}>
                Confirm New Password :
                <br />
                <input
                  onChange={(e) =>
                    dispatch({ type: "newConPass", payload: e.target.value })
                  }
                  type='text'
                  placeholder='Confirm New Password'
                  className={`${style.readOnlyInputs} , bg-gray-50  input-bordered input-success w-full `}
                />
                {state.passError ? (
                  <p className='text-red-600 text-sm'>{state.passError}</p>
                ) : (
                  ""
                )}
              </label>

              <button
                onClick={() => updatePassword()}
                className={style.editButton}
              >
                Change <FaPencilAlt className='ml-2 text-white' />
              </button>
            </div>
          </div>
          <br />

          <br />
        </>
      )}
    </>
  );
};

export default Profile;
