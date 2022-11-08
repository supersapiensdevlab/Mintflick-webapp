import React from "react";
import EventCardList from "./EventCardList";
import EventCategories from "./EventCategories";
import Filter from "./Filter";
import { useState, useEffect } from "react";
function Event() {
  const [payWallStatus, setPayWallStatus] = useState();
  const [userInfo, setUserInfo] = useState();

  console.log("this  is  paywall status" + " " + payWallStatus);
  console.log("this  is  user info" + " " + userInfo);

  useEffect(() => {
    console.log("Adding UnlockProtocol Lock");

    window.addEventListener("unlockProtocol.status", function (event) {
      console.log(
        "this  is  from inside  take  a look " + " " + event.detail.state,
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
    <div className=' flex w-full h-screen  bg-white dark:bg-slate-900 '>
      <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div>

      <div className='w-full lg:w-3/4 lg:mr-12 h-full pt-24 space-y-6 overflow-y-auto pb-12'>
        <div className='p-2 w-full h-52 rounded-xl bg-slate-100 dark:bg-slate-800'></div>
        <EventCardList></EventCardList>

        <EventCardList></EventCardList>
        <EventCardList></EventCardList>
      </div>
    </div>
  );
}

export default Event;
