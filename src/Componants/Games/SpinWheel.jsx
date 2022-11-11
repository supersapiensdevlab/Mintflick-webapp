import React from "react";
import WheelComponent from "react-wheel-of-prizes";
import Lottie from "lottie-react";
import wheel from "../../Assets/graphics/wheel.json";
import fireworks from "../../Assets/graphics/fireworks.json";

const SpinWheel = () => {
  const segments = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    console.log(winner);
  };

  return (
    <div className="p-2 pt-20  h-screen w-acreen bg-slate-100 dark:bg-slate-800 overflow-y-hidden">
      <div className="h-full w-full">
        <div className="flex justify-center ml-52 -mt-20  w-full">
          <WheelComponent
            segments={segments}
            segColors={segColors}
            onFinished={(winner) => onFinished(winner)}
            primaryColor="black"
            contrastColor="white"
            buttonText="Spin"
            isOnlyOnce={false}
            size={200}
            upDuration={100}
            downDuration={1000}
          />
        </div>
        <Lottie
          className="w-1/2 absolute bottom-0 sm:h-1/2 right-1/2 -z-1"
          autoplay={true}
          loop={true}
          animationData={fireworks}
        />
        <Lottie
          className="w-1/2 absolute bottom-0 sm:h-1/2 left-1/2 -z-1"
          autoplay={true}
          loop={true}
          animationData={wheel}
        />
      </div>
    </div>
  );
};

export default SpinWheel;
