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
      name: "Home",
      isActive: 1,
      link: "/homescreen/home",
    },
    {
      icon: <AccessPoint size={28}></AccessPoint>,
      name: "Live",
      isActive: 2,
      link: "/homescreen/live",
    },
    {
      icon: <Confetti size={28}></Confetti>,
      name: "Events",
      isActive: 3,
      link: "/homescreen/marketPlace",
    },
    {
      icon: <Search size={24}></Search>,
      name: "Explore",
      isActive: 4,
      link: "/homescreen/explore",
    },
    {
      icon: <Bell size={24}></Bell>,
      name: "Notifications",
      isActive: 5,
      link: "/homescreen/notifications",
    },
  ];
  return (
    <div className="flex text-white items-center   py-4 justify-around   bg-slate-900/25 backdrop-blur-xl">
      {data.map((item) => (
        <NavLink
          to={item.link}
          onClick={() => {
            setActive(item.isActive);
            // navigateTo(`${item.link}`);
          }}
          className={({ isActive }) =>
            isActive ? `  opacity-100 ` : `    opacity-50`
          }
        >
          {item.icon}
        </NavLink>
      ))}
    </div>
  );
}

export default BottomNavigation;
