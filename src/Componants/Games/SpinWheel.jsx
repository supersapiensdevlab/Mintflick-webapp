import React from "react";
import WheelComponent from "react-wheel-of-prizes";
import Lottie from "lottie-react";
import wheel from "../../Assets/graphics/wheel.json";
import fireworks from "../../Assets/graphics/fireworks.json";
import { ChevronLeft } from "tabler-icons-react";
import { Link } from "react-router-dom";

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
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center justify-start">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <Link
          to={`/homescreen/allgames`}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </Link>
        <span className="text-xl font-bold text-brand1 mx-auto -translate-x-8">
          Spinwheel
        </span>
        {/* <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span> */}
      </div>
      <div className="flex justify-center ml-96    w-full">
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
      {/* <Lottie
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
        /> */}
    </div>
  );
};

export default SpinWheel;
