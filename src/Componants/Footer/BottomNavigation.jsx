import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AccessPoint,
  Bell,
  Confetti,
  Search,
  SmartHome,
} from "tabler-icons-react";
import { UserContext } from "../../Store";

function BottomNavigation() {
  const State = useContext(UserContext);

  const navigateTo = useNavigate();
  const [active, setActive] = useState(1);
  const data = [
    {
      icon: <SmartHome size={28}> </SmartHome>,
      name: "Home",
      isActive: 1,
      link: "/homescreen/home",
      notification: 0,
    },
    {
      icon: <AccessPoint size={28}></AccessPoint>,
      name: "Live",
      isActive: 2,
      link: "/homescreen/live",
      notification: State.database.liveUsers?.length,
    },
    {
      icon: <Confetti size={28}></Confetti>,
      name: "Events",
      isActive: 3,
      link: "/homescreen/marketPlace",
      notification: 0,
    },
    {
      icon: <Search size={24}></Search>,
      name: "Explore",
      isActive: 4,
      link: "/homescreen/explore",
      notification: 0,
    },
    {
      icon: <Bell size={24}></Bell>,
      name: "Notifications",
      isActive: 5,
      link: "/homescreen/notifications",
      notification: State.database.userData.data?.user?.notification?.length,
    },
  ];
  return (
    <div className="flex  items-center   py-4 pb-6 justify-evenly   bg-slate-900/25 backdrop-blur-xl border-t-[1px] border-gray-300/20">
      {data.map((item) => (
        <NavLink
          to={item.link}
          onClick={() => {
            setActive(item.isActive);
            // navigateTo(`${item.link}`);
          }}
          className={({ isActive }) =>
            isActive ? `relative  text-white ` : ` relative   text-white/50`
          }
        >
          {item.icon}
          {item.notification !== 0 && (
            <div className="absolute self-center h-4 px-1 text-xs font-semibold text-center text-white rounded-full shadow bg-rose-600 w-fit -top-2 left-4">
              {item.notification}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNavigation;
