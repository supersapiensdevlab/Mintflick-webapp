import React, { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';
import axios from 'axios';

const NFTAudioPlayer = ({ track, cardDetails, user, trackId }) => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const progressBarMobile = useRef();
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

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

  const trackStarted = () => {
    console.log(duration);
    const time = Math.floor(duration / 3);
    // console.log(time);
    // console.log(currentTime);
    if (currentTime > time) {
      if (user ? user.username !== cardDetails.user.username : false) {
        //   const timer = setTimeout(() => {
        const trackDetails = {
          trackusername: `${cardDetails.user.username}`,
          trackindex: `${trackId}`,
          viewed_user: `${user.username}`,
        };

        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_SERVER_URL}/user/plays`,
          headers: {
            'content-type': 'application/json',
            'auth-token': localStorage.getItem('authtoken'),
          },
          data: trackDetails,
        }).then(function (response) {});
        //   }, time);
        //   return () => clearTimeout(timer);
      }
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changeRangeMobile = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      '--seek-before-width',
      `${(progressBar.current.value / duration) * 100}%`,
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 5);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - -5);
    changeRange();
  };

  return (
    <div className="w-full h-max ">
      <div className="flex flex-col w-full ">
        <div className="flex justify-center items-center mb-4 ">
          {/* current time */}
          <div className="text-xs md:text-sm">{calculateTime(currentTime)}</div>

          {/* progress bar */}
          <div className="md:contents hidden z-0">
            <input
              type="range"
              className={`${styles.progressBar} mx-2 z-0`}
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
            />
          </div>

          <div className="md:hidden block">
            <input
              type="range"
              className={`${styles.progressBarMobile} md:mx-2 mx-1`}
              defaultValue="0"
              ref={progressBarMobile}
              onChange={changeRangeMobile}
            />
          </div>

          {/* duration */}
          <div className="text-xs md:text-sm">
            {duration && !isNaN(duration) && calculateTime(duration)}
          </div>
        </div>
        <div className="flex w-full justify-center">
          <audio ref={audioPlayer} src={track} preload="metadata"></audio>
          <button className={styles.forwardBackward} onClick={backThirty}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>
          <button
            onClick={() => {
              togglePlayPause();
              trackStarted();
            }}
            className="bg-white md:h-16 md:w-16 h-12 w-12 flex justify-center items-center rounded-full mx-3"
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="md:h-14 md:w-14 h-11 w-11 text-dbeats-light"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="md:h-14 md:w-14 h-11 w-11 text-dbeats-light "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
          <button className={styles.forwardBackward} onClick={forwardThirty}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTAudioPlayer;
