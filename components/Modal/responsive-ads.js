import React, { useState } from "react";
import axios from "axios";
import { FaImage, FaTrash } from "react-icons/fa";
import style from "./style.module.css";
import { Modal } from "antd";

const UpdateResponsiveAds = ({ setReload, reload }) => {
  const [opened, setOpened] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (previewUrls?.length == 1) {
      alert("Max 1 files");
      return;
    }
    if (files.length > 0) {
      const newSelectedFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newSelectedFiles]);

      const newPreviewUrls = newSelectedFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removeImage = (e) => {
    const indexToRemove = previewUrls.findIndex((url) => url === e);

    if (indexToRemove !== -1) {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(indexToRemove, 1);

      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(indexToRemove, 1);
      setSelectedFiles(newSelectedFiles);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const link = e.target.link.value;
    const image = "";
    const data = { link, image };

    if (selectedFiles[0]) {
      const formData = new FormData();
      formData.append("images", selectedFiles[0]);

      await fetch("http://localhost:5000/api/files2/files", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          data.image = result?.[0];
        });
    }

    const newData = {};
    for (let key in data) {
      if (data[key] !== "") {
        newData[key] = data[key];
      }
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/responsive-ads/66689fbab312cb5061e3f771`,
        newData,
      );
      setOpened(false);
      setReload(!reload);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onClose = () => {
    setOpened(false);
  };

  return (
    <div>
      <Modal
        open={opened}
        centered
        onCancel={onClose}
        title='Update Resposive Ad'
        footer={false}
      >
        <div
          className={`${previewUrls.length < 1 ? "block" : "hidden"} h-[200px]`}
        >
          {previewUrls.length < 1 && (
            <label className='block font-bold relative'>
              <input
                className='rounded w-[200px]'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              <FaImage className='absolute top-0 bg-white w-[200px] h-[200px] p-5 text-gray-400 border border-red-500 rounded' />
            </label>
          )}
        </div>
        <div>
          {previewUrls.length > 0 && (
            <div className=' sm:flex items-center sm:flex-row  gap-5  sm:mb-0 mb-10'>
              {previewUrls.map((url, index) => (
                <div key={index} className={`${style.card}`}>
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <p
                    className={`${style.cross}`}
                    onClick={() => removeImage(url)}
                  >
                    <span>
                      <FaTrash />
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Link : <br />
            <input name='link' className='bg-gray-200 w-full text-green-700' />
          </label>
          <br />
          <br />
          {loading ? (
            <button
              disabled
              className='bg-pink-700 font-mono text-white rounded font-bold  py-1 px-8 cursor-not-allowed'
            >
              Loading...
            </button>
          ) : (
            <button
              type='submit'
              className='bg-pink-700 font-mono text-white rounded font-bold  py-1 px-8'
            >
              Update Ad
            </button>
          )}
        </form>
      </Modal>

      <button
        onClick={() => setOpened(true)}
        className='bg-pink-700 font-mono text-white rounded font-bold text-xl py-1 px-8'
      >
        Update Ad
      </button>
    </div>
  );
};

export default UpdateResponsiveAds;
