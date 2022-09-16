import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";

function ScheduledStream(props) {
  const [scheduledStream, setScheduledStream] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/scheduled_stream`)
      .then(async (res) => {
        setScheduledStream(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full h-fit p-4 space-y-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800 ">
      <p className="font-bold text-base text-brand5 ">{props.section_name}</p>
      <div className=" w-full overflow-x-auto">
        <div className="flex space-x-4 w-fit">
          {scheduledStream.length > 0 ? (
            <>
              {scheduledStream.map((live) => (
                <div className="relative w-64 space-y-2">
                  <div className="absolute top-4 left-2 w-fit bg-rose-600 rounded-full px-2 text-slate-100 text-sm font-semibold">
                    Scheduled  {moment(new Date(live.streamSchedule*1)).fromNow()}
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
                        live.profile_image
                          ? live.profile_image
                          : placeholderImage
                      }
                      alt="profileImage"
                      placeholderSrc={placeholderImage}
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
            <div className="text-brand5">No Scheduled Streams </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScheduledStream;
