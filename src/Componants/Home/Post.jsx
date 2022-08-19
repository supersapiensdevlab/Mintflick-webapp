import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
  ArrowNarrowRight,
  At,
  DotsVertical,
  Heart,
  MessageCircle,
  PlayerPause,
  PlayerPlay,
  Send,
  Share,
} from "tabler-icons-react";
import PolygonToken from "../../Assets/logos/PolygonToken";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";
import axios from "axios";
import ReactPlayer from "react-player";

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
  //comment
  const [text, setText] = useState("");
  const [showCommentInput, setshowCommentInput] = useState(false);

  //comments
  const [showComments, setshowComments] = useState(false);

  function handleOnEnter() {
    alert(text);
  }

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
    if (currentTime == duration) {
      setIsPlaying(false);
    }
  }, [currentTime]);

  const trackStarted = async () => {
    const time = Math.floor(duration / 3);
    if (currentTime > time) {
      if (
        State.database.userData.data.user
          ? State.database.userData.data.user.username !== props.profileUsername
          : false
      ) {
        //   const timer = setTimeout(() => {
        const trackDetails = {
          trackusername: `${props.profileUsername}`,
          trackindex: `${props.trackId}`,
          viewed_user: `${State.database.userData.data.user.username}`,
        };

        await axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/user/plays`,
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(State.database.userData.data.jwtToken),
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
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
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

  //// Only Track Specific States and Functions

  const videoStarted = () => {
    if (
      State.database.userData.data.user
        ? State.database.userData.data.user.username !== props.profileUsername
        : false
    ) {
      const timer = setTimeout(() => {
        const videoDetails = {
          videousername: `${props.profileUsername}`,
          videoindex: `${props.videoId}`,
          viewed_user: `${State.database.userData.data.user.username}`,
        };

        axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/user/views`,
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(State.database.userData.data.jwtToken),
          },
          data: videoDetails,
        }).then(function (response) {});
      }, 5000);
      return () => clearTimeout(timer);
    }
  };

  //// Video End

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
        <div className=" w-full h-fit z-10 space-y-2">
          {props.image && (
            <img
              className="w-full rounded-lg"
              src={props.image}
              alt="User Post"
            />
          )}
          <div className="text-brand4 text-sm space-x-2">
            <span
              onClick={() => setshowComments(!showComments)}
              className="cursor-pointer"
            >
              {props.comments ? props.comments.length : 0} Comments
            </span>
          </div>
        </div>
      )}
      {props.contentType === "track" && (
        <>
          {" "}
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
                <audio
                  ref={audioPlayer}
                  src={props.trackUrl}
                  preload="metadata"
                ></audio>
                <span className="text-brand2 text-base font-medium">
                  {calculateTime(currentTime)}
                </span>
                <input
                  type="range"
                  defaultValue="0"
                  min="0"
                  max="100"
                  className="w-full  p-2 bg-slate-300 dark:bg-slate-600 appearance-none rounded-full range range-primary range-xs"
                  ref={progressBar}
                  onChange={changeRange}
                />

                <span className="text-brand2 text-base font-medium">
                  {duration && !isNaN(duration) && calculateTime(duration)}
                </span>

                <label class="btn btn-circle btn-sm btn-ghost swap swap-rotate ">
                  <input type="checkbox" checked={isPlaying} />
                  <PlayerPlay
                    class="swap-off "
                    onClick={() => {
                      togglePlayPause();
                    }}
                  ></PlayerPlay>
                  <PlayerPause
                    class="swap-on "
                    onClick={() => {
                      togglePlayPause();
                    }}
                  ></PlayerPause>
                </label>
              </div>
            </div>
          </div>{" "}
          <div className="text-brand4 text-sm space-x-2">
            <span>{props.trackPlays ? props.trackPlays.length : 0} plays</span>
            <span
              onClick={() => setshowComments(!showComments)}
              className="cursor-pointer"
            >
              {props.comments ? props.comments.length : 0} Comments
            </span>
          </div>
        </>
      )}

      {props.contentType === "video" && (
        <>
          <div className=" w-full h-fit z-10 rounded-lg overflow-clip">
            <ReactPlayer
              className="w-full h-full max-h-screen "
              width="100%"
              height="400px"
              playing={true}
              muted={true}
              volume={0.5}
              light={props.videoImage}
              url={props.videoUrl}
              controls={true}
              onStart={() => {
                videoStarted();
              }}
            />
          </div>
          <div className="text-brand4 text-sm space-x-2">
            <span>{props.videoViews ? props.videoViews.length : 0} views</span>
            <span
              onClick={() => setshowComments(!showComments)}
              className="cursor-pointer"
            >
              {props.comments ? props.comments.length : 0} Comments
            </span>
          </div>
        </>
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
          <div
            onClick={() => setshowCommentInput(!showCommentInput)}
            className="cursor-pointer flex items-center space-x-2 text-brand1"
          >
            <MessageCircle></MessageCircle>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-brand1">
            <Share></Share>
          </div>
        </div>
      </div>
      {showCommentInput && (
        <div className="flex gap-2">
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type here..."
            className="input w-full "
          />

          <button
            onClick={() => text && handleOnEnter()}
            className="btn  btn-primary btn-outline"
          >
            <ArrowNarrowRight />
          </button>
        </div>
      )}
      {showComments && props.comments && (
        <div className=" justify-between w-full space-y-2">
          {props.comments.map((comment) => (
            <div className="w-full flex items-start space-x-1">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="profile pic"
                className="h-8 w-8 object-cover rounded-full mt-1"
              />
              <div className="flex flex-col">
                <p className=" text-brand5 text-sm font-medium">
                  <span className="text-brand4 font-semibold mr-1">
                    user name
                  </span>
                  {comment.comment}
                </p>
                <div className="cursor-pointer flex  items-center text-brand5  text-xs">
                  <Heart size={14}></Heart>like
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Post;
