import React, { useEffect, useRef, useState } from "react";
import style from "../../styles/addBlog.module.css";
import { Editor } from "@tinymce/tinymce-react";
import jwt_decode from "jwt-decode";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Upload, message, Button } from "antd";
import { useRouter } from "next/router";

const modules = {
  toolbar: [
    // Header dropdown (includes paragraph option)
    [{ header: [1, 2, 3, false] }], // false = normal paragraph text
    ["bold", "italic", "underline"], // text styles
    [{ color: [] }], // text color picker
    [{ list: "ordered" }, { list: "bullet" }], // ordered & bullet lists
    ["link"],
    ["clean"], // remove formatting
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

const initialState = {
  country: [],
  title: "",
  writer: "",
  category: "",
  subCategory: "",
  desc: "",
  image: "",
  limit: "",
  permalink: "",
  metaDesc: "",
  metaKey: "",
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // console.log(file)
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddBlog = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [image, setImage] = useState("");
  const [imagLoading, setIsLoadingimgS] = useState(false);
  const [imgError, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [imaglink, setImageLink] = useState("");

  const [fileList, setFileList] = useState([]);

  // const [desc, setDescription] = useState("");
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setState({ ...state, desc: editorRef.current.getContent() });
    }
  };
  const usersStringfy = Cookies.get("token");

  useEffect(() => {
    fetch(`/category.json`)
      .then((res) => res.json())
      .then((data) => setState({ ...state, country: data }));
  }, []);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      setError(true);
      return;
    } else {
      setError(false);
    }
    const isLt50KB = file.size / 1024 < 50;
    if (!isLt50KB) {
      message.error("Image must be smaller than 50KB!");
      setError(true);
      return;
    } else {
      setError(false);
    }

    return isJpgOrPng && isLt50KB;
  };

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  const submit = async () => {
    const data = { ...state };
    const user = jwt_decode(usersStringfy);
    setIsLoadingimgS(true);

    if (fileList.length == 0) {
      data["image"] = "avater";
    } else {
      const formData = new FormData();
      formData.append("images", fileList[0].originFileObj);
      await fetch("http://localhost:5000/api/files2/files", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          data["image"] = result?.[0];
        });
    }

    setIsLoadingimgS(false);
    data["writer"] = user?.firstName + user?.lastName;

    await Promise.all([
      axios.post("http://localhost:5000/api/blogs", data, {
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${usersStringfy}`,
        },
      }),
      axios.post(
        "https://skipthegame-live-backend.vercel.app/api/blogs",
        data,
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      ),
    ]).then(([response]) => {
      setIsLoadingimgS(false);
      if (response.data.status == "success") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        }).then(setFileList([]));
        setTimeout(() => {
          router.reload();
        }, 500);
        setState({
          ...state,
          title: "",
          writer: "",
          category: "",
          desc: "",
          image: "",
          limit: "",
          metaDesc: "",
          permalink: "",
          metaKey: "",
        });
      }
    });
  };

  const handleCancel = () => {
    setPreviewOpen(false);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div className=''>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const upload = async () => {
    const formData = new FormData();
    formData.append("images", image);
    await fetch("http://localhost:5000/api/extraimage/files", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setloading(false);
        setImageLink(result.url);
      });
  };

  const copy = () => {
    global.navigator.clipboard.writeText(imaglink);
    message.success("Copied to clipboard");
    setImageLink("");
  };

  const sub = state.country.find((a) => a.name == state.category);

  return (
    <div className={style.container}>
      <div className='w-11/12 m-auto text-black font-bold text-lg'>
        <div className='flex justify-between '>
          <>
            <Upload
              listType='picture-card'
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={beforeUpload}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt='example'
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </>
          <div className='border border-red-600'>
            <p className='text-sm'>if you need image url for blog</p>
            <input
              type='file'
              className='file-input p-0 file-input-xs file-input-info w-12/12'
              onChange={(e) => setImage(e.target.files[0])}
            />
            <br />

            {imaglink ? (
              <button
                className='bg-sky-400 text-white text-sm px-2'
                onClick={() => copy()}
              >
                Copy
              </button>
            ) : (
              <>
                {loading ? (
                  <button className='bg-sky-400 text-sm text-white px-2'>
                    Loading URL
                  </button>
                ) : (
                  <button
                    className='bg-sky-400 text-white text-sm  px-2'
                    onClick={() => upload()}
                  >
                    Genarate URL
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <br />
        <label className='w-full'>
          Blog Title : <br />
          <input
            type='text'
            value={state.title}
            maxLength={100}
            placeholder='Blog Title'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "title",
                payload: e.target.value,
              })
            }
          />
        </label>
        <br />
        <br />
        <label className=''>
          Permalink : <br />
          <input
            type='text'
            value={state.permalink}
            placeholder='Permalinks'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "permalink",
                payload: e.target.value,
              })
            }
          />
        </label>
        <br />
        <br />
        <label className=''>
          Meta Description : <br />
          <input
            type='text'
            value={state.metaDesc}
            placeholder='Meta Description'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "metaDesc",
                payload: e.target.value,
              })
            }
          />
        </label>
        <br />
        <br />
        <label className=''>
          Meta Keyword : <br />
          <input
            type='text'
            value={state.metaKey}
            placeholder='Keyword'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "metaKey",
                payload: e.target.value,
              })
            }
          />
        </label>
        <br />
        <br />
        <label>
          Category : <br />
          <select
            value={state.category}
            className='p-3 bg-white border w-full rounded'
            onChange={(e) =>
              dispatch({
                type: "category",
                payload: e.target.value,
              })
            }
          >
            <option>--Select Category--</option>
            {state.country?.map((a) => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
        </label>
        <br /> <br />
        <label>
          Description : <br />
          <ReactQuill
            theme='snow'
            value={state.desc}
            modules={modules}
            formats={formats}
            className='h-[200px]  sm:mb-16 mb-16'
            onChange={(value) =>
              dispatch({
                type: "desc",
                payload: value,
              })
            }
          />
        </label>
        {imagLoading == true ? (
          <button className={style.editButton}>
            <img width={40} src='/upload.gif' />
          </button>
        ) : (
          <>
            {imgError ? (
              <button className={style.editButton} disabled>
                Post
              </button>
            ) : (
              <button className={style.editButton} onClick={() => submit()}>
                Post
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddBlog;
