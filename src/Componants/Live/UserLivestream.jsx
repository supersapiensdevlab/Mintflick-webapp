import axios from "axios";
import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { useContext } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import JoinSuperfanModal from "../Home/Modals/JoinSuperfanModal";
import Loading from "../Loading/Loading";
import { ChevronLeft, Eye, Message, Share, X } from "tabler-icons-react";
import livePlaceholder from "../../Assets/Gaming Posters/liveplaceholder.jpg";
import LiveRoom from "./LiveRoom";
import UserLiveFullScreen from "./UserLiveFullScreen";
import superfan_logo from "../../Assets/logos/icons/superfans/superfan.svg";
import { Player } from "@livepeer/react";

import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
const socket = io(`${process.env.REACT_APP_VIEWS_URL}`, {
  autoConnect: false,
});

function UserLivestream() {
  const navigateTo = useNavigate();
  const { username } = useParams();
  const [streamUser, setStreamUser] = useState(null);
  // const streamUserInfo = useMemo(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_SERVER_URL}/user/${username}`)
  //     .then((value) => {
  //       console.log("memo called");
  //       //  setStreamUser(value.data);
  //       // for (let i = 0; i < value.data.follower_count.length; i++) {
  //       //   if (
  //       //     State.database.userData?.data
  //       //       ? value.data.follower_count[i] ===
  //       //         State.database.userData.data?.user.username
  //       //       : false
  //       //   ) {
  //       //     setSubscribeButtonText("Unfollow");
  //       //   }
  //       // }
  //       return value.data;
  //     });
  // }, []);

  const State = useContext(UserContext);

  const [joinsuperfanModalOpen, setJoinsuperfanModalOpen] = useState(false);

  // const socket = io('http://localhost:800');

  const [privateUser, setPrivate] = useState(true);

  const [time, setTime] = useState(null);
  const [showChat, setshowChat] = useState(false);

  const [livestreamViews, setLivestreamViews] = useState(0);

  const text = "Copy Link To Clipboard";
  const [buttonText, setButtonText] = useState(text);
  const [subscribeButtonText, setSubscribeButtonText] = useState("Follow");

  const [viewColor, setViewColor] = useState("white");
  const [viewAnimate, setViewAnimate] = useState("animate-none");

  // Description Read More
  const [readMore, setReadMore] = useState(false);

  // eslint-disable-next-line no-unused-vars

  const trackFollowers = async () => {
    const followData = {
      following: `${streamUser?.username}`,
      follower: `${State.database.userData.data?.user.username}`,
    };

    if (subscribeButtonText === "Follow") {
      setSubscribeButtonText("Unfollow");
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert("Invalid Login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      setSubscribeButtonText("Follow");
      await axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert("Invalid Login");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const get_User = async () => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/user/${username}`)
      .then((value) => {
        setStreamUser(value.data);
        for (let i = 0; i < value.data.follower_count.length; i++) {
          if (
            State.database.userData?.data
              ? value.data.follower_count[i] ===
                State.database.userData.data?.user.username
              : false
          ) {
            setSubscribeButtonText("Unfollow");
            break;
          }
        }
      });
    ////console.log(value.data)
  };

  useEffect(() => {
    get_User();
    // console.log(streamUserInfo);
    if (State.database.userData?.data?.user.username) {
      setPrivate(false);
    } else {
      setPrivate(true);
    }

    // if (props.playbackUserData) {
    //   let videotime = props.playbackUserData.time;
    //   const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
    //   setTime(moment(timestamp).fromNow());
    // }
    // eslint-disable-next-line
  }, []);

  //https://dbeats-live-view-heroku.herokuapp.com/
  // useEffect(() => {
  //   const socket = io(`wss://localhost:4000`, {
  //     transports: ["websocket"],

  //   });
  //   socket.on("connection");
  //   socket.emit("joinlivestream", username);
  //   socket.on("count", (details) => {
  //     if (details.room === username) {
  //       setLivestreamViews(details.roomSize);
  //     }
  //   });
  //   socket.on("livecount", (details) => {
  //     setLivestreamViews(details.roomSize);
  //     // console.log('emitted');
  //     // console.log('inc', livestreamViews);
  //     setViewColor("green-500");
  //     setViewAnimate("animate-pulse");
  //     setTimeout(() => {
  //       setViewColor("white");
  //       setViewAnimate("animate-none");
  //     }, 3000);
  //   });
  //   socket.on("removecount", (roomSize) => {
  //     setLivestreamViews(roomSize);
  //     // console.log('removecount emitted');
  //     // console.log('dec', livestreamViews);
  //     setViewColor("red-500");
  //     setViewAnimate("animate-pulse");
  //     setTimeout(() => {
  //       setViewColor("white");
  //       setViewAnimate("animate-none");
  //     }, 3000);
  //   });
  //   // socket
  //   //   .off('count', (data) => {
  //   //     console.log(data);
  //   //   })
  //   //   .on('count', (data) => {
  //   //     console.log(data.num);
  //   //     setLivestreamViews(data.num);
  //   //   });
  // }, []);

  // enable this for viewer count
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("connected to socket");
      socket.emit("joinlivestream", username);
    });

    socket.on("disconnect", () => {
      console.log("disconnected socket");
    });

    socket.io.on("error", (error) => {
      console.log("socket went wrong ", error);
    });

    socket.on("count", (c) => {
      setLivestreamViews(c);
    });

    return () => {
      socket.disconnect();
      socket.off("count");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (State.database.userData.data && streamUser) {
      const already = streamUser.follower_count.find(
        (f) => f == State.database.userData.data.user.username
      );
      if (already) {
        setSubscribeButtonText("Unfollow");
      }
    }
  }, [State.database.userData?.data?.user, streamUser]);

  useEffect(() => {
    State.updateDatabase({ showHeader: false, showBottomNav: false });
  }, []);
  const livepeerClient = createReactClient({
    provider: studioProvider({
      apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
    }),
  });

  const theme = {
    colors: {
      accent: "rgb(0, 145, 255)",
      containerBorderColor: "rgba(0, 145, 255, 0.9)",
    },
    fonts: {
      display: "Inter",
    },
  };
  return streamUser && State.database.userData.data ? (
    <div className="flex items-start justify-center w-screen h-screen lg:pt-24">
      <div
        className={`flex flex-col h-full flex-grow max-w-5xl mx-auto  bg-white dark:bg-slate-900 ${
          showChat ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        <button
          onClick={() => {
            State.updateDatabase({ showHeader: true, showBottomNav: true });
            navigateTo("../live");
          }}
          className="sticky top-0 left-0 z-50 flex items-center justify-start w-full p-2 font-semibold bg-white lg:hidden dark:bg-slate-900 text-brand3"
        >
          <ChevronLeft />
          Back
        </button>
        {streamUser ? (
          !streamUser?.livepeer_data.isActive &&
          new Date(streamUser?.streamSchedule * 1) > new Date() ? (
            <img
              className="object-cover w-full  aspect-video"
              src={
                streamUser?.thumbnail ? streamUser?.thumbnail : livePlaceholder
              }
            />
          ) : (
            <div className="w-full aspect-video">
              <Player
                title={
                  streamUser && streamUser?.streamDetails
                    ? streamUser?.streamDetails.name
                    : "Mintflick Stream"
                }
                playbackId={streamUser?.livepeer_data.playbackId}
                showPipButton
                autoPlay
                priority
                showTitle={false}
                poster={
                  streamUser?.thumbnail
                    ? streamUser?.thumbnail
                    : livePlaceholder
                }
                aspectRatio="16to9"
                controls={{
                  autohide: 3000,
                }}
                theme={{
                  borderStyles: { containerBorderStyle: "hidden" },
                  radii: { containerBorderRadius: "0px" },
                }}
              />
              {/* <ReactPlayer
                  controls={true}
                  width={"100%"}
                  height={"max-content"}
                  url={`https://cdn.livepeer.com/hls/${streamUser.livepeer_data.playbackId}/index.m3u8`}
                  footer={false}
                /> */}
            </div>
          )
        ) : null}
        <div
          className={`relative   p-2 ${
            showChat
              ? "overflow-hidden flex-grow"
              : "overflow-auto md:overflow-visible"
          }`}
        >
          <div className="px-4 py-2 text-base font-semibold tracking-wider md:text-lg text-brand2">
            {streamUser && streamUser?.streamDetails
              ? streamUser?.streamDetails.name
              : null}
          </div>
          {!privateUser ? (
            State.database.userData.data && streamUser ? (
              <div className="flex items-center justify-start gap-2 m-2">
                <Link
                  className="w-12 aspect-square"
                  to={`../profile/${streamUser?.username}`}
                >
                  <img
                    src={
                      streamUser?.profile_image
                        ? streamUser?.profile_image
                        : placeholderImage
                    }
                    alt="profile picture"
                    className="object-cover w-full h-full rounded-full "
                  />
                </Link>
                <div className="flex flex-col items-start gap-1">
                  <Link
                    to={`../profile/${streamUser?.username}`}
                    className="text-base font-bold tracking-wider w-fit md:text-lg text-brand1 hover:underline"
                  >
                    {streamUser?.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    {streamUser?.username !=
                    State.database.userData.data?.user.username ? (
                      <button
                        id="subscribeButton"
                        className="text-primary text-xs  font-semibold border-[1px] border-primary px-2 py-1 rounded-full  "
                        onClick={
                          State.database.userData.data.user != null &&
                          trackFollowers
                        }
                      >
                        <span>{subscribeButtonText}</span>
                      </button>
                    ) : null}
                  </div>
                </div>
                {streamUser?.superfan_data &&
                  streamUser?.username !=
                    State.database.userData.data?.user.username &&
                  streamUser?.superfan_to.find(
                    (o) =>
                      o.username == State.database.userData.data?.user.username
                  ) == undefined && (
                    <button
                      className="ml-auto font-medium capitalize btn btn-brand btn-sm"
                      onClick={() => setJoinsuperfanModalOpen(true)}
                    >
                      <img className="w-5 mr-1" src={superfan_logo} />
                      Become superfan
                    </button>
                  )}
              </div>
            ) : (
              <a className="rounded-full btn btn-outline btn-primary btn-xs">
                Login to Follow & Become a SuperFan
              </a>
            )
          ) : null}
          <div className="flex flex-wrap w-full gap-2 p-2 ">
            {streamUser &&
            new Date(streamUser?.streamSchedule * 1) > new Date() &&
            !streamUser?.livepeer_data.isActive ? (
              <span className="flex items-center h-8 px-3 rounded-full w-fit bg-slate-100 dark:bg-slate-800">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-teal-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex w-full h-full bg-teal-600 rounded-full"></span>
                </span>
                <p className="ml-2 text-xs font-semibold sm:text-sm text-brand2">
                  Streaming on{" "}
                  <span className="text-teal-600">
                    {moment(streamUser?.streamSchedule * 1).format(
                      "MMMM Do YYYY, h:mm a"
                    )}
                  </span>
                </p>
              </span>
            ) : (
              <span className="flex items-center h-8 px-3 rounded-full w-fit bg-slate-100 dark:bg-slate-800">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex w-full h-full bg-red-600 rounded-full"></span>
                </span>
                <p className="ml-2 text-xs font-semibold sm:text-sm text-brand2">
                  Live now
                </p>
              </span>
            )}
            {/* <div className="flex justify-between w-full gap-2 md:ml-auto md:w-fit"> */}
            <span className="flex items-center h-8 gap-1 px-3 rounded-full w-fit bg-slate-100 dark:bg-slate-800">
              <span className="text-teal-600">
                <Eye size={16} />
              </span>
              <p className="text-xs font-semibold sm:text-sm text-brand2">
                {livestreamViews}
              </p>
            </span>
            <span
              onClick={() => setshowChat(true)}
              className="flex items-center h-8 gap-1 px-3 rounded-full cursor-pointer xl:hidden w-fit bg-slate-100 dark:bg-slate-800"
            >
              <span className="text-teal-600">
                <Message size={16} />
              </span>
              <p className="text-xs font-semibold sm:text-sm text-brand2">
                Live Chat
              </p>
            </span>

            <div
              onClick={() =>
                State.updateDatabase({
                  shareModalOpen: true,
                  sharePostUrl: `https://mintflick.app/homescreen/live/${streamUser?.username}`,
                })
              }
              className="flex gap-2 rounded-full btn btn-outline btn-primary btn-sm md:ml-auto"
            >
              <Share size={14} />
              <p className="">SHARE</p>
            </div>
          </div>
          {streamUser && streamUser?.streamDetails && (
            <div className="p-3 m-2 text-lg rounded-lg text-brand3 h-fit bg-slate-100 dark:bg-slate-800 ">
              {streamUser?.streamDetails?.description?.length > 100 ? (
                <div className="w-full">
                  <div className="text-sm truncate whitespace-pre-line">
                    {readMore
                      ? streamUser?.streamDetails?.description
                      : streamUser?.streamDetails?.description?.substring(
                          0,
                          100
                        )}
                  </div>
                  {readMore ? (
                    <span
                      className="text-sm font-semibold text-blue-700 cursor-pointer"
                      onClick={() => setReadMore(false)}
                    >
                      Show Less
                    </span>
                  ) : (
                    <span
                      className="text-sm font-semibold text-blue-700 cursor-pointer"
                      onClick={() => setReadMore(true)}
                    >
                      ...Read More
                    </span>
                  )}
                </div>
              ) : (
                <p className="max-w-full whitespace-normal">
                  {streamUser?.streamDetails?.description}
                </p>
              )}
            </div>
          )}
          <div className="grid grid-flow-row grid-cols-2 gap-4 p-2 ">
            {streamUser?.streamLinks ? (
              streamUser?.streamLinks.map((link, index) => {
                return (
                  <div key={index} className="w-full h-full">
                    <a
                      href={link?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="object-cover w-full rounded-md aspect-video"
                        src={link?.image}
                      />
                    </a>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div
            className={` ${
              showChat ? "absolute bottom-0 left-0" : "hidden"
            } w-full h-full pb-10`}
          >
            <div className="flex justify-between flex-grow p-2 font-semibold rounded-t-lg text-brand3 bg-slate-200 dark:bg-slate-700">
              live chat
              <X
                className="cursor-pointer"
                onClick={() => setshowChat(false)}
              />
            </div>
            <LiveRoom username={streamUser?.username}></LiveRoom>
          </div>
        </div>
      </div>
      <div className="hidden w-1/3 h-full xl:block">
        <div className={`   w-full h-full pb-10`}>
          <div className="flex justify-between flex-grow p-2 font-semibold  text-brand3 bg-slate-200 dark:bg-slate-700">
            live chat
            {/* <X className="cursor-pointer" onClick={() => setshowChat(false)} /> */}
          </div>
          <LiveRoom username={streamUser?.username}></LiveRoom>
        </div>
      </div>
      <div
        className={`${
          joinsuperfanModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <JoinSuperfanModal
          setJoinSuperfanModal={setJoinsuperfanModalOpen}
          // content={props.content}
          superfan_data={streamUser?.superfan_data}
          toPay={streamUser?.wallet_id}
          postUsername={streamUser?.username}
        />
      </div>
    </div>
  ) : (
    <div className="w-screen h-screen bg-slate-100 dark:bg-slate-800 ">
      <Loading />
    </div>
  );
}

export default UserLivestream;
