import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AccessPoint, Confetti, SmartHome } from "tabler-icons-react";

function TopNavigation() {
  const navigateTo = useNavigate();
  const [active, setActive] = useState(1);
  const data = [
    {
      icon: <SmartHome size={28}> </SmartHome>,
      isActive: 1,
      link: "/homescreen/home",
      name: "Home",
    },
    {
      icon: <AccessPoint size={28}></AccessPoint>,
      isActive: 2,
      link: "/homescreen/live",
      name: "Live",
    },
    {
      icon: <Confetti size={28}></Confetti>,
      isActive: 3,
      link: "/homescreen/marketPlace",
      name: "Event",
    },
  ];
  return (
    <div className="flex items-center justify-center h-fit p-1 rounded-lg space-x-10 ">
      {data.map((item) => (
        <NavLink
          to={item.link}
          onClick={() => {
            setActive(item.isActive);
            // navigateTo(`${item.link}`);
          }}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand flex flex-col items-center justify-center space-y-1 `
              : `btn  btn-ghost dark:text-gray-100 flex flex-col items-center justify-center space-y-1`
          }
        >
          {item.icon}
          <p className="text-white normal-case">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
}

export default TopNavigation;
