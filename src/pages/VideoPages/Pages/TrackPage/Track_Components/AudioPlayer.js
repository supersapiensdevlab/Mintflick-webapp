import React, { useState, useRef, useEffect } from 'react';
import Waves from './Visual';

const AudioPlayer = ({ userData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useRef();
  const progressRef = useRef();
  const animationRef = useRef();
  const lableRef = useRef();
  const [duration, setDuration] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [hidePlay, setHidePlay] = useState(true);

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressRef.current.max = seconds;
    // eslint-disable-next-line
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  useEffect(() => {
    const newValue = Number(
      ((progressRef.current.value - progressRef.current.min) * 100) /
        (progressRef.current.max - progressRef.current.min),
    );
    //const newPosition = 10 - newValue * 0.2;
    lableRef.current.innerHTML = `<span className="p-5 bg-white">${calculateTime(
      progressRef.current.value,
    )}</span>`;
    lableRef.current.style.marginLeft = `calc(${newValue - 2}%)`;
  }, [currentTime]);

  // useEffect(() => {
  //   togglePlayPause();
  // }, []);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMin}:${returnedSec}`;
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressRef.current.value;
    changePlayerCurrentTime();
  };

  const whilePlaying = () => {
    if (audioPlayer.current) {
      progressRef.current.value = audioPlayer.current.currentTime;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changePlayerCurrentTime = () => {
    progressRef.current.style.setProperty(
      '--seek-before-width',
      `${(progressRef.current.value / duration) * 100}%`,
    );
    setCurrentTime(progressRef.current.value);
  };

  const seekBack = () => {
    progressRef.current.value = Number(progressRef.current.value - 10);
    changeRange();
  };
  const seekForward = () => {
    progressRef.current.value = Number(progressRef.current.value - -10);
    changeRange();
  };

  return (
    <>
      <div>
        <Waves
          src={userData.link}
          isPlaying={isPlaying}
          currentTime={currentTime}
          setIsPlaying={setIsPlaying}
          setHidden={setHidePlay}
        />
      </div>
      <audio ref={audioPlayer} src={userData.link} muted={true}></audio>
      <div className="flex items-center">
        <div className="flex justify-around items-center w-96 pt-5">
          <button onClick={seekBack}>
            <i className="text-3xl fas fa-backward"></i>
          </button>
          <button onClick={togglePlayPause} hidden={hidePlay}>
            {isPlaying ? (
              <i className="text-5xl far fa-pause-circle"></i>
            ) : (
              <i className="text-5xl far fa-play-circle"></i>
            )}
          </button>
          <button onClick={seekForward}>
            <i className="text-3xl fas fa-forward"></i>
          </button>
        </div>

        {/* progress bar */}
        <div className="group flex w-full items-end">
          <div className="px-2 text-lg font-bold">{calculateTime(currentTime)}</div>
          <div className={`w-full`}>
            <div className="range-value opacity-0 group-hover:opacity-100" ref={lableRef}></div>
            <input
              ref={progressRef}
              type="range"
              defaultValue="0"
              onChange={changeRange}
              className="appearance-none 
              rounded-full h-5 w-full bg-gradient-to-r 
              from-green-400 to-blue-500 
              font-white overflow-hidden cursor-pointer"
            />
          </div>
          <div className="px-2 text-lg font-bold">
            {duration && !isNaN(duration) && calculateTime(duration)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
