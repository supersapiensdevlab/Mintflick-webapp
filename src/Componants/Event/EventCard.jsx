import React from "react";
import { NavLink } from "react-router-dom";
import imgPlaceHolder from "../../Assets/profile-pic.png";
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
      to={"../event-details/" + lockId}
      className="mx-auto relative h-fit w-full sm:w-96  sm:rounded-lg bg-white dark:bg-slate-700 sm:hover:scale-105 cursor-pointer transition-all ease-in-out shadow-xl overflow-hidden"
    >
      <div className=" absolute flex items-center gap-1  top-2 left-2 w-fit">
        <div className=" bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
          {type}
        </div>
        <div className=" bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
          {Category}
        </div>
      </div>
      {isFreeEvent && (
        <div className="absolute right-2 top-2 w-fit bg-teal-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
          free
        </div>
      )}
      <img
        className="aspect-video w-full object-cover sm:rounded-t-md"
        src={
          selectedPostImg
            ? selectedPostImg
            : "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
        }
        alt="banner"
      />
      <div className="flex items-center w-full space-x-2 my-1  py-3 px-4">
        <img
          className="h-10 w-10 rounded-full"
          src={userImg ? userImg : imgPlaceHolder}
          alt="user profile"
        />
        <div className="flex-grow ">
          <p className="w-48 text-lg font-semibold text-brand1 truncate">
            {name}
          </p>
          <p className="text-base font-normal text-brand3">
            {username.length > 10
              ? username.slice(0, 6) +
                "..." +
                username.slice(username.length - 6, username.length)
              : username}
          </p>
        </div>
        <span className="h-12 w-1  bg-slate-200 dark:bg-slate-600 rounded-full  "></span>
        <p className="flex flex-col gap-1 items-end w-fit my-1 font-semibold text-success  ">
          <span className="font-bold text-xl flex">
            {getDayMonth(startDate)}
          </span>

          <span className="font-bold  text-neutral dark:text-gray-100  flex ">
            {startDate ? formatAMPM(startDate) : null}
          </span>
        </p>
      </div>
      <div className="flex items-center w-full space-x-2  pb-4 px-2">
        <p className="flex-grow px-4  h-12  text-ellipsis  overflow-hidden text-base font-normal text-brand4">
          {description}
        </p>
        {/* <p className="  text-start flex-grow px-4  h-12  text-ellipsis  overflow-hidden text-base font-normal text-brand4">
                  ...
                </p> */}
      </div>
      {/* <span className=" absolute bottom-0 right-2 text-brand2 text-xs text-semibold z-[999]">
                Only 20 tickets left
              </span>
              <div className="w-full relative bg-white/20 h-4">
                <div className="w-1/3 absolute top-0 left-0 h-full bg-gradient-to-tr   from-[#A36CFC]  via-primary  to-brand px-1  "></div>
              </div> */}
    </NavLink>
  );
}

export default EventCard;
