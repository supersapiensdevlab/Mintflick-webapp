import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function LiveBanners() {
  return (
    <div className="p-2 w-full h-52 rounded-xl bg-slate-100 dark:bg-slate-800">
      <Splide
        aria-label="My Favorite Images"
        options={{
          rewind: true,
          perPage: 3,
          focus: "center",
          trimSpace: true,

          autoplay: true,
          pauseOnHover: true,
          gap: 2,
        }}
      >
        <SplideSlide>
          <div className="h-48 w-64 rounded-lg  bg-red-700"></div>
        </SplideSlide>
        <SplideSlide>
          <div className="h-48 w-64 rounded-lg bg-red-700"></div>
        </SplideSlide>
        <SplideSlide>
          <div className="h-48 w-64 rounded-lg bg-red-700"></div>
        </SplideSlide>
        <SplideSlide>
          <div className="h-48 w-64 rounded-lg bg-red-700"></div>
        </SplideSlide>
        <SplideSlide>
          <div className="h-48 w-64 rounded-lg bg-red-700"></div>
        </SplideSlide>
      </Splide>
    </div>
  );
}

export default LiveBanners;
