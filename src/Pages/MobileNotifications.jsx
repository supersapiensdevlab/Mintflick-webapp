import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import EmptyNotification from "../Componants/Header/EmptyNotification";
import NotificationContent from "../Componants/Header/NotificationContent";
import { UserContext } from "../Store";

function MobileNotifications() {
  const State = useContext(UserContext);

  //new notification
  const [newNotification, setNewNotification] = useState(0);

  const [onlyOnce, setOnlyOnce] = useState(false);

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    if (
      State.database.userData.data?.user &&
      State.database.userData.data?.user.notification &&
      !onlyOnce
    ) {
      setOnlyOnce(true);
      if (State.database.userData.data?.user.notification.length > 0) {
        setNewNotification(
          State.database.userData.data?.user.notification.length
        );
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data?.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.oldnotification[i]);
        }
        for (
          let i = 0;
          i < State.database.userData.data?.user.notification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.notification[i]);
        }
        setNotification(data.reverse());
      } else {
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data?.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.oldnotification[i]);
        }
        setNotification(data.reverse());
      }
    }
  }, [State.database.userData?.data?.user?.notification]);

  const handleNotification = () => {
    if (State.database.userData?.data?.user && newNotification > 0) {
      setNewNotification(0);
      const data = {
        username: State.database.userData.data.user?.username,
      };
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/seennotification`,
        data: data,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <div className="p-2 pt-20  h-screen bg-slate-100 dark:bg-slate-800">
      {/* <label tabindex="0" className=" avatar">
        <button class="btn btn-circle btn-ghost" onClick={handleNotification}>
          <Bell size={28}></Bell>
        </button>
        {newNotification > 0 ? (
          <div
            className="bg-rose-600 rounded-full shadow  
                        h-4 w-4 text-xs self-center text-center font-semibold  
                        absolute top-1  right-2  
                         text-white"
          >
            {newNotification}
          </div>
        ) : null}
      </label> */}

      {notification.length > 0 ? (
        <div className="w-full p-2">
          {notification.map((value, i) => {
            return (
              <div key={i} className="w-full ">
                {console.log(value)}
                <NotificationContent data={value} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mx-auto p-2 ">
          <EmptyNotification />
        </div>
      )}
    </div>
  );
}

export default MobileNotifications;
