import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccessPoint, Confetti, SmartHome } from "tabler-icons-react";

function TopNavigation() {
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
  ];
  return (
    <div className="flex items-center justify-center h-fit p-1 rounded-lg space-x-10 bg-gray-100 dark:bg-slate-800">
      {data.map((item) => (
        <button
          onClick={() => {
            setActive(item.isActive);
            navigateTo(`${item.link}`);
          }}
          className={`  ${
            active === item.isActive
              ? `btn  btn-primary`
              : `btn  btn-ghost dark:text-gray-100`
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

export default TopNavigation;
