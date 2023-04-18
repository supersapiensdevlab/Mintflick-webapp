import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AccessPoint, Confetti, SmartHome } from "tabler-icons-react";

function TopNavigation() {
  const navigateTo = useNavigate();
  const [active, setActive] = useState(1);
  const data = [
    {
      icon: <SmartHome size={22}> </SmartHome>,
      isActive: 1,
      link: "/homescreen/home",
      name: "Feed",
    },
    {
      icon: <AccessPoint size={22}></AccessPoint>,
      isActive: 2,
      link: "/homescreen/live",
      name: "Live",
    },
    {
      icon: <Confetti size={22}></Confetti>,
      isActive: 3,
      link: "/homescreen/events",
      name: "Event",
    },
  ];
  return (
    <div className="flex items-center justify-center p-1 space-x-10 rounded-lg h-fit ">
      {data.map((item, i) => (
        <NavLink
          key={i}
          to={item.link}
          onClick={() => {
            setActive(item.isActive);
            // navigateTo(`${item.link}`);
          }}
          className={({ isActive }) =>
            isActive
              ? `btn   btn-brand flex  gap-2 items-center justify-center  `
              : `btn  btn-ghost dark:text-gray-100 flex  gap-2 items-center justify-center `
          }>
          {item.icon}
          <p className="text-xs font-semibold">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
}

export default TopNavigation;
