//import { Web3Provider } from '@ethersproject/providers';
import { Menu, Transition } from '@headlessui/react';
//import SuperfluidSDK from '@superfluid-finance/js-sdk';
import axios from 'axios';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Playlist } from '../../../../component/Modals/PlaylistModals/PlaylistModal';
import { ShareModal } from '../../../../component/Modals/ShareModal/ShareModal';
import PageNotFound from '../../../../component/PageNotFound/PageNotFound';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import animationDataNotFound from '../../../../lotties/error-animation.json';
import RecommendedCard from './RecommendedCard';
//import dbeatsLogoBnW from '../../../../assets/images/Logo/logo-blacknwhite.png';
import SuperfanModal from '../../../../component/Modals/SuperfanModal/superfan-modal';

//import maticLogo from '../../../../assets/graphics/polygon-matic-logo.svg';
//import Web3 from 'web3';
//import { Image } from 'react-img-placeholder';

// import {Helmet} from "react-helmet";

moment().format();

const PlayBackInfo = (props) => {
  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/playback/${props.video_username}/${props.video_id}`;
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

  const user = JSON.parse(window.localStorage.getItem('user'));

  const [playbackUrl, setPlaybackUrl] = useState('');

  const [loader, setLoader] = useState(true);

  const [userData, setUserData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [videoPresent, setVideoPresent] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [privateUser, setPrivate] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const [showBuyCrypto, setShowBuyCrypto] = useState(false);
  // const buyCrypto = () => setShowBuyCrypto(!showBuyCrypto);

  // const [showRecurring, setShowRecurring] = useState(false);
  // const toggleRecurring = () => setShowRecurring(!showRecurring);

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
  console.log(user);
  console.log(props);

  const trackFollowers = () => {
    if (user != null) {
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
            'auth-token': localStorage.getItem('authtoken'),
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
            'auth-token': localStorage.getItem('authtoken'),
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
    }
  };

  const get_User = async () => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/user/${props.video_username}`)
      .then((value) => {
        if (value.data === '') {
          setUserNotFound(true);
          return;
        }

        setFooterData(value.data);

        let fetchedVideoData;
        for (let i = 0; i < value.data.videos.length; i++) {
          if (value.data.videos[i].videoId === props.video_id) {
            fetchedVideoData = value.data.videos[i];
            setVideoData(value.data.videos[i]);

            let video_data = {
              username: value.data.username,
              videos: value.data.videos[i],
            };
            setUserData(video_data);
            break;
          }
        }

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
          videoname: `${props.video_username}/${props.video_id}`,
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
            videoname: `${props.video_username}/${props.video_id}`,
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
        videostreamid: `${props.video_username}`,
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
          'auth-token': localStorage.getItem('authtoken'),
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
        videostreamid: `${props.video_username}`,
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
          'auth-token': localStorage.getItem('authtoken'),
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
    setArrayData([]);
    get_User();

    fetchData();
    let value = JSON.parse(window.localStorage.getItem('user'));
    ////console.log(value);

    if (user ? value.username === props.video_username : false) {
      setPrivate(true);
    } else {
      setPrivate(false);
    }
    // eslint-disable-next-line
  }, [props.video_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonText(text);
    }, 2000);
    return () => clearTimeout(timer);
  }, [buttonText]);

  useEffect(() => {
    //View Counter

    if (user ? user.username !== props.video_username : false) {
      const timer = setTimeout(() => {
        const videoDetails = {
          videousername: `${props.video_username}`,
          videoindex: `${props.video_id}`,
          viewed_user: `${user.username}`,
        };

        axios({
          method: 'POST',
          url: `${process.env.REACT_APP_SERVER_URL}/user/views`,
          headers: {
            'content-type': 'application/json',
            'auth-token': localStorage.getItem('authtoken'),
          },
          data: videoDetails,
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [props.video_id]);

  ////console.log(arrayData);

  // const testFlow = async (amount) => {
  //   const walletAddress = await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //     params: [
  //       {
  //         eth_accounts: {},
  //       },
  //     ],
  //   });
  //   const sf = new SuperfluidSDK.Framework({
  //     ethers: new Web3Provider(window.ethereum),
  //   });
  //   await sf.initialize();

  //   const carol2 = sf.user({
  //     address: walletAddress[0],

  //     // fDAIx token, which is a test Super Token on Goerli network  0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00
  //     //MATICx Tokens 0x96B82B65ACF7072eFEb00502F45757F254c2a0D4
  //     token: '0x96B82B65ACF7072eFEb00502F45757F254c2a0D4',
  //   });
  //   let finalAmount = 385802469135 * amount;
  //   await carol2.flow({
  //     recipient: '0x7095b5921592D02C446C2C7bEF145D441Ab270ff',
  //     // This flow rate is equivalent to 1 tokens per month, for a token with 18 decimals.
  //     flowRate: finalAmount.toString(),
  //   });

  //   //const details = await carol2.details();
  //   //console.log(details.cfa.flows.outFlows[0]);
  // };

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
              lg:pb-50  
               sm:ml-20 
               mt-16
             bg-gradient-to-b from-blue-50 via-blue-50 to-white  
             dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  
             dark:to-dbeats-dark-primary`}
          >
            <div className=" lg:col-span-2 dark:bg-dbeats-dark-alt text-black dark:text-white ">
              <div className="self-center bg-black ">
                {footerData ? (
                  <VideoPlayer playbackUrl={playbackUrl} creatorData={footerData} footer={true} />
                ) : null}
              </div>
              <div className="2xl:mx-7 sm:p-2 p-3   dark:bg-dbeats-dark-alt">
                <div className=" flex  ">
                  <div className="2xl:py-4 lg:py-2 w-full">
                    <div className=" w-full text-left mt-0" style={{ padding: '0px' }}>
                      {userData ? (
                        <p className="font-semibold 2xl:text-xl lg:text-md ">
                          {userData.videos.videoName}
                        </p>
                      ) : null}
                      {time ? (
                        <p className="  2xl:text-lg lg:text-xs text-md text-gray-400 pb-4">
                          {userData.videos.views ? userData.videos.views.length : '0'} views{' '}
                          <span className=" mx-1">&#183;</span>
                          {time}
                        </p>
                      ) : null}
                    </div>
                    {!privateUser ? (
                      <div>
                        {user ? (
                          <div className="flex items-center   w-full">
                            <button
                              className="flex items-center dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                              onClick={
                                user != null ? trackFollowers : (window.location.href = '/signup')
                              }
                            >
                              <span>{subscribeButtonText}</span>
                              <div
                                hidden={loader}
                                className="w-4 h-4 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                              ></div>
                            </button>

                            <button
                              onClick={
                                user != null
                                  ? handleShowSubscriptionModal
                                  : (window.location.href = '/signup')
                              }
                              className={
                                footerData.superfan_data
                                  ? ' flex dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2      mr-3 font-semibold text-white   '
                                  : 'hidden'
                              }
                            >
                              <span
                                className={`${
                                  footerData.superfan_data ? '' : 'hidden'
                                } whitespace-nowrap  flex`}
                              >
                                Become a Superfan
                              </span>
                            </button>
                          </div>
                        ) : (
                          <Link
                            to="/signup"
                            className="bg-dbeats-light flex whitespace-nowrap  p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                          >
                            <span className="flex whitespace-nowrap">
                              Login to Subscribe & Become a SuperFan
                            </span>
                          </Link>
                        )}
                      </div>
                    ) : null}
                  </div>
                  <div className="2xl:text-2xl lg:text-md 2xl:py-4 lg:py-2 py-2 flex justify-around">
                    <div className="  text-center lg:mx-3">
                      <button className="border-0 bg-transparent" onClick={handleShow}>
                        <i className="fas fa-share-alt opacity-50 mx-2"></i>
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
                        <Menu.Items className="  dark:bg-opacity-10 backdrop-filter  backdrop-blur-md absolute right-0 w-56  origin-top-right bg-white dark:bg-dbeats-dark-primary dark:text-gray-50 divide-y divide-gray-100   shadow   focus:outline-none">
                          <div className="px-1 py-1 ">
                            {user ? (
                              <Menu.Item className="w-full text-gray-700 dark:text-gray-50 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
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
                    className="w-full p-0 m-0 h-88 2xl:h-88 lg:h-88 sm:mb-36"
                    title="comment"
                    src="https://theconvo.space/embed/dt?threadId=KIGZUnR4RzXDFheXoOwo"
                    allowtransparency="true"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
            <div className="  w-full pb-32  pt-2 col-span-1 sm:px-5 px-3  bg-opacity-30 bg-white sm:dark:bg-dbeats-dark-secondary dark:bg-dbeats-dark-alt text-black  dark:text-white">
              <div className=" w-full  grid grid-cols-1 grid-flow-row gap-3  ">
                {arrayData.map((value, index) => {
                  return (
                    <RecommendedCard
                      key={index}
                      value={value}
                      darkMode={darkMode}
                      handleShowPlaylist={handleShowPlaylist}
                    />
                  );
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

          <SuperfanModal
            userDataDetails={footerData}
            show={showSubscriptionModal}
            handleClose={handleCloseSubscriptionModal}
            className={`${darkMode && 'dark'}   mx-auto    mt-32 shadow `}
          />
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
