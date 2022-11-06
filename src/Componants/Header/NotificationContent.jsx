import React, { useState } from "react";
import moment from "moment";
import { useEffect } from "react";
import CircleLogo from "../../../src/Assets/profile-pic.png";
import { Link } from "react-router-dom";
moment().format();

const NotificationContent = ({ data }) => {
  const [userLiveTime, setUserLiveTime] = useState(null);

  console.log(data);

  useEffect(() => {
    const timestamp = new Date(data.time * 1000); // This would be the timestamp you want to format
    setUserLiveTime(moment(timestamp).fromNow());
  }, []);

  return (
    <div className="p-2 w-full hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md">
      <Link to={data?.link} className="flex items-center gap-2 cursor-pointer ">
        <img
          src={CircleLogo}
          alt="announcement_info"
          className="h-8 w-8 rounded-full"
        />

        <div>
          {data.announcement?.includes("was") ? (
            <p className="text-brand2 text-sm font-semibold break-words">
              {data.announcement + ` ${userLiveTime} ago`}
            </p>
          ) : (
            <div className="">
              <p className="text-brand2 text-sm font-medium break-words">
                {data.announcement}
              </p>
              <p className="text-brand4 text-xs font-normal break-words">
                {userLiveTime}
              </p>
            </div>
          )}
        </div>

        {data.post_image && (
          <img
            src={data.post_image}
            // src={CircleLogo}
            alt="announcement_info"
            className="h-12 w-12 ml-auto rounded-sm object-cover"
          />
        )}
      </Link>
    </div>
  );
};

export default NotificationContent;
