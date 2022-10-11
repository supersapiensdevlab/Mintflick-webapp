import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import { Image } from "react-img-placeholder";
import placeholderImage from "../../Assets/profile-pic.png";
import { useNavigate } from "react-router-dom";
import { Eye } from "tabler-icons-react";

function LiveChannels() {
  const State = useContext(UserContext);

  const navigateTo = useNavigate();

  // For Live Users
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`)
      .then(async (repos) => {
        let tempdata = [];
        for (let i = 0; i < repos.data.length; i++) {
          await axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`
            )
            .then((value) => {
              if (value.data !== "") {
                console.log("setting live users");
                tempdata.push(value.data);
              }
            });
        }
        State.addLiveUsers(tempdata);
      });
  }, []);
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-brand5 mb-2">Live now</p>
      {State.database.liveUsers.length > 0 ? (
        <>
          {State.database.liveUsers.map((channel) => (
            <div
              onClick={() => navigateTo(`../liveuser/${channel.username}`)}
              className="group flex cursor-pointer items-center gap-2  rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              key={channel.id}
            >
              {/* <img
                  className="h-full rounded-full border-2 border-rose-600"
                  src={channel.profile_image}
                  alt="profileImage"
                /> */}
              <Image
                width={33}
                height={33}
                className="h-full rounded-full border-2 border-rose-600"
                src={
                  channel.profile_image
                    ? channel.profile_image
                    : placeholderImage
                }
                alt="profileImage"
                placeholderSrc={placeholderImage}
              />
              <p className="cursor-pointer text-base font-medium text-brand3">
                {channel.name}
              </p>
              <p className="hidden  group-hover:flex items-center gap-1 cursor-pointer text-sm font-semibold  text-brand6 ml-auto mr-4">
                Watch Now
                {/* <Eye size={16} />  */}
              </p>
            </div>
          ))}
        </>
      ) : (
        <div className="text-brand6"> No streams are live now</div>
      )}
    </div>
  );
}

export default LiveChannels;
