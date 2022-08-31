import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
  AlertOctagon,
  ArrowNarrowRight,
  At,
  CircleCheck,
  Comet,
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
import ReactPlayer from "react-player";
import moment from "moment";
import AllComments from "./AllComments/AllComments";
import defaultProPic from "../../Assets/profile-pic.png";
import useUserActions from "../../Hooks/useUserActions";
function Post(props) {
  // Common State and Functions
  const State = useContext(UserContext);
  const [loadFeed] = useUserActions();

  const [videoLikes, setVideoLikes] = useState(0);
  const [videoLiked, setVideoLiked] = useState(null);

  const [trackLikes, setTrackLikes] = useState(0);
  const [trackLiked, setTrackLiked] = useState(null);

  const [postLikes, setPostLikes] = useState(0);
  const [postLiked, setPostLiked] = useState(null);

  const [pollLikes, setPollLikes] = useState(0);
  const [pollLiked, setPollLiked] = useState(null);

  const [pollChoice, setPollChoice] = useState(0);
  const [pollVotes, setPollVotes] = useState(0);
  const [pollVoted, setPollVoted] = useState(null);

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
  const [commentCount, setCommentCount] = useState(0);
  // local comments
  const [myComments, setMyComments] = useState([]);

  //comments
  const [showComments, setshowComments] = useState(false);

  const videoRef = useRef();

  useEffect(() => {
    if (props.comments) {
      setCommentCount(props.comments.length);
    }
  }, [props.comments]);
  async function handleOnEnter() {
    if (State.database.userData.data.user && text !== "") {
      let data = {
        user_data_id: props.profileuser_id,
        content: props.content,
        comment: text,
      };
      axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/user/addcomment`,
        data: data,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
        .then((res) => {
          setText("");
          setMyComments((myComments) => [
            {
              comment: text,
              _id: res.data.id,
              user_id: State.database.userData.data.user._id,
              likes: [],
              profile_image: State.database.userData.data.user.profile_image,
              username: State.database.userData.data.user.username,
              name: State.database.userData.data.user.name,
            },
            ...myComments,
          ]);
          setCommentCount((commentsNumber) => commentsNumber + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
      if (videoRef.current) {
        if (videoRef.current.getInternalPlayer()) {
          videoRef.current?.getInternalPlayer().pause();
        }
      }
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
    props.setCurrentPlay(props.myKey);
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

  // like section
  useEffect(() => {
    if (props.likes) {
      if (props.postId) {
        setPostLikes(props.likes.length);
      } else if (props.videoId) {
        setVideoLikes(props.likes.length);
      } else if (props.pollId) {
        setPollLikes(props.likes.length);
        setPollVotes(props.votes.length);
      } else {
        setTrackLikes(props.likes.length);
      }
    }

    if (props.content.pollId) {
      if (
        props.content.votes &&
        props.content.votes.length > 0 &&
        props.content.votes.includes(
          State.database.userData.data?.user.username
        )
      ) {
        setPollVoted(true);
        for (let i = 0; i < props.content.options.length; i++) {
          if (
            props.content.options[i].selectedBy.includes(
              State.database.userData.data.user.username
            )
          ) {
            setPollChoice(i);
            break;
          }
        }
      } else {
        setPollVoted(false);
      }
    }
    if (
      props.likes &&
      State.database.userData.data &&
      props.likes.includes(State.database.userData.data.user.username)
    ) {
      if (props.trackId) {
        setTrackLiked(true);
      } else if (props.postId) {
        setPostLiked(true);
      } else if (props.videoId) {
        setVideoLiked(true);
      } else if (props.pollId) {
        setPollLiked(true);
      }
    } else {
      if (props.trackId) {
        setTrackLiked(false);
      } else if (props.postId) {
        setPostLiked(false);
      } else if (props.videoId) {
        setVideoLiked(false);
      } else if (props.pollId) {
        setPollLiked(false);
      }
    }
  }, [props.likes, State.database.userData.data]);
  const handleVideoLikes = () => {
    let videotemp = videoLiked;
    setVideoLiked(!videoLiked);
    if (videotemp) {
      setVideoLikes((l) => l - 1);
    } else {
      setVideoLikes((l) => l + 1);
    }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      videousername: `${props.profileUsername}`,
      videoId: `${props.videoId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/videoreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleTrackLikes = () => {
    let tracktemp = trackLiked;
    setTrackLiked(!trackLiked);
    if (tracktemp) {
      setTrackLikes((l) => l - 1);
    } else {
      setTrackLikes((l) => l + 1);
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      trackusername: `${props.profileUsername}`,
      trackId: `${props.trackId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/trackreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollLikes = () => {
    let polltemp = pollLiked;
    setPollLiked(!pollLiked);
    if (polltemp) {
      setPollLikes((l) => l - 1);
    } else {
      setPollLikes((l) => l + 1);
    }
    // if (pollLikes.includes(user.username)) {
    //   let newArr = pollLikes.filter((item, index) => item != user.username);
    //   setpollLikes(newArr);
    //   set
    // } else {
    //   let temp = pollLikes;
    //   temp.push(user.username);
    //   setpollLikes(temp);
    //   console.log(pollLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      pollusername: `${props.profileUsername}`,
      pollId: `${props.pollId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/pollreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePostLikes = () => {
    let posttemp = postLiked;
    setPostLiked(!postLiked);
    if (posttemp) {
      setPostLikes((l) => l - 1);
    } else {
      setPostLikes((l) => l + 1);
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      postusername: `${props.profileUsername}`,
      postId: `${props.postId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/postreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollVote = (choice) => {
    console.log(pollVoted, choice);
    if (!pollVoted) {
      setPollVotes(pollVotes + 1);
      console.log("pollVotes inc", pollVotes);
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const voteData = {
      reactusername: `${State.database.userData.data.user.username}`,
      pollusername: `${props.profileUsername}`,
      pollId: `${props.pollId}`,
      voted: `${choice}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/pollVote`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: voteData,
    })
      .then(async function (response) {
        setPollVoted(true);
        setPollChoice(choice);
        if (response) {
          ////console.log(response);
          await loadFeed();
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-fit lg:bg-slate-100 lg:dark:bg-slate-800 lg:rounded-xl p-4 lg:p-8 space-y-4 pb-4 border-b-2 lg:border-none  border-slate-200 dark:border-slate-900">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {props.profilePic ? (
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={props.profilePic}
              alt={props.profileName}
            />
          ) : (
            <div class="avatar placeholder">
              <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
                <span class="text-3xl uppercase">
                  {props.profileName.slice(0, 1)}
                </span>
              </div>
            </div>
          )}

          <div>
            <p className="font-semibold text-base text-brand1">
              {props.profileName}
            </p>
            <p className="font-normal text-xs text-brand4">
              {moment(props.timestamp * 1000).fromNow()}
            </p>
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
              className="menu menu-compact dropdown-content p-1 shadow-xl bg-slate-100 dark:bg-slate-600  text-brand3 font-semibold rounded-lg w-48 "
            >
              <li>
                <a className="dark:hover:bg-slate-800">
                  <Comet className="-rotate-90" /> Join Superfan
                </a>
              </li>
              <li
                onClick={() =>
                  State.updateDatabase({
                    reportModalOpen: true,
                    reportPostUrl: "",
                  })
                }
              >
                <a className="hover:bg-rose-500">
                  <AlertOctagon />
                  Report
                </a>
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
            {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
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
            {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
          </div>
        </>
      )}

      {props.contentType === "poll" && (
        <div className="w-full">
          <div className="font-normal text-base text-brand2 w-full">
            {props.content.question}
          </div>
          {props.content.options.map((option, i) => {
            return (
              <div
                key={i}
                onClick={() => {
                  if (
                    !pollVoted &&
                    !props.content.votes.includes(
                      State.database.userData.data.user.username
                    )
                  ) {
                    handlePollVote(i);
                  }
                }}
                className={`${
                  option.selectedBy &&
                  option.selectedBy.includes(
                    State.database.userData.data?.user.username
                  ) &&
                  pollChoice === i
                    ? " bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700 bg-no-repeat"
                    : pollVoted &&
                      " bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700 bg-no-repeat "
                } my-2 flex gap-2 p-2  border-2 rounded-lg border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 justify-between `}
                style={{
                  backgroundSize: `${Math.ceil(
                    (option.selectedBy.length / props.votes.length) * 100
                  )}% 100%`,
                }}
              >
                <span className="w-full text-brand1 dark:text-brand2 ">
                  {option.option}{" "}
                  {props.votes &&
                  props.votes.includes(
                    State.database.userData.data?.user.username
                  ) ? (
                    <span className="text-sm text-brand4">
                      {Math.ceil(
                        (option.selectedBy.length / props.votes.length) * 100
                      )}
                      %
                    </span>
                  ) : null}
                </span>
                {/* <span
                  className={`absolute left-0 h-full bg-slate-400 dark:bg-slate-900 w-4`}
                ></span> */}
                <div className="text-success">
                  {option.selectedBy &&
                  option.selectedBy.includes(
                    State.database.userData.data?.user.username
                  ) ? (
                    <div className="flex">
                      voted&nbsp;
                      <CircleCheck />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
          <div className="text-brand4 text-sm space-x-2">
            <span>{pollVotes}&nbsp; Votes</span>
            {/* <span
            onClick={() => setshowComments(!showComments)}
            className='cursor-pointer'>
            {commentCount} Comments
          </span> */}
          </div>
        </div>
      )}

      {props.contentType === "video" && (
        <>
          <div className="font-normal text-base text-brand2 w-full">
            {props.content.videoName}
          </div>
          <div className="font-normal text-base text-brand5 w-full">
            {props.content.description}
          </div>

          <div className=" w-full h-fit z-10 rounded-lg overflow-clip">
            <ReactPlayer
              ref={videoRef}
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
            {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
          </div>
        </>
      )}
      <div
        className={
          props.tokenId && !props.gettingNFTData
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
          {props.contentType === "post" && (
            <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
              <Heart
                className={`${
                  postLiked
                    ? "text-red-600 hover:text-white fill-rose-600"
                    : "text-brand1 hover:text-red-600"
                }`}
                onClick={handlePostLikes}
              ></Heart>
              <p className="font-medium text-sm ">{postLikes}</p>
            </div>
          )}
          {props.contentType === "video" && (
            <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
              <Heart
                className={`${
                  videoLiked
                    ? "text-red-600 hover:text-white fill-rose-600"
                    : "text-brand1 hover:text-red-600"
                }`}
                onClick={handleVideoLikes}
              ></Heart>
              <p className="font-medium text-sm ">{videoLikes}</p>
            </div>
          )}
          {props.contentType === "track" && (
            <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
              <Heart
                className={`${
                  trackLiked
                    ? "text-red-600 hover:text-white fill-rose-600"
                    : "text-brand1 hover:text-red-600"
                }`}
                onClick={handleTrackLikes}
              ></Heart>
              <p className="font-medium text-sm ">{trackLikes}</p>
            </div>
          )}
          {props.contentType === "poll" && (
            <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
              <Heart
                className={`${
                  pollLiked
                    ? "text-red-600 hover:text-white fill-rose-600"
                    : "text-brand1 hover:text-red-600"
                }`}
                onClick={handlePollLikes}
              ></Heart>
              <p className="font-medium text-sm ">{pollLikes}</p>
            </div>
          )}

          <div
            onClick={() => {
              setshowCommentInput(!showCommentInput);
              setshowComments(!showComments);
            }}
            className="cursor-pointer flex items-center space-x-2 text-brand1"
          >
            <MessageCircle></MessageCircle>
            <p className="font-medium text-sm ">{commentCount}</p>
          </div>
          <div
            onClick={() => State.updateDatabase({ shareModalOpen: true })}
            className="cursor-pointer flex items-center space-x-2 text-brand1"
          >
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
            value={text}
          />

          <button
            onClick={() => text && handleOnEnter()}
            className="btn  btn-primary btn-outline"
          >
            <ArrowNarrowRight />
          </button>
        </div>
      )}

      {showComments && (props.comments || myComments.length > 0) ? (
        <AllComments
          myComments={myComments}
          user_id={props.profileuser_id}
          contentData={props.content}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default Post;
