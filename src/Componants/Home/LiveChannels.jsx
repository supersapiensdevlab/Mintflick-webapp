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
    <div className="w-full space-y-4 h-fit">
      <p className="mb-2 text-lg font-extrabold text-brand5">Live now</p>
      {State.database.liveUsers.length > 0 ? (
        <>
          {State.database.liveUsers.map((channel) => (
            <div
              onClick={() => navigateTo(`../live/${channel.username}`)}
              className="flex items-center gap-2 rounded-full cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-800"
              key={channel.id}
            >
              {/* <img
                  className="h-full border-2 rounded-full border-rose-600"
                  src={channel.profile_image}
                  alt="profileImage"
                /> */}
              <Image
                width={33}
                height={33}
                className="object-cover h-full border-2 rounded-full aspect-square border-rose-600"
                src={
                  channel.profile_image
                    ? channel.profile_image
                    : placeholderImage
                }
                alt="profileImage"
                placeholderSrc={placeholderImage}
              />
              <p className="text-base font-medium cursor-pointer text-brand3">
                {channel.name}
              </p>
              <p className="items-center hidden gap-1 ml-auto mr-4 text-sm font-semibold cursor-pointer group-hover:flex text-brand6">
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
