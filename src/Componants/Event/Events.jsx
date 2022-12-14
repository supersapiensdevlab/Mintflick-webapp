import React from "react";
import EventCardList from "./EventCardList";
import EventCategories from "./EventCategories";
import Filter from "./Filter";
import { useState, useEffect } from "react";
import { Plus, Search } from "tabler-icons-react";
import { Link } from "react-router-dom";
function Event() {
  const [payWallStatus, setPayWallStatus] = useState();
  const [userInfo, setUserInfo] = useState();

  console.log("this  is  paywall status" + " " + payWallStatus);
  console.log("this  is  user info" + " " + userInfo);

  useEffect(() => {
    console.log("Adding UnlockProtocol Lock");

    window.addEventListener("unlockProtocol.status", function (event) {
      console.log(
        "this  is  from inside  take  a look " + " " + event.detail.state
      );
      setPayWallStatus(event.detail.state);
    });

    window.addEventListener("unlockProtocol.authenticated", function (event) {
      // event.detail.addresss includes the address of the current user, when known
      setUserInfo(event.detail.address);
    });

    window.addEventListener("unlockProtocol.transactionSent", function (event) {
      // event.detail.hash includes the hash of the transaction sent
    });
  }, []);

  return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 ">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}

      <div className="w-full    lg:mr-12 h-full pt-24 space-y-6 overflow-y-auto pb-12">
        <div className="p-2 w-full flex gap-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800">
          <input
            type="text"
            placeholder="Search events"
            className="input input-bordered w-full     flex-grow"
          />
          <Link className="btn gap-2 btn-brand" to={"../create-event"}>
            <Plus />
            <span className="hidden sm:block">Create Event</span>
          </Link>
        </div>
        <EventCardList></EventCardList>
      </div>
    </div>
  );
}

export default Event;
