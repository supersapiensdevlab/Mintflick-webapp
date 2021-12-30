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
        <div id="outer-container" className="h-full ">
          <div
            id="page-wrap"
            className={`${darkMode && 'dark'} grid 2xl:pl-16 lg:pl-14 grid-cols-6`}
          >
            <div
              id="recommended_channel"
              className="w-full  pt-8 h-full lg:col-span-1 hidden  lg:block sm:hidden mt-4  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary"
            >
              <div className="2xl:pl-8 2xl:pt-8 lg:pl-4 lg:pt-4 ">
                {latestUploads ? (
                  <>
                    <div>
                      <h5 className="pb-2 font-semibold 2xl:text-base lg:text-xs dark:text-gray-200">
                        {' '}
                        Latest videos
                      </h5>
                      {latestVideo.map((video, i) => {
                        if (i < 5) {
                          return (
                            <div key={i} className="flex items-center pb-4">
                              <Link to={`/playback/${video.username}/${video.videoId}`}>
                                <img
                                  src={video.profile_image !== '' ? video.profile_image : logo}
                                  alt=""
                                  className="2xl:w-14 2xl:h-14 lg:h-10 lg:w-10 rounded-full bg-gray-100 self-center"
                                />
                              </Link>
                              <div className="pl-3">
                                <p className="truncate 2xl:w-40 lg:w-28 dark:text-gray-200 2xl:text-sm lg:text-xs">
                                  {video.videoName}
                                </p>
                                <span className="  2xl:text-sm lg:text-xs text-gray-400   flex">
                                  {' '}
                                  {video.username}{' '}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4  items-center self-center justify-center text-blue-500 mx-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <div>
                      <h5 className="pb-2 font-semibold 2xl:text-base 2xl:pt-6 lg:pt-4 lg:text-xs dark:text-gray-200">
                        {' '}
                        Latest Musics
                      </h5>
                      {latestTrack.map((track, i) => {
                        if (i < 5) {
                          return (
                            <div key={i} className="flex items-center pb-4">
                              <Link to={`/track/${track.username}/${track.trackId}`}>
                                <img
                                  src={track.profile_image !== '' ? track.profile_image : logo}
                                  alt=""
                                  className="2xl:w-14 2xl:h-14 lg:h-10 lg:w-10 rounded-full bg-gray-100 self-center"
                                />
                              </Link>
                              <div className="pl-3">
                                <p className="truncate 2xl:w-40 lg:w-28 dark:text-gray-200 2xl:text-sm lg:text-xs">
                                  {' '}
                                  {track.trackName}
                                </p>
                                <span className="  2xl:text-sm lg:text-xs text-gray-400   flex">
                                  {' '}
                                  {track.username}{' '}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4  items-center self-center justify-center text-blue-500 mx-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
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
            <div className="flex flex-col justify-between col-span-6 h-screen lg:col-span-5 h-full  pt-5 bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-secondary">
              <div>
                <div id="display_videos" className="lg:my-5 lg:px-4 px-0 my-0  h-max">
                  <div className=" lg:px-4 h-max">
                    {slides.length > 2 ? (
                      <div className="pt-4">
                        <ResponsiveCarousel slides={slides} autoplay={false} />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="lg:mt-10 2xl:px-4 ">
                  <div id="display_playback_videos" className="mt-10 2xl:px-4 px-1 ">
                    <div>
                      <h4 className=" font-bold mt-10 2xl:pb-4 lg:pb-2">
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
                      <h4 className=" font-bold 2xl:pl-5 pl-5 2xl:pt-1 lg:pt-0 pt-2 pb-4 dark:text-gray-200 text-gray-900">
                        Trending
                      </h4>
                      <div className="">
                        <Carousel cols={4}>
                          {arrayData.map((playbackUser, i) => {
                            return (
                              <Carousel.Item key={i}>
                                <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} />
                              </Carousel.Item>
                            );
                          })}
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-0  ">
                <div className="LottieButton opacity-10 mb-5 mt-10 ">
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
