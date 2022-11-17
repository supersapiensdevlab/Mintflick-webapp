import React, { useContext } from "react";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";

function Vouch() {
  const State = useContext(UserContext);

  return (
    <div className="flex flex-col items-start   bg-slate-100 dark:bg-slate-800 w-full  rounded-lg  h-fit">
      <p className="text-2xl text-white font-bold p-4 bg-slate-800  w-full rounded-t-lg">
        Mintflick<span className="font-medium">Vouch</span>
      </p>

      <div className="flex items-center gap-2 w-full p-4 bg-slate-200 dark:bg-slate-700">
        <img
          src={
            State.database.userProfileData?.data.profile_image
              ? State.database.userProfileData?.data.profile_image
              : coverImage
          }
          alt="Profile image"
          className="w-12 h-12 object-cover rounded-full"
        />
        <span className="text-brand2 font-medium text-lg">
          {State.database.userProfileData
            ? State.database.userProfileData.data.username
            : ""}
        </span>
      </div>
      <div className="h-48 w-full p-4">
        <textarea
          type="textarea"
          className=" textarea text-lg text-brand3 font-semibold w-full h-24"
          placeholder={"Vouch for your favorite creator"}

          //   onChange={(e) =>
          //   value={}
        />
      </div>
    </div>
  );
}

export default Vouch;
