import { compressImage } from "../../utils/compressImage";
import React, { useState } from "react";
import axios from "axios";
import { FaImage, FaTrash } from "react-icons/fa";
import { Modal } from "antd";

const UpdateResponsiveAds = ({ setReload, reload, ads }) => {
  const [opened, setOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const link = e.target.link.value;
    const data = { link, image: "" };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("images", (await compressImage(selectedFile)).file);

      await fetch("https://paraglive-backend.vercel.app/api/files2/files", {
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
      await axios.patch(
        `https://paraglive-backend.vercel.app/api/responsive-ads/6a4dff1365f818834bf4b27b`,
        newData,
      );
      setOpened(false);
      setReload(!reload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setOpened(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const displayImage = previewUrl || ads?.image;

  return (
    <div>
      <Modal
        open={opened}
        centered
        onCancel={onClose}
        title='Update Responsive Ad'
        footer={false}
        width={420}
      >
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col items-center gap-2'>
            <div className='relative w-[220px] h-[220px] rounded-lg overflow-hidden border border-gray-300 bg-gray-100 group'>
              {displayImage ? (
                <img
                  src={displayImage}
                  alt='Ad preview'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                  <FaImage size={48} />
                </div>
              )}

              <label className='absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 text-transparent group-hover:text-white text-sm font-semibold cursor-pointer transition-colors'>
                Change Image
                <input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
              </label>

              {previewUrl && (
                <button
                  type='button'
                  onClick={removeImage}
                  className='absolute top-2 right-2 bg-white/90 text-red-600 rounded-full p-2 shadow hover:bg-white'
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          </div>

          <label className='block'>
            <span className='block font-bold mb-1'>Link</span>
            <input
              name='link'
              defaultValue={ads?.link}
              className='w-full box-border bg-gray-100 border border-gray-300 rounded px-3 py-2 text-green-700 focus:outline-none focus:ring-2 focus:ring-pink-600'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='bg-pink-700 disabled:opacity-60 disabled:cursor-not-allowed font-mono text-white rounded font-bold py-2 px-8 self-start'
          >
            {loading ? "Updating..." : "Update Ad"}
          </button>
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
