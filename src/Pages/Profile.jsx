import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../Store";
import Channels from "../Componants/Home/Channels";
import ProfileCard from "../Componants/Profile/ProfileCard";
import TextChannels from "../Componants/Profile/TextChannels";
import { Helmet } from "react-helmet";

function Profile() {
  const State = useContext(UserContext);
  const [loader, setloader] = useState(false);
  async function isUserAvaliable() {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,

      data: {
        walletId: localStorage.getItem("walletAddress"),
      },
    })
      .then((response) => {
        console.log(response);
        State.updateDatabase({
          userData: response,
        });
        setloader(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    State.database.userData !== "" && isUserAvaliable();
    console.log(State.database.userData);

    console.log(localStorage.getItem("authtoken"));
  }, []);
  return loader ? (
    <>
      {" "}
      <Helmet>
        <meta charSet='utf-8' />
        <title>{State.database.userData.data.user.name}</title>
        <link rel='canonical' href='https://mintflick.app/' />
      </Helmet>
      <div className=' flex flex-col lg:flex-row h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900'>
        <div className='flex flex-col h-fit lg:h-full w-full lg:w-1/4 lg:ml-12 lg:mr-4 pt-16 lg:pt-24 space-y-6 overflow-y-auto'>
          <ProfileCard></ProfileCard>
          <TextChannels></TextChannels>
          <TextChannels></TextChannels>
          <TextChannels></TextChannels>
          <TextChannels></TextChannels>
        </div>
        <div className='w-full lg:w-3/4 flex flex-col items-center  h-fit lg:h-full  pt-24 lg:mr-12   space-y-6 lg:overflow-y-auto '>
          <div className='h-full w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-lg'>
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Profile</title>
        <link rel='canonical' href='http://mysite.com/example' />
      </Helmet>
      <div className=' flex  lg:flex-row h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900'></div>
    </>
  );
}

export default Profile;
