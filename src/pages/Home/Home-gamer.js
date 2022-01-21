import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-grid-carousel';
import Lottie from 'react-lottie';
import { useSelector } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import dbeatsLogoBnW from '../../assets/images/Logo/logo-blacknwhite.png';

import animationData from '../../lotties/gamers.json';
import ResponsiveCarousel from './Cards/HomeSlider';
import LiveCard from './Cards/LiveCard';
import PlayBackCardGamer from './Cards/PlayBackCard-gamer';
// import {Helmet} from "react-helmet";
import { Link } from 'react-router-dom';
import Dropdown from '../../component/dropdown.component';
import FeedbackForm from '../../component/form/feedbackForm';
import MainToolbar from '../../component/Toolbar/main-toolbar';

import { ReactComponent as Verified } from '../../assets/icons/verified-account.svg';

const Home = () => {
  const [activeStreams, setActiveStreams] = useState([]);
  const [slides, setSlides] = useState([]);
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [arrayData, setArrayData] = useState([]);

  const [latestVideo, setLatestVideo] = useState([]);
  const [latestTrack, setLatestTrack] = useState([]);

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
          .get(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`)
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
                        Who to Follow
                      </h5>
                      {latestVideo.map((video, i) => {
                        if (i < 5) {
                          return (
                            <div key={i} className="flex items-center pb-2">
                              <div
                                className="border flex border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 
                              bg-white dark:bg-dbeats-dark-primary lg:rounded md:rounded sm:rounded shadow-sm dark:shadow-md    text-dbeats-dark-primary p-2 rounded    w-full  dialog "
                              >
                                <Link to={`/profile/${video.username}`}>
                                  <img
                                    src={
                                      video.profile_image !== ''
                                        ? video.profile_image
                                        : dbeatsLogoBnW
                                    }
                                    alt=""
                                    className=" w-12  h-12   bg-gray-100 self-center rounded-full"
                                  />
                                </Link>
                                <div className="pl-3">
                                  <p className="truncate 2xl:w-40 lg:w-28 text-dbeats-dark-primary dark:text-gray-200 2xl:font-bold lg:text-xs">
                                    {console.log(video)}
                                    {video.name}
                                  </p>
                                  <span className="  2xl:text-sm lg:text-xs text-gray-400   flex">
                                    {' '}
                                    {video.username}{' '}
                                    {video.is_verified ? (
                                      <Verified className="h-4 w-4  items-center self-center justify-center text-dbeats-light mx-1" />
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
                <div id="display_videos" className=" h-max  ">
                  <div className=" lg:px-4 h-max">
                    {slides.length > 2 ? (
                      <div className=" ">
                        <ResponsiveCarousel slides={slides} autoplay={false} />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className=" 2xl:px-4 ">
                  <div id="display_playback_videos" className=" mb-2">
                    <div>
                      <h4 className=" font-bold  2xl:pb-4 lg:pb-2">
                        {activeStreams ? (
                          (activeStreams.length <= 2 && activeStreams.length !== 0) ||
                          activeStreams.length > 5 ? (
                            <>
                              <p className="mb-3 w-max mx-auto   self-center text-center  drop-shadow text-2xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800">
                                <span className=" bg-red-900 animate-ping   rounded-full   inline-block  h-2 w-2 self-center ">
                                  &middot;
                                </span>
                                LIVE
                              </p>
                              <div className="">
                                <Carousel cols={4}>
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
                  {user ? <MainToolbar></MainToolbar> : ''}
                  <div id="display_playback_videos" className=" px-1 mx-2 my-1">
                    <div className="  ">
                      <div className="flex my-1">
                        <Dropdown
                          className=" "
                          data={category}
                          setSelected={setSelectedCategory}
                          getSelected={selectedCategory}
                        />
                        <h4 className="  sm:text-sm lg:text-xs 2xl:text-sm self-center   dark:text-gray-200 text-gray-900 p-2 cursor-pointer dark:hover:bg-dbeats-dark-primary rounded mx-1 ">
                          All
                        </h4>
                        <h4 className="  sm:text-sm lg:text-xs 2xl:text-sm self-center   dark:text-gray-200 text-gray-900 p-2 cursor-pointer dark:hover:bg-dbeats-dark-primary rounded mx-1">
                          Videos
                        </h4>
                        <h4 className="  sm:text-sm lg:text-xs 2xl:text-sm self-center   dark:text-gray-200 text-gray-900 p-2 cursor-pointer dark:hover:bg-dbeats-dark-primary rounded mx-1">
                          Music
                        </h4>
                        <h4 className="   sm:text-sm lg:text-xs 2xl:text-sm self-center  dark:text-gray-200 text-gray-900 p-2 cursor-pointer dark:hover:bg-dbeats-dark-primary rounded mx-1">
                          Pictures
                        </h4>
                      </div>
                      <FeedbackForm />
                      <Carousel cols={4}>
                        {arrayData.map((playbackUser, i) => {
                          return (
                            <Carousel.Item key={i}>
                              <PlayBackCardGamer
                                darkMode={darkMode}
                                playbackUserData={playbackUser}
                              />
                            </Carousel.Item>
                          );
                        })}
                      </Carousel>
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
