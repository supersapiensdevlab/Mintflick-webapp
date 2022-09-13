import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { UserContext } from "../Store";
import ProfileCard from "../Componants/Profile/ProfileCard";
import ProfileVisitCard from "../Componants/Profile/ProfileVisitCard";

import TextChannels from "../Componants/Profile/TextChannels";
import { Helmet } from "react-helmet";
import Loading from "../Componants/Loading/Loading";

function Profile() {
  const State = useContext(UserContext);

  const { userName } = useParams();
  const [loader, setloader] = useState(false);
  async function getUser() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/user/${userName}`,
    })
      .then((response) => {
        console.log(response);
        State.updateDatabase({ userProfileData: response });
        setloader(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    setloader(true);
    getUser();
  }, []);
  return !loader ? (
    <>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>{State.database.userData.data.user.name}</title>
        <link rel="canonical" href="https://mintflick.app/" />
      </Helmet> */}
      <div className=" lg:flex  h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900 overflow-y-auto">
        <div className="flex flex-col h-fit lg:h-full w-full lg:w-1/4 lg:ml-12 lg:mr-4 pt-16 lg:pt-24 lg:space-y-6 lg:overflow-y-auto">
          <ProfileCard
            coverImage={State.database.userProfileData?.data.cover_image}
            profileImage={State.database.userProfileData?.data.profile_image}
            name={State.database.userProfileData?.data.name}
            userName={State.database.userProfileData?.data.username}
            follower_count={
              State.database.userProfileData?.data.follower_count.length
            }
            followee_count={
              State.database.userProfileData?.data.followee_count.length
            }
            superfan_of={
              State.database.userProfileData?.data.superfan_of.length
            }
          />
          <TextChannels></TextChannels>
        </div>
        <div className="w-full lg:w-3/4 flex flex-col items-center lg:h-full  pt-24 lg:mr-12   space-y-6 ">
          <div className="h-full w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-lg ">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Profile</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Loading msg="Please wait getting profile details" />
    </>
  );
}

export default Profile;
