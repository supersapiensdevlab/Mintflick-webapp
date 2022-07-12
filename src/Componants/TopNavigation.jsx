import React, { useState } from "react";

function TopNavigation() {
  const [active, setActive] = useState(1);
  const data = [
    { icon: <i className='fa-solid fa-house fa-2x'></i>, isActive: 1 },
    {
      icon: <i className='fa-solid fa-tower-broadcast fa-2x'></i>,
      isActive: 2,
    },
    {
      icon: <i className='fa-solid fa-store fa-2x'></i>,
      isActive: 3,
    },
  ];
  return (
    <div className='flex items-center justify-center h-full full space-x-20'>
      {data.map((item) => (
        <div
          onClick={() => setActive(item.isActive)}
          className={`flex items-center h-full cursor-pointer ${
            active === item.isActive
              ? `text-brand border-b-4  border-brand`
              : ""
          }`}>
          {item.icon}
        </div>
      ))}
    </div>
  );
}

export default TopNavigation;
