import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-skyblue.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import Billboard from '../../component/Billboard/Billboard-Card';
import ProfileCard from '../../component/Cards/ProfileCard';
import Dropdown from '../../component/dropdown.component';
import FeedbackForm from '../../component/form/feedbackForm';
import HowToUse from '../../component/form/howToUse';
import GamesToolbar from '../../component/form/games-toolbar';
import ReferAFriend from '../../component/form/ReferAFriend';

import MainToolbar from '../../component/Toolbar/main-toolbar';
import animationData from '../../lotties/gamers.json';
import ResponsiveCarousel from './Cards/HomeSlider';
import LiveCard from './Cards/LiveCard';
import NFTCard from '../Profile/ProfileSections/Store/NFT_Store';
import { useParams } from 'react-router-dom';
import * as Scroll from 'react-scroll';
import { loadTrending } from '../../actions/trendingActions';
import NFTStore from '../Profile/ProfileSections/Store/NFT_Store';
Modal.setAppElement('#root');

const Home = () => {
  const dispatch = useDispatch();
  const [activeStreams, setActiveStreams] = useState([]);
  const [slides, setSlides] = useState([]);
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const user = useSelector((state) => state.User.user);
  const Trending = useSelector((state) => state.Trending);
  const [verifiedUser, setverifiedUser] = useState(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  // const [latestUploads, setLatestUploads] = useState(null);

  const params = useParams();
  const urlUsername = params.username;
  //localStorage.setItem('referrer', urlUsername);
  useEffect(() => {
    if (params.username) {
      localStorage.setItem('referrer', urlUsername);
      console.log('referrer', urlUsername);
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/referred-by/${urlUsername}`)
        .then((value) => {
          console.log(value);
        })
        .catch((err) => {});
    }
  }, [params.username]);

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

  const [showNewPost, setShowNewPost] = useState(false);

  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
    if (position > 2000) {
      setShowNewPost(true);
    } else {
      setShowNewPost(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTop = () => {
    console.log('called');
    var scroll = Scroll.animateScroll;
    scroll.scrollToTop({
      duration: 3000,
    });
  };

  // useEffect(() => {
  //   if (scrollPosition > 1500) {
  //     const interval = setInterval(() => {
  //       console.log('Logs every minute');
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   } // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, []);

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
    // fetchData();
    // dispatch(loadTrending());

    axios.get(`${process.env.REACT_APP_SERVER_URL}/get_verifiedusers`).then(async (repos) => {
      let data = [];
      for (let i = 0; i < repos.data.length; i++) {
        data.push(repos.data[i]);
      }

      setverifiedUser(data);
      // console.log(data);
    });
  }, []);

  // const fetchData = async () => {
  //   // const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
  //   // for (let i = 0; i < fileRes.data.length; i++) {
  //   //   if (fileRes.data[i].videos && fileRes.data[i].videos.length > 0) {
  //   //     if (user ? fileRes.data[i].username !== user.username : true)
  //   //       setArrayData((prevState) => [...prevState, fileRes.data[i]]);
  //   //   }
  //   // }

  //   const fetchUploads = await axios.get(`${process.env.REACT_APP_SERVER_URL}/trending`);
  //   // console.log(fetchUploads.data.trending);
  //   if (fetchUploads.data.trending) {
  //     let trending = [];
  //     let fetchedData = fetchUploads.data.trending.reverse();

  //     for (let i = 0; i < fetchedData.length; i++) {
  //       trending.push(fetchedData[i]);
  //     }
  //     setLatestVideo(trending);
  //     {
  //       //console.log(trending);
  //     }
  //     // setLatestUploads(true);
  //   }

  //   // if (fetchUploads.data.latest_tracks) {
  //   //   let data = [];
  //   //   let fetchedData = fetchUploads.data.latest_tracks.reverse();
  //   //   for (let i = 0; i < fetchedData.length; i++) {
  //   //     if (!data.some((el) => el.username === fetchedData[i].username)) {
  //   //       data.push(fetchedData[i]);
  //   //     }
  //   //   }
  //   //   setLatestTrack(data);
  //   //   setLatestUploads(true);
  //   // }
  // };

  return (
    <>
      {/* <Helmet>
        <meta property="og:title"              content="DBeats" />
        <meta property="og:description"        content="<div style='font-size:20px; font-weight:500;color:green;'>Live Streaming Videos 🎥, Music &#127926; & NFTs Platform on the Blockchain 🚀</div>" />
        <meta property="og:image"              content="https://beta.dbeats.live/favicon.ico" />
      </Helmet> */}
      <div className={`${darkMode && 'dark'} justify-center pt-16`}>
        {activeStreams && activeStreams.length > 0 ? (
          <div className="lg:mx-20  ">
            {slides.length > 2 ? (
              <div id="display_videos" className="lg:my-5 lg:px-4    mx-20 ">
                <div className=" lg:px-4 h-max">
                  <div className="">
                    <ResponsiveCarousel slides={slides} autoplay={false} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className=" 2xl:px-4  mx-auto pt-4">
              <div>
                {activeStreams ? (
                  (activeStreams.length <= 2 && activeStreams.length !== 0) ||
                  activeStreams.length > 5 ? (
                    <>
                      <div className="">
                        <Splide
                          className=" "
                          options={{
                            perMove: 1,
                            grid: {
                              // You can define rows/cols instead of dimensions.
                              dimensions: [
                                [1, 1],
                                [2, 2],
                                [2, 1],
                                [1, 2],
                                [2, 2],
                                [3, 2],
                              ],
                              gap: {
                                row: '6px',
                                col: '6px',
                              },
                            },
                            perPage: 4,
                            gap: '1rem',
                            autoplay: true,
                            drag: 'free',
                            focus: 'center',
                            arrows: false,
                            interval: 300,
                            dots: false,
                            pagination: false,
                            autoScroll: {
                              speed: 2,
                            },
                            breakpoints: {
                              1920: {
                                perPage: 4,
                                gap: '.7rem',
                              },
                              1440: {
                                perPage: 3,
                                gap: '.7rem',
                              },
                              1280: {
                                perPage: 2,
                                gap: '.7rem',
                              },
                              1024: {
                                perPage: 2,
                                gap: '.7rem',
                              },
                              960: {
                                perPage: 1,
                                gap: '.7rem',
                              },
                              720: {
                                perPage: 1,
                                gap: '.7rem',
                              },
                              640: {
                                perPage: 1,
                                gap: '.7rem',
                              },
                              480: {
                                perPage: 1,
                                gap: '.7rem',
                              },
                            },
                          }}
                        >
                          {activeStreams.map((liveUser, i) => {
                            if (activeStreams.length <= 2 || i >= 5) {
                              return (
                                <SplideSlide
                                  className="px-2 py-2"
                                  key={i}
                                  data-splide-interval="1000"
                                >
                                  <LiveCard liveUserData={liveUser} username={liveUser.username} />
                                </SplideSlide>
                              );
                            }
                            return 0;
                          })}{' '}
                        </Splide>
                      </div>{' '}
                    </>
                  ) : null
                ) : (
                  false
                )}
              </div>
            </div>
          </div>
        ) : null}
        <div className="h-full w-full mx-auto justify-center">
          <div
            className={`${
              darkMode && 'dark'
            }  grid grid-cols-10  dark:bg-dbeats-dark-primary   mx-auto  md:gap-2 md:pl-9 md:pr-8 lg:pl-24 lg:pr-8 sm:px-10`}
          >
            <div className="col-span-1 xl:block hidden"></div>

            <div className="w-full col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2   h-full   md:block hidden      ">
              <div className="sticky top-20">
                {/* <Billboard user={user}></Billboard> */}
                <HowToUse className="z-500" />
                <GamesToolbar className="z-500" />
              </div>
            </div>
            {/* {classes.other_videos} */}

            <div className="flex flex-col justify-between     h-full w-full  col-span-10 md:col-span-6 lg:col-span-5  xl:col-span-4 ">
              <div className="2xl:px-4 lg:px-3  my-2 sm:my-4">
                <div>
                  {user ? <MainToolbar></MainToolbar> : ''}
                  <div className=" ">
                    <div className="flex mt-3 align-middle justify-center ">
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
                    {showNewPost ? (
                      <div className="2xl:w-1/3 lg:w-1/3 w-screen 2xl:ml-5 cursor-pointer flex justify-center items-center text-xs 2xl:text-base fixed 2xl:top-16 lg:top-12 top-16 z-10 h-max ">
                        <button
                          className="w-max flex 2xl:px-3 2xl:py-2 px-2 py-1 rounded-lg text-black dark:text-white  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary"
                          onClick={scrollTop}
                        >
                          <p className="font-bold w-full self-center">New Post</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 2xl:ml-1 ml-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="my-2">
                    <div
                      className="mt-10 animate-spin rounded-full h-7 w-7 mx-auto border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                      hidden={!Trending.loading ? true : false}
                    ></div>{' '}
                    {/* {arrayData.map((playbackUser, i) => {
                      return (
                        <div key={i}>
                          <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} />
                        </div>
                      );
                    })} */}
                    <NFTStore></NFTStore>
                    {/* {Trending.trending &&
                      Trending.trending.map((playbackUser, i) => {
                        return (
                          <div key={i}>
                            {/* <PlayBackCard darkMode={darkMode} playbackUserData={playbackUser} /> */}
                    {/* {i % 3 == 0 ? <Billboard user={user}></Billboard> : null} */}
                    {/* </div>
                        );
                      })} */}
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

            <div className="w-full   h-full    col-span-4 md:col-span-3 lg:col-span-2 xl:col-span-2  lg:block hidden  ">
              <div className="my-4 ">
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
                            <ProfileCard user={verifieduser} />
                          </SplideSlide>
                        );
                      })
                    : null}
                </Splide>
                {user ? <ReferAFriend className="z-500 " /> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
