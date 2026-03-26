import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import style from "../../styles/moduleCss/postDetails.module.css";

const Details = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  async function posts(id) {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/products/${id}`,
        {
          method: "GET",
        },
      );

      const newPost = response.data.data.product;
      setPost(newPost);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (id) {
      posts(id);
    }
  }, [router?.query]);

  return (
    <div className='bg-white'>
      <Head>
        <title>{post ? `${post?.[0]?.name}` : "loading"}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header></Header>
      {loading ? (
        <div className='btn  bg-transparent border-0 loading flex m-auto'>
          loading
        </div>
      ) : (
        <div className='m-10'>
          <h1 className='text-lg text-black font-bold sm:text-2xl'>
            {post?.[0]?.name}
          </h1>

          <hr />

          <div className={style.contentContainer}>
            <div
              className='w-full text-black text-sm mt-5 sm:text-base'
              dangerouslySetInnerHTML={{
                __html: post?.[0]?.description,
              }}
            ></div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {post?.[0]?.imgOne ? (
                <img
                  className={style.fImg}
                  width={200}
                  height={200}
                  src={post?.[0]?.imgOne}
                />
              ) : (
                ""
              )}
              {post?.[0]?.imgTwo ? (
                <img
                  className={style.fImg}
                  width={200}
                  height={200}
                  src={post?.[0]?.imgTwo}
                />
              ) : (
                ""
              )}
              {post?.[0]?.imgThree ? (
                <img
                  className={style.fImg}
                  width={200}
                  height={200}
                  src={post?.[0]?.imgThree}
                />
              ) : (
                ""
              )}
              {post?.[0]?.imgFour ? (
                <img
                  className={style.fImg}
                  width={200}
                  height={200}
                  src={post?.[0]?.imgFour}
                />
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            <ul className='m-10 text-black'>
              <li className='list-disc'>
                Poster age :{" "}
                <span className='text-red-600'>{post?.[0]?.age}</span>
              </li>
              <li className='list-disc'>
                Poster Mobile :{" "}
                <span className='text-red-600'>{post?.[0]?.phone}</span>{" "}
              </li>
              <li className='list-disc'>
                Poster Email :{" "}
                <span className='text-red-600'>{post?.[0]?.email}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
      <Footer></Footer>
    </div>
  );
};

export default Details;
