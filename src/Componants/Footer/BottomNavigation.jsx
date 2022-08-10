import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AccessPoint,
  Bell,
  Confetti,
  Search,
  SmartHome,
} from "tabler-icons-react";

function BottomNavigation() {
  const navigateTo = useNavigate();
  const [active, setActive] = useState(1);
  const data = [
    {
      icon: <SmartHome size={28}> </SmartHome>,
      isActive: 1,
      link: "/homescreen/home",
    },
    {
      icon: <AccessPoint size={28}></AccessPoint>,
      isActive: 2,
      link: "/homescreen/live",
    },
    {
      icon: <Confetti size={28}></Confetti>,
      isActive: 3,
      link: "/homescreen/marketPlace",
    },
    {
      icon: <Search size={24}></Search>,
      isActive: 4,
      link: "/homescreen/marketPlace",
    },
    {
      icon: <Bell size={24}></Bell>,
      isActive: 5,
      link: "/homescreen/marketPlace",
    },
  ];
  return (
    <div className="flex items-center justify-evenly h-fit pt-2 pb-6  bg-white dark:bg-slate-900">
      {data.map((item) => (
        <NavLink
          to={item.link}
          onClick={() => {
            setActive(item.isActive);
            // navigateTo(`${item.link}`);
          }}
          className={({ isActive }) =>
            isActive ? `btn   btn-brand` : `btn  btn-ghost dark:text-gray-100`
          }
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNavigation;
