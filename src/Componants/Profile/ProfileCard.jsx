import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";

function ProfileCard() {
  const State = useContext(UserContext);

  async function getUserData() {
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
          walletAddress: response.data.user.wallet_id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    !State.database.userData.data && getUserData();
  }, []);

  return (
    <div className="flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <img
        src={
          State.database.userData.data
            ? State.database.userData.data.user.cover_image
            : coverImage
        }
        alt="cover image"
        className="w-full aspect-{4/2} rounded-lg object-cover"
      />
      <img
        src={
          State.database.userData.data
            ? State.database.userData.data.user.profile_image
            : coverImage
        }
        alt="Profile image"
        className="w-20 h-20 -mt-10 object-cover rounded-full"
      />
      <div className="flex flex-col items-center w-full h-fit space-y-1 m-2">
        <p className="text-lg text-brand1 font-bold">
          {State.database.userData.data?.user.name}
        </p>
        <span className="flex items-center gap-2 text-base text-brand3 font-medium">
          {"@" + `${State.database.userData.data?.user.username}`}
          <p className="flex items-center gap-1 text-sm text-primary font-medium">
            <Share size={12}></Share>share
          </p>
        </span>
        <div className="w-full flex p-2 justify-around">
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {State.database.userData.data?.user.follower_count.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Followers
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {State.database.userData.data?.user.followee_count.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Following
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {State.database.userData.data?.user.superfan_of.length}
            <p className="flex items-center gap-1 text-xs text-primary font-medium">
              SuperFans
            </p>
          </span>
        </div>
        <div className="flex flex-col p-4 w-full gap-1">
          <button className="btn btn-primary btn-outline btn-sm w-full">
            Edit profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
