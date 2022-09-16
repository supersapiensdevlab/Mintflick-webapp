import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { Image } from "react-img-placeholder";
import { useCountdown } from "../../Hooks/useCountdown";
import placeholderImage from "../../Assets/profile-pic.png";

function SingleScheduled({ live }) {
  const [days, hours, minutes, seconds] = useCountdown(live.streamSchedule * 1);

  return (
    <div className="relative w-64 space-y-2">
      <div className={`absolute flex justify-evenly top-4 left-2 w-fit  rounded-full px-2 text-slate-100 text-sm font-semibold  ${days<1?(hours<1?'bg-rose-600':(hours<12&&'bg-orange-600')):'bg-green-600' }`}>
        Starting in {days > 0 && `${days}Days`} {hours}Hrs {minutes}mins
      </div>
      <img
        className=" aspect-video w-full object-cover rounded-lg"
        src={live.thumbnail}
      />
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
            {live.streamDetails ? live.streamDetails.name : "Untitled Stream"}
          </p>
          <p className="text-sm font-normal text-brand5">{live.username}</p>
        </div>
      </div>
    </div>
  );
}

export default SingleScheduled;
