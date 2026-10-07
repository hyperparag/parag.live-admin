import React, { useState } from "react";
//import { useDisclosure } from "@mantine/hooks";
//import { Modal, Button } from "@mantine/core";
import axios from "axios";
import { Modal } from "antd";

const UpdateRainbowAds = ({ setReload, reload, ads }) => {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const text = e.target.text.value;
    const link = e.target.link.value;

    const data = { text, link };

    const newData = {};
    for (let key in data) {
      if (data[key] !== "") {
        newData[key] = data[key];
      }
    }
    const response = await axios.patch(
      `  https://paraglive-backend.vercel.app/api/rainbow-ads/6a4dfed965f818834bf4b278`,
      newData,
    );
    setOpened(false);
    setReload(!reload);
    setLoading(false);
  };

  const onClose = () => {
    setOpened(false);
  };

  return (
    <div>
      <Modal
        footer={false}
        open={opened}
        onCancel={onClose}
        title='Update Rainbow Ad'
      >
        <form onSubmit={handleSubmit}>
          <label>
            Text : <br />
            <input
              name='text'
              defaultValue={ads?.text}
              className='bg-gray-200 w-full text-pink-700'
            />
          </label>
          <label>
            Link : <br />
            <input
              name='link'
              defaultValue={ads?.link}
              className='bg-gray-200 w-full text-pink-700'
            />
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

export default UpdateRainbowAds;
