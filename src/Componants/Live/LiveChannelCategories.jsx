import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Store";
import placeholder from "../../Assets/Gaming Posters/liveplaceholder.jpg";
import { Image } from "react-img-placeholder";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LiveChannelCategories(props) {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  // For Live Users
  useEffect(() => {
    if (State.database.liveUsers.length <= 0) {
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
    }
  }, []);

  return (
    <div className="w-full h-fit   space-y-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800 ">
      <p className="font-bold text-base text-brand5 px-4 pt-4">
        {props.section_name}
      </p>
      <div className=" w-full overflow-x-auto px-4 pb-4">
        <div className="flex space-x-4 w-fit">
          {State.database.liveUsers.length > 0 ? (
            <>
              {State.database.liveUsers.map((live) => (
                <div
                  onClick={() => navigateTo(`../liveuser/${live.username}`)}
                  className="relative w-64 space-y-2 cursor-pointer"
                >
                  <div className="absolute top-4 left-2 w-fit bg-rose-600 rounded-full px-2 text-slate-100 text-sm font-semibold">
                    {props.event_status}
                  </div>
                  <div
                    className=" h-36 w-full bg-cover rounded-lg"
                    style={{
                      backgroundImage: `url(${live.thumbnail}  )`,
                    }}
                  ></div>
                  <div className="flex w-full space-x-2 ">
                    <Image
                      width={40}
                      height={40}
                      className="h-10 rounded-full"
                      src={
                        live.profile_image ? live.profile_image : placeholder
                      }
                      alt="profileImage"
                      placeholderSrc={placeholder}
                    />
                    <div className=" ">
                      <p className="w-48 text-sm font-medium text-brand3 truncate">
                        {live.streamDetails
                          ? live.streamDetails.name
                          : "Untitled Stream"}
                      </p>
                      <p className="text-sm font-normal text-brand5">
                        {live.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-brand5">No Live Streams </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveChannelCategories;
