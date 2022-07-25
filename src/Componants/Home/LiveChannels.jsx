import React, { useState } from "react";

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
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-gray-400 mb-2">Live now</p>
      {channels.map((channel) => (
        <div className="flex  items-center space-x-2 h-8 ">
          <div className="h-full flex items-center flex-grow space-x-2">
            <img
              className="h-full rounded-full border-2 border-rose-600"
              src={channel.img}
              alt="profileImage"
            />

            <p className="cursor-pointer text-base font-bold text-gray-600">
              {channel.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LiveChannels;
