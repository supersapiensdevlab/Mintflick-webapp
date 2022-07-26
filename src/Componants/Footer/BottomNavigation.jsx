import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    { icon: <SmartHome size={28}> </SmartHome>, isActive: 1, link: "/" },
    {
      icon: <AccessPoint size={28}></AccessPoint>,
      isActive: 2,
      link: "/live",
    },
    {
      icon: <Confetti size={28}></Confetti>,
      isActive: 3,
      link: "/marketPlace",
    },
    {
      icon: <Search size={24}></Search>,
      isActive: 4,
      link: "/marketPlace",
    },
    {
      icon: <Bell size={24}></Bell>,
      isActive: 5,
      link: "/marketPlace",
    },
  ];
  return (
    <div className="flex items-center justify-evenly h-fit p-4 pb-6 bg-white dark:bg-slate-900">
      {data.map((item) => (
        <button
          onClick={() => {
            setActive(item.isActive);
            navigateTo(`${item.link}`);
          }}
          className={`  ${
            active === item.isActive
              ? `btn  btn-primary btn-brand`
              : `btn  btn-ghost dark:text-gray-100`
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

export default BottomNavigation;
