import { compressImage } from "../../utils/compressImage";
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
import { Modal, Upload, message, Button, DatePicker, Radio } from "antd";
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
  desc: "",
  image: "",
  // Alt text for the cover image (accessibility + SEO).
  altText: "",
  // null posts immediately; an ISO date schedules the post for later.
  publishAt: null,
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
  const [scheduleLater, setScheduleLater] = useState(false);
  const [errors, setErrors] = useState({});

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
    // Oversized images are compressed to 50KB when uploaded.
    return isJpgOrPng;
  };

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  // Lowercase, hyphenated slug: the same shape the public blog URL needs.
  // Applied on blur rather than every keystroke, so typing a space mid-title
  // doesn't get eaten before the next word is typed.
  const normalizeSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handlePermalinkBlur = () => {
    setState((prev) => ({ ...prev, permalink: normalizeSlug(prev.permalink) }));
  };

  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").trim();

  const validate = () => {
    const e = {};
    if (!state.title.trim()) e.title = "Blog title is required";
    if (!state.permalink.trim()) e.permalink = "Permalink is required";
    if (!state.category) e.category = "Please select a category";
    if (!stripHtml(state.desc)) e.desc = "Description is required";
    return e;
  };

  const submit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      message.error("Please fill all required fields");
      return;
    }
    setErrors({});

    const data = { ...state };
    const user = jwt_decode(usersStringfy);
    setIsLoadingimgS(true);

    if (fileList.length == 0) {
      data["image"] = "avater";
    } else {
      try {
        const formData = new FormData();
        formData.append(
          "images",
          (await compressImage(fileList[0].originFileObj)).file,
        );
        const res = await fetch(
          "  https://paraglive-backend.vercel.app/api/files2/files",
          { method: "POST", body: formData },
        );
        if (!res.ok) throw new Error("upload failed");
        const result = await res.json();
        // The upload API answers { urls, files }. This used to read result[0],
        // which is undefined on that shape, so every blog was saved with no
        // image URL and showed a broken picture.
        const uploaded = Array.isArray(result)
          ? result[0]
          : (result.urls || [])[0] || (result.files || [])[0]?.url;
        if (!uploaded) throw new Error("no url returned");
        data["image"] = uploaded;
      } catch (error) {
        console.error(error);
        setIsLoadingimgS(false);
        message.error("The image could not be uploaded. Please try again.");
        return;
      }
    }

    setIsLoadingimgS(false);
    data["writer"] = user?.firstName + user?.lastName;
    data["publishAt"] = scheduleLater && state.publishAt ? state.publishAt : null;
    delete data.country;

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${usersStringfy}`,
    };

    // The second site mirrors the blog; it must not block or fail the post.
    axios
      .post("https://skipthegame-live-backend.vercel.app/api/blogs", data, {
        headers,
      })
      .catch(() => {});

    await axios
      .post("  https://paraglive-backend.vercel.app/api/blogs", data, { headers })
      .then((response) => {
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
          altText: "",
          publishAt: null,
          limit: "",
          metaDesc: "",
          permalink: "",
          metaKey: "",
        });
        setErrors({});
      }
    })
      .catch(() => {
        setIsLoadingimgS(false);
        message.error("The blog could not be saved.");
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
    formData.append("images", (await compressImage(image)).file);

    // This used /api/extraimage/files, a stub that returns a message and no
    // URL, so the uploaded image link was always undefined.
    try {
      const res = await fetch(
        "  https://paraglive-backend.vercel.app/api/files2/files",
        { method: "POST", body: formData },
      );
      if (!res.ok) throw new Error("upload failed");
      const result = await res.json();

      const uploaded = Array.isArray(result)
        ? { url: result[0] }
        : (result.files || [])[0] || { url: (result.urls || [])[0] };

      setloading(false);
      if (uploaded?.url) {
        setImageLink(uploaded.url);
      } else {
        message.error("The image could not be uploaded.");
      }
    } catch (error) {
      setloading(false);
      console.error(error);
      message.error("The image could not be uploaded.");
    }
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
                className='bg-sky-700 text-white text-sm px-2'
                onClick={() => copy()}
              >
                Copy
              </button>
            ) : (
              <>
                {loading ? (
                  <button className='bg-sky-700 text-sm text-white px-2'>
                    Loading URL
                  </button>
                ) : (
                  <button
                    className='bg-sky-700 text-white text-sm  px-2'
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
          <span className='text-red-600'>*</span> Blog Title : <br />
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
          <div className='flex justify-between mt-0.5'>
            {errors.title && (
              <p className='text-red-600 text-xs'>{errors.title}</p>
            )}
            <p
              className={`text-xs ml-auto ${
                state.title.length > 85 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {state.title.length}/100
            </p>
          </div>
        </label>
        <br />
        <label className=''>
          <span className='text-red-600'>*</span> Permalink : <br />
          <input
            type='text'
            value={state.permalink}
            maxLength={100}
            placeholder='Permalinks'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "permalink",
                payload: e.target.value,
              })
            }
            onBlur={handlePermalinkBlur}
          />
          <div className='flex justify-between mt-0.5'>
            {errors.permalink ? (
              <p className='text-red-600 text-xs'>{errors.permalink}</p>
            ) : (
              <p className='text-xs text-gray-500'>
                Only lowercase letters, numbers and hyphens are kept
                automatically &mdash; no spaces.
              </p>
            )}
            <p
              className={`text-xs ml-auto ${
                state.permalink.length > 85 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {state.permalink.length}/100
            </p>
          </div>
        </label>
        <br />
        <label className=''>
          Meta Description :{" "}
          <span className='font-normal text-xs text-gray-500'>
            (optional)
          </span>
          <br />
          <input
            type='text'
            value={state.metaDesc}
            maxLength={160}
            placeholder='Meta Description'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "metaDesc",
                payload: e.target.value,
              })
            }
          />
          <p
            className={`text-xs text-right mt-0.5 ${
              state.metaDesc.length > 140 ? "text-red-600" : "text-gray-500"
            }`}
          >
            {state.metaDesc.length}/160
          </p>
        </label>
        <br />
        <label className=''>
          Meta Keyword :{" "}
          <span className='font-normal text-xs text-gray-500'>
            (optional)
          </span>
          <br />
          <input
            type='text'
            value={state.metaKey}
            maxLength={255}
            placeholder='Keyword'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "metaKey",
                payload: e.target.value,
              })
            }
          />
          <p
            className={`text-xs text-right mt-0.5 ${
              state.metaKey.length > 220 ? "text-red-600" : "text-gray-500"
            }`}
          >
            {state.metaKey.length}/255
          </p>
        </label>
        <br />
        <label className=''>
          Image Alt Text :{" "}
          <span className='font-normal text-xs text-gray-500'>
            (optional)
          </span>
          <br />
          <input
            type='text'
            value={state.altText}
            maxLength={150}
            placeholder='Describe the cover image (for accessibility and SEO)'
            className='input input-bordered w-full bg-white border'
            onChange={(e) =>
              dispatch({
                type: "altText",
                payload: e.target.value,
              })
            }
          />
          <p
            className={`text-xs text-right mt-0.5 ${
              state.altText.length > 130 ? "text-red-600" : "text-gray-500"
            }`}
          >
            {state.altText.length}/150
          </p>
        </label>
        <br />
        <label>
          <span className='text-red-600'>*</span> Category : <br />
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
            <option value=''>--Select Category--</option>
            {state.country?.map((a) => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
          {errors.category && (
            <p className='text-red-600 text-xs mt-0.5'>{errors.category}</p>
          )}
        </label>
        <br /> <br />
        <label>
          <span className='text-red-600'>*</span> Description : <br />
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
          <div className='flex justify-between mt-0.5'>
            {errors.desc && (
              <p className='text-red-600 text-xs'>{errors.desc}</p>
            )}
            <p className='text-xs text-gray-500 ml-auto'>
              {stripHtml(state.desc).length} characters
            </p>
          </div>
        </label>
        <div className='mt-4 mb-4'>
          <p className='mb-1'>Schedule Post :</p>
          <Radio.Group
            value={scheduleLater}
            onChange={(e) => {
              setScheduleLater(e.target.value);
              if (!e.target.value) {
                setState((prev) => ({ ...prev, publishAt: null }));
              }
            }}
            options={[
              { label: "Post now", value: false },
              { label: "Schedule for later", value: true },
            ]}
          />
          {scheduleLater && (
            <div className='mt-2'>
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format='YYYY-MM-DD HH:mm'
                placeholder='Pick a date and time'
                disabledDate={(current) =>
                  current && current.endOf("day").valueOf() < Date.now()
                }
                onChange={(value) =>
                  setState((prev) => ({
                    ...prev,
                    publishAt: value ? value.toISOString() : null,
                  }))
                }
              />
              {state.publishAt && (
                <p className='text-xs mt-1 font-normal'>
                  Goes live on {new Date(state.publishAt).toLocaleString()}. It
                  stays hidden from the site until then.
                </p>
              )}
            </div>
          )}
        </div>
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
