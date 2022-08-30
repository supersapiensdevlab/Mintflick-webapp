import React, { useState } from "react";
import moment from "moment";
import { useEffect } from "react";
import CircleLogo from "../../../src/Assets/profile-pic.png";
moment().format();

const NotificationContent = ({ data }) => {
  const [userLiveTime, setUserLiveTime] = useState(null);

  useEffect(() => {
    const timestamp = new Date(data.timestamp); // This would be the timestamp you want to format
    setUserLiveTime(moment(timestamp).fromNow());
  }, []);

  return (
    <div className="h-full max-h-80 overflow-hidden overflow-y-auto">
      <a
        href={data.link ? data.link : `/live/${data.username}`}
        className="grid grid-cols-4 justify-center p-1 dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark-secondary dark:text-white text-gray-500"
      >
        {data.post_image ? (
          <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
            <img
              src={data.post_image}
              alt="announcement_info"
              className="h-full w-auto rounded-sm"
            />
          </div>
        ) : null}
        {!data.post_image && data.linkpreview_data ? (
          <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
            <img
              src={data.linkpreview_data.image.url}
              alt="announcement_info"
              className="h-full w-auto rounded-sm"
            />
          </div>
        ) : null}
        {!data.post_image && !data.linkpreview_data && data.post_video ? (
          <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
            <img
              src={CircleLogo}
              alt="announcement_info"
              className="h-full w-auto rounded-sm"
            />
          </div>
        ) : null}
        {data.announcement.includes("was") ? (
          <div className="col-span-3 rounded-sm ">
            <p className="pl-2 line-clamp-3 text-sm font-semibold break-words">
              {data.announcement + ` ${userLiveTime} ago`}
            </p>
          </div>
        ) : (
          <div className="col-span-3 rounded-sm ">
            <p className="pl-2 line-clamp-3 text-sm font-semibold break-words">
              {data.announcement}
            </p>
            <p className="pl-2 line-clamp-3 text-xs font-normal break-words">
              {userLiveTime}
            </p>
          </div>
        )}
      </a>
    </div>
  );
};

export default NotificationContent;
