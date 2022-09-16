import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import SingleScheduled from "./SingleScheduled";

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
                <SingleScheduled live={live} />
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
