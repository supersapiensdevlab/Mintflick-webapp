import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import { Image } from "react-img-placeholder";
import placeholderImage from "../../Assets/profile-pic.png";

function LiveChannels() {
  const State = useContext(UserContext);

  // For Live Users
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`)
      .then(async (repos) => {
        for (let i = 0; i < repos.data.length; i++) {
          await axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`
            )
            .then((value) => {
              if (value.data !== "")
                State.updateDatabase({ liveUsers: value.data });
            });
        }
      });
  }, []);
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-brand5 mb-2">Live now</p>
      {State.database.liveUsers.length > 0 ? (
        <>
          {State.database.liveUsers.map((channel) => (
            <div className="flex  items-center space-x-2 h-8 " key={channel.id}>
              <div className="h-full flex items-center flex-grow space-x-2">
                {/* <img
                  className="h-full rounded-full border-2 border-rose-600"
                  src={channel.profile_image}
                  alt="profileImage"
                /> */}
                <Image
                  width={33}
                  height={33}
                  className="h-full rounded-full border-2 border-rose-600"
                  src={channel.profile_image ? channel.profile_image : placeholderImage}
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
                <p className="cursor-pointer text-base font-medium text-brand3">
                  {channel.name}
                </p>
              </div>
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
