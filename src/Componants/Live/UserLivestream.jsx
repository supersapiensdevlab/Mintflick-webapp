import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import JoinSuperfanModal from "../Home/Modals/JoinSuperfanModal";

function UserLivestream() {
  const { username } = useParams();
  const [streamUser, setStreamUser] = useState(null);
  const State = useContext(UserContext);

  const [joinsuperfanModalOpen, setJoinsuperfanModalOpen] = useState(false);

  // const socket = io('http://localhost:800');

  const [privateUser, setPrivate] = useState(true);

  const [time, setTime] = useState(null);

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
      following: `${streamUser.username}`,
      follower: `${State.database.userData.data.user.username}`,
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
            State.database.userData.data
              ? value.data.follower_count[i] ===
                State.database.userData.data.user.username
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

    if (
      State.database.userData.data &&
      State.database.userData.data.user.username === username
    ) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }

    // if (props.playbackUserData) {
    //   let videotime = props.playbackUserData.time;
    //   const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
    //   setTime(moment(timestamp).fromNow());
    // }
    // eslint-disable-next-line
  }, []);

  //https://dbeats-live-view-heroku.herokuapp.com/
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_VIEWS_URL}`, {
      transports: ["websocket", "polling"],
      upgrade: false,
      secure: true,
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    socket.on("connection");
    socket.emit("joinlivestream", username);
    socket.on("count", (details) => {
      if (details.room === username) {
        setLivestreamViews(details.roomSize);
      }
    });
    socket.on("livecount", (details) => {
      setLivestreamViews(details.roomSize);
      // console.log('emitted');
      // console.log('inc', livestreamViews);
      setViewColor("green-500");
      setViewAnimate("animate-pulse");
      setTimeout(() => {
        setViewColor("white");
        setViewAnimate("animate-none");
      }, 3000);
    });
    socket.on("removecount", (roomSize) => {
      setLivestreamViews(roomSize);
      // console.log('removecount emitted');
      // console.log('dec', livestreamViews);
      setViewColor("red-500");
      setViewAnimate("animate-pulse");
      setTimeout(() => {
        setViewColor("white");
        setViewAnimate("animate-none");
      }, 3000);
    });
    // socket
    //   .off('count', (data) => {
    //     console.log(data);
    //   })
    //   .on('count', (data) => {
    //     console.log(data.num);
    //     setLivestreamViews(data.num);
    //   });
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

  return (
    <div className="w-full min-h-full pt-24  bg-white dark:bg-slate-900 ">
      <>
        {streamUser && State.database.userData.data ? (
          <div className="">
            <div className={`flex   pb-50  lg:ml-12  relative  h-full `}>
              <div className="flex-1 w-full">
                <div>
                  {streamUser ? (
                    streamUser.thumbnail &&
                    !streamUser.livepeer_data.isActive &&
                    new Date(streamUser.streamSchedule * 1) > new Date() ? (
                      <>
                        <img
                          className="max-h-120 self-center lg:px-8 w-screen lg:w-full lg:mt-3   mt-0.5"
                          src={streamUser.thumbnail}
                        />
                      </>
                    ) : (
                      <ReactPlayer
                        controls={true}
                        width={"100%"}
                        height={"max-content"}
                        url={`https://cdn.livepeer.com/hls/${streamUser.livepeer_data.playbackId}/index.m3u8`}
                        footer={false}
                      />
                    )
                  ) : null}
                </div>

                <div className="2xl:ml-7 sm:p-2 p-3  bg-dbeats-dark-alt shadow   md:px-6">
                  <div className=" flex sm:py-2 py-2">
                    <div className="  w-full">
                      <>
                        {streamUser &&
                        new Date(streamUser.streamSchedule * 1) > new Date() &&
                        !streamUser.livepeer_data.isActive ? (
                          <span className="text-dbeats-light border px-5 py-3 border-dbeats-light rounded  mr-1 md:text-lg ml-5 text-sm tracking-wider">
                            <i className="fa-solid text-red-500 fa-circle text-sm mr-2"></i>
                            Stream Starting on{" "}
                            {moment(streamUser.streamSchedule * 1).format(
                              "MMMM Do YYYY, h:mm a"
                            )}
                          </span>
                        ) : null}
                      </>
                      <>
                        <h1 className="text-white mt-3 mr-1 md:text-2xl ml-5 text-sm tracking-wider">
                          {streamUser && streamUser.streamDetails
                            ? streamUser.streamDetails.name
                            : null}
                        </h1>
                      </>
                      {!privateUser ? (
                        <div>
                          {State.database.userData.data && streamUser ? (
                            <>
                              {" "}
                              <div className="flex    text-black text-sm font-medium   py-2  px-4  ">
                                <Link
                                  to={`/profile/${streamUser.username}/posts`}
                                  className="mr-4"
                                >
                                  <img
                                    src={
                                      streamUser.profile_image
                                        ? streamUser.profile_image
                                        : placeholderImage
                                    }
                                    alt=""
                                    className="  md:w-16 md:h-14 h-8 w-10    rounded-full    self-start"
                                  />
                                </Link>
                                <div className="w-full  flex  justify-between   md:mt-2 ">
                                  <div>
                                    <div className="w-full self-center  ">
                                      <Link
                                        to={`/profile/${streamUser.username}/posts`}
                                        className="2xl:text-sm lg:text-xs text-xs text-gray-500  mb-2"
                                      >
                                        <div className="flex align-middle">
                                          <h3 className="text-white mr-1 md:text-lg text-sm tracking-wider">
                                            {streamUser.name}
                                          </h3>
                                        </div>

                                        <p className="text-white text-opacity-40 self-center items-center content-center">
                                          &middot;&nbsp;{streamUser.username}
                                        </p>
                                      </Link>
                                      {""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center   w-full px-4">
                                {streamUser.username !=
                                State.database.userData.data.user.username ? (
                                  subscribeButtonText === "Follow" ? (
                                    <button
                                      id="subscribeButton"
                                      className="flex items-center dark:bg-dbeats-light    border border-dbeats-light dark:hover:bg-dbeats-secondary-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                                      onClick={
                                        State.database.userData.data.user !=
                                          null && trackFollowers
                                      }
                                    >
                                      <span>{subscribeButtonText}</span>
                                    </button>
                                  ) : (
                                    <button
                                      id="subscribeButton"
                                      className="flex items-center dark:bg-dbeats-light    border border-dbeats-light dark:hover:bg-dbeats-secondary-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                                      onClick={
                                        State.database.userData.data.user !=
                                          null && trackFollowers
                                      }
                                    >
                                      <span>{subscribeButtonText}</span>
                                    </button>
                                  )
                                ) : null}

                                {streamUser.superfan_data &&
                                streamUser.username !=
                                  State.database.userData.data.user.username &&
                                streamUser.superfan_to.find(
                                  (o) =>
                                    o.username ==
                                    State.database.userData.data.user.username
                                ) == undefined ? (
                                  <button
                                    onClick={() =>
                                      setJoinsuperfanModalOpen(true)
                                    }
                                    className={
                                      streamUser.superfan_data
                                        ? " flex dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2      mr-3 font-semibold text-white   "
                                        : "hidden"
                                    }
                                  >
                                    <span
                                      className={`${
                                        streamUser.superfan_data ? "" : "hidden"
                                      } whitespace-nowrap flex`}
                                    >
                                      🥳 Become a Superfan
                                    </span>
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </>
                          ) : (
                            <a className="bg-dbeats-light flex w-max  p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white ">
                              <span className="whitespace-nowrap flex">
                                Login to Follow & Become a SuperFan
                              </span>
                            </a>
                          )}
                        </div>
                      ) : null}
                      {/* <div className="mt-2">
                      <>
                        <p>
                          <span className="text-white mr-1 font-bold md:text-lg md:ml-20 text-sm tracking-wider">
                            Description:
                          </span>{' '}
                          <span className="text-base text-white ml-5">
                            {userData && userData.streamDetails
                              ? userData.streamDetails.description
                              : null}
                          </span>
                        </p>
                      </>
                    </div> */}
                      {streamUser && streamUser.streamDetails && !readMore ? (
                        <div className="mt-2 ml-1 text-lg text-white p-2">
                          <p>
                            {streamUser.streamDetails.description.length >
                            100 ? (
                              <>
                                {streamUser.streamDetails.description.substring(
                                  0,
                                  100
                                )}{" "}
                                <span
                                  className="text-dbeats-light cursor-pointer"
                                  onClick={() => setReadMore(true)}
                                >
                                  ...Read More
                                </span>
                              </>
                            ) : (
                              streamUser.streamDetails.description
                            )}
                          </p>
                        </div>
                      ) : null}

                      {streamUser && streamUser.streamDetails && readMore ? (
                        <div className="mt-2 ml-1 text-lg text-white p-2">
                          <p>
                            {streamUser.streamDetails.description.length >
                            100 ? (
                              <>
                                {streamUser.streamDetails.description}{" "}
                                <span
                                  className="text-dbeats-light cursor-pointer"
                                  onClick={() => setReadMore(false)}
                                >
                                  {" "}
                                  Show Less
                                </span>
                              </>
                            ) : (
                              streamUser.streamDetails.description
                            )}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="2xl:text-2xl lg:text-md text-xs 2xl:py-4 lg:py-2 py-2 flex justify-around dark:text-dbeats-white   ">
                      <p
                        className={`text-white md:text-lg text-xs text-center pr-2 flex flex-col`}
                      >
                        <span
                          className={`text-${viewColor}  ${viewAnimate} font-bold`}
                        >
                          {livestreamViews}
                        </span>
                        viewers
                      </p>
                      <div
                        onClick={() =>
                          State.updateDatabase({
                            shareModalOpen: true,
                            sharePostUrl: `https://v2.mintflick.app/homescreen/liveuser/${streamUser.username}`,
                          })
                        }
                        className="  text-center lg:mx-3 mx-1 text-slate-200"
                      >
                        <button className="border-0 bg-transparent">
                          <i className="fas fa-share-alt  mx-2"></i>
                        </button>
                        <br />
                        <p className="2xl:text-base  text-xs lg:text-sm">
                          {" "}
                          SHARE
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 grid-flow-row mt-4  ">
                    {streamUser.streamLinks ? (
                      streamUser.streamLinks.map((link, index) => {
                        return (
                          <div
                            key={index}
                            className="h-full w-full p-2 rounded"
                          >
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                className="  h-full w-full rounded"
                                src={link.image}
                              />
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="  w-1/4   ">
                {/* {userData.username && (
                  <LiveChat userp={userData} privateUser={user}></LiveChat>
                )} */}
              </div>
            </div>
            <div
              className={`${
                joinsuperfanModalOpen && "modal-open"
              } modal modal-bottom sm:modal-middle`}
            >
              <JoinSuperfanModal
                setJoinSuperfanModal={setJoinsuperfanModalOpen}
                content={{}}
                superfan_data={streamUser.superfan_data}
              />
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  );
}

export default UserLivestream;
