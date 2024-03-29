import { Web3Provider } from "@ethersproject/providers";
import { Menu, Transition } from "@headlessui/react";
import { Framework } from "@superfluid-finance/sdk-core";
//import playimg from "../../../assets/images/telegram.png";
import axios from "axios";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import Modal from "react-modal";
// import Modal from 'react-awesome-modal';
// import { Container, Row } from 'react-bootstrap';
// import Lottie from 'react-lottie';
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import person from "../../../../assets/images/profile.svg";
// import superfluid from '../../../../assets/images/superfluid-black.svg';
import { ShareModal } from "../../../../component/Modals/ShareModal/ShareModal";
import SuperfanModal from "../../../../component/Modals/SuperfanModal/superfan-modal";
import VideoPlayer from "../../../../component/VideoPlayer/VideoPlayer";
// import animationDataConfetti from '../../../../lotties/confetti.json';
// import animationData from '../../../../lotties/fans.json';
// import animationDataGiraffee from '../../../../lotties/giraffee.json';
// import ChatRoom from '../../../Profile/ProfileSections/ChatRoom/ChatRoom';
// import classes from '../Info.module.css';
// import LiveCard from './LiveCard';
import LiveChat from "./LiveChat";
import { io } from "socket.io-client";
import { RadioGroup } from "@headlessui/react";
import useWeb3Modal from "../../../../hooks/useWeb3Modal";

