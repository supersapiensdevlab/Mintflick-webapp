import React, { useState } from "react";

function Channels() {
  const [channels, setChannels] = useState([
    {
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      name: "channel1",
      isPinned: true,
      msgs: 9,
    },
    {
      img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.pyTO7CtEDsKb8QgOmjOexgHaHa%26pid%3DApi&f=1",
      name: "channel2",
      isPinned: false,
      msgs: 4,
    },
  ]);
  return (
    <div className='w-full h-fit bg-brand/5 rounded-xl p-5'>
      <p className='font-black text-lg text-brand mb-8'>CHANNELS</p>
      {channels.map((channel) => (
        <div className='flex  items-center space-x-2 h-10 my-2'>
          <div className='h-full flex items-center flex-grow space-x-2'>
            <img
              className='h-full rounded-full'
              src={channel.img}
              alt='Tailwind-CSS-Avatar-component'
            />

            <p className='cursor-pointer text-base font-medium text-gray-300'>
              {channel.name}
            </p>
          </div>
          <div className='h-full avatar'></div>
          {channel.isPinned ? (
            <i className='cursor-pointer text-brand fa-solid fa-thumbtack fa-lg'></i>
          ) : (
            <i className='cursor-pointer text-brand/25 fa-solid fa-thumbtack fa-lg'></i>
          )}

          <div className='flex items-center h-6 w-fit p-2 bg-red-800 rounded-full'>
            <p className='text-white'>{channel.msgs}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Channels;
