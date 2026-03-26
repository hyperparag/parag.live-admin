import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { FaPencilAlt } from "react-icons/fa";
import style from "../../styles/moduleCss/blogModal.module.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

// ================== Quill Editor Configuration ==================
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "list",
  "bullet",
  "link",
];

// ================== Initial State ==================
const initialState = {
  country: [],
  title: "",
  writer: "",
  category: "",
  desc: "",
  image: "",
  limit: "",
  metaDesc: "",
  permalink: "",
  metaKey: "",
};

// ================== Component ==================
const BlogDetails = ({ blog, setReload, reload, blogLoading }) => {
  const router = useRouter();
  const editorRef = useRef(null);
  const [state, setState] = useState(initialState);
  const [update, setUpdate] = useState(false);
  const [imagLoading, setImagLoading] = useState(false);
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const [dummyimgs, setDummyimgs] = useState([{ img: blog?.image }]);
  const token = Cookies.get("token");

  const localDate = new Date(blog?.updatedAt);
  const time = localDate?.toLocaleTimeString();
  const date = localDate?.toLocaleDateString();

  // ================== Helpers ==================
  const dispatch = (e) => setState({ ...state, [e.type]: e.payload });

  const log = () => {
    if (editorRef.current) {
      setState({ ...state, desc: editorRef.current.getContent() });
    }
  };

  // ================== Effects ==================
  useEffect(() => {
    fetch("/category.json")
      .then((res) => res.json())
      .then((data) => setState((prev) => ({ ...prev, country: data })));
  }, []);

  useEffect(() => {
    if (blog?.image) setDummyimgs([{ img: blog.image }]);
  }, [blog?.image]);

  // ================== Image Handler ==================
  const handleImgChange = (e, i) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    // Size limit 200KB
    if (file.size >= 200000) {
      setState({ ...state, limit: "Image size must be less than 200Kb" });
    } else {
      setState({ ...state, limit: "" });
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newImgs = [...dummyimgs];
      newImgs[i].img = reader.result;
      setDummyimgs(newImgs);
      setFile(file);
    };
    reader.readAsDataURL(file);
  };

  // ================== Delete Blog ==================
  const deleteBlog = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://paraglive-backend.vercel.app/api/blogs/${id}`, {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((response) => {
            if (response.data.status === "success") {
              Swal.fire("Deleted!", "Your blog has been deleted.", "success");
              setReload(!reload);
            }
          });
      }
    });
  };

  // ================== Update Blog ==================
  const handleUpdate = async () => {
    setImagLoading(true);
    const data = { ...state };

    try {
      // Upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append("images", image);

        const uploadRes = await fetch(
          "https://paraglive-backend.vercel.app/api/files/files",
          {
            method: "POST",
            body: formData,
          },
        );

        const result = await uploadRes.json();
        data.image = result.url;
      } else {
        data.image = "";
      }

      // Send update request
      const res = await axios.patch(
        `https://paraglive-backend.vercel.app/api/blogs/${blog?._id}`,
        data,
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.status === "success") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your changes have been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        setReload(!reload);
        setUpdate(false);
        setState(initialState);
        document.getElementById("my-modal-15").checked = false;
      }
    } finally {
      setImagLoading(false);
    }
  };

  // ================== Render ==================
  return (
    <div>
      <input type='checkbox' id='my-modal-15' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box w-11/12 max-w-5xl h-4/5 max-h-screen bg-white overflow-y-auto'>
          {blogLoading ? (
            "Loading..."
          ) : update ? (
            <div>
              <h1 className='text-red-600 text-lg sm:text-2xl flex items-center'>
                Update Blog <FaPencilAlt className='ml-2 text-red-600' />
              </h1>

              {/* ========== Image Upload ========== */}
              <div className={style.imageContainer}>
                <div className={style.inputs}>
                  {dummyimgs.map((res, i) => (
                    <li key={i}>
                      <div className={style.inputBox}>
                        <input
                          className={style.upload}
                          type='file'
                          onChange={(e) => handleImgChange(e, i)}
                          onBlur={(e) => setImage(e.target.files[0])}
                        />
                        <img alt='' src={res.img} className={style.image} />
                      </div>
                      {state.limit && (
                        <p className='text-red-600 flex'>{state.limit}</p>
                      )}
                    </li>
                  ))}
                </div>
              </div>

              {/* ========== Input Fields ========== */}
              <div className='space-y-5 mt-5'>
                <label className='text-black font-bold'>
                  Blog Title:
                  <input
                    type='text'
                    defaultValue={blog?.title}
                    placeholder='Blog Title'
                    className='input input-bordered w-full bg-white border'
                    onChange={(e) =>
                      dispatch({ type: "title", payload: e.target.value })
                    }
                  />
                </label>

                <label className='text-black font-bold'>
                  Permalink:
                  <input
                    type='text'
                    defaultValue={blog?.permalink}
                    placeholder='Permalink'
                    className='input input-bordered w-full bg-white border'
                    onChange={(e) =>
                      dispatch({ type: "permalink", payload: e.target.value })
                    }
                  />
                </label>

                <label className='text-black font-bold'>
                  Meta Description:
                  <input
                    type='text'
                    defaultValue={blog?.metaDesc}
                    placeholder='Meta Description'
                    className='input input-bordered w-full bg-white border'
                    onChange={(e) =>
                      dispatch({ type: "metaDesc", payload: e.target.value })
                    }
                  />
                </label>

                <label className='text-black font-bold'>
                  Meta Keyword:
                  <input
                    type='text'
                    defaultValue={blog?.metaKey}
                    placeholder='Keyword'
                    className='input input-bordered w-full bg-white border'
                    onChange={(e) =>
                      dispatch({ type: "metaKey", payload: e.target.value })
                    }
                  />
                </label>

                <label className='text-black font-bold'>
                  Category:
                  <select
                    className='p-3 bg-white border w-full rounded'
                    defaultValue={blog?.category}
                    onChange={(e) =>
                      dispatch({ type: "category", payload: e.target.value })
                    }
                  >
                    <option>--Select Category--</option>
                    {state.country?.map((a) => (
                      <option key={a.name} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>

                <ReactQuill
                  theme='snow'
                  defaultValue={blog?.desc}
                  modules={modules}
                  formats={formats}
                  className='h-[200px] text-black mb-16'
                  onChange={(value) =>
                    dispatch({ type: "desc", payload: value })
                  }
                />
              </div>

              {/* ========== Buttons ========== */}
              <div className='flex items-center mt-16'>
                {imagLoading ? (
                  <button className={style.editButton}>
                    <img width={40} src='/upload.gif' />
                  </button>
                ) : (
                  <>
                    {state.limit ? (
                      <button className={style.editButton} disabled>
                        Update
                      </button>
                    ) : (
                      <label
                        htmlFor='my-modal-15'
                        className={style.editButton}
                        onClick={handleUpdate}
                      >
                        Update
                      </label>
                    )}
                  </>
                )}

                <label
                  htmlFor='my-modal-15'
                  className='bg-blue-400 px-3 py-1 ml-5 text-white cursor-pointer font-bold rounded'
                  onClick={() => setUpdate(false)}
                >
                  Cancel
                </label>
              </div>
            </div>
          ) : (
            // ================== View Mode ==================
            <div>
              <img
                className={style.image}
                src={blog?.image}
                alt={blog?.title}
              />
              <h1 className='text-black font-bold text-lg sm:text-2xl mt-3'>
                Title: {blog?.title}
                <span className='text-sm font-normal'>
                  {" "}
                  (By{" "}
                  <span className='text-green-400 font-bold'>
                    {blog?.writer}
                  </span>{" "}
                  - {time}, {date})
                </span>
              </h1>

              <div className='mt-5 text-black space-y-3'>
                <p>
                  <b>Meta Description:</b> {blog?.metaDesc}
                </p>
                <p>
                  <b>Meta Keyword:</b> {blog?.metaKey}
                </p>
                <p>
                  <b>Category:</b>{" "}
                  <span className={style.category}>{blog?.category}</span>
                </p>
                <div
                  className='mb-5 text-black'
                  dangerouslySetInnerHTML={{ __html: blog?.desc }}
                />
              </div>

              <div className='flex mt-5'>
                <label
                  htmlFor='my-modal-15'
                  className='bg-blue-400 px-3 py-1 mr-5 text-white cursor-pointer font-bold rounded'
                >
                  Cancel
                </label>

                <button onClick={() => deleteBlog(blog?._id)}>
                  <label
                    htmlFor='my-modal-15'
                    className='bg-red-600 px-3 py-2 text-white cursor-pointer font-bold rounded'
                  >
                    Delete
                  </label>
                </button>

                <button>
                  <label
                    htmlFor='my-modal-15'
                    className='bg-green-600 px-3 py-2 text-white cursor-pointer ml-3 font-bold rounded'
                    onClick={() => setUpdate(true)}
                  >
                    Update
                  </label>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