const PublicInfo = (props) => {
  // const socket = io('http://localhost:800');
  const location = useLocation();
  console.log(location);
  console.log(props);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/live/${props.stream_id}`;
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const [loadWeb3Modal, logoutOfWeb3Modal, logoutweb3] = useWeb3Modal();

  const [userData, setUserData] = useState({});

  const [privateUser, setPrivate] = useState(true);

  const user = useSelector((state) => state.User.user);
  const [time, setTime] = useState(null);

  const [playbackUrl, setPlaybackUrl] = useState("");

  const [livestreamViews, setLivestreamViews] = useState(0);

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showReport, setShowReport] = useState(false);
  const handleReportShow = () => setShowReport(true);
  const handleReportClose = () => setShowReport(false);

  const [showReportSubmitThankyou, setShowReportSubmitThankyou] =
    useState(false);
  const handleReportThankyouShow = () => setShowReportSubmitThankyou(true);
  const handleReportThankyouClose = () => setShowReportSubmitThankyou(false);

  const [showOtherReport, setShowOtherReport] = useState(false);
  const handleOtherReportShow = () => setShowOtherReport(true);
  const handleOtherReportClose = () => setShowOtherReport(false);

  const [reportValue, setReportValue] = useState("Nudity or pornography");
  const [userReportValue, setUserReportValue] = useState("");

  const text = "Copy Link To Clipboard";
  const [buttonText, setButtonText] = useState(text);
  const [subscribeButtonText, setSubscribeButtonText] = useState("Follow");

  const [viewColor, setViewColor] = useState("white");
  const [viewAnimate, setViewAnimate] = useState("animate-none");

  // eslint-disable-next-line no-unused-vars
  const [arrayData, setArrayData] = useState([]);

  const handleReportSubmit = () => {
    let reportData = {
      reporter: user.username,
      reported: userData.username,
      report: reportValue,
      videoId: "live",
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/videoreports`,
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
      data: reportData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setShowReport(false);
    setShowOtherReport(false);
    setShowReportSubmitThankyou(true);
  };

  const handleInputChange = (e) => {
    setReportValue(e.target.value);
  };

  const trackFollowers = () => {
    const followData = {
      following: `${userData.username}`,
      follower: `${user.username}`,
    };

    if (subscribeButtonText === "Follow") {
      setSubscribeButtonText("Unfollow");
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("authtoken"),
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
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("authtoken"),
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
      .get(`${process.env.REACT_APP_SERVER_URL}/user/${props.stream_id}`)
      .then((value) => {
        setUserData(value.data);
        for (let i = 0; i < value.data.follower_count.length; i++) {
          if (user ? value.data.follower_count[i] === user.username : false) {
            setSubscribeButtonText("Unfollow");
            break;
          }
        }
        setPlaybackUrl(
          `https://cdn.livepeer.com/hls/${value.data.livepeer_data.playbackId}/index.m3u8`
        );
      });
    ////console.log(value.data)
  };

  const fetchData = async () => {
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    for (let i = 0; i < fileRes.data.length; i++) {
      if (fileRes.data[i].videos) {
        if (user ? fileRes.data[i].username === user.username : false) {
          continue;
        }
        if (
          fileRes.data[i].username !== props.video_username &&
          fileRes.data[i].videos.length > 0
        ) {
          setArrayData((prevState) => [...prevState, fileRes.data[i]]);
        }
      }
    }
    ////console.log(fileRes, "Hi");
    //await sf.initialize();
  };

  useEffect(() => {
    get_User();
    fetchData();

    if (user ? user.username === props.stream_id : false) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }

    if (props.playbackUserData) {
      let videotime = props.playbackUserData.time;
      const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
      setTime(moment(timestamp).fromNow());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_VIEWS_URL}`, {
      transports: ["websocket", "polling"],
      upgrade: true,
      secure: true,
      withCredentials: true,
      //       extraHeaders: {
      //         'my-custom-header': 'abcd',
      //       },
    });
    socket.on("connection");
    socket.emit("joinlivestream", props.stream_id);
    socket.on("count", (details) => {
      if (details.room === props.stream_id) {
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

  const testFlow = async (amount) => {
    const walletAddress = await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    const sf = await Framework.create({
      ethers: new Web3Provider(window.ethereum),
    });
    await sf.initialize();

    const carol2 = sf.user({
      address: walletAddress[0],

      // fDAIx token, which is a test Super Token on Goerli network
      token: "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
    });

    await carol2.flow({
      recipient: "0xF976A17dE1945C6977725aE289A1c2EA5d036789",
      // This flow rate is equivalent to 1 tokens per month, for a token with 18 decimals.
      flowRate: 385802469135 * amount,
    });

    //const details = await carol2.details();
    //console.log(details.cfa.flows.outFlows[0]);
  };
  const handleLogin = () => {
    loadWeb3Modal();
  };
  return (
    <div className="">
      <div
        className={`${
          darkMode && "dark"
        }  grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row  pb-50  lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary`}
      >
        <div className=" lg:col-span-2 pt-3 mt-10">
          <div className="self-center lg:px-8 w-screen lg:w-full lg:mt-3 mt-0.5  ">
            {userData ? (
              <VideoPlayer
                playbackUrl={playbackUrl}
                creatorData={userData}
                footer={true}
              />
            ) : null}
          </div>

          <div className="2xl:mx-7 sm:p-2 p-3   dark:bg-dbeats-dark-secondary">
            <div className=" flex  ">
              <div className="2xl:py-4 lg:py-2 w-full">
                <div
                  className=" w-full text-left mt-0"
                  style={{ padding: "0px" }}
                >
                  {userData.superfan_data ? (
                    <p className="font-semibold 2xl:text-xl lg:text-md ">
                      {userData.videos.videoName}
                    </p>
                  ) : null}
                  {/* {time ? (
                    <p className="  2xl:text-lg lg:text-xs text-md text-gray-400 pb-4">{time}</p>
                  ) : null} */}
                </div>
                {!privateUser ? (
                  <div>
                    {user && userData ? (
                      <>
                        {" "}
                        <div className="flex   text-black text-sm font-medium   md:px-4  md:py-3 px-1 py-2">
                          <Link
                            to={`/profile/${userData.username}/`}
                            className="mr-4"
                          >
                            <img
                              src={
                                userData.profile_image
                                  ? userData.profile_image
                                  : person
                              }
                              alt=""
                              className="  md:w-16 md:h-14 h-8 w-10    rounded-full    self-start"
                            />
                          </Link>
                          <div className="w-full  flex  justify-between   md:mt-2 ">
                            <div>
                              <div className="w-full self-center  ">
                                <Link
                                  to={`/profile/${userData.username}/`}
                                  className="2xl:text-sm lg:text-xs text-xs text-gray-500  mb-2"
                                >
                                  <div className="flex align-middle">
                                    <h3 className="text-white mr-1 md:text-lg text-sm tracking-wider">
                                      {userData.name}
                                    </h3>

                                    <p className="text-white ml-1 text-opacity-40 text-xs self-center align-middle">
                                      {time}
                                    </p>
                                  </div>

                                  <p className="text-white text-opacity-40 self-center items-center content-center">
                                    &middot;&nbsp;{userData.username}
                                  </p>
                                </Link>
                                {""}
                              </div>
                            </div>
                            {/* Hiding Follow Button due to bugs 
                <div>
                  <div
                    onClick={trackFollowers}
                    className="  rounded-3xl group w-max ml-2 p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  >
                    <div className="  h-full w-full text-black dark:text-white p-1 flex   rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                      <p className="self-center mx-2 flex">
                        <span>
                          {buttonText === 'follow' ? (
                            <i className="fas fa-plus self-center mx-2"></i>
                          ) : null}
                          &nbsp;{buttonText}
                        </span>
                        <div
                          hidden={subscribeLoader}
                          className="w-3 h-3 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                        ></div>
                      </p>
                    </div>
                  </div>
                </div> */}
                          </div>
                        </div>
                        <div className="flex items-center   w-full">
                          {subscribeButtonText === "Follow" ? (
                            <button
                              id="subscribeButton"
                              className="flex items-center dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                              onClick={user != null && trackFollowers}
                            >
                              <span>{subscribeButtonText}</span>
                              {/* <div
                            hidden={loader}
                            className="w-4 h-4 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                          ></div> */}
                            </button>
                          ) : null}

                          <button
                            onClick={
                              user != null && handleShowSubscriptionModal
                            }
                            className={
                              userData.superfan_data
                                ? " flex dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2      mr-3 font-semibold text-white   "
                                : "hidden"
                            }
                          >
                            <span
                              className={`${
                                userData.superfan_data ? "" : "hidden"
                              } whitespace-nowrap flex`}
                            >
                              🥳 Become a Superfan
                            </span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <a
                        onClick={handleLogin}
                        className="bg-dbeats-light flex w-max  p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                      >
                        <span className="whitespace-nowrap flex">
                          Login to Follow & Become a SuperFan
                        </span>
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="2xl:text-2xl lg:text-md text-xs 2xl:py-4 lg:py-2 py-2 flex justify-around dark:text-dbeats-white -ml-24 md:-ml-0">
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
                <div className="  text-center lg:mx-3 mx-1">
                  <button
                    className="border-0 bg-transparent"
                    onClick={handleShow}
                  >
                    <i className="fas fa-share-alt opacity-50 mx-2"></i>
                  </button>
                  <br />
                  <p className="2xl:text-base  text-xs lg:text-sm"> SHARE</p>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button>
                      <i className="fas fa-ellipsis-h opacity-50 mx-2"></i>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="   absolute right-0 w-56  origin-top-right bg-white dark:bg-dbeats-dark-primary dark:text-gray-50 divide-y divide-gray-100   shadow   focus:outline-none">
                      {user && user.username != userData.username ? (
                        <div className="px-1 py-1 ">
                          <Menu.Item className="w-full text-gray-700 dark:text-gray-50 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                            <button
                              onClick={() => {
                                handleReportShow();
                              }}
                            >
                              Report
                            </button>
                          </Menu.Item>
                        </div>
                      ) : (
                        <></>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
        <div className="  w-full col-span-1" style={{ height: "100vh" }}>
          {userData.username && (
            <LiveChat userp={userData} privateUser={user}></LiveChat>
          )}
        </div>
      </div>

      <Modal
        isOpen={showReport}
        className="h-max lg:w-1/3  w-5/6  mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && "dark"} border rounded-lg`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
            <Row>
              <h2 className="flex justify-between w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 ml-60 text-gray-900 dark:text-gray-100 font-bold">
                  Report
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1 mr-8 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleReportClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full px-3">
                <h1 className="text-white text-xl mb-2">
                  Why are you reporting this post?
                </h1>
                <div className="w-full max-h-60 overflow-y-scroll text-white text-lg">
                  <RadioGroup
                    value={reportValue}
                    onChange={setReportValue}
                    className=" w-max"
                  >
                    <RadioGroup.Option
                      value="Nudity or pornography"
                      className="p-1 cursor-pointer flex items-center"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Nudity or pornography
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Sexual Exploitation"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Sexual Exploitation
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Sharing private images"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Sharing private images
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Violent threat"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Violent threat
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Animal abuse"
                    >
                      {({ checked }) => (
                        <span className={checked ? "text-dbeats-light" : ""}>
                          Animal abuse
                        </span>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Death, severe injury, dangerous"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Death, severe injury, dangerous
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Firearms"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Firearms
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Fake health documents"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Fake health documents
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Report piracy"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? "text-dbeats-light" : ""}>
                            Report piracy
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  </RadioGroup>
                  <button
                    className="p-1"
                    onClick={() => {
                      handleOtherReportShow();
                      handleReportClose();
                    }}
                  >
                    Others
                  </button>
                </div>
              </div>
            </Row>
            <Row>
              <div
                className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
              >
                <button
                  className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                  onClick={handleReportSubmit}
                >
                  Submit Report
                </button>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>

      <Modal
        isOpen={showReportSubmitThankyou}
        className="h-max lg:w-1/3  w-5/6 mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && "dark"}`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg border">
            <Row>
              <h2 className="flex justify-between  w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold">
                  Thanks for reporting!!
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1  justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleReportThankyouClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full flex justify-center items-center pt-5 pb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-28 w-28"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>

      <Modal
        isOpen={showOtherReport}
        className="h-max lg:w-1/3  w-5/6 mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && "dark"} border rounded-lg`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
            <Row>
              <h2 className="flex justify-around w-full 2xl:text-2xl lg:text-md py-4 2xl:py-6 lg:py-2  pt-7  text-center relative  ">
                <div
                  onClick={() => {
                    handleOtherReportClose();
                    handleReportShow();
                  }}
                  className="cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-alt ml-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="col-span-4 text-gray-900 dark:text-gray-100 font-bold">
                  Help us understand the problem
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleOtherReportClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full h-max px-2">
                <textarea
                  className="w-full text-white text-lg h-48 rounded-sm p-2  border dark:bg-dbeats-dark-primary"
                  placeholder="Issue..."
                  required
                  onChange={handleInputChange}
                />
              </div>
            </Row>
            <Row>
              <div
                className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
              >
                <button
                  className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                  onClick={handleReportSubmit}
                >
                  Submit Report
                </button>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>

      <ShareModal
        show={show}
        handleClose={handleClose}
        sharable_data={sharable_data}
        copybuttonText={buttonText}
        setCopyButtonText={setButtonText}
      />

      <SuperfanModal
        userDataDetails={userData}
        show={showSubscriptionModal}
        handleClose={handleCloseSubscriptionModal}
        className={`${darkMode && "dark"}   mx-auto    mt-32 shadow `}
      />
    </div>
  );
};

export default PublicInfo;
