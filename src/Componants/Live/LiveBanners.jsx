import React, { useEffect, useRef, useState } from "react";

import livestream from "../../Assets/Onboarding/livestream.webp";
import tickets from "../../Assets/Onboarding/tickets.webp";
import social from "../../Assets/Onboarding/social.webp";
import Marquee from "react-fast-marquee";

function LiveBanners() {
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const banners = [livestream, tickets, social];
  const delay = 2500;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="p-2 w-full   rounded-xl  relative">
      <div className="absolute top-0 left-2 h-full w-12 bg-gradient-to-r from-white dark:from-slate-900 z-10"></div>
      <div className="absolute top-0 right-2 h-full w-12 bg-gradient-to-r from-white dark:from-slate-900 z-10 rotate-180"></div>
      <Marquee gradient={false} speed={70} className="w-full">
        <div className="flex w-full items-center justify-center  ">
          {banners.map((backgroundColor, index) => (
            <div
              className="mx-2 aspect-video h-24 md:h-36 rounded-md overflow-clip"
              key={index}
            >
              <img
                src={backgroundColor}
                alt=""
                className="h-full w-full object-cover"
              ></img>
            </div>
          ))}{" "}
        </div>
      </Marquee>
    </div>
  );
}

export default LiveBanners;
