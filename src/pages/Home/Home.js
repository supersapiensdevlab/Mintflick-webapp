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
import Dropdown from '../../component/dropdown.component';
import FeedbackForm from '../../component/form/feedbackForm';
import { ReactComponent as Verified } from '../../assets/icons/verified-account.svg';
import MainToolbar from '../../component/Toolbar/main-toolbar';
import maticLogo from '../../assets/graphics/polygon-matic-logo.svg';
import Modal from 'react-modal';
import ProfileCard from '../../component/Cards/ProfileCard';
import Billboard from '../../component/Billboard/Billboard-Card';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';

Modal.setAppElement('#root');

const Home = () => {
  const [activeStreams, setActiveStreams] = useState([]);
  const [slides, setSlides] = useState([]);
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [arrayData, setArrayData] = useState([]);

  const [latestVideo, setLatestVideo] = useState([]);
  const [latestTrack, setLatestTrack] = useState([]);

  const user = JSON.parse(window.localStorage.getItem('user'));

  const [verifiedUser, setverifiedUser] = useState(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const [latestUploads, setLatestUploads] = useState(null);

  Splide.defaults = {
    type: 'loop',
    perPage: 2,
  };

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

  const filter = ['All', 'Music', 'Gaming', 'Movies', 'Videos', 'NFT'];
  const [selectedFilter, setSelectedFilter] = useState(filter[0]);

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

    axios.get(`${process.env.REACT_APP_SERVER_URL}/get_verifiedusers`).then(async (repos) => {
      let data = [];
      for (let i = 0; i < repos.data.length; i++) {
        data.push(repos.data[i]);
      }

      setverifiedUser(data);
      console.log(data);
    });
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
    // console.log(fetchUploads.data.trending);
    if (fetchUploads.data.trending) {
      let trending = [];
      let fetchedData = fetchUploads.data.trending.reverse();

      for (let i = 0; i < fetchedData.length; i++) {
        trending.push(fetchedData[i]);
      }
      setLatestVideo(trending);
      {
        //console.log(trending);
      }
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
      <div className={`${darkMode && 'dark'} justify-center pt-18`}>
        {activeStreams && activeStreams.length > 0 ? (
          <div className="   mx-20 my-4">
            <div id="display_videos" className="lg:my-5 lg:px-4  ">
              <div className=" lg:px-4 h-max">
                {slides.length > 2 ? (
                  <div className="">
                    <ResponsiveCarousel slides={slides} autoplay={false} />
                  </div>
                ) : null}
              </div>
            </div>

            <div className=" 2xl:px-4  ">
              <div>
                <h4 className=" font-bold  2xl:pb-4 lg:pb-2">
                  {activeStreams ? (
                    (activeStreams.length <= 2 && activeStreams.length !== 0) ||
                    activeStreams.length > 5 ? (
                      <>
                        <p className="mb-3 w-max mx-auto   self-center text-center  drop-shadow text-2xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800">
                          <span className=" bg-red-900 animate-ping mr-2 sm:rounded-full   inline-block  h-2 w-2 self-center ">
                            &middot;
                          </span>
                          LIVE
                        </p>
                        <div className="">
                          <Carousel className="my-2 py-2" cols={5}>
                            {activeStreams.map((liveUser, i) => {
                              if (activeStreams.length <= 2 || i >= 5) {
                                return (
                                  <Carousel.Item key={i}>
                                    <LiveCard
                                      className="my-2 py-2"
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
          </div>
        ) : null}
        <div className="h-full w-full mx-auto justify-center">
          <div
            className={`${
              darkMode && 'dark'
            }  grid grid-cols-10  dark:bg-dbeats-dark-primary   mx-auto  md:gap-2 md:px-14 lg:px-24 sm:px-10`}
          >
            <div className="col-span-1 xl:block hidden"></div>
            <div className="w-full col-span-3 lg:col-span-2  h-full   md:block hidden      ">
              <div className="sticky top-20">
                <Billboard user={user}></Billboard>
              </div>
            </div>
            {/* {classes.other_videos} */}

            <div className="flex flex-col justify-between   h-full w-full  col-span-10 md:col-span-7 lg:col-span-5  xl:col-span-4 ">
              <div className="2xl:px-4 lg:px-3 ">
                <div className="  ">
                  {user ? <MainToolbar></MainToolbar> : ''}

                  <div className="flex mt-3 align-middle justify-center">
                    <Dropdown
                      className="sm:font-normal text-xs "
                      data={category}
                      setSelected={setSelectedCategory}
                      getSelected={selectedCategory}
                    />
                    <button className="self-center rounded-3xl group w-max ml-2 p-1 mr-1  justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center            transform-gpu  transition-all duration-300 ease-in-out ">
                      <span
                        onClick={() => setSelectedFilter(filter[0])}
                        className={`${
                          selectedFilter === filter[0]
                            ? 'nm-inset-dbeats-dark-secondary dark:text-dbeats-light'
                            : ''
                        }  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary`}
                      >
                        <p className="self-center mx-2 sm:font-normal text-xs">All</p>
                      </span>
                    </button>
                    <button className="self-center rounded-3xl group w-max ml-1 p-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center            transform-gpu  transition-all duration-300 ease-in-out ">
                      <span
                        onClick={() => setSelectedFilter(filter[1])}
                        className={`${
                          selectedFilter === filter[1]
                            ? 'nm-inset-dbeats-dark-secondary dark:text-dbeats-light'
                            : ''
                        }  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary`}
                      >
                        <p className="self-center mx-2 sm:font-normal text-xs">Music</p>
                      </span>
                    </button>
                    <button className="self-center rounded-3xl group w-max ml-1 p-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center            transform-gpu  transition-all duration-300 ease-in-out ">
                      <span
                        onClick={() => setSelectedFilter(filter[2])}
                        className={`${
                          selectedFilter === filter[2]
                            ? 'nm-inset-dbeats-dark-secondary dark:text-dbeats-light'
                            : ''
                        }  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary`}
                      >
                        <p className="self-center mx-2 sm:font-normal text-xs">Videos</p>
                      </span>
                    </button>
                    <button className="self-center rounded-3xl group w-max ml-1 p-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center            transform-gpu  transition-all duration-300 ease-in-out ">
                      <span
                        onClick={() => setSelectedFilter(filter[3])}
                        className={`${
                          selectedFilter === filter[3]
                            ? 'nm-inset-dbeats-dark-secondary dark:text-dbeats-light'
                            : ''
                        }  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary`}
                      >
                        <p className="self-center mx-2 sm:font-normal text-xs">NFT</p>
                      </span>
                    </button>
                  </div>

                  <div className="my-2">
                    <div
                      className="mt-10 animate-spin rounded-full h-7 w-7 mx-auto border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                      hidden={latestVideo.length > 0 ? true : false}
                    ></div>{' '}
                    {/* {arrayData.map((playbackUser, i) => {
                      return (
                        <div key={i}>
                          <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} />
                        </div>
                      );
                    })} */}
                    {latestVideo.map((playbackUser, i) => {
                      return (
                        <div key={i}>
                          <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} />
                          {i % 3 == 0 ? <Billboard user={user}></Billboard> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bottom-0  ">
                <div className="LottieButton opacity-10   ">
                  <Lottie options={defaultOptions} height={150} width={225} />
                </div>
                <p className="text-black   capitalize text-center proxima-reg dark:text-white dark:text-opacity-20">
                  Developed by Creators for the Creators on a Decentralised Web
                </p>
              </div>
            </div>

            <div className="w-full   h-full    hidden  lg:block md:hidden  col-span-2  ">
              <div className=" ">
                <FeedbackForm className="z-500" />
              </div>

              <div className="sticky top-20">
                <h4 className="text-white  px-2 my-1 ">Recommended Creators</h4>

                <Splide
                  options={{
                    type: 'loop',
                    gap: '1rem',
                    autoplay: true,
                    pauseOnHover: false,
                    arrows: false,
                    interval: 300,
                  }}
                >
                  {verifiedUser
                    ? verifiedUser.map((verifieduser, i) => {
                        return (
                          <SplideSlide className="px-2" key={i} data-splide-interval="1000">
                            <ProfileCard user={verifieduser}></ProfileCard>
                          </SplideSlide>
                        );
                      })
                    : null}
                </Splide>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
