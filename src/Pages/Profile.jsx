import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { UserContext } from "../Store";
import ProfileCard from "../Componants/Profile/ProfileCard";
import ProfileVisitCard from "../Componants/Profile/ProfileVisitCard";

import TextChannels from "../Componants/Profile/TextChannels";
import { Helmet } from "react-helmet";
import Loading from "../Componants/Loading/Loading";
import TimeLine from "../Componants/Home/TimeLine";
import ProfileMedia from "../Componants/Profile/ProfileMedia";
import MintWallet from "../Componants/Profile/MintWallet";
import Vouch from "../Componants/Profile/Vouch";

function Profile() {
  const State = useContext(UserContext);
  useEffect(() => {
    State.updateDatabase({ showHeader: true });
  }, []);
  const { userName } = useParams();
  const [loader, setloader] = useState(false);
  const [activeTab, setactiveTab] = useState(1);

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
  }, [userName]);
  return !loader ? (
    <div className=" lg:flex  h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900 overflow-y-auto">
      <div className="flex flex-col h-fit lg:h-full w-full lg:w-1/4 lg:ml-12 lg:mr-4 pt-16 lg:pt-24 lg:space-y-6 lg:overflow-y-auto">
        <ProfileCard
          coverImage={State.database.userProfileData?.data.cover_image}
          profileImage={State.database.userProfileData?.data.profile_image}
          name={State.database.userProfileData?.data.name}
          userName={State.database.userProfileData?.data.username}
          follower_count={
            State.database.userProfileData?.data?.follower_count?.length
          }
          followee_count={
            State.database.userProfileData?.data?.followee_count?.length
          }
          superfan_to={
            State.database.userProfileData?.data?.superfan_to?.length
          }
        />
        <TextChannels></TextChannels>
        {/* <Vouch /> */}
      </div>
      <div className="relative w-full  lg:w-2/4 flex flex-col items-center  lg:h-full pt-14 lg:pt-24 lg:overflow-y-auto">
        <div className="sticky  z-50 top-0 left-0 w-full mb-3">
          <div className="relative h-12 w-full bg-slate-100/10 backdrop-blur-sm rounded-lg flex">
            <div
              onClick={() => setactiveTab(1)}
              className="z-50 h-full w-1/2 flex items-center justify-center gap-2 cursor-pointer "
            >
              <sapn
                className={`text-white
                 font-semibold`}
              >
                Posts
              </sapn>
            </div>
            <div
              onClick={() => setactiveTab(2)}
              className="z-50 h-full w-1/2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <sapn
                className={`text-white
                 font-semibold`}
              >
                NFT's
              </sapn>
            </div>
            <span
              className={`${
                activeTab === 1 ? "left-0 ml-1" : " translate-x-full -ml-1  "
              } absolute top-0 h-10 w-1/2 mt-1 mb-1  bg-slate-100/10 backdrop-blur-sm rounded-lg transform transition-all ease-in-out`}
            />
          </div>
        </div>
        {activeTab === 1 ? (
          <ProfileMedia className="z-10" userName={userName}></ProfileMedia>
        ) : (
          ""
        )}
        {/* <TimeLine></TimeLine> */}
      </div>
      <div className="hidden lg:flex flex-col h-fit lg:h-full w-full lg:w-1/4 lg:ml-4 lg:mr-12 pt-16 lg:pt-24 lg:space-y-6 lg:overflow-y-auto">
        {/* <MintWallet /> */}
      </div>
    </div>
  ) : (
    // <Loading msg="Please wait getting profile details" />
    <div className="h-screen w-screen bg-slate-100 dark:bg-slate-800 ">
      <Loading />
    </div>
  );
}

export default Profile;
