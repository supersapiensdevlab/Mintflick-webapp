import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-img-placeholder';
import ReactPlayer from 'react-player/lazy';
import { Link } from 'react-router-dom';
import maticLogo from '../../../assets/graphics/polygon-matic-logo.svg';
import dbeatsLogoBnW from '../../../assets/images/Logo/logo-blacknwhite.png';
import person from '../../../assets/images/profile.svg';
import axios from 'axios';
import BidModal from '../../../component/Modals/BidModal/BidModal';

moment().format();

const PlayBackCard = (props) => {
  const [playing, setPlaying] = useState(false);
  const user = JSON.parse(window.localStorage.getItem('user'));

  //let history = useHistory();

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const [time, setTime] = useState(null);

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
    if (buttonText === 'Login to Subscribe') {
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
            <div className="grid grid-cols-3 border-t border-opacity-20 mx-2">
              <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fas fa-heart mr-2"></i>
                  Like
                </p>
              </div>
              <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fas fa-share mr-2"></i>Share
                </p>
              </div>
              <div className="flex  text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100 flex items-center justify-center">
                  <i className="fas fa-flag mr-2"></i> Report
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <BidModal isBidOpen={showBidModal} handleCloseBid={handleCloseBidModal}></BidModal>
    </>
  );
};

export default PlayBackCard;
