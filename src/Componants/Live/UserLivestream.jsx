import React from "react";
import { useParams } from "react-router-dom";

function UserLivestream() {
  const { username } = useParams();
  return (
    <div className=" flex w-full h-screen pt-24  bg-white dark:bg-slate-900 ">
      <span className="text-xl text-brand1">{username}</span>
    </div>
  );
}

export default UserLivestream;
