import React, { useEffect, useRef, useState } from "react";
import banner1 from "../../Assets/Gaming Posters/Banner4.png";
import banner2 from "../../Assets/Gaming Posters/Banner5.jpg";
import banner3 from "../../Assets/Gaming Posters/Banner3.jpg";
import banner4 from "../../Assets/Gaming Posters/Banner6.jfif";
import banner5 from "../../Assets/Gaming Posters/Banner7.jpg";
import banner6 from "../../Assets/Gaming Posters/Banner8.jpg";

function LiveBanners() {
  const colors = ["#0088FE", "#00C49F", "#FFBB28"];
  const banners = [banner1, banner2, banner3, banner4, banner5, banner6];
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
    <div className="p-2 w-full h-52 rounded-xl bg-slate-100 dark:bg-slate-800">
      <div className="slideshow relative">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 102}%, 0, 0)` }}
        >
          {banners.map((backgroundColor, index) => (
            <div className="slide" key={index}>
              <img
                src={backgroundColor}
                className="w-full h-full object-cover"
              ></img>
            </div>
          ))}
        </div>

        <div className="slideshowDots absolute bottom-0 left-1/2 -translate-x-1/2">
          {colors.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveBanners;
