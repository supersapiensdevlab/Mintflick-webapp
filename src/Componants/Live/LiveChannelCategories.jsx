import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";


function LiveChannelCategories(props) {
  const [data, setData] = useState([
    {
      channelName: "Channel name",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      topic: "Topic name will come here |this will truncate",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
    {
      channelName: "Channel name",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      topic: "Topic name will come here",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/157dfb104546895.5f6513c370c0d.jpg",
      url: "",
    },
    {
      channelName: "Channel name",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      topic: "Topic name will come here",
      img: "https://steamuserimages-a.akamaihd.net/ugc/912420007691182082/5007D949A6BD87FC9CFA9006E16B6CBF2C3923DC/?imw=1024&imh=576&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      url: "",
    },
    {
      channelName: "Channel name",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      topic: "Topic name will come here",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      channelName: "Channel name",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      topic: "Topic name will come here",
      img: "https://i.ytimg.com/vi/wQz1Qi1EyMQ/maxresdefault.jpg",
      url: "",
    },
  ]);

  const State = useContext(UserContext);

  return (
    <div className="w-full h-fit p-4 space-y-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800 ">
      <p className="font-bold text-base text-brand5 ">
        {props.section_name}
      </p>
      <div className=" w-full overflow-x-auto">
        <div className="flex space-x-4 w-fit">
          {State.database.liveUsers.map((live) => (
            <div className="relative w-64 space-y-2">
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
                  src={live.profile_image ? live.profile_image : placeholderImage}
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
                <div className=" ">
                  <p className="w-48 text-sm font-medium text-brand3 truncate">
                    {live.streamDetails ? live.streamDetails.name : 'Untitled Stream'}
                  </p>
                  <p className="text-sm font-normal text-brand5">
                    {live.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveChannelCategories;
