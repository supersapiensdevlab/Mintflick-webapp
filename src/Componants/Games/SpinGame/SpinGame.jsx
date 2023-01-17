import { random } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import "./SpinGame.css";
import Confetti from "./Confetti";

import useWindowSize from "react-use-window-size";
import Lottie from "lottie-react";
import wheel from "../../../Assets/graphics/wheel.json";

import fireworks from "../../../Assets/graphics/fireworks.json";
import { Link } from "react-router-dom";
import { ChevronLeft } from "tabler-icons-react";

function SpinGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState(null);
  const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝", "🍭"];

  const [fruit1, setFruit1] = useState("🍉");
  const [fruit2, setFruit2] = useState("🍓");
  const [fruit3, setFruit3] = useState("🍇");
  const [rolling, setRolling] = useState(false);
  let slotRef = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isSpinning) {
      //console.log('spinning');
      if (fruit1 === fruit2 && fruit2 === fruit3) {
        setWin(true);
        //console.log('holaaa');
      }
    }
  }, [fruit1, fruit2, fruit3]);
  // to trigger roolling and maintain state
  const roll = () => {
    setRolling(true);
    setIsSpinning(true);
    if (win) {
      setWin(false);
    }
    setTimeout(() => {
      setRolling(false);
    }, 400);

    // looping through all 3 slots to start rolling
    slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selected = triggerSlotRotation(slot.current);
      if (i + 1 == 1) setFruit1(selected);
      else if (i + 1 == 2) setFruit2(selected);
      else setFruit3(selected);
    });
  };

  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = (ref) => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;
    let randomOption = Math.floor(Math.random() * fruits.length);
    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return fruits[randomOption];
  };

  return (
    <>
      <Confetti spray={win} originX={0} originY={1} angle={45} />
      <Confetti spray={win} originX={0.5} originY={0.7} angle={90} />

      <Confetti spray={win} originX={1} originY={1} angle={120} />

      {/* <Confetti width={1920} height={1080} numberOfPieces={100} tweenDuration={10} recycle={true} /> */}
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
            SpinGame
          </span>
          {/* <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span> */}
        </div>
        <div className="flex-grow flex flex-col justify-center items-center w-full max-w-3xl">
          <h1 className="text-center text-4xl text-white py-6">
            Make a spin 🎰
          </h1>

          <div className="SlotMachine">
            <div className="spin__slot mx-1  ">
              <section className="spin__section border bg-mintie   rounded-lg">
                <div className=" spin__container   " ref={slotRef[0]}>
                  {fruits.map((fruit, i) => (
                    <div key={i}>
                      <span>{fruit}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="spin__slot mx-1">
              <section className="spin__section border bg-mintie   rounded-lg">
                <div
                  className="spin__container bg-dbeats-dark-alt"
                  ref={slotRef[1]}
                >
                  {fruits.map((fruit) => (
                    <div key={Math.random()}>
                      <span>{fruit}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className="spin__slot mx-1">
              <section className="spin__section border bg-mintie   rounded-lg">
                <div
                  className="spin__container bg-dbeats-dark-alt shadow-md"
                  ref={slotRef[2]}
                >
                  {fruits.map((fruit) => (
                    <div key={Math.random()}>
                      <span>{fruit}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <button
              onClick={!rolling && roll}
              disabled={rolling}
              className="  btn btn-brand btn-sm block mx-auto space-x-2 text-white w-32 mt-3"
            >
              <span className="text-white">
                {rolling ? "Rolling..." : "Spin 🎲"}
              </span>
            </button>

            {win && (
              <div className="mt-5 text-center text-2xl text-white">
                Hurray! You Won
              </div>
            )}
          </div>
        </div>{" "}
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
    </>
  );
}

export default SpinGame;
