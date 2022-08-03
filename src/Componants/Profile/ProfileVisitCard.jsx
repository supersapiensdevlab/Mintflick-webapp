import React from "react";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";

function ProfileCard() {
  return (
    <div className="flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <img
        src={coverImage}
        alt="Girl in a jacket"
        className="w-full h-24 rounded-lg object-cover"
      />
      <img
        src={coverImage}
        alt="Girl in a jacket"
        className="w-20 h-20 -mt-10 object-cover rounded-full"
      />
      <div className="flex flex-col items-center w-full h-fit space-y-2">
        <p className="text-lg text-brand1 font-bold">Name name</p>
        <span className="flex items-center gap-2 text-base text-brand3 font-medium">
          @username
          <p className="flex items-center gap-1 text-sm text-primary font-medium">
            <Share size={12}></Share>share
          </p>
        </span>
        <div className="w-full flex justify-around">
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            12
            <p className="flex items-center  text-base text-primary font-bold">
              Followers
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            12
            <p className="flex items-center  text-base text-primary font-bold">
              Following
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            3
            <p className="flex items-center gap-1 text-base text-primary font-bold">
              SuperFans
            </p>
          </span>
        </div>
        <div className="flex flex-col p-4 w-full gap-1">
          <button className="btn btn-brand btn-sm w-full">follow</button>
          <button className="btn btn-primary btn-outline btn-sm w-full">
            become superfan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
