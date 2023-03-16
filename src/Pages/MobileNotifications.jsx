import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AlertTriangle } from "tabler-icons-react";
import EmptyNotification from "../Componants/Header/EmptyNotification";
import NotificationContent from "../Componants/Header/NotificationContent";
import { UserContext } from "../Store";

function MobileNotifications() {
  const State = useContext(UserContext);

  //new notification
  const [newNotification, setNewNotification] = useState(0);

  // const [onlyOnce, setOnlyOnce] = useState(false);

  const [notification, setNotification] = useState([]);

  useEffect(() => {
    State.updateDatabase({ showHeader: true });
    if (
      State.database.userData.data?.user &&
      State.database.userData.data?.user.notification
    ) {
      // setOnlyOnce(true);
      if (State.database.userData.data?.user.notification.length > 0) {
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
    <div className="p-2 py-20 overflow-y-auto w-screen h-screen bg-slate-100 dark:bg-slate-800">
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
        <div className="w-full p-2   divide-solid dark:divide-slate-700 divide-y-2">
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
        <div className="h-full w-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-4 text-brand6">
            <AlertTriangle size={64} />
            <span className="text-2xl font-bold">No new notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNotifications;
