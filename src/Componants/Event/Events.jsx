import React, { useContext } from "react";
import EventCardList from "./EventCardList";
import EventCategories from "./EventCategories";
import Filter from "./Filter";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, Search } from "tabler-icons-react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";
function Event() {
  const [payWallStatus, setPayWallStatus] = useState();
  const [userInfo, setUserInfo] = useState();

  const State = useContext(UserContext);

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

  useEffect(() => {
    State.updateDatabase({ showHeader: true });
    State.updateDatabase({ showBottomNav: true });
  }, []);

  return (
    <div className="w-screen h-screen pt-20 bg-white lg:px-12 dark:bg-slate-900 ">
      {/* <div className='flex-col hidden w-1/4 h-full pt-24 ml-12 space-y-6 overflow-y-auto lg:flex'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}

      <EventCardList></EventCardList>
    </div>
  );
}

export default Event;
