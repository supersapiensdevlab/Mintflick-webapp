import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
  At,
  DotsVertical,
  Heart,
  MessageCircle,
  PlayerPause,
  PlayerPlay,
  Share,
} from "tabler-icons-react";
import PolygonToken from "../../Assets/logos/PolygonToken";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";
import axios from "axios";

function Post(props) {

  // Common State and Functions
  const State = useContext(UserContext);
  const [gettingNFTData, setGettingNFTData] = useState(true);


  //// Only Track Specific States and Functions

  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sendPlays, setSendPlays] = useState(false);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer?.current?.duration);
    setDuration(seconds);
    if (progressBar.current) progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  useEffect(() => {
    if (props.currentPlay != props.myKey) {
      audioPlayer.current?.pause();
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    }
  }, [props.currentPlay]);

  const togglePlayPause = () => {
    console.log('toggleing')
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      props.setCurrentPlay(props.myKey);
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (!sendPlays) {
      trackStarted();
    }
    if(currentTime == duration){
      setIsPlaying(false)
    }
  }, [currentTime]);

  const trackStarted = async () => {
    const time = Math.floor(duration / 3);
    if (currentTime > time) {
      if (State.database.userData.data.user ? State.database.userData.data.user.username !== props.profileUsername : false) {
        //   const timer = setTimeout(() => {
        const trackDetails = {
          trackusername: `${props.profileUsername}`,
          trackindex: `${props.trackId}`,
          viewed_user: `${State.database.userData.data.user.username}`,
        };

        await axios({
          method: 'POST',
          url: `${process.env.REACT_APP_SERVER_URL}/user/plays`,
          headers: {
            'content-type': 'application/json',
            'auth-token': JSON.stringify(State.database.userData.data.jwtToken),
          },
          data: trackDetails,
        }).then(function (response) {
          setSendPlays(true);
        });
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

  //// Track End



  return (
    <div className="w-full h-fit lg:bg-slate-100 lg:dark:bg-slate-800 lg:rounded-xl p-4 lg:p-8 space-y-4 pb-4 border-b-2 lg:border-none  border-slate-200 dark:border-slate-900">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={props.profilePic}
            alt="Tailwind-CSS-Avatar-component"
          />
          <div>
            <p className="font-semibold text-base text-brand1">
              {props.profileName}
            </p>
            <p className="font-normal text-xs text-brand4">{props.timestamp}</p>
          </div>
        </div>
        <div className=" ">
          <div className="dropdown dropdown-end">
            <label
              tabindex="0"
              className="btn btn-ghost btn-circle dark:hover:bg-slate-700"
            >
              <DotsVertical className=""></DotsVertical>
            </label>
            <ul
              tabindex="0"
              className="menu menu-compact dropdown-content p-1 shadow bg-slate-100 dark:bg-slate-600 text-brand1 rounded-lg w-52"
            >
              <li>
                <a>Report</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="font-normal text-base text-brand2 w-full">{props.text}</p>
      {props.contentType === "post" && (
        <div className=" w-full h-fit z-10">
          {props.image && (
            <img
              className="w-full rounded-lg"
              src={props.image}
              alt="User Post"
            />
          )}
        </div>
      )}
      {props.contentType === "track" && (
        <div className="flex w-full h-fit z-10 bg-slate-200 dark:bg-slate-700 rounded-l-lg rounded-r-lg overflow-hidden">
          <img
            className="h-28 w-28 object-cover"
            src={props.trackImage}
            alt="Track image"
          />
          <div className="flex flex-col p-3 h-28 flex-grow ">
            <div className="flex flex-col h-full">
              <span className="text-brand3 text-base font-semibold">
                {props.trackName}
              </span>
              <span className="text-brand4 text-sm font-medium">
                {props.trackDisc}
              </span>
            </div>
            <div className="flex flex-grow w-full items-center gap-2">
              <audio ref={audioPlayer} src={props.trackUrl} preload="metadata"></audio>
              <span className="text-brand2 text-base font-medium">{calculateTime(currentTime)}</span>
              <input
                type="range"
                defaultValue="0"
                min="0"
                max="100"
                class="w-full   bg-slate-300 dark:bg-slate-600 appearance-none rounded-full range range-primary range-xs"
                ref={progressBar}
                onChange={changeRange}
              />

              <span className="text-brand2 text-base font-medium">
                {duration && !isNaN(duration) && calculateTime(duration)}
              </span>

              <label class="btn btn-circle btn-sm btn-ghost swap swap-rotate " >
                <input type="checkbox" checked={isPlaying} />
                <PlayerPlay class="swap-off " onClick={() => {
                  togglePlayPause();
                }}></PlayerPlay>
                <PlayerPause class="swap-on " onClick={() => {
                  togglePlayPause();
                }}></PlayerPause>
              </label>
            </div>
          </div>
        </div>
      )}
      {props.contentType === "track" && <div className="text-gray-400">{props.trackPlays ? props.trackPlays.length : 0} plays</div>}
      {props.contentType === "video" && (
        <div className=" w-full h-fit z-10">video</div>
      )}
      <div
        className={
          props.tokenId && !gettingNFTData
            ? "cursor-pointer flex items-center justify-start rounded-lg space-x-2 text-brand2"
            : "hidden"
        }
      >
        <p className="font-bold text-sm text-primary">Owner</p>
        <At size={20}></At>
        <p className=" font-semibold text-sm ">{props.ownerId}</p>
        <div className=" flex flex-grow  h-fit  items-center justify-end rounded-full ">
          <div className="flex h-fit w-fit items-center justify-end  btn-primary btn-outline rounded-full p-1">
            <PolygonToken></PolygonToken>
            <p className="text-sm  mx-1">{props.price}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer flex items-center text-rose-700 space-x-2">
            <Heart></Heart>
            <p className="font-medium text-sm ">
              {props.likes ? props.likes.length : ""}
            </p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-brand1">
            <MessageCircle></MessageCircle>
            <p className="font-medium text-sm text-brand3">
              {props.comments ? props.comments.length : ""}
            </p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-brand1">
            <Share></Share>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
