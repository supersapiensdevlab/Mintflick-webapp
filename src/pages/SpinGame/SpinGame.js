import { random } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import './SpinGame.css';
import Confetti from './Confetti';
function SpinGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState(null);
  const fruits = ['🍒', '🍉', '🍊', '🍓', '🍇', '🥝', '🍭'];

  const [fruit1, setFruit1] = useState('🍉');
  const [fruit2, setFruit2] = useState('🍓');
  const [fruit3, setFruit3] = useState('🍇');
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
    win ? setWin(false) : null;
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
    <div className="dark text-center mt-32 relative">
      <h1 className="text-center text-4xl text-white py-6">Make a spin 🎰</h1>
      <Confetti spray={win} />
      <div className="SlotMachine">
        <div className="slot mx-1">
          <section>
            <div className=" container bg-dbeats-dark-alt " ref={slotRef[0]}>
              {fruits.map((fruit, i) => (
                <div key={i}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot mx-1">
          <section>
            <div className="container bg-dbeats-dark-alt" ref={slotRef[1]}>
              {fruits.map((fruit) => (
                <div key={Math.random()}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot mx-1">
          <section>
            <div className="container bg-dbeats-dark-alt shadow-md" ref={slotRef[2]}>
              {fruits.map((fruit) => (
                <div key={Math.random()}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div
          onClick={!rolling && roll}
          disabled={rolling}
          className="  transform-gpu  w-max  mx-auto   transition-all duration-300 ease-in-out mt-3 cursor-pointer
             items-center justify-center p-1   overflow-hidden 
            font-medium text-gray-900 rounded-full   bg-gradient-to-br 
           from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary  
            hover:nm-inset-dbeats-dark-primary   hover:text-white dark:text-white  "
        >
          <span className="relative px-12 py-5 whitespace-nowrap font-bold text-xl   bg-gradient-to-br from-dbeats-light to-dbeats-secondary-light hover:nm-inset-dbeats-secondary-light  rounded-full">
            {rolling ? 'Rolling...' : 'Spin 🎲'}
          </span>
        </div>

        {win && <div className="mt-5 text-center text-2xl text-white">You Won</div>}
      </div>
    </div>
  );
}

export default SpinGame;
