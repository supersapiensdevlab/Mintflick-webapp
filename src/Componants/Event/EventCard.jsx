import React from "react";
import { NavLink } from "react-router-dom";

function EventCard({
  type,
  Category,
  isFreeEvent,
  selectedPostImg,
  name,
  username,
  userImg,
  description,
  startDate,
  lockId,
  id,
}) {
  function formatAMPM(datee) {
    let date = new Date(datee);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function getDayMonth(datee) {
    let dateTime = new Date(datee);
    var month = dateTime.getMonth();
    var date = dateTime.getDate();
    var strTime = date + " " + monthList[month];
    return strTime;
  }

  return (
    <NavLink
      to={"../event-details/" + id}
      className="relative w-full mx-auto overflow-hidden transition-all ease-in-out bg-white rounded-lg shadow-xl cursor-pointer h-fit sm:w-96 dark:bg-slate-700 sm:hover:scale-105"
    >
      <div className="absolute flex items-center gap-1 top-2 left-2 w-fit">
        <div className="px-2 text-sm font-semibold rounded-full border-[1px] border-white/30 bg-slate-700/60 backdrop-blur-sm text-slate-100">
          {type}
        </div>
        <div className="px-2 text-sm font-semibold rounded-full border-[1px] border-white/30 bg-slate-700/60 backdrop-blur-sm text-slate-100">
          {Category}
        </div>
      </div>
      {isFreeEvent && (
        <div className="absolute px-2 text-sm font-semibold rounded-full border-[1px] border-white/30 right-2 top-2 w-fit bg-teal-700/60 backdrop-blur-sm text-slate-100">
          free
        </div>
      )}
      <img
        className="object-cover w-full aspect-video sm:rounded-t-md"
        src={
          selectedPostImg
            ? selectedPostImg
            : "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
        }
        alt="banner"
      />
      <div className="flex items-center w-full px-4 py-3 my-1 space-x-2">
        {/* <img
          className="w-10 h-10 rounded-full"
          src={userImg ? userImg : imgPlaceHolder}
          alt="user profile"
        /> */}
        <div className="flex-grow ">
          <p className="w-48 text-xl font-semibold truncate text-brand1">
            {name}
          </p>
          <p className="text-sm font-normal text-brand4">
            {username.length > 10
              ? username.slice(0, 6) +
                "..." +
                username.slice(username.length - 6, username.length)
              : username}
          </p>
        </div>
        <span className="w-1 h-12 rounded-full bg-slate-200 dark:bg-slate-600 "></span>
        <p className="flex flex-col items-end gap-[1px] my-1 font-semibold w-fit text-success ">
          <span className="flex text-xl font-bold">
            {getDayMonth(startDate)}
          </span>

          <span className="flex font-semibold text-brand4 ">
            {startDate ? formatAMPM(startDate) : null}
          </span>
        </p>
      </div>
      <div className="flex items-center w-full pb-4 ">
        <p className="flex-grow h-12 px-4 overflow-hidden text-base font-semibold line-clamp-2 text-brand4">
          {description}
        </p>
        {/* <p className="flex-grow h-12 px-4 overflow-hidden text-base font-normal text-start text-ellipsis text-brand4">
                  ...
                </p> */}
      </div>
      {/* <span className=" absolute bottom-0 right-2 text-brand2 text-xs text-semibold z-[999]">
                Only 20 tickets left
              </span>
              <div className="relative w-full h-4 bg-white/20">
                <div className="w-1/3 absolute top-0 left-0 h-full bg-gradient-to-tr   from-[#A36CFC]  via-primary  to-brand px-1  "></div>
              </div> */}
    </NavLink>
  );
}

export default EventCard;
