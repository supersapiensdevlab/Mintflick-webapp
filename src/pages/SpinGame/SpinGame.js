import React, { useEffect, useRef, useState } from 'react';
import './SpinGame.css';
function SpinGame() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [win, setWin] = useState(null);
  const [fruit1, setFruit1] = useState('🍒');
  const [fruit2, setFruit2] = useState('🍒');
  const [fruit3, setFruit3] = useState('🍒');
  const [rolling, setRolling] = useState(false);
  let slotRef = [useRef(null), useRef(null), useRef(null)];
  const fruits = ['🍒', '🍉', '🍊', '🍓', '🍇', '🥝'];

  useEffect(() => {
    if (isSpinning) {
      console.log('spinning')
      if (fruit1 === fruit2 && fruit2 === fruit3) {
        setWin(true);
        console.log('holaaa')
      }
    }
  }, [fruit1, fruit2, fruit3]);
  // to trigger roolling and maintain state
  const roll = () => {
    setRolling(true);
    setIsSpinning(true);

    setTimeout(() => {
      setRolling(false);
    }, 700);

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
      <h1 className='text-center text-4xl text-white py-6'>Make a spin</h1>
      <div className="SlotMachine">
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[0]}>
              {fruits.map((fruit, i) => (
                <div key={i}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[1]}>
              {fruits.map((fruit) => (
                <div key={Math.random()}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[2]}>
              {fruits.map((fruit) => (
                <div key={Math.random()}>
                  <span>{fruit}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div
          className={!rolling ? 'roll rolling m-auto' : 'roll m-auto'}
          onClick={!rolling && roll}
          disabled={rolling}
        >
          {rolling ? 'Rolling...' : 'ROLL'}
        </div>
        {win && <div className="mt-5 text-center text-2xl text-white">You Won</div>}
      </div>
    </div>
  );
}

export default SpinGame;
