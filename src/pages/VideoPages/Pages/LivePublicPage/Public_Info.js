import { Web3Provider } from '@ethersproject/providers';
import { Menu, Transition } from '@headlessui/react';
import SuperfluidSDK from '@superfluid-finance/js-sdk';
//import playimg from "../../../assets/images/telegram.png";
import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-awesome-modal';
import { Container, Row } from 'react-bootstrap';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';
import superfluid from '../../../../assets/images/superfluid-black.svg';
import { ShareModal } from '../../../../component/Modals/ShareModal/ShareModal';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import animationDataConfetti from '../../../../lotties/confetti.json';
import animationData from '../../../../lotties/fans.json';
import animationDataGiraffee from '../../../../lotties/giraffee.json';
import classes from '../Info.module.css';
import LiveCard from './LiveCard';

const PublicInfo = (props) => {
  let sharable_data = `https://dbeats-demo.vercel.app /live/${props.stream_id}`;
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);

  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const [userData, setUserData] = useState(null);

  const [privateUser, setPrivate] = useState(true);

  const user = JSON.parse(window.localStorage.getItem('user'));

  const [playbackUrl, setPlaybackUrl] = useState('');

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);
  const [subscribeButtonText, setSubscribeButtonText] = useState('Subscribe');

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
          'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
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
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`);
    for (let i = 0; i < fileRes.data.length; i++) {
      if (user ? fileRes.data[i].username !== user.username : true) {
        await axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/get_user_by_id/${fileRes.data[i].id}`)
          .then((response) => {
            if (response.data) {
              setArrayData((prevState) => [...prevState, response.data]);
            }
          });
      }
    }
    ////console.log(fileRes, "Hi");
  };

  useEffect(() => {
    get_User();
    fetchData();
    let value = JSON.parse(window.localStorage.getItem('user'));
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
    <div className="mt-10">
      <div
        className={`${
          darkMode && 'dark'
        }  grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row pt-3 pb-50 mt-10 lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary`}
      >
        <div className=" lg:col-span-2">
          <div className="self-center lg:px-8 w-screen lg:w-full lg:mt-3 mt-0.5">
            {userData ? <VideoPlayer playbackUrl={playbackUrl} creatorData={userData} /> : null}
          </div>

          <div className="lg:mx-7 lg:px-7 px-3">
            <div className="lg:flex flex-row justify-between lg:my-2 my-1  ">
              <div className="py-4">
                <div className=" w-full text-left mt-0" style={{ padding: '0px' }}>
                  {userData ? <p className="font-semibold text-xl pb-4">{}</p> : null}
                </div>
                {!privateUser ? (
                  <div>
                    {user ? (
                      <button
                        className="bg-dbeats-light p-1 text-lg rounded-sm px-4 mr-3 font-semibold text-white "
                        onClick={trackFollowers}
                      >
                        <span>{subscribeButtonText}</span>
                      </button>
                    ) : (
                      <a
                        href="/signup"
                        className="bg-dbeats-light p-1 text-lg rounded-sm px-4 mr-3 font-semibold text-white "
                      >
                        <span>Login</span>
                      </a>
                    )}
                    <button className="bg-dbeats-light    p-1 text-lg rounded-sm px-4 mr-3 font-semibold text-white ">
                      <i className="fas fa-dice-d20  mr-1 cursor-pointer"></i>
                      <span onClick={handleShowSubscriptionModal}>Become a SuperFan</span>
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="text-2xl lg:py-4 py-2 flex justify-around">
                <div className="  text-center lg:mx-3">
                  <button className="border-0 bg-transparent" onClick={handleShow}>
                    <i className="fas fa-share opacity-50 mx-2"></i>
                  </button>
                </div>
                <i className="fas fa-heart opacity-50 mx-2"></i>
                <i className="fas fa-heart-broken opacity-50 mx-2"></i>
                <i className="far fa-laugh-squint opacity-50 mx-2"></i>
                <i className="far fa-angry opacity-50 mx-2"></i>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="">
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
                        <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                          <button>Duplicate</button>
                        </Menu.Item>
                      </div>
                      <div>
                        <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                          <button>Archive</button>
                        </Menu.Item>
                        <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                          <button>Move</button>
                        </Menu.Item>
                      </div>
                      <div>
                        <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                          <button>Delete</button>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
            {userData ? (
              <div className="w-full">
                <hr />
                <h4 className="py-2">Description : </h4>
                <p className="pb-2">{userData.name}</p>
                <hr />
              </div>
            ) : null}
            <div className={`${classes.comment_section}`}>
              <iframe
                className="w-full p-0 m-0 h-60 lg:h-88"
                title="comment"
                src="https://theconvo.space/embed/dt?threadId=KIGZUnR4RzXDFheXoOwo"
                allowtransparency="true"
                loading="eager"
              />
            </div>
          </div>
        </div>
        <div className="  w-full col-span-1 px-5 mt-12">
          <div className=" w-full grid grid-cols-1 grid-flow-row gap-3">
            {arrayData.map((value, index) => {
              return <LiveCard key={index} value={value} />;
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
        visible={showSubscriptionModal}
        className="h-max w-max"
        effect="fadeInUp"
        aria-labelledby="contained-modal-title-vcenter "
        centered
      >
        <div className={`${darkMode && 'dark'} h-max w-max`}>
          <h2 className="grid grid-cols-5 justify-items-center text-2xl py-4   text-center relative bg-gradient-to-b from-blue-50 via-blue-50 to-blue-50  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary">
            <div className="col-span-5    text-gray-900 dark:text-gray-100 font-bold">SUPERFAN</div>
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
                  <Lottie options={defaultOptions2} height={200} width={500} />
                </div>
                <div className="col-span-2 ">
                  <Lottie options={defaultOptions} height={200} width={300} />
                </div>
                <div className="   col-span-2">
                  <Lottie options={defaultOptions3} height={200} width={500} />
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
                <div className="grid grid-cols-6 gap-4 w-full   self-center">
                  <button
                    onClick={() => testFlow(10)}
                    className="  h-max shadow text-center col-span-6 lg:col-span-2   w-full  mx-auto p-2   text-black dark:text-white font-semibold hover:rounded   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                  >
                    <span className="font-bold text-2xl">10 DAI</span>
                    <br></br>
                    <span>PER MONTH</span>
                    <br></br>
                    <p className="text-sm font-thin text-gray-800 dark:text-gray-300">
                      Fans who contribute at this level get my thanks and access to recipes and
                      flash fiction.{' '}
                    </p>
                  </button>
                  <button
                    onClick={() => testFlow(30)}
                    className="  shadow text-center col-span-6 lg:col-span-2   w-full  mx-auto p-2    text-black dark:text-white font-semibold   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                  >
                    <span className="font-bold text-2xl">30 DAI</span>
                    <br></br>
                    <span>PER MONTH</span>
                    <br></br>
                    <span className="text-sm font-thin text-gray-800 dark:text-gray-300">
                      You get all the goodies, my thanks, written content, and you will see concept
                      art for my Video Content before it goes public..{' '}
                    </span>
                  </button>
                  <button
                    onClick={() => testFlow(20)}
                    className="block shadow text-center col-span-6 lg:col-span-2   w-full  mx-auto p-2  text-black dark:text-white font-semibold   border dark:bg-dbeats-dark-alt border-dbeats-light hover:shadow-none transition-all transform hover:scale-99 hover:bg-dbeats-light "
                  >
                    <span className="font-bold text-2xl">20 DAI</span>
                    <br></br>
                    <span>PER MONTH</span>
                    <br></br>
                    <span className="text-sm font-thin text-gray-800 dark:text-gray-300">
                      Fans who contribute at this level get my thanks and access to recipes and
                      flash fiction.{' '}
                    </span>
                  </button>
                </div>
              </Row>
              <Row className="self-center text-center mt-5 dark:text-gray-500 font-semibold">
                powered by{' '}
                <img
                  src={superfluid}
                  alt="superfluid"
                  className="h-10 rounded w-max  self-center mx-auto bg-white p-2 dark:bg-opacity-75"
                ></img>
              </Row>
            </Container>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublicInfo;
