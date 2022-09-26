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
import Loading from "../Loading/Loading";
import { Eye, Share } from "tabler-icons-react";

const socket = io("https://mintflickviews.herokuapp.com", {
  autoConnect: false,
});

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

  const slangText = [
    "NFTs are more than just a jpeg",
    "Never share your private keys",
    "Web3 is Web2 on steroids...",
    "Blochain is the future",
    "NFTs are the future",
    "Buy the Dip",
    "WAGMI",
    "Decentralised doesn't mean Safe. Be cautious",
    "Create. Mint. Vibe",
    "Own your shit",
  ];

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

    socket.on("count",(c)=>{
      setLivestreamViews(c);
    })

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

  return streamUser && State.database.userData.data ? (
    <div className="w-full min-h-screen h-fit pt-20 bg-white dark:bg-slate-900">
      <div className={`flex flex-col lg:flex-row relative h-full p-4`}>
        <div className="flex-1 space-y-2">
          {streamUser ? (
            streamUser.thumbnail &&
            !streamUser.livepeer_data.isActive &&
            new Date(streamUser.streamSchedule * 1) > new Date() ? (
              <img
                className="w-full aspect-video rounded-sm lg:rounded-xl object-cover"
                src={streamUser.thumbnail}
              />
            ) : (
              <div className="rounded-sm lg:rounded-xl overflow-hidden">
                <ReactPlayer
                  controls={true}
                  width={"100%"}
                  height={"max-content"}
                  url={`https://cdn.livepeer.com/hls/${streamUser.livepeer_data.playbackId}/index.m3u8`}
                  footer={false}
                />
              </div>
            )
          ) : null}

          <div className="space-y-2  w-full">
            <div className="w-full flex flex-col md:flex-row gap-2 ">
              {streamUser &&
              new Date(streamUser.streamSchedule * 1) > new Date() &&
              !streamUser.livepeer_data.isActive ? (
                <span className="flex items-center h-8 w-fit bg-slate-100 dark:bg-slate-800  rounded-full px-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                    <span className="absolute inline-flex rounded-full h-full w-full bg-teal-600"></span>
                  </span>
                  <p className="text-sm font-semibold text-brand2 ml-2">
                    Stream Starting on{" "}
                    <span className="text-teal-600">
                      {moment(streamUser.streamSchedule * 1).format(
                        "MMMM Do YYYY, h:mm a"
                      )}
                    </span>
                  </p>
                </span>
              ) : null}
              <div className="md:ml-auto flex w-full md:w-fit justify-between gap-2">
                <span className="flex items-center gap-1 h-8 w-fit bg-slate-100 dark:bg-slate-800  rounded-full px-3">
                  <span className="text-teal-600">
                    <Eye size={16} />
                  </span>
                  <p className="text-sm font-semibold text-brand2">
                    {livestreamViews}
                  </p>
                </span>

                <div
                  onClick={() =>
                    State.updateDatabase({
                      shareModalOpen: true,
                      sharePostUrl: `https://v2.mintflick.app/homescreen/liveuser/${streamUser.username}`,
                    })
                  }
                  className="btn btn-outline btn-primary btn-sm rounded-full gap-2"
                >
                  <Share size={16} />
                  SHARE
                </div>
              </div>
            </div>

            {!privateUser ? (
              State.database.userData.data && streamUser ? (
                <div className="lg:flex justify-between space-y-2 w-full">
                  <div className="flex justify-start items-start gap-2">
                    <Link
                      className="w-20 aspect-square"
                      to={`../profile/${streamUser.username}/posts`}
                    >
                      <img
                        src={
                          streamUser.profile_image
                            ? streamUser.profile_image
                            : placeholderImage
                        }
                        alt="profile picture"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </Link>
                    <div className="w-full ">
                      <Link
                        to={`../profile/${streamUser.username}/posts`}
                        className="w-fit text-base text-brand1 font-semibold tracking-wider hover:underline"
                      >
                        {streamUser.name}
                      </Link>
                      <h1 className="text-lg text-brand2 font-semibold tracking-wider">
                        {streamUser && streamUser.streamDetails
                          ? streamUser.streamDetails.name
                          : null}
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {streamUser.username !=
                    State.database.userData.data.user.username ? (
                      subscribeButtonText === "Follow" ? (
                        <button
                          id="subscribeButton"
                          className="btn btn-brand btn-sm"
                          onClick={
                            State.database.userData.data.user != null &&
                            trackFollowers
                          }
                        >
                          <span>{subscribeButtonText}</span>
                        </button>
                      ) : (
                        <button
                          id="subscribeButton"
                          className="btn btn-primary btn-outline btn-sm"
                          onClick={
                            State.database.userData.data.user != null &&
                            trackFollowers
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
                      ) == undefined && (
                        <button
                          onClick={() => setJoinsuperfanModalOpen(true)}
                          className={
                            streamUser.superfan_data
                              ? "btn btn-brand btn-sm"
                              : "hidden"
                          }
                        >
                          🥳 Become a Superfan
                        </button>
                      )}
                  </div>
                </div>
              ) : (
                <a className="btn btn-brand btn-outline">
                  Login to Follow & Become a SuperFan
                </a>
              )
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

            {streamUser && streamUser.streamDetails && (
              <div className="p-4 text-lg text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
                <p>
                  {streamUser.streamDetails.description.length > 100 ? (
                    <>
                      {readMore
                        ? streamUser.streamDetails.description
                        : streamUser.streamDetails.description.substring(
                            0,
                            100
                          )}
                      {!readMore ? (
                        <span
                          className="text-sm font-semibold text-blue-700 cursor-pointer"
                          onClick={() => setReadMore(true)}
                        >
                          ...Read More
                        </span>
                      ) : (
                        <span
                          className="text-sm font-semibold text-blue-700 cursor-pointer"
                          onClick={() => setReadMore(false)}
                        >
                          {" "}
                          Show Less
                        </span>
                      )}
                    </>
                  ) : (
                    streamUser.streamDetails.description
                  )}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 grid-flow-row   ">
            {streamUser.streamLinks ? (
              streamUser.streamLinks.map((link, index) => {
                return (
                  <div key={index} className="h-full w-full">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="aspect-video object-cover w-full rounded-md"
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
        <div className="w-full lg:w-96">
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
    <div className="h-screen w-screen bg-slate-100 dark:bg-slate-800 ">
      <Loading msg={slangText} />
    </div>
  );
}

export default UserLivestream;
