import axios from "axios";
import React, { useEffect, useState } from "react";
import UpdateRainbowAds from "./Modal/rainbow-ads";

const RainbowAds = () => {
  const [ads, setAds] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const getAds = async () => {
    await axios
      .get(`https://paraglive-backend.vercel.app/api/rainbow-ads`)
      .then((res) => {
        setLoading(false);
        setAds(res?.data?.response?.links);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    getAds();
  }, [reload]);

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='uppercase font-bold font-mono text-2xl text-pink-700'>
          ADS/Rainbow Ad
        </h1>
        <UpdateRainbowAds setReload={setReload} reload={reload} ads={ads} />
      </div>
      <div className='h-[500px] flex justify-center items-center sm:m-10 mt-10 bg-white'>
        {loading ? (
          <p>Loading....</p>
        ) : (
          <div className='flex flex-col items-center gap-10 text-xl p-5'>
            <h1 className=''>
              <b>Text : </b> <span>{ads?.text}</span>
            </h1>
            <h1 className=''>
              <b>Link : </b>{" "}
              <a href={ads?.link} className='text-blue-400' target='_blank'>
                {ads?.link}
              </a>
            </h1>
            <h1 className=''>
              <b>Last Update : </b>{" "}
              <span>{new Date(ads?.updatedAt).toLocaleDateString()}</span>
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default RainbowAds;
