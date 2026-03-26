import axios from "axios";
import React, { useEffect, useState } from "react";
import UpdateResponsiveAds from "./Modal/responsive-ads";

const ResponsiveAds = () => {
  const [ads, setAds] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const getAds = async () => {
    await axios
      .get(`https://paraglive-backend.vercel.app/api/responsive-ads`)
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
          ADS/Responsive Ad
        </h1>
        <UpdateResponsiveAds setReload={setReload} reload={reload} />
      </div>
      <div className='h-fit flex justify-center items-center sm:m-10 mt-10 bg-white'>
        {loading ? (
          <p>Loading....</p>
        ) : (
          <div className='flex border flex-col items-center gap-10 text-xl p-5'>
            <img className='sm:w-2/4 w-10/12' src={ads?.image} />
            <h1 className='mt-10'>
              <b>Link : </b> <span>{ads?.link}</span>
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

export default ResponsiveAds;
