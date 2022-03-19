import { Tab } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-grid-carousel';
import { Route, Switch, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import person from '../../../../assets/images/profile.svg';
import background from '../../../../assets/images/wallpaper.jpg';
import { ReactComponent as Verified } from '../../../../assets/icons/verified-account.svg';
import {
  UploadCoverImageModal,
  UploadProfileImageModal,
} from '../../../../component/Modals/ImageUploadModal/ImageUploadModal';
import ProfileUpdateModal from '../../../../component/Modals/ProfileUpdate/ProfileUpdate';
import ProfileSettingsModal from '../../../../component/Modals/ProfileUpdate/ProfileSettingsModal';

import AnnouncementCard from '../../Cards/AnnouncementCard';
import CarouselCard from '../../Cards/CarouselCard';
import PlaylistCard from '../../Cards/PlaylistCard';
import ReactionCard from '../../Cards/ReactionCard';
import TrackCard from '../../Cards/TrackCard';
import dbeatsLogoBnW from '../../../../assets/images/Logo/logo-blacknwhite.png';
import { Image } from 'react-img-placeholder';
import SuperfanModal from '../../../../component/Modals/SuperfanModal/superfan-modal';

const ProfileDetails = ({ setSharable_data, tabname, urlUsername, user, setShow, darkMode }) => {
  const [pinnedData, setPinnedData] = useState([]);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [superfan, setSuperfan] = useState(0);

  const [privateUser, setPrivate] = useState(true);
  const [loader, setLoader] = useState(true);
  const [isMailVerified, setIsMailVerified] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [subscribeLoader, setSubscribeLoader] = useState(true);

  const handleShow = () => setShow(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const handleShowUpdate = () => setShowUpdate(true);
  const handleCloseUpdate = () => setShowUpdate(false);

  const [showSettings, setshowSettings] = useState(false);
  const handleshowSettings = () => setshowSettings(true);
  const handleCloseSettings = () => setshowSettings(false);

  const navigate = useHistory();

  const [showUploadCoverImage, setShowUploadCoverImage] = useState(false);
  const [showUploadProfileImage, setShowUploadProfileImage] = useState(false);
  const handleCloseImage = () => {
    setShowUploadCoverImage(false);
    setShowUploadProfileImage(false);
  };

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [tabIndex, setTabIndex] = useState(0);
  const [postsData, setPostsData] = useState(null);

  const [buttonText, setButtonText] = useState('Follow');
  const [displayName, setDisplayName] = useState(user.name);

  const [superfan_data, setSuperfan_data] = useState(null);
  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);

  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const [pageUser, setPageUser] = useState(null);

  const myData = JSON.parse(window.localStorage.getItem('user'));
  if (myData)
    //console.log(myData.username);
    //console.log(user.username);

    useEffect(() => {
      let value = JSON.parse(window.localStorage.getItem('user'));
      if (value) {
        if (value.username === urlUsername) {
          setSharable_data(`${process.env.REACT_APP_CLIENT_URL}/profile/${value.username}`);
          setPrivate(true);
          setFollowers(value.follower_count.length);
          setFollowing(value.followee_count.length);
          setSuperfan(value.superfan_to.length);

          setIsMailVerified(value.is_mail_verified);
          setIsVerified(value.is_verified);

          if (value.pinned) {
            setPinnedData(value.pinned);
          }

          if (value.cover_image && value.cover_image !== '') {
            setCoverImage(value.cover_image);
          } else {
            setCoverImage(background);
          }

          if (value.profile_image && value.profile_image !== '') {
            setProfileImage(value.profile_image);
          } else {
            //console.log('person', person);
            setProfileImage(person);
          }

          if (value.posts) {
            let data = value.posts;
            setPostsData(data.reverse());
          }
        } else {
          get_User();
          setPrivate(false);
        }
      } else {
        get_User();
        setPrivate(false);
      }
      // eslint-disable-next-line
    }, [urlUsername]);

  useEffect(() => {
    let tabno = tabname;
    switch (tabno) {
      case 'posts':
        setTabIndex(0);
        break;
      case 'videos':
        setTabIndex(1);
        break;
      case 'music':
        setTabIndex(2);
        break;
      case 'activity':
        setTabIndex(3);
        break;
      case 'playlists':
        setTabIndex(4);
        break;
      case 'following':
        break;
      case 'followers':
        break;
      default:
        // navigate.push(`/profile/${urlUsername}`);
        setTabIndex(0);
    }
    // eslint-disable-next-line
  }, [tabname]);

  //console.log(navigate);

  const get_User = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${urlUsername}`).then((value) => {
      for (let i = 0; i < value.data.follower_count.length; i++) {
        if (myData) {
          if (value.data.follower_count[i] === myData.username) {
            setButtonText('Unfollow');
            break;
          }
        } else {
          setButtonText('Login to Follow');
          break;
        }
      }
      setSharable_data(`${process.env.REACT_APP_CLIENT_URL}/profile/${value.data.username}`);
      setFollowers(value.data.follower_count.length);
      setFollowing(value.data.followee_count.length);
      setSuperfan(value.data.superfan_to.length);

      setIsMailVerified(value.data.is_mail_verified);
      setIsVerified(value.data.is_verified);
      setSuperfan_data(value.data.superfan_data);
      setPageUser(value.data);

      if (value.data.cover_image && value.data.cover_image !== '') {
        setCoverImage(value.data.cover_image);
      } else {
        setCoverImage(background);
      }

      if (value.data.posts) {
        let data = value.data.posts;
        setPostsData(data.reverse());
      }

      if (value.data.profile_image && value.data.profile_image !== '') {
        setProfileImage(value.data.profile_image);
      } else {
        //console.log('person', person);
        setProfileImage(person);
      }
    });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  const trackFollowers = () => {
    setSubscribeLoader(false);
    if (buttonText === 'Login to Follow') {
      window.location.href = '/signup';
    }
    ////console.log(followers);
    const followData = {
      following: `${user.username}`,
      follower: `${myData.username}`,
    };

    if (buttonText === 'Follow') {
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
            setButtonText('Unfollow');
            setFollowers(followers + 1);
            setSubscribeLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          //console.log(error);
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
            setButtonText('Follow');
            setFollowers(followers - 1);
            setSubscribeLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  };

  const UnPinningUser = (pinnedUser) => {
    const UnPinningData = {
      username: myData.username,
      pinneduser: pinnedUser,
    };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/unpin`,
      data: UnPinningData,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then(() => {
        let value = [];
        for (let i = 0; i < pinnedData.length; i++) {
          if (pinnedData[i] !== pinnedUser) {
            value.push(pinnedData[i]);
          }
        }
        setPinnedData(value);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const PinningUser = (pinnedUser) => {
    const PinningData = {
      username: myData.username,
      pinneduser: pinnedUser,
    };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/pinned`,
      data: PinningData,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then(() => {
        setPinnedData((prevData) => [...prevData, pinnedUser]);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const SendVerificationMail = () => {
    let data = { email: myData.email };
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/send_verify_email`,
      data: data,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then(() => {
        setIsMailVerified(true);
      })
      .catch(function (error) {
        //console.log(error);
      });
  };

  const NavTabs = ['Posts', 'Videos', 'Music', 'Playlists']; //, 'Subscribed Channels'

  const NavTabsTitle = ({ text }) => {
    if (text === 'Subscribed Channels') {
      if (!privateUser) {
        return null;
      }
    }
    return (
      <Tab
        className={({ selected }) =>
          classNames(
            'w-full  text-sm leading-5 font-semibold text-gray-400 2xl:text-lg lg:text-xs ',
            selected
              ? 'text-dbeats-light font-bold border-b-2 border-dbeats-light'
              : 'hover:bg-black/[0.12]  dark:hover:text-gray-100 hover:text-gray-700',
          )
        }
      >
        <Link to={`/profile/${urlUsername}/${text.toLowerCase()}`}>
          <div className="w-full py-2.5 font-semibold text-gray-400 2xl:text-lg lg:text-xs ">
            {text}
          </div>
        </Link>
      </Tab>
    );
  };

  return (
    <div className={`${darkMode && 'dark'}   h-max lg:col-span-5 col-span-6 w-full   `}>
      <div id="display_details" className="h-full 2xl:pt-16 lg:pt-12 pt-16">
        {!isMailVerified && privateUser ? (
          <div
            className="bg-dbeats-dark-primary border-t-2 border-red-500 rounded-b text-red-900 px-4 py-2  shadow-md"
            role="alert"
          >
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <div className="py-1">
                  <svg
                    className="fill-current h-6 w-6 text-red-500 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Please verify your Email</p>
                </div>
              </div>
              <div
                className="w-30 bg-dbeats-dark-alt rounded  cursor-pointer text-red-500 px-4 py-1    hover:bg-red-500 hover:text-white"
                onClick={SendVerificationMail}
              >
                Send Verification Mail
              </div>
            </div>
          </div>
        ) : null}
        <div className="bg-white dark:bg-dbeats-dark-primary 2xl:pb-3 lg:pb-2">
          {privateUser ? (
            <div
              className="ml-2 mt-2 absolute dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark dark:text-gray-400 hover:bg-gray-200
          hover:text-dbeats-light dark:hover:text-white text-dbeats-light bg-white  rounded-full z-2 w-7 h-7 items-center"
            >
              <i
                className="fas fa-pen p-1.5 
       cursor-pointer align-middle items-center  "
                onClick={() => setShowUploadCoverImage(true)}
              ></i>
            </div>
          ) : (
            false
          )}
          <div className="block ">
            <img src={coverImage} alt="backgroundImg" className="2xl:h-88 lg:h-56 h-56 w-full " />
          </div>
          <div className="w-full ">
            <div className="w-full flex flex-col lg:flex-row 2xl:-mt-28 lg:-mt-20 -mt-20   ">
              <div className="w-full flex flex-col   z-1 mx-auto ">
                <div className="  flex flex-col lg:flex-row justify-between   md:mt-20  mt-40  sm:-mt-24 text-gray-400   dark:bg-dbeats-dark-primary bg-white dark:backdrop-filter dark:backdrop-blur dark:bg-opacity-80  backdrop-filter  backdrop-blur  bg-opacity-90">
                  <div className="dark:text-white  text-dbeats-dark-alt 2xl:py-4 lg:py-2.5    md:py-3 lg:mx-0 px-10 lg:px-10 md:px-4 ">
                    <div className="flex flex-wrap lg:pt-0 items-center ">
                      <span className="font-bold 2xl:text-xl lg:text-xl md:text-xl mr-3 font-GTWalsheimPro">
                        {user.name}
                      </span>
                      {!privateUser && myData && superfan_data ? (
                        <button
                          onClick={handleShowSubscriptionModal}
                          className={
                            superfan_data
                              ? ' flex nm-flat-dbeats-dark-primary  border border-dbeats-light dark:hover:bg-dbeats-light p-1 2xl:text-lg lg:text-sm text-md  rounded  2xl:px-4 px-4 lg:px-2      mr-3   text-white   '
                              : 'hidden'
                          }
                        >
                          <span
                            className={`${superfan_data ? '' : 'hidden'} whitespace-nowrap  flex`}
                          >
                            🥳 Become a Superfan
                          </span>
                        </button>
                      ) : null}
                      <button
                        onClick={handleShow}
                        className="no-underline border text-dbeats-dark-alt 
                        cursor-pointer dark:border-transparent border-1 dark:border-opacity-20  dark:text-gray-200 
                        hover:bg-dbeats-light hover:text-white 
                        dark:hover:text-white rounded   mr-1 
                        flex self-center   py-2.5 2xl:px-3 lg:px-1.5  text-xs 2xl:text-lg  px-2"
                      >
                        <i className="fas fa-share-alt self-center mx-1 "></i>
                      </button>
                      {myData && !privateUser ? (
                        <button
                          href="#"
                          className="flex items-center no-underline cursor-pointer border-dbeats-light border-1  
                          text-dbeats-light hover:bg-dbeats-light 
                          hover:text-white rounded font-bold mr-1   self-center py-1 2xl:px-3 lg:px-1.5 lg:text-sm 2xl:text-lg"
                          onClick={trackFollowers}
                        >
                          <span>
                            {buttonText === 'Follow' ? <i className="fas fa-plus"></i> : null}
                            &nbsp;{buttonText}
                          </span>
                          <div
                            hidden={subscribeLoader}
                            className="w-3 h-3 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                          ></div>
                        </button>
                      ) : null}

                      {privateUser ? (
                        <button
                          onClick={handleShowUpdate}
                          className="no-underline border text-dbeats-dark-alt 
                        cursor-pointer dark:border-white border-1 dark:border-opacity-20  dark:text-gray-200 
                        hover:bg-dbeats-light hover:text-white 
                        dark:hover:text-white rounded font-bold mr-1 
                        flex self-center   py-1 2xl:px-3 lg:px-1.5  text-xs 2xl:text-lg  px-2"
                        >
                          <i className="fas fa-pen self-center mr-2 "></i> Edit
                        </button>
                      ) : null}
                      {privateUser ? (
                        <button
                          onClick={handleshowSettings}
                          className="no-underline border text-dbeats-dark-alt 
                        cursor-pointer dark:border-white border-1 dark:border-opacity-20  dark:text-gray-200 
                        hover:bg-dbeats-light hover:text-white 
                        dark:hover:text-white rounded font-bold mr-1 
                        flex self-center   py-1 2xl:px-3 lg:px-1.5  text-xs 2xl:text-lg  px-2"
                        >
                          <i className="fas fa-cog  self-center mr-2"></i> Settings
                        </button>
                      ) : null}
                    </div>
                    <div className="flex items-center">
                      <span className="  2xl:text-lg lg:text-sm opacity-60">@{user.username}</span>
                      {isVerified ? (
                        <Verified className="h-5 w-5  items-center self-center justify-center text-dbeats-light mx-1" />
                      ) : null}
                    </div>
                  </div>

                  <div className="2xl::w-56 lg:w-44 w-full flex justify-center z-1 -mt-48  md:-mt-36 lg:-mt-20 2xl:-mt-24 mb-24 md:mb-8 2xl:mb-0 xl:mb-0 lg:mb-0  sm:-mt-24">
                    <div
                      className="2xl:px-1 2xl:py-1 shadow-sm 2xl:w-44 2xl:h-44 lg:w-32 
                lg:h-32 md:h-36 md:w-36 h-28 w-28 bg-white   
                dark:bg-dbeats-dark-primary overflow-hidden rounded-full    z-500 "
                    >
                      {/* <img
                        src={profileImage}
                        alt=""
                        className="relative h-full w-full dark:bg-dbeats-dark-alt align-middle items-center   rounded-full  z-500 "
                      /> */}
                      <Image
                        src={profileImage ? profileImage : dbeatsLogoBnW}
                        height={80}
                        width={80}
                        className="relative h-full w-full dark:bg-dbeats-dark-alt align-middle items-center   rounded-full  z-500 "
                        alt=""
                        placeholderSrc={dbeatsLogoBnW}
                      />
                      {privateUser ? (
                        <div className="flex justify-end ">
                          <div
                            className="absolute dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark dark:text-gray-400 hover:bg-gray-200
                        hover:text-dbeats-light dark:hover:text-white text-dbeats-light bg-white  rounded-full z-2 -mt-4 -mr-2 w-7 h-7 items-center"
                          >
                            <i
                              className="fas fa-pen p-1.5 
                     cursor-pointer align-middle items-center  "
                              onClick={() => setShowUploadProfileImage(true)}
                            ></i>
                          </div>
                        </div>
                      ) : (
                        false
                      )}
                    </div>
                  </div>

                  <div className="lg:grid lg:grid-flow-rows lg:grid-cols-3  font-bold 2xl:text-xl lg:text-sm text-gray-20 lg:gap-4 flex justify-between items-center mb-2 md:mb-5">
                    <div className="mx-auto lg:px-4 px-2 flex flex-col lg:flex-row justify-center items-center">
                      <div className=" w-full mr-2 flex justify-center ">
                        {/*{user.subscribers ? <>{user.subscribers.length}</> : 0}{" "}*/}
                        {followers}{' '}
                      </div>

                      <Link to={`/profile/${urlUsername}/followers`}>
                        <div className="cursor-pointer 2xl:text-sm lg:text-xs hover:underline hover:text-gray-50">
                          FOLLOWERS
                        </div>
                      </Link>
                    </div>
                    <div className="mx-auto lg:px-4 px-2 flex flex-col lg:flex-row justify-center items-center">
                      <div className=" w-full mr-2 flex justify-center ">
                        {/*{user.subscribed ? <>{user.subscribed.length}</> : 0}{" "}*/}
                        {following}{' '}
                      </div>
                      <Link to={`/profile/${urlUsername}/following`}>
                        <div className="cursor-pointer 2xl:text-sm lg:text-xs hover:underline hover:text-gray-50">
                          FOLLOWING
                        </div>
                      </Link>
                    </div>
                    <div className="mx-auto lg:px-4 px-2 flex flex-col lg:flex-row justify-center items-center">
                      <div className=" w-full mr-2 flex justify-center ">
                        {/*{user.subscribed ? <>{user.subscribed.length}</> : 0}{" "}*/}
                        {superfan}{' '}
                      </div>
                      <Link to={`/profile/${urlUsername}/superfans`}>
                        <div className="cursor-pointer 2xl:text-sm lg:text-xs hover:underline hover:text-gray-50">
                          SUPERFANS
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  relative mb-20 ">
          <Tab.Group defaultIndex={tabIndex}>
            <Tab.List className="flex  px-1  space-x-1 bg-white text-white  dark:bg-gradient-to-b  dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary bg-gradient-to-b    from-white  to-blue-50">
              {NavTabs.map((tab, idx) => {
                return <NavTabsTitle text={tab} key={idx} />;
              })}
            </Tab.List>

            <Switch>
              <Route path={`/profile/:username/posts`}>
                <div className=" sm:px-5  pb-5">
                  {postsData && postsData.length > 0 ? (
                    <div>
                      {postsData.map((post, i) => {
                        //////console.log(playbackUser)
                        return (
                          <div key={i}>
                            <AnnouncementCard
                              privateUser={privateUser}
                              post={post}
                              index={i}
                              username={user.username}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="2xl:text-lg lg:text-sm dark:text-white mt-2">No Posts till now</p>
                  )}
                </div>
              </Route>

              <Route path={`/profile/:username/videos`}>
                <div className=" sm:px-5  pb-5">
                  {user.videos && user.videos.length > 0 ? (
                    <div>
                      {user.videos
                        .slice(0)
                        .reverse()
                        .map((playbackUser, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div key={i}>
                              <CarouselCard
                                privateUser={privateUser}
                                videono={i}
                                playbackUserData={playbackUser}
                                index={user.videos.length - 1 - i}
                                username={user.username}
                                type="video"
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="2xl:text-lg lg:text-sm dark:text-white mt-2">
                      No Videos till now
                    </p>
                  )}
                </div>
              </Route>

              <Route path={`/profile/:username/music`}>
                <div className="sm:px-5  pb-5">
                  {user.tracks && user.tracks.length > 0 ? (
                    <div className="w-full">
                      {user.tracks
                        .slice(0)
                        .reverse()
                        .map((track, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div key={i} className="w-full">
                              <TrackCard
                                privateUser={privateUser}
                                trackno={i}
                                track={track}
                                index={i}
                                username={user.username}
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="2xl:text-lg lg:text-sm dark:text-white mt-2">No Music till now</p>
                  )}
                </div>
              </Route>

              <Route path={`/profile/:username/activity`}>
                <div className=" sm:px-5  pb-5">
                  {user.your_reactions.length > 0 ? (
                    <div>
                      {user.your_reactions
                        .slice(0)
                        .reverse()
                        .map((playbackUser, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div key={i} className="">
                              <ReactionCard
                                reactno={i}
                                playbackUserData={playbackUser}
                                index={i}
                                username={user.username}
                                type="video"
                              />
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="2xl:text-lg lg:text-sm dark:text-white mt-2">
                      No Latest Activity
                    </p>
                  )}
                </div>
              </Route>

              <Route path={`/profile/:username/playlists`}>
                <div className="px-2 2xl:pt-5 lg:pt-2 pb-5">
                  {user.my_playlists && user.my_playlists.length > 0 ? (
                    <div>
                      {user.my_playlists
                        .slice(0)
                        .reverse()
                        .map((playlist, i) => {
                          return (
                            <>
                              <div key={i} className="">
                                <h2 className="dark:text-white font-bold 2xl:text-2xl lg:text-lg text-md ml-2 my-2">
                                  {playlist.playlistname}
                                </h2>
                                <div>
                                  <Carousel cols={4}>
                                    {playlist.playlistdata.map((data, i) => {
                                      return (
                                        <Carousel.Item key={i}>
                                          <PlaylistCard playlistData={data} />
                                        </Carousel.Item>
                                      );
                                    })}
                                  </Carousel>
                                </div>
                              </div>
                              <hr className="2xl:my-7 lg:my-3 opacity-30" />
                            </>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="2xl:text-lg lg:text-sm dark:text-white">No Existing PlayLists</p>
                  )}
                </div>
              </Route>

              <Route path={`/profile/:username/following`}>
                <div className="pt-4 pl-4">
                  {privateUser ? (
                    <h2 className="text-white opacity-40">
                      Pinned Channels will be shown on left sidebar.
                    </h2>
                  ) : (
                    <h2 className="text-white opacity-40">Following</h2>
                  )}
                  <div className=" grid grid-cols-2 sm:grid-cols-4 grid-flow-row ">
                    {user.followee_count.length > 0 ? (
                      <div>
                        {user.followee_count.map((following, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div
                              key={i}
                              className="flex 2xl:text-lg lg:text-sm text-md shadow pl-4 w-full  lg:w-full   my-3 lg:my-2.5 py-2 rounded dark:hover:bg-dbeats-dark-alt dark:bg-dbeats-dark-secondary dark:text-gray-100 "
                            >
                              {privateUser ? (
                                <>
                                  {pinnedData.indexOf(following) > -1 ? (
                                    <i
                                      className="fas fa-thumbtack mx-3 my-auto 2xl:text-xl lg:text-md cursor-pointer "
                                      onClick={() => UnPinningUser(following)}
                                    ></i>
                                  ) : (
                                    <i
                                      className="fas fa-thumbtack mx-3 my-auto 2xl:text-xl lg:text-md  opacity-20 hover:opacity-100 cursor-pointer -rotate-45 transform"
                                      onClick={() => PinningUser(following)}
                                    ></i>
                                  )}
                                </>
                              ) : null}
                              <Link to={`/profile/${following}/posts`}>
                                <h2 className="hover:underline">{following}</h2>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="2xl:text-lg lg:text-sm dark:text-white mt-2">
                        🥺Not Following Anyone
                      </p>
                    )}
                  </div>
                </div>
              </Route>

              <Route path={`/profile/:username/followers`}>
                <div className="pt-4 pl-4">
                  {<h2 className="text-white opacity-40">Followers</h2>}
                  <div className=" grid grid-cols-2 sm:grid-cols-4 grid-flow-row ">
                    {user.follower_count ? (
                      <div>
                        {user.follower_count.map((follower, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div
                              key={i}
                              className="flex 2xl:text-lg lg:text-sm text-md shadow  w-full  lg:w-full pl-4  my-3 lg:my-2.5 py-2 rounded dark:hover:bg-dbeats-dark-alt dark:bg-dbeats-dark-secondary dark:text-gray-100 "
                            >
                              <Link to={`/profile/${follower}/posts`}>
                                <h2 className="hover:underline">{follower}</h2>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="2xl:text-lg lg:text-sm dark:text-white">🥺No Followers</p>
                    )}
                  </div>
                </div>
              </Route>

              <Route path={`/profile/:username/superfans`}>
                <div className="pt-4 pl-4">
                  {<h2 className="text-white opacity-40"> Superfans</h2>}
                  <div className=" grid grid-cols-2 sm:grid-cols-4 grid-flow-row ">
                    {user.superfan_to.length > 0 ? (
                      <div>
                        {user.superfan_to.reverse().map((superfan, i) => {
                          //////console.log(playbackUser)
                          return (
                            <div
                              key={i}
                              className="justify-between flex 2xl:text-lg lg:text-sm text-md shadow  w-full  lg:w-full px-4  my-3 lg:my-2.5 py-2 rounded dark:hover:bg-dbeats-dark-alt dark:bg-dbeats-dark-secondary dark:text-gray-100 "
                            >
                              <Link to={`/profile/${superfan.username}/posts`}>
                                <h2 className="hover:underline">{superfan.username}</h2>
                              </Link>
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-dbeats-white opacity-40 justify-end"
                                href={`https://polygonscan.com/tx/${superfan.txnHash}`}
                              >
                                view transaction
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="2xl:text-lg lg:text-sm dark:text-white mt-2"> 🥺No Superfans</p>
                    )}
                  </div>
                </div>
              </Route>
            </Switch>
          </Tab.Group>
        </div>
      </div>
      <UploadCoverImageModal
        show={showUploadCoverImage}
        handleClose={handleCloseImage}
        setCoverImage={setCoverImage}
        coverImage={coverImage}
        loader={loader}
        setLoader={setLoader}
        darkMode={darkMode}
      />
      <UploadProfileImageModal
        show={showUploadProfileImage}
        handleClose={handleCloseImage}
        setProfileImage={setProfileImage}
        loader={loader}
        setLoader={setLoader}
        darkMode={darkMode}
      />
      <ProfileUpdateModal
        show={showUpdate}
        handleClose={handleCloseUpdate}
        userData={user}
        darkMode={darkMode}
        setDisplayName={setDisplayName}
      />
      <ProfileSettingsModal
        show={showSettings}
        handleClose={handleCloseSettings}
        userData={user}
        darkMode={darkMode}
        setDisplayName={setDisplayName}
      />
      <SuperfanModal
        userDataDetails={pageUser}
        show={showSubscriptionModal}
        handleClose={handleCloseSubscriptionModal}
        className={`${darkMode && 'dark'}   mx-auto    mt-32 shadow `}
      />
    </div>
  );
};

export default ProfileDetails;
