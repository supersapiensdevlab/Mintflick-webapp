import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";

function LiveChannels() {
  const [channels, setChannels] = useState([
    {
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      name: "channel1",
      isPinned: true,
    },
    {
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.pyTO7CtEDsKb8QgOmjOexgHaHa%26pid%3DApi&f=1",
      name: "channel2",
      isPinned: false,
    },
  ]);
  const State = useContext(UserContext);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`).then(async (repos) => {
      for (let i = 0; i < repos.data.length; i++) {
        await axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`)
          .then((value) => {
            if (value.data !== '') State.updateDatabase({ liveUsers: [...State.database.liveUsers, value.data] });
          });
      }
    });
  }, []);
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-brand5 mb-2">Live now</p>
      {State.database.liveUsers.length > 0 ? <>
        {State.database.liveUsers.map((channel) => (
          <div className="flex  items-center space-x-2 h-8 ">
            <div className="h-full flex items-center flex-grow space-x-2">
              <img
                className="h-full rounded-full border-2 border-rose-600"
                src={channel.profile_image}
                alt="profileImage"
              />

              <p className="cursor-pointer text-base font-medium text-brand3">
                {channel.name}
              </p>
            </div>
          </div>
        ))}
      </> : <div className="text-brand5"> No streams are live now</div>}
    </div>
  );
}

export default LiveChannels;
