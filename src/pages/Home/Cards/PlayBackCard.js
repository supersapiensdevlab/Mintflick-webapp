import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-img-placeholder';
import ReactPlayer from 'react-player/lazy';
import { Link } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import Modal from 'react-modal';
import maticLogo from '../../../assets/graphics/polygon-matic-logo.svg';
import { useSelector } from 'react-redux';
import dbeatsLogoBnW from '../../../assets/images/Logo/logo-blacknwhite.png';
import person from '../../../assets/images/profile.svg';
import axios from 'axios';
import BidModal from '../../../component/Modals/BidModal/BidModal';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';
import { RadioGroup } from '@headlessui/react';

moment().format();

const PlayBackCard = (props) => {
  const [playing, setPlaying] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));

  const [like, setLike] = useState(0);
  const [userreact, setUserreact] = useState('');

  //let history = useHistory();
  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/playback/${
    props.playbackUserData.user ? props.playbackUserData.user.username : ''
  }/${props.playbackUserData.id}`;
  // const setUserName = props.playbackUserData.user.name.toLower();
  // console.log(setUserName);

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const shareText = 'Copy Link To Clipboard';
  const [shareButtonText, setShareButtonText] = useState(shareText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShareButtonText(shareText);
    }, 2000);
    return () => clearTimeout(timer);
  }, [shareButtonText]);

  useEffect(() => {
    if (user && user.your_reactions.length != 0 && props.playbackUserData.user) {
      let checkVideo = `${props.playbackUserData.user.username}/${props.playbackUserData.id}`;
      for (let i = 0; i < user.your_reactions.length; i++) {
        if (user.your_reactions[i].link == checkVideo) {
          setUserreact('like');
        }
      }
    }
  });
  // console.log(props.playbackUserData);
  // console.log(user);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const [time, setTime] = useState(null);

  const [showShare, setShowShare] = useState(false);
  const handleShareClose = () => setShowShare(false);
  const handleShareShow = () => setShowShare(true);

  useEffect(() => {
    if (props.playbackUserData) {
      let videotime = props.playbackUserData.time;
      const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
      setTime(moment(timestamp).fromNow());
    }
    // eslint-disable-next-line
  }, []);

  const [subscribeLoader, setSubscribeLoader] = useState(true);

  const [buttonText, setButtonText] = useState('follow');
  const [followers, setFollowers] = useState(0);
  const [listingPrice, setListingPrice] = useState(null);

  const trackFollowers = () => {
    setSubscribeLoader(false);
    if (buttonText === 'Login to Follow') {
      window.location.href = '/signup';
    }
    //console.log(followers);
    const followData = {
      following: `${props.playbackUserData.user.username}`,
      follower: `${user.username}`,
    };

    if (buttonText === 'follow') {
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
            setButtonText('following');
            setFollowers(followers + 1);
            setSubscribeLoader(true);
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
            setButtonText('follow');
            setFollowers(followers - 1);
            setSubscribeLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const [showBidModal, setShowBidModal] = useState(false);
  const handleCloseBidModal = () => setShowBidModal(false);
  const handleShowBidModal = () => setShowBidModal(true);

  const [showReport, setShowReport] = useState(false);
  const handleReportShow = () => setShowReport(true);
  const handleReportClose = () => setShowReport(false);

  const [showReportSubmitThankyou, setShowReportSubmitThankyou] = useState(false);
  const handleReportThankyouShow = () => setShowReportSubmitThankyou(true);
  const handleReportThankyouClose = () => setShowReportSubmitThankyou(false);

  const [showOtherReport, setShowOtherReport] = useState(false);
  const handleOtherReportShow = () => setShowOtherReport(true);
  const handleOtherReportClose = () => setShowOtherReport(false);

  const [reportValue, setReportValue] = useState('Nudity or pornography');
  const [userReportValue, setUserReportValue] = useState('');

  const handleReportSubmit = () => {
    if (user) {
      let reportData = {
        reporter: user.username,
        reported: props.playbackUserData.user.username,
        report: reportValue,
        videoId: props.playbackUserData.id,
      };
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/videoreports`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
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
    } else {
      window.location.href = '/signup';
    }
  };

  // const handleLike = () => {
  //   if (user) {
  //     // Code For Like
  //   } else {
  //     window.location.href = '/signup';
  //   }
  // };

  const handleInputChange = (e) => {
    setReportValue(e.target.value);
  };

  const handlereaction = (videoprops) => {
    if (!user) {
      window.location.href = '/signup';
    }
    if (userreact === '') {
      const reactionData = {
        reactusername: `${user.username}`,
        videousername: `${props.playbackUserData.user.username}`,
        reaction: videoprops,
        videostreamid: `${props.playbackUserData.user.username}`,
        videoindex: `${props.playbackUserData.id}`,
        videolink: `${props.playbackUserData.link}`,
      };

      if (videoprops === 'like') {
        setLike(like + 1);
        setUserreact('like');
      }
      // else if (videoprops === 'dislike') {
      //   setDislike(dislike + 1);
      //   setUserreact('dislike');
      // } else if (videoprops === 'happy') {
      //   setHappy(happy + 1);
      //   setUserreact('happy');
      // } else {
      //   setAngry(angry + 1);
      //   setUserreact('angry');
      // }

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
        videousername: `${props.playbackUserData.user.username}`,
        newreaction: videoprops,
        oldreaction: userreact,
        videostreamid: `${props.playbackUserData.user.username}`,
        videoindex: `${props.playbackUserData.id}`,
        videolink: `${props.playbackUserData.link}`,
      };

      if (videoprops === userreact) {
        if (videoprops === 'like') {
          setLike(like - 1);
        }
        // else if (videoprops === 'dislike') {
        //   setDislike(dislike - 1);
        // } else if (videoprops === 'happy') {
        //   setHappy(happy - 1);
        // } else {
        //   setAngry(angry - 1);
        // }
        setUserreact('');
      } else {
        if (videoprops === 'like') {
          setLike(like + 1);
          setUserreact('like');
        }
        // else if (videoprops === 'dislike') {
        //   setDislike(dislike + 1);
        //   setUserreact('dislike');
        // } else if (videoprops === 'happy') {
        //   setHappy(happy + 1);
        //   setUserreact('happy');
        // } else {
        //   setAngry(angry + 1);
        //   setUserreact('angry');
        // }

        if (userreact === 'like') {
          setLike(like - 1);
        }
        // else if (userreact === 'dislike') {
        //   setDislike(dislike - 1);
        // } else if (userreact === 'happy') {
        //   setHappy(happy - 1);
        // } else {
        //   setAngry(angry - 1);
        // }
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
  // const handleReport = () => {
  //   if (user) {
  //     // Code For Report
  //   } else {
  //     window.location.href = '/signup';
  //   }
  // };

  return (
    <>
      {props.playbackUserData.user ? (
        <div
          className={`${props.darkMode && 'dark'} my-4  dark:text-gray-50 
           shadow-sm dark:shadow-md  p-0.5  sm:rounded-xl bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary-lg      text-dbeats-dark-primary    relative   `}
        >
          <div className="sm:rounded-xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary">
            <div className=" pb-4 ">
              <div className="flex   text-black text-sm font-medium   px-4  py-3">
                <Link to={`/profile/${props.playbackUserData.user.username}/`} className="mr-4">
                  <img
                    src={
                      props.playbackUserData.user.profile_image
                        ? props.playbackUserData.user.profile_image
                        : person
                    }
                    alt=""
                    className="  w-16 h-14    rounded-full    self-start"
                  />
                </Link>
                <div className="w-full flex  justify-between mt-2">
                  <div>
                    <div className="w-full self-center  ">
                      <Link
                        to={`/profile/${props.playbackUserData.user.username}/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                      >
                        <div className="flex align-middle">
                          <p className="text-white mr-1">{props.playbackUserData.user.name}</p>
                          &middot;
                          <p className="text-white ml-1 text-opacity-40 text-xs self-center align-middle">
                            {time}
                          </p>
                        </div>

                        <p className="text-white text-opacity-40">
                          {props.playbackUserData.user.username}
                        </p>
                      </Link>{' '}
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

              <div className=" text-base  dark:text-gray-200   text-gray-900 px-4  ">
                {props.playbackUserData.title.slice(0, 45)}
                {props.playbackUserData.title.length > 45 ? '...' : ''}
              </div>
            </div>
            <div
              className={`cursor-pointer w-full 2xl:h-max lg:h-max md:h-max xs:h-max min-h-full   dark:bg-black bg-black `}
            >
              <Link
                to={`/playback/${props.playbackUserData.user.username}/${props.playbackUserData.id}`}
                className="h-full "
              ></Link>
              <ReactPlayer
                className="w-full h-full max-h-screen "
                width="100%"
                height="480px"
                playing={true}
                muted={true}
                volume={0.5}
                light={props.playbackUserData.artwork}
                url={props.playbackUserData.link}
                controls={true}
              />
            </div>
            <div className="flex   text-black text-sm font-medium   px-4  py-3">
              <Link to={`/profile/${props.playbackUserData.user.username}/`} className="mr-4">
                <img
                  src={
                    props.playbackUserData.user.profile_image
                      ? props.playbackUserData.user.profile_image
                      : person
                  }
                  alt=""
                  loading="lazy"
                  className="w-16 h-14 rounded-full self-start"
                />
              </Link>
              <div className="w-full flex justify-between mt-2">
                <div>
                  <div className="w-full self-center  ">
                    <Link
                      to={`/profile/${props.playbackUserData.user.username}/`}
                      className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                    >
                      <h4>{props.playbackUserData.user.name} </h4>
                    </Link>{' '}
                    <div className="2xl:text-sm lg:text-xs text-sm text-gray-500 pr-2 flex  ">
                      owner
                    </div>
                  </div>
                </div>
                <div className="flex ">
                  {listingPrice ? (
                    <div className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                      <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                        <img
                          className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                          src={maticLogo}
                          alt="logo"
                        ></img>
                        <p className="self-center mx-2">200</p>
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={handleShowBidModal}
                      className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    >
                      <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                        <img
                          className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                          src={maticLogo}
                          alt="logo"
                        ></img>
                        <p className="self-center mx-2">Make an offer</p>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-around border-t border-opacity-20 mx-2">
              {user && user.username != props.playbackUserData.user.username ? (
                <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p
                    // onClick={handlereaction}
                    className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100"
                  >
                    <i
                      className={
                        userreact === 'like'
                          ? `fas fa-heart mr-2 text-red-700 animate-pulse`
                          : `fas fa-heart mr-2`
                      }
                    ></i>
                    Like
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div
                onClick={handleShareShow}
                className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3"
              >
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fas fa-share mr-2"></i>Share
                </p>
              </div>
              {user && user.username != props.playbackUserData.user.username ? (
                <div className="flex  text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p
                    onClick={handleReportShow}
                    className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100 flex items-center justify-center"
                  >
                    <i className="fas fa-flag mr-2"></i> Report
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <BidModal isBidOpen={showBidModal} handleCloseBid={handleCloseBidModal}></BidModal>
      <ShareModal
        show={showShare}
        handleClose={handleShareClose}
        sharable_data={sharable_data}
        copybuttonText={shareButtonText}
        setCopyButtonText={setShareButtonText}
      />
      <Modal
        isOpen={showReport}
        className="h-max lg:w-1/3  w-5/6  mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && 'dark'} border rounded-lg`}>
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
                <h1 className="text-white text-xl mb-2">Why are you reporting this post?</h1>
                <div className="w-full max-h-60 overflow-y-scroll text-white text-lg">
                  <RadioGroup value={reportValue} onChange={setReportValue} className=" w-max">
                    <RadioGroup.Option
                      value="Nudity or pornography"
                      className="p-1 cursor-pointer flex items-center"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>Violent threat</span>
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
                        <span className={checked ? 'text-dbeats-light' : ''}>Animal abuse</span>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Death, severe injury, dangerous"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>Firearms</span>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>
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
                          <span className={checked ? 'text-dbeats-light' : ''}>Report piracy</span>
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
        <div className={`${darkMode && 'dark'}`}>
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
        <div className={`${darkMode && 'dark'} border rounded-lg`}>
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
    </>
  );
};

export default PlayBackCard;
