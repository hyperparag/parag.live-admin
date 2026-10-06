import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import style from "../../styles/moduleCss/adminDashboad.module.css";

const initialState = {
  shemale: "",
  meet: "",
  live: "",
  header: "",
  links: [],
};

const Links = () => {
  const [state, setState] = useState(initialState);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  const usersStringfy = Cookies.get("token");

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  async function getUser() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/links`,
        {
          method: "GET",
        },
      );
      const data = response.data.links;

      setState({ ...state, links: data });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUser();
  }, [reload]);

  const update = () => {
    setLoading(true);
    console.log(state);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Replace links!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `https://paraglive-backend.vercel.app/api/links/69da879bf82392d9999f40c5`,
            state,
            {
              headers: {
                authorization: `Bearer ${usersStringfy}`,
              },
            },
          )
          .then((response) => {
            setLoading(false);
            if (response.data.status == "success") {
              Swal.fire("Replaced!", "You links are live now", "success");
              setState({
                ...state,
                shemale: "",
                meet: "",
                live: "",
                header: "",
              });
            }
            setReload(!reload);
          });
      }
    });
  };

  return (
    <div>
      <p className='text-red-600 font-bold  text-right  text-xs sm:text-sm'>
        if you dont wanna update the links , then keep blank the inputs
      </p>
      <div className='bg-white'>
        <div className='m-auto w-full sm:w-5/6'>
          <label className='flex flex-col sm:flex-row justify-between sm:justify-center p-2 sm:px-24'>
            <h1 className=' sm:w-2/6 w-full sm:text-xl text-sm font-bold'>
              {" "}
              Shemale Escorts :{" "}
            </h1>
            <input
              onChange={(e) =>
                dispatch({
                  type: "shemale",
                  payload: e.target.value,
                })
              }
              type='text'
              defaultValue={state.links?.[0]?.shemale}
              className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning  sm:w-2/6 w-full `}
            />
          </label>

          <label className='flex flex-col sm:flex-row justify-between sm:justify-center p-2 sm:px-24 sm:py-10'>
            <h1 className=' sm:w-2/6 w-full sm:text-xl  text-sm font-bold'>
              {" "}
              Meet & Fuck :{" "}
            </h1>
            <input
              onChange={(e) =>
                dispatch({
                  type: "meet",
                  payload: e.target.value,
                })
              }
              type='text'
              defaultValue={state.links?.[0]?.meet}
              className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning  sm:w-2/6 w-full `}
            />
          </label>
          <label className='flex flex-col sm:flex-row justify-between sm:justify-center p-2 sm:px-24'>
            <h1 className=' sm:w-2/6 w-full sm:text-xl  text-sm font-bold'>
              {" "}
              Live Escorts :{" "}
            </h1>
            <input
              onChange={(e) =>
                dispatch({
                  type: "live",
                  payload: e.target.value,
                })
              }
              type='text'
              defaultValue={state.links?.[0]?.live}
              className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning  sm:w-2/6 w-full `}
            />
          </label>
          <br />
          {/*<label className="flex justify-between sm:justify-center p-2 sm:px-24">
            <h1 className=" sm:w-2/6 w-full sm:text-xl  text-sm font-bold">
              {" "}
              Header :{" "}
            </h1>
            <input
              onChange={(e) =>
                dispatch({
                  type: "header",
                  payload: e.target.value,
                })
              }
              type="text"
              defaultValue={state.links?.[0]?.header}
              className={`${style.editableInputs} , bg-gray-50  input-bordered input-warning  sm:w-2/6 w-full `}
            />
          </label>*/}
          <label className='flex flex-col sm:flex-row justify-between sm:justify-center p-2 sm:px-24'>
            <button onClick={() => update()} className={style.updateButton}>
              Update
            </button>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Links;
