import { Web3Provider } from '@ethersproject/providers';
import { Menu, Transition } from '@headlessui/react';
import SuperfluidSDK from '@superfluid-finance/js-sdk';
//import playimg from "../../../assets/images/telegram.png";
import axios from 'axios';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
// import Modal from 'react-awesome-modal';
// import { Container, Row } from 'react-bootstrap';
// import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import person from '../../../../assets/images/profile.svg';
// import superfluid from '../../../../assets/images/superfluid-black.svg';
import { ShareModal } from '../../../../component/Modals/ShareModal/ShareModal';
import SuperfanModal from '../../../../component/Modals/SuperfanModal/superfan-modal';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
// import animationDataConfetti from '../../../../lotties/confetti.json';
// import animationData from '../../../../lotties/fans.json';
// import animationDataGiraffee from '../../../../lotties/giraffee.json';
// import ChatRoom from '../../../Profile/ProfileSections/ChatRoom/ChatRoom';
// import classes from '../Info.module.css';
// import LiveCard from './LiveCard';
import LiveChat from './LiveChat';

const PublicInfo = (props) => {
  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/live/${props.stream_id}`;
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [userData, setUserData] = useState({});

  const [privateUser, setPrivate] = useState(true);

  const user = JSON.parse(window.localStorage.getItem('user'));
  const [time, setTime] = useState(null);

  const [playbackUrl, setPlaybackUrl] = useState('');

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);
  const [subscribeButtonText, setSubscribeButtonText] = useState('Subscribe');

  // eslint-disable-next-line no-unused-vars
  const [arrayData, setArrayData] = useState([]);

  const trackFollowers = () => {
    const followData = {
      following: `${userData.username}`,
      follower: `${user.username}`,
    };

    if (subscribeButtonText === 'Subscribe') {
      setSubscribeButtonText('Unsubscribe');
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
        headers: {
          'content-type': 'application/json',
          'auth-token':localStorage.getItem('authtoken')
        },
        data: followData,
        
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
      setSubscribeButtonText('Subscribe');
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
        headers: {
          'content-type': 'application/json',
          'auth-token':localStorage.getItem('authtoken')
        },
        data: followData,
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

  const get_User = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${props.stream_id}`).then((value) => {
      setUserData(value.data);
      for (let i = 0; i < value.data.follower_count.length; i++) {
        if (user ? value.data.follower_count[i] === user.username : false) {
          setSubscribeButtonText('Unsubscribe');
          break;
        }
      }
      setPlaybackUrl(
        `https://cdn.livepeer.com/hls/${value.data.livepeer_data.playbackId}/index.m3u8`,
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
    let value = JSON.parse(window.localStorage.getItem('user'));
    console.log(userData);
    console.log(user);
    if (user ? value.username === props.stream_id : false) {
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
    <div className="">
      <div
        className={`${
          darkMode && 'dark'
        }  grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row  pb-50  lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary`}
      >
        <div className=" lg:col-span-2 pt-3 mt-10">
          <div className="self-center lg:px-8 w-screen lg:w-full lg:mt-3 mt-0.5  ">
            {userData ? (
              <VideoPlayer playbackUrl={playbackUrl} creatorData={userData} footer={true} />
            ) : null}
          </div>

          <div className="2xl:mx-7 sm:p-2 p-3   dark:bg-dbeats-dark-secondary">
            <div className=" flex  ">
              <div className="2xl:py-4 lg:py-2 w-full">
                <div className=" w-full text-left mt-0" style={{ padding: '0px' }}>
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
                    {userData ? (
                      <>
                        {' '}
                        <div className="flex   text-black text-sm font-medium   px-4  py-3">
                          <Link to={`/profile/${user.username}/`} className="mr-4">
                            <img
                              src={user.profile_image ? user.profile_image : person}
                              alt=""
                              className="  w-16 h-14    rounded-full    self-start"
                            />
                          </Link>
                          <div className="w-full flex  justify-between mt-2">
                            <div>
                              <div className="w-full self-center  ">
                                <Link
                                  to={`/profile/${user.username}/`}
                                  className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                                >
                                  <div className="flex align-middle">
                                    <h3 className="text-white mr-1 text-lg tracking-wider">
                                      {user.name}
                                    </h3>
                                    &middot;
                                    <p className="text-white ml-1 text-opacity-40 text-xs self-center align-middle">
                                      {time}
                                    </p>
                                  </div>

                                  <p className="text-white text-opacity-40">{user.username}</p>
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
                        <div className="flex items-center   w-full">
                          {subscribeButtonText === 'Subscribe' ? (
                            <button
                              id="subscribeButton"
                              className="flex items-center dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                              onClick={trackFollowers}
                            >
                              <span>{subscribeButtonText}</span>
                              {/* <div
                            hidden={loader}
                            className="w-4 h-4 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                          ></div> */}
                            </button>
                          ) : null}

                          <button
                            onClick={handleShowSubscriptionModal}
                            className={
                              userData.superfan_data
                                ? ' flex dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2      mr-3 font-semibold text-white   '
                                : 'hidden'
                            }
                          >
                            <span
                              className={`${
                                userData.superfan_data ? '' : 'hidden'
                              } whitespace-nowrap flex`}
                            >
                              Become a Superfan
                            </span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        to="/signup"
                        className="bg-dbeats-light flex  p-1 2xl:text-lg lg:text-sm text-md  rounded-sm 2xl:px-4 px-4 lg:px-2 mr-3 font-semibold text-white "
                      >
                        <span className="whitespace-nowrap flex">
                          Login to Subscribe & Become a SuperFan
                        </span>
                      </Link>
                    )}
                  </div>
                ) : null}
              </div>
              <div className="2xl:text-2xl lg:text-md 2xl:py-4 lg:py-2 py-2 flex justify-around dark:text-dbeats-white">
                <div className="  text-center lg:mx-3">
                  <button className="border-0 bg-transparent" onClick={handleShow}>
                    <i className="fas fa-share-alt opacity-50 mx-2"></i>
                  </button>
                  <br />
                  <p className="2xl:text-base  text-base lg:text-sm"> SHARE</p>
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
                      <div className="px-1 py-1 ">
                        <Menu.Item className="w-full text-gray-700 dark:text-gray-50 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                          <button>Report</button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </div>
        <div className="  w-full col-span-1" style={{ height: '100vh' }}>
          {userData.username && <LiveChat userp={userData} privateUser={user}></LiveChat>}
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
        userDataDetails={userData}
        show={showSubscriptionModal}
        handleClose={handleCloseSubscriptionModal}
        className={`${darkMode && 'dark'}   mx-auto    mt-32 shadow `}
      />
    </div>
  );
};

export default PublicInfo;
