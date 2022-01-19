import React, { useEffect, useState, useRef } from 'react';
import { Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeMute from '@material-ui/icons/VolumeOff';

const BottomBar = ({ songDetails, playing, firstPlayed, setState }) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const progressRef = useRef();
  const audioPlayer = useRef();
  const volumeRef = useRef();
  const animationRef = useRef();
  const lableRef = useRef();

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [mute, setMute] = useState(false);

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    // eslint-disable-next-line
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  useEffect(() => {
    if (audioPlayer.current) {
      if (playing) {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
      }
    }

    // eslint-disable-next-line
  }, [playing, setState]);

  useEffect(() => {
    if (progressRef.current) {
      lableRef.current.innerHTML = `${calculateTime(progressRef.current.value)}`;
    }
  }, [currentTime]);

  const changeRange = () => {
    audioPlayer.current.currentTime = progressRef.current.value;
    changePlayerCurrentTime();
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMin}:${returnedSec}`;
  };

  const changeVolumeRange = () => {
    audioPlayer.current.volume = volumeRef.current.value / 100;
  };

  const whilePlaying = () => {
    if (audioPlayer.current && progressRef.current) {
      progressRef.current.value = audioPlayer.current.currentTime;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changePlayerCurrentTime = () => {
    if (progressRef.current) {
      progressRef.current.style.setProperty(
        '--seek-before-width',
        `${(progressRef.current.value / duration) * 100}%`,
      );
      setCurrentTime(progressRef.current.value);
    }
  };

  const seekForward = () => {
    progressRef.current.value = Number(progressRef.current.value - -10);
    changeRange();
  };

  return (
    <>
      <div
        className={`${darkMode && 'dark'}  font-proxima-reg bottom-20 pb-1.5 fixed z-100 
        w-full transition duration-1000 ease-in-out`}
      >
        <audio ref={audioPlayer} src={songDetails.songLink} muted={mute}></audio>

        <Transition
          show={firstPlayed}
          enter="transition ease-in-out duration-1000"
          enterFrom="transform opacity-0  -translate-y-full "
          enterTo="transform bg-opacity-100   translate-y-0 "
          leave="transition ease-in-out duration-500"
          leaveFrom="transform bg-opacity-100   translate-y-0"
          leaveTo="transform   opacity-0 -translate-y-full"
        >
          <div className={`${firstPlayed ? 'block' : 'hidden'}  `}>
            <span className="bg-white pb-2 bg-opacity-80 dark:bg-dbeats-dark pb-2 dark:bg-opacity-60">
              <input
                ref={progressRef}
                type="range"
                defaultValue="0"
                max={duration}
                onChange={changeRange}
                className="appearance-none cursor-pointer w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500  
                font-white rounded outline-none slider-thumb backdrop-filter  backdrop-blur-md"
              />
            </span>
            <div
              className=" h-32 pb-2 pl-2 bg-white shadow-sm z-100  absolute w-screen 
            dark:bg-dbeats-dark  dark:text-gray-100  
            bg-opacity-60 dark:bg-opacity-60 backdrop-filter  backdrop-blur-md"
            >
              <>
                <div className="flex justify-between  self-center    md:justify-start md:space-x-10">
                  <img
                    id="album-artwork"
                    src={songDetails.artwork}
                    className=" lg:mr-4 mr-1 h-20 w-20 self-center align-middle  "
                    alt=""
                  ></img>
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:w-full">
                    <div className="self-center truncate w-full">
                      <p className="text-ellipsis overflow-ellipsis capitalize font-bold whitespace-nowrap truncate">
                        {songDetails.songTitle}
                      </p>
                      <p className="capitalize whitespace-nowrap truncate">{songDetails.author}</p>
                    </div>
                    {/* <audio key={songLink} autoPlay>
                <source src={songLink} type="audio/mpeg" />
              </audio> */}

                    <div className="flex items-center md:self-center lg:justify-center w-full  ">
                      <div className="text-dbeats-alt dark:text-white lg:text-lg text-sm pr-3">
                        <span className="range-value " ref={lableRef}></span>
                        <span> / {duration && !isNaN(duration) && calculateTime(duration)}</span>
                      </div>
                      <div
                        onClick={setState}
                        className="cursor-pointer dark:hover:bg-dbeats-dark-secondary p-1 rounded"
                      >
                        {playing ? (
                          <i className="fas mx-3  text-xl fa-pause    "></i>
                        ) : (
                          <i className="fas mx-3 cursor-pointer text-xl fa-play   "></i>
                        )}
                      </div>

                      <i
                        className="fas mx-3 fa-step-forward cursor-pointer"
                        onClick={seekForward}
                      ></i>

                      <div className="flex md:visible invisible items-center">
                        {!mute ? (
                          <VolumeUp
                            className="cursor-pointer mx-1"
                            onClick={() => setMute(!mute)}
                          />
                        ) : (
                          <VolumeMute
                            className="cursor-pointer mx-1"
                            onClick={() => setMute(!mute)}
                          />
                        )}

                        <input
                          ref={volumeRef}
                          type="range"
                          defaultValue="50"
                          onChange={changeVolumeRange}
                          className="appearance-none ml-2 cursor-pointer w-full h-1.5 bg-gradient-to-r from-green-400 to-blue-500  
                        font-white rounded outline-none slider-thumb backdrop-filter  backdrop-blur-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
};
export default BottomBar;
