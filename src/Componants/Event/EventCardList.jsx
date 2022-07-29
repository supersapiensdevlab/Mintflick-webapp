import React, { useState } from "react";
import { UserCircle } from "tabler-icons-react";

function EventCardList() {
  const [data, setData] = useState([
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      topic: "Event name | Location",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
  ]);
  return (
    <div className="w-full h-fit p-4 space-y-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800 ">
      <p className="font-bold text-base text-brand5 ">
        Category name will come here
      </p>
      <div className=" w-full overflow-x-auto">
        <div className="flex space-x-4 w-fit">
          {data.map((event) => (
            <div className="relative h-fit w-64 py-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-700">
              <div className="absolute flex items-center gap-1  top-4 left-4 w-fit bg-slate-600/30 backdrop-blur-sm rounded-full px-1 text-slate-100 text-sm font-semibold">
                <UserCircle size={16}></UserCircle> {event.bookings}
              </div>
              <div
                className="my-1 h-36 w-full bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${event.img}  )`,
                }}
              ></div>
              <div className="flex w-full space-x-2 my-1 ">
                <img
                  className="h-10 rounded-full"
                  src={event.channelProfile}
                  alt="user profile"
                />
                <div className=" ">
                  <p className="w-48 text-sm font-medium text-brand3 truncate">
                    {event.topic}
                  </p>
                  <p className="text-sm font-normal text-brand5">
                    {event.channelName}
                  </p>
                </div>
              </div>
              <p className="w-64 my-1 text-sm font-medium text-brand3 truncate">
                {event.timeline}
              </p>
              <p className="w-64 my-1 text-base font-semibold text-emerald-600 truncate">
                {event.prices}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventCardList;
