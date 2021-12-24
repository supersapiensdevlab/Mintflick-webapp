import { Web3Provider } from '@ethersproject/providers';
import { Menu, Transition } from '@headlessui/react';
import SuperfluidSDK from '@superfluid-finance/js-sdk';
import axios from 'axios';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Lottie from 'react-lottie';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import superfluid from '../../../../assets/images/superfluid-black.svg';
import { Playlist } from '../../../../component/Modals/PlaylistModals/PlaylistModal';
import { ShareModal } from '../../../../component/Modals/ShareModal/ShareModal';
import PageNotFound from '../../../../component/PageNotFound/PageNotFound';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import animationDataConfetti from '../../../../lotties/confetti.json';
import animationDataNotFound from '../../../../lotties/error-animation.json';
import animationData from '../../../../lotties/fans.json';
import animationDataGiraffee from '../../../../lotties/giraffee.json';
import RecommendedCard from './RecommendedCard';

// import {Helmet} from "react-helmet";

moment().format();

const PlayBackInfo = (props) => {
  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/playback/${props.stream_id}/${props.video_id}`;
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);

  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const [like, setLike] = useState(0);
  const [dislike, setDislike] = useState(0);
  const [happy, setHappy] = useState(0);
  const [angry, setAngry] = useState(0);
  const [userreact, setUserreact] = useState('');

  const [showPlaylist, setShowPlaylist] = useState(false);
  const handleClosePlaylist = () => setShowPlaylist(false);
  const handleShowPlaylist = () => setShowPlaylist(true);

  const [showLogin, setShowLogin] = useState(false);
  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const defaultOptions2 = {
    loop: true,
    autoplay: false,
    animationData: animationDataConfetti,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const defaultOptions3 = {
    loop: true,
    autoplay: false,
    animationData: animationDataGiraffee,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const user = JSON.parse(window.localStorage.getItem('user'));

  const [playbackUrl, setPlaybackUrl] = useState('');

  const [loader, setLoader] = useState(true);

  const [userData, setUserData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [videoPresent, setVideoPresent] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [privateUser, setPrivate] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show, setShow] = useState(false);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  const [subscribeButtonText, setSubscribeButtonText] = useState('Subscribe');

  const [arrayData, setArrayData] = useState([]);

  const [time, setTime] = useState(null);

  const convertTimestampToTime = (timeData) => {
    const timestamp = new Date(timeData.time * 1000); // This would be the timestamp you want to format
    setTime(moment(timestamp).fromNow());
  };

  // const SuperfluidSDK = require("@superfluid-finance/js-sdk");
  // const { Web3Provider } = require("@ethersproject/providers");

  // const sf = new SuperfluidSDK.Framework({
  //   ethers: new Web3Provider(window.ethereum),
  // });

  const trackFollowers = () => {
    setLoader(false);
    const followData = {
      following: `${userData.username}`,
      follower: `${user.username}`,
    };
    if (subscribeButtonText === 'Subscribe') {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            setSubscribeButtonText('Unsubscribe');
            setLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            console.log(response);
            setSubscribeButtonText('Subscribe');
            setLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const get_User = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${props.stream_id}`).then((value) => {
      console.log(value);
      let fetchedVideoData;
      for (let i = 0; i < value.data.videos.length; i++) {
        console.log(value.data.videos[i].videoId, ' ', props.video_id);
        if (value.data.videos[i].videoId === props.video_id) {
          fetchedVideoData = value.data.videos[i];
          setVideoData(value.data.videos[i]);
          break;
        }
      }
      if (value.data === '') {
        setUserNotFound(true);
        return;
      }
      setUserData(value.data);
      if (!fetchedVideoData) {
        setNotFound(true);
        return;
      } else {
        setVideoPresent(true);
      }
      convertTimestampToTime(fetchedVideoData);
      for (let i = 0; i < value.data.follower_count.length; i++) {
        if (user ? value.data.follower_count[i] === user.username : false) {
          setSubscribeButtonText('Unsubscribe');
          break;
        }
      }

      setPlaybackUrl(`${fetchedVideoData.link}`);

      let reactionData = {
        videousername: value.data.username,
        videoname: `${props.stream_id}/${props.video_id}`,
        videolink: `${fetchedVideoData.link}`,
      };
      //console.log('reaction: ', reactionData);

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/getreactions`,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: reactionData,
      })
        .then(function (response) {
          //console.log(response);
          setLike(response.data.reaction.like.length);
          setDislike(response.data.reaction.dislike.length);
          setAngry(response.data.reaction.angry.length);
          setHappy(response.data.reaction.happy.length);
        })
        .catch(function (error) {
          console.log(error);
        });

      if (user) {
        reactionData = {
          username: `${user.username}`,
          videousername: value.data.username,
          videoname: `${props.stream_id}/${props.video_id}`,
          videolink: `${fetchedVideoData.link}`,
        };

        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_SERVER_URL}/user/getuserreaction`,
          headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          data: reactionData,
        })
          .then(function (response) {
            ////console.log(response.data);
            setUserreact(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
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
        if (fileRes.data[i].username !== props.stream_id && fileRes.data[i].videos.length > 0) {
          setArrayData((prevState) => [...prevState, fileRes.data[i]]);
        }
      }
    }
    ////console.log(fileRes, "Hi");
    //await sf.initialize();
  };

  // //console.log('userData', userData);
  // //console.log(userData ? videoData.link : '');

  const handlereaction = (videoprops) => {
    if (!user) {
      handleLoginShow();
      return;
    }
    if (userreact === '') {
      const reactionData = {
        reactusername: `${user.username}`,
        videousername: `${userData.username}`,
        reaction: videoprops,
        videostreamid: `${props.stream_id}`,
        videoindex: `${props.video_id}`,
        videolink: `${videoData.link}`,
      };

      if (videoprops === 'like') {
        setLike(like + 1);
        setUserreact('like');
      } else if (videoprops === 'dislike') {
        setDislike(dislike + 1);
        setUserreact('dislike');
      } else if (videoprops === 'happy') {
        setHappy(happy + 1);
        setUserreact('happy');
      } else {
        setAngry(angry + 1);
        setUserreact('angry');
      }

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/reactions`,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: reactionData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      const reactionData = {
        reactusername: `${user.username}`,
        videousername: `${userData.username}`,
        newreaction: videoprops,
        oldreaction: userreact,
        videostreamid: `${props.stream_id}`,
        videoindex: `${props.video_id}`,
        videolink: `${videoData.link}`,
      };

      if (videoprops === userreact) {
        if (videoprops === 'like') {
          setLike(like - 1);
        } else if (videoprops === 'dislike') {
          setDislike(dislike - 1);
        } else if (videoprops === 'happy') {
          setHappy(happy - 1);
        } else {
          setAngry(angry - 1);
        }
        setUserreact('');
      } else {
        if (videoprops === 'like') {
          setLike(like + 1);
          setUserreact('like');
        } else if (videoprops === 'dislike') {
          setDislike(dislike + 1);
          setUserreact('dislike');
        } else if (videoprops === 'happy') {
          setHappy(happy + 1);
          setUserreact('happy');
        } else {
          setAngry(angry + 1);
          setUserreact('angry');
        }

        if (userreact === 'like') {
          setLike(like - 1);
        } else if (userreact === 'dislike') {
          setDislike(dislike - 1);
        } else if (userreact === 'happy') {
          setHappy(happy - 1);
        } else {
          setAngry(angry - 1);
        }
      }

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/removeuserreaction`,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: reactionData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  //const handlePlaylist = () => {};

  useEffect(() => {
    get_User();

    fetchData();
    let value = JSON.parse(window.localStorage.getItem('user'));
    ////console.log(value);

    if (user ? value.username === props.stream_id : false) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonText(text);
    }, 2000);
    return () => clearTimeout(timer);
  }, [buttonText]);

  ////console.log(arrayData);

  const testFlow = async (amount) => {
    const walletAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    const sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
    });
    await sf.initialize();

    const carol2 = sf.user({
      address: walletAddress[0],

      // fDAIx token, which is a test Super Token on Goerli network
      token: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00',
    });

    await carol2.flow({
      recipient: '0xF976A17dE1945C6977725aE289A1c2EA5d036789',
      // This flow rate is equivalent to 1 tokens per month, for a token with 18 decimals.
      flowRate: 385802469135 * amount,
    });

    //const details = await carol2.details();
    //console.log(details.cfa.flows.outFlows[0]);
  };
  return (
    <>
      {videoPresent ? (
        <div>
          {/* <Helmet>
              <meta property="og:title"              content={videoData.videoName} />
              <meta property="og:description"        content={`<div style='font-size:20px; font-weight:500;color:green;'>${videoData.description}</div>`} />
              <meta property="og:image"              content={`${videoData.videoImage}`} />
              
            </Helmet> */}
          <div
            className={`${darkMode && 'dark'}  grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row 
            2xl:pt-3 lg:pt-0 lg:pb-50 2xl:mt-14 mt-10 
             lg:mt-12 lg:ml-11  
             bg-gradient-to-b from-blue-50 via-blue-50 to-white  
             dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  
             dark:to-dbeats-dark-primary`}
          >
            <div className=" lg:col-span-2 dark:bg-dbeats-dark-alt text-black dark:text-white">
              <div className="self-center 2xl:px-12 lg:px-5 w-screen lg:w-full 2xl:mt-1 lg:mt-2 mt-2.5">
                {userData ? <VideoPlayer playbackUrl={playbackUrl} creatorData={userData} /> : null}
              </div>
              <div className="2xl:mx-7 2xl:px-7 lg:px-2 lg:mx-4 px-3 dark:bg-dbeats-dark-alt">
                <div className="lg:flex flex-row justify-between lg:my-2 my-1  ">
                  <div className="2xl:py-4 lg:py-2">
                    <div className=" w-full text-left mt-0" style={{ padding: '0px' }}>
                      {videoData ? (
                        <p className="font-semibold 2xl:text-xl lg:text-md pb-4">
                          {videoData.videoName}
                        </p>
                      ) : null}
                      {time ? (
                        <p className="font-semibold 2xl:text-lg lg:text-xs text-md text-gray-400 pb-4">
                          {time}
                        </p>
                      ) : null}
                    </div>
                    {!privateUser ? (
                      <div>
                        {user ? (
                          <div className="flex items-center ">
                            <button
                              className="flex items-center bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                              onClick={trackFollowers}
                            >
                              <span>{subscribeButtonText}</span>
                              <div
                                hidden={loader}
                                className="w-4 h-4 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                              ></div>
                            </button>

                            <button className="bg-dbeats-light    p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white ">
                              <i className="fas fa-dice-d20  mr-1 cursor-pointer"></i>
                              <span onClick={handleShowSubscriptionModal}>Become a SuperFan</span>
                            </button>
                          </div>
                        ) : (
                          <Link
                            to="/signup"
                            className="bg-dbeats-light  p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                          >
                            <span>Login to Subscribe and Become a SuperFan</span>
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="2xl:text-2xl lg:text-md 2xl:py-4 lg:py-2 py-2 flex justify-around">
                    <div className="  text-center lg:mx-3">
                      <button className="border-0 bg-transparent" onClick={handleShow}>
                        <i className="fas fa-share opacity-50 mx-2"></i>
                      </button>
                      <br />
                      <p className="2xl:text-base  text-base lg:text-sm"> SHARE</p>
                    </div>

                    <div className="  text-center">
                      <i
                        className={
                          userreact === 'like'
                            ? 'cursor-pointer fas fa-heart mx-3 text-red-700 animate-pulse'
                            : 'cursor-pointer fas fa-heart opacity-20 mx-3 hover:text-red-300  hover:opacity-100'
                        }
                        onClick={() => handlereaction('like')}
                      ></i>
                      <br />
                      <p className="text-base">{like}</p>
                    </div>
                    <div className="  text-center">
                      <i
                        className={
                          userreact === 'dislike'
                            ? 'cursor-pointer fas fa-heart-broken mx-3   text-purple-500'
                            : 'cursor-pointer fas fa-heart-broken opacity-20 mx-3 hover:text-purple-300 hover:opacity-100'
                        }
                        onClick={() => handlereaction('dislike')}
                      ></i>
                      <br />
                      <p className="text-base">{dislike}</p>
                    </div>
                    <div className="  text-center">
                      <i
                        className={
                          userreact === 'happy'
                            ? 'cursor-pointer far fa-laugh-squint mx-3 text-yellow-500 '
                            : 'cursor-pointer far fa-laugh-squint opacity-20 mx-3 hover:text-yellow-200  hover:opacity-100'
                        }
                        onClick={() => handlereaction('happy')}
                      ></i>{' '}
                      <br />
                      <p className="text-base"> {happy}</p>
                    </div>
                    <div className="  text-center">
                      <i
                        className={
                          userreact === 'angry'
                            ? 'cursor-pointer far fa-angry  mx-3 text-red-800'
                            : 'cursor-pointer far fa-angry  opacity-20 mx-3 hover:text-red-300 hover:opacity-100'
                        }
                        onClick={() => handlereaction('angry')}
                      ></i>{' '}
                      <br />
                      <p className="text-base"> {angry}</p>
                    </div>

                    <Menu
                      as="div"
                      className="relative inline-block text-left"
                      style={{ zIndex: 100 }}
                    >
                      <div style={{ zIndex: 50 }}>
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
                        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-1 py-1 ">
                            <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                              <button>Edit</button>
                            </Menu.Item>
                            {user ? (
                              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                                <button
                                  onClick={() => {
                                    handleShowPlaylist();
                                  }}
                                >
                                  Add to Playlist
                                </button>
                              </Menu.Item>
                            ) : (
                              <> </>
                            )}
                          </div>
                          <div className="px-1 py-1">
                            <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                              <button>Archive</button>
                            </Menu.Item>
                            <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                              <button>Move</button>
                            </Menu.Item>
                          </div>
                          <div className="px-1 py-1">
                            <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                              <button>Delete</button>
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                {videoData ? (
                  <div className="w-full">
                    <hr />
                    <h4 className="py-2 lg:text-sm 2xl:text-lg">Description : </h4>
                    <p className="pb-2 lg:text-sm 2xl:text-lg">{videoData.description}</p>
                    <hr />
                  </div>
                ) : null}
                <div className="bg-blue-50">
                  <iframe
                    className="w-full p-0 m-0 h-88 2xl:h-88 lg:h-88 mb-40"
                    title="comment"
                    src="https://theconvo.space/embed/dt?threadId=KIGZUnR4RzXDFheXoOwo"
                    allowtransparency="true"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
            <div className="  w-full pb-32 2xl:pt-6 pt-5 col-span-1 px-5 lg:pt-4 dark:bg-dbeats-dark-alt text-black  dark:text-white">
              <div className=" w-full  grid grid-cols-1 grid-flow-row gap-3  ">
                {arrayData.map((value, index) => {
                  return <RecommendedCard key={index} value={value} darkMode={darkMode} />;
                })}
              </div>
            </div>
          </div>
          <ShareModal
            show={show}
            handleClose={handleClose}
            sharable_data={sharable_data}
            copybuttonText={buttonText}
            setCopyButtonText={setButtonText}
          />
          <Modal
            isOpen={showSubscriptionModal}
            className="h-max lg:w-max w-5/6 bg-white mx-auto 2xl:mt-60 lg:mt-20 mt-32 shadow "
          >
            <div className={`${darkMode && 'dark'} h-max w-max`}>
              <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2   text-center relative bg-gradient-to-b from-blue-50 via-blue-50 to-blue-50  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary">
                <div className="col-span-5    text-gray-900 dark:text-gray-100 font-bold">
                  SUPERFAN
                </div>
                <div
                  className="ml-5 cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-primary absolute right-10 top-5"
                  onClick={handleCloseSubscriptionModal}
                >
                  <i className="fas fa-times"></i>
                </div>
              </h2>

              <div>
                <Container className="px-4 pb-4 bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary">
                  <div className="relative grid grid-cols-6">
                    <div className="   col-span-2">
                      <Lottie
                        options={defaultOptions2}
                        height={window.innerWidth >= '1536' ? 200 : 150}
                        width={window.innerWidth >= '1536' ? 500 : 300}
                      />
                    </div>
                    <div className="col-span-2 ">
                      <Lottie
                        options={defaultOptions}
                        height={window.innerWidth >= '1536' ? 200 : 150}
                        width={window.innerWidth >= '1536' ? 300 : 200}
                      />
                    </div>
                    <div className="   col-span-2">
                      <Lottie
                        options={defaultOptions3}
                        height={window.innerWidth >= '1536' ? 200 : 150}
                        width={window.innerWidth >= '1536' ? 500 : 300}
                      />
                    </div>
                  </div>
                  {/* 
                  <button
                    onClick={handleCloseSubscriptionModal}
                    className=" block text-center col-span-1 px-5 w-full  mx-auto p-2 mt-4 mb-2  text-dbeats-light font-semibold rounded-lg border  border-dbeats-light hover:border-white hover:text-white hover:bg-dbeats-dark-secondary transition-all transform hover:scale-95"
                  >
                    Cancel
                  </button> */}

                  <Row>
                    <div className="grid grid-cols-6 2xl:gap-4 lg:gap-2 w-full   self-center">
                      <button
                        onClick={() => testFlow(10)}
                        className="  h-max shadow text-center col-span-6 lg:col-span-2   2xl:w-full w-full lg:w-60  mx-auto p-2 2xl:p-2 lg:p-1  text-black dark:text-white font-semibold hover:rounded   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                      >
                        <span className="font-bold 2xl:text-2xl lg:text-sm">10 DAI</span>
                        <br></br>
                        <span className="2xl:text-2xl lg:text-sm">PER MONTH</span>
                        <br></br>
                        <p className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
                          Fans who contribute at this level get my thanks and access to recipes and
                          flash fiction.{' '}
                        </p>
                      </button>
                      <button
                        onClick={() => testFlow(30)}
                        className="  shadow text-center col-span-6 lg:col-span-2   2xl:w-full w-full lg:w-60  mx-auto p-2 2xl:p-2 lg:p-1     text-black dark:text-white font-semibold   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                      >
                        <span className="font-bold 2xl:text-2xl lg:text-sm">30 DAI</span>
                        <br></br>
                        <span className="2xl:text-2xl lg:text-sm">PER MONTH</span>
                        <br></br>
                        <span className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
                          You get all the goodies, my thanks, written content, and you will see
                          concept art for my Video Content before it goes public..{' '}
                        </span>
                      </button>
                      <button
                        onClick={() => testFlow(20)}
                        className="block shadow text-center col-span-6 lg:col-span-2   2xl:w-full w-full lg:w-60  mx-auto p-2 2xl:p-2 lg:p-1   text-black dark:text-white font-semibold   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                      >
                        <span className="font-bold 2xl:text-2xl lg:text-sm">20 DAI</span>
                        <br></br>
                        <span className="2xl:text-2xl lg:text-sm">PER MONTH</span>
                        <br></br>
                        <span className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
                          Fans who contribute at this level get my thanks and access to recipes and
                          flash fiction.{' '}
                        </span>
                      </button>
                    </div>
                  </Row>
                  <Row className="self-center text-center mt-5 dark:text-gray-500 font-semibold 2xl:text-lg lg:text-sm">
                    powered by{' '}
                    <img
                      src={superfluid}
                      alt="superfluid"
                      className="2xl:h-10 lg:h-8 rounded w-max  self-center mx-auto bg-white p-2 dark:bg-opacity-75"
                    ></img>
                  </Row>
                </Container>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={showLogin}
            className="h-max lg:w-1/3  w-5/6 bg-white mx-auto lg:mt-60 mt-32 rounded-lg"
          >
            <div className={`${darkMode && 'dark'}`}>
              <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-primary rounded-lg">
                <Row>
                  <h2 className="grid grid-cols-5 justify-around w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                    <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold">
                      Kindly Login
                    </div>
                    <div
                      className="ml-5 cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-primary absolute right-10 top-7 2xl:top-4 lg:top-2"
                      onClick={handleLoginClose}
                    >
                      <i className="fas fa-times"></i>
                    </div>
                  </h2>
                </Row>
                <Row>
                  <Link
                    to="/signup"
                    className="block mx-auto 2xl:p-2 p-2 lg:p-1 mt-4 mb-2 2xl:w-96 lg:w-72 w-full lg:text-md 2xl:text-lg  text-white text-center font-semibold rounded-lg bg-dbeats-light"
                  >
                    Login
                  </Link>
                </Row>
              </Container>
            </div>
          </Modal>

          {userData && userData.videos ? (
            <Playlist
              showPlaylist={showPlaylist}
              setShowPlaylist={setShowPlaylist}
              handleClosePlaylist={handleClosePlaylist}
              handleShowPlaylist={handleShowPlaylist}
              data={userData}
              id={props.video_id}
              datatype="video"
            />
          ) : null}
        </div>
      ) : null}
      {notFound ? (
        <PageNotFound
          headtext="Video Not found"
          text="Please check the Video ID"
          animation={animationDataNotFound}
        />
      ) : null}
      {userNotFound ? (
        <PageNotFound
          headtext="Video Not found"
          text="Please check the Username "
          animation={animationDataNotFound}
        />
      ) : null}
    </>
  );
};

export default PlayBackInfo;
