import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-grid-carousel';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';
import logo from '../..//assets/images/logo.svg';
import animationData from '../../lotties/gamers.json';
import ResponsiveCarousel from './Cards/HomeSlider';
import LiveCard from './Cards/LiveCard';
import PlayBackCard from './Cards/PlayBackCard';
// import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Dropdown from '../../component/dropdown.component';

const Home = () => {
  const [activeStreams, setActiveStreams] = useState([]);
  const [slides, setSlides] = useState([]);
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [arrayData, setArrayData] = useState([]);

  const [latestVideo, setLatestVideo] = useState([]);
  const [latestTrack, setLatestTrack] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleShowFeedback = () => setShowFeedback(true);

  const [showWelcome, setShowWelcome] = useState(true);
  const handleShowWelcome = () => setShowWelcome(false);

  const user = JSON.parse(window.localStorage.getItem('user'));
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const [latestUploads, setLatestUploads] = useState(null);

  const category = [
    'Trending',
    'Latest',
    'Earliest',
    'Following',
    'Recently Sold',
    'Highest Prices',
    'Lowest Prices',
  ];
  const [selectedCategory, setSelectedCategory] = useState(category[0]);

  useEffect(() => {
    let slidesValue = [];
    axios.get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`).then(async (repos) => {
      for (let i = 0; i < repos.data.length; i++) {
        await axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/get_user_by_id/${repos.data[i].id}`)
          .then((value) => {
            if (value.data !== '') setActiveStreams((prevState) => [...prevState, value.data]);

            if (i < 5) {
              slidesValue.push(value.data);
            }
          });
      }
      setSlides(slidesValue);
    });
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    for (let i = 0; i < fileRes.data.length; i++) {
      if (fileRes.data[i].videos && fileRes.data[i].videos.length > 0) {
        if (user ? fileRes.data[i].username !== user.username : true)
          setArrayData((prevState) => [...prevState, fileRes.data[i]]);
      }
    }

    const fetchUploads = await axios.get(`${process.env.REACT_APP_SERVER_URL}/trending`);
    if (fetchUploads.data.latest_videos) {
      let data = [];
      let fetchedData = fetchUploads.data.latest_videos.reverse();
      for (let i = 0; i < fetchedData.length; i++) {
        if (!data.some((el) => el.username === fetchedData[i].username)) {
          data.push(fetchedData[i]);
        }
      }
      setLatestVideo(data);
      setLatestUploads(true);
    }
    if (fetchUploads.data.latest_tracks) {
      let data = [];
      let fetchedData = fetchUploads.data.latest_tracks.reverse();
      for (let i = 0; i < fetchedData.length; i++) {
        if (!data.some((el) => el.username === fetchedData[i].username)) {
          data.push(fetchedData[i]);
        }
      }
      setLatestTrack(data);
      setLatestUploads(true);
    }
  };

  return (
    <>
      {/* <Helmet>
        <meta property="og:title"              content="DBeats" />
        <meta property="og:description"        content="<div style='font-size:20px; font-weight:500;color:green;'>Live Streaming Videos 🎥, Music &#127926; & NFTs Platform on the Blockchain 🚀</div>" />
        <meta property="og:image"              content="https://beta.dbeats.live/favicon.ico" />
      </Helmet> */}
      <div className={`${darkMode && 'dark'} `}>
        <div id="outer-container" className="h-full  ">
          <div
            id="page-wrap"
            className={`${darkMode && 'dark'} grid 2xl:pl-16 lg:pl-14 grid-cols-6 `}
          >
            <div
              id="recommended_channel"
              className="w-full  pt-18  h-full lg:col-span-1 hidden  lg:block sm:hidden   bg-dbeats-white  dark:bg-dbeats-dark-secondary"
            >
              <div className="2xl:pl-8  lg:pl-4  ">
                {latestUploads ? (
                  <>
                    <div>
                      <h5 className="p-2 font-semibold 2xl:text-base lg:text-xs text-dbeats-dark-primary dark:text-gray-200">
                        {' '}
                        Latest videos
                      </h5>
                      {latestVideo.map((video, i) => {
                        if (i < 5) {
                          return (
                            <div key={i} className="flex items-center pb-4">
                              <div className="border border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white dark:bg-dbeats-dark-primary lg:rounded md:rounded sm:rounded shadow-sm dark:shadow-md    text-dbeats-dark-primary p-2 rounded   w-full dialog ">
                                <Link to={`/playback/${video.username}/${video.videoId}`}>
                                  <img
                                    src={video.videoImage !== '' ? video.videoImage : logo}
                                    alt=""
                                    className=" w-full h-full bg-gray-100 self-center"
                                  />
                                </Link>
                                <div className="py-3">
                                  <p className="truncate   text-dbeats-dark-primary dark:text-gray-200 2xl:font-bold lg:text-xs">
                                    {video.videoName}
                                  </p>
                                  <span className="  2xl:text-sm lg:text-xs text-gray-400   flex">
                                    {' '}
                                    {video.username}{' '}
                                    {video.is_verified ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4  items-center self-center justify-center text-dbeats-light mx-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : null}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <div>
                      <h5 className="pb-2 font-semibold 2xl:text-base   lg:text-xs text-dbeats-dark-primary dark:text-gray-200">
                        {' '}
                        Latest Musics
                      </h5>
                      {latestTrack.map((track, i) => {
                        if (i < 5) {
                          return (
                            <div key={i} className="flex items-center pb-4">
                              <div className="border flex border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white dark:bg-dbeats-dark-primary lg:rounded md:rounded sm:rounded shadow-sm dark:shadow-md    text-dbeats-dark-primary p-2 rounded    w-full  dialog ">
                                <Link to={`/track/${track.username}/${track.trackId}`}>
                                  <img
                                    src={track.trackImage !== '' ? track.trackImage : logo}
                                    alt=""
                                    className=" w-20  h-20   bg-gray-100 self-center"
                                  />
                                </Link>
                                <div className="pl-3">
                                  <p className="truncate 2xl:w-40 lg:w-28 text-dbeats-dark-primary dark:text-gray-200 2xl:font-bold lg:text-xs">
                                    {' '}
                                    {track.trackName}
                                  </p>
                                  <span className="  2xl:text-sm lg:text-xs text-gray-400   flex">
                                    {' '}
                                    {track.username}{' '}
                                    {track.is_verified ? (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4  items-center self-center justify-center text-dbeats-light mx-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    ) : null}
                                  </span>
                                  <p className="truncate 2xl:w-40 lg:w-28 text-dbeats-dark-primary dark:text-gray-200 2xl:font-bold lg:text-xs">
                                    {' '}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            {/* {classes.other_videos} */}
            <div className="pt-18 flex flex-col justify-between col-span-6  lg:col-span-5 h-full   bg-dbeats-white   dark:bg-dbeats-dark-secondary">
              <div>
                <div id="display_videos" className="lg:my-5 lg:px-4 h-max hidden">
                  <div className=" lg:px-4 h-max">
                    {slides.length > 2 ? (
                      <div className=" ">
                        <ResponsiveCarousel slides={slides} autoplay={false} />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className=" 2xl:px-4 ">
                  <div id="display_playback_videos" className=" 2xl:px-4 px-1 hidden">
                    <div>
                      <h4 className=" font-bold  2xl:pb-4 lg:pb-2">
                        {activeStreams ? (
                          (activeStreams.length <= 2 && activeStreams.length !== 0) ||
                          activeStreams.length > 5 ? (
                            <>
                              <p className="mb-3 w-max mx-auto   self-center text-center  drop-shadow text-2xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800">
                                <span className=" bg-red-900 animate-ping mr-2 rounded-full   inline-block  h-2 w-2 self-center ">
                                  &middot;
                                </span>
                                LIVE
                              </p>
                              <div className="">
                                <Carousel cols={5}>
                                  {activeStreams.map((liveUser, i) => {
                                    if (activeStreams.length <= 2 || i >= 5) {
                                      return (
                                        <Carousel.Item key={i}>
                                          <LiveCard
                                            className=""
                                            liveUserData={liveUser}
                                            username={liveUser.username}
                                          />
                                        </Carousel.Item>
                                      );
                                    }
                                    return 0;
                                  })}
                                </Carousel>
                              </div>{' '}
                            </>
                          ) : null
                        ) : (
                          false
                        )}
                      </h4>
                    </div>
                  </div>
                  <div id="display_playback_videos" className="2xl:px-4 lg:px-3 px-1">
                    <div className="  ">
                      <div className="flex my-1">
                        <Dropdown
                          className=" "
                          data={category}
                          setSelected={setSelectedCategory}
                          getSelected={selectedCategory}
                        />
                        <h4 className=" font-bold   dark:text-gray-200 text-gray-900 p-2 cursor-pointer">
                          All
                        </h4>
                        <h4 className=" font-bold   dark:text-gray-200 text-gray-900 p-2 cursor-pointer">
                          Videos
                        </h4>
                        <h4 className=" font-bold   dark:text-gray-200 text-gray-900 p-2 cursor-pointer">
                          Music
                        </h4>
                        <h4 className=" font-bold   dark:text-gray-200 text-gray-900 p-2 cursor-pointer">
                          Pictures
                        </h4>
                      </div>
                      <Transition
                        show={showWelcome}
                        as={Fragment}
                        enter="transition ease-in-out duration-100"
                        enterFrom="transform opacity-0    "
                        enterTo="transform opacity-100    "
                        leave="transition ease-in-out duration-100"
                        leaveFrom="transform opacity-100   "
                        leaveTo="transform   opacity-0  "
                      >
                        <div className="mb-4 border border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white dark:bg-dbeats-dark-primary lg:rounded md:rounded sm:rounded shadow-sm dark:shadow-md    text-dbeats-dark-primary p-4 rounded   md:w-2/3 dialog ">
                          {!showFeedback ? (
                            <div>
                              <div className="justify-between flex">
                                <p className=" text-dbeats-light text-lg font-bold">Welcome ✨</p>
                              </div>
                              <p className="">
                                This is our open Beta!
                                <br></br>Many things are still in the making. Please be patient if
                                it isn’t 100% how you would like, we are working on it. <br></br>{' '}
                                So, enjoy, the house is yours and please let us know how we can do
                                better, fix any bugs and improve the app over time.
                              </p>
                              <div
                                onClick={() => {
                                  handleShowFeedback();
                                }}
                                className="px-5 py-2 bg-dbeats-light  w-max rounded mt-4 text-white cursor-pointer hover:bg-dbeats-secondary-light"
                              >
                                Leave your feedback
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-4 grid-cols-2 ">
                              <div className="justify-between flex col-span-2">
                                <p className=" text-dbeats-light text-lg font-bold">
                                  Leave a feedback✨
                                </p>
                                <a
                                  href="# "
                                  onClick={() => {
                                    handleShowWelcome();
                                  }}
                                  className="opacity-40"
                                >
                                  close
                                </a>
                              </div>
                              <form className=" col-span-1">
                                <p className="">
                                  How is it going so far?
                                  <br></br>
                                  <input
                                    required
                                    type="text"
                                    name="feedback"
                                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-dbeats-light focus:ring-dbeats-light block    w-full rounded sm:text-sm focus:ring-1"
                                    placeholder="Tell us more"
                                  />
                                  <input
                                    type="email"
                                    name="email"
                                    required
                                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-dbeats-light focus:ring-dbeats-light block    w-full rounded sm:text-sm focus:ring-1"
                                    placeholder="Your Email (optional)"
                                  />
                                </p>
                                <div
                                  type="submit"
                                  className="px-5 py-2 bg-dbeats-light w-max rounded mt-4 text-white cursor-pointer hover:bg-dbeats-secondary-light"
                                >
                                  Send feedback
                                </div>
                              </form>
                              <div className=" col-span-1">
                                join us on <br className="mt-1"></br>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://discord.gg/xZavZyAbx4"
                                  type="button"
                                  className="  text-white bg-[#5865F2] hover:bg-[#3b5998]/90 focus:ring-2 focus:ring-[#3b5998]/50 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                                >
                                  <svg
                                    viewBox="0 0 71 55"
                                    fill="none"
                                    className="mr-2 -ml-1 w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0)">
                                      <path
                                        d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                                        fill="#ffffff"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0">
                                        <rect width="71" height="55" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Discord
                                </a>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://twitter.com/DBeatsLive"
                                  type="button"
                                  className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-2 focus:ring-[#1da1f2]/50 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1da1f2]/55 mr-2 mb-2"
                                >
                                  <svg
                                    className="mr-2 -ml-1 w-4 h-4"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fab"
                                    data-icon="twitter"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"
                                    ></path>
                                  </svg>
                                  Twitter
                                </a>
                                <br></br>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://www.linkedin.com/company/dbeats"
                                  type="button"
                                  className="text-white bg-[#0e76a8] hover:bg-[#0a76a8]/90 focus:ring-2 focus:ring-[#3b5998]/50 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                                >
                                  <svg
                                    className="mr-2 -ml-1 w-4 h-4"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fab"
                                    data-icon="linkedin"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24 "
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                                    />
                                  </svg>
                                  LinkedIn
                                </a>
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://www.instagram.com/dbeats.app/"
                                  type="button"
                                  className="text-white bg-[#8a3ab9] hover:bg-[#bc2a8d]/90 focus:ring-2 focus:ring-[#3b5998]/50 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                                >
                                  <svg
                                    className="mr-2 -ml-1 w-4 h-4"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fab"
                                    data-icon="linkedin"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24 "
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                    />
                                  </svg>
                                  Instagram
                                </a>{' '}
                              </div>
                            </div>
                          )}
                        </div>
                      </Transition>
                      <div className="">
                        {arrayData.map((playbackUser, i) => {
                          return (
                            <div key={i}>
                              <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-0  ">
                <div className="LottieButton opacity-10   ">
                  <Lottie options={defaultOptions} height={200} width={300} />
                </div>
                <h3 className="text-black   capitalize text-center proxima-reg dark:text-white dark:text-opacity-20">
                  Developed by Creators for the Creators on a Decentralised Web
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
