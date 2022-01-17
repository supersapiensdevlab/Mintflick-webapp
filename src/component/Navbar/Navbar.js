import { Menu as Dropdown, Transition } from '@headlessui/react';
import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleDarkMode } from '../../actions/index';
import logoDark from '../../assets/images/dark-logo.svg';
import CircleLogo from '../../assets/images/dbeats-logo.png';
import logo from '../../assets/images/white-logo.svg';
import useWeb3Modal from '../../hooks/useWeb3Modal';
import {
  AnnouncementModal,
  UploadNFTModal,
  UploadTrackModal,
  UploadVideoModal,
} from '../Modals/NavbarModals';
import Toggle from '../toggle.component';
import classes from './Navbar.module.css';

const NavBar = () => {
  // eslint-disable-next-line no-unused-vars
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const [notification, setNotification] = useState([]);

  const user = JSON.parse(window.localStorage.getItem('user'));

  const wrapperRef = useRef(null);

  //Popup
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const handleCloseAnnouncement = () => setShowAnnouncement(false);
  const handleShowAnnouncement = () => setShowAnnouncement(true);

  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const handleCloseVideoUpload = () => setShowVideoUpload(false);
  const handleShowVideoUpload = () => setShowVideoUpload(true);

  const [showTrackUpload, setShowTrackUpload] = useState(false);
  const handleCloseTrackUpload = () => setShowTrackUpload(false);
  const handleShowTrackUpload = () => setShowTrackUpload(true);

  const [showNFTUpload, setShowNFTUpload] = useState(false);
  const handleCloseNFTUpload = () => setShowNFTUpload(false);
  const handleShowNFTUpload = () => setShowNFTUpload(true);

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const [alluser, setAllUser] = useState([]);
  const [filterResultDisplay, setFilterResultDisplay] = useState(true);
  const [newNotification, setNewNotification] = useState(0);

  //Loader
  const [loader, setLoader] = useState(true);

  //  Modal
  const [showOpen, setOnOpen] = useState(false);

  // Sidebar functions
  const handleOnOpen = () => setOnOpen(true);
  const isMenuOpen = (state) => setOnOpen(state.isOpen);

  // Auth functions
  const handleLogout = () => {
    window.location.href = '/';
    window.localStorage.clear();
    const timer = setTimeout(() => {
      logoutOfWeb3Modal();
    }, 2000);
    return () => clearTimeout(timer);
  };

  const [toggled, setToggled] = useState(JSON.parse(window.localStorage.getItem('darkmode')));
  const handleClick = () => {
    setToggled((s) => !s);
    dispatch(toggleDarkMode(!darkMode));
    if (!darkMode) {
      document.body.style.backgroundColor = '#101010';
    } else {
      document.body.style.backgroundColor = '#fff';
    }
  };

  const handleNotification = () => {
    if (user && newNotification > 0) {
      setNewNotification(0);
      const data = {
        username: user.username,
      };
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/seennotification`,
        data: data,
      })
        .then()
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const [filteredData, setFilteredData] = useState([]);
  const [filteredVideoData, setFilteredVideoData] = useState([]);
  const [wordEntered, setWordEntered] = useState('');

  const handleFilter = (event) => {
    setFilterResultDisplay(false);
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = alluser.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });

    const newVideoFilter = [];

    alluser.map((value) => {
      if (value.videos) {
        value.videos.map(async (video, index) => {
          if (video.videoName.toLowerCase().includes(searchWord.toLowerCase())) {
            let data = {
              username: value.username,
              index: index,
              video: video,
            };
            newVideoFilter.push(data);
          }
          return 0;
        });
      }
      return 0;
    });

    //console.log('Videofilter', newVideoFilter);

    if (searchWord === '') {
      setFilteredData([]);
      setFilteredVideoData([]);
    } else {
      setFilteredData(newFilter);
      setFilteredVideoData(newVideoFilter);
    }
  };

  useEffect(() => {
    window.localStorage.setItem('darkmode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilterResultDisplay(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_URL}/user`,
    })
      .then((response) => {
        setAllUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    if (user && user.notification) {
      if (user.notification.length > 0) {
        setNewNotification(user.notification.length);
        let data = [];
        for (let i = 0; i < user.oldnotification.length; i++) {
          data.push(user.oldnotification[i]);
        }
        for (let i = 0; i < user.notification.length; i++) {
          data.push(user.notification[i]);
        }
        setNotification(data.reverse());
      } else {
        let data = [];
        for (let i = 0; i < user.oldnotification.length; i++) {
          data.push(user.oldnotification[i]);
        }
        setNotification(data.reverse());
      }
    }
    // eslint-disable-next-line
  }, []);

  //console.log(notification);

  const searchData = {
    usernameData: filteredData,
    videoData: filteredVideoData,
  };

  const NotificationContent = ({ data }) => {
    console.log(data);
    return (
      <div className="h-full my-1">
        <Link
          to={{
            pathname: `${process.env.REACT_APP_CLIENT_URL}/profile/${data.username}/posts`,
          }}
          target="_blank"
          rel="noopener noreferrer"
          className="grid grid-cols-4 justify-center p-2 dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark-secondary dark:text-white text-gray-500"
        >
          {data.post_image ? (
            <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
              <img
                src={data.post_image}
                alt="announcement_info"
                className="h-full w-auto rounded-sm"
              />
            </div>
          ) : null}
          {!data.post_image && data.linkpreview_data ? (
            <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
              <img
                src={data.linkpreview_data.image.url}
                alt="announcement_info"
                className="h-full w-auto rounded-sm"
              />
            </div>
          ) : null}
          {!data.post_image && !data.linkpreview_data && data.post_video ? (
            <div className="h-20 col-span-1 rounded-sm bg-gray-700 flex justify-center">
              <img src={CircleLogo} alt="announcement_info" className="h-full w-auto rounded-sm" />
            </div>
          ) : null}
          <div className="col-span-3 rounded-sm ">
            <p className="pl-2 line-clamp-3 text-sm font-semibold break-words">
              {data.announcement}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className={`${darkMode && 'dark'}`}>
        <Menu
          customBurgerIcon={false}
          pageWrapId={'page-wrap'}
          outerContainerId={'outer-container'}
          isOpen={showOpen}
          onStateChange={isMenuOpen}
          className={`bg-white dark:bg-dbeats-dark-primary `}
          width={window.innerWidth >= '1536' ? '16.5rem' : '12rem'}
        >
          <div className="pt-5 bg-transparent hidden w-0"></div>
          <div className={`${classes.menu_items} dark:hover:bg-dbeats-dark-alt hover:bg-blue-50`}>
            <Link
              className="text-black 2xl:text-xl lg:text-md text-bold dark:text-white "
              id="home"
              to="/"
            >
              <i id={classes.menu_item} className="fa  fa-home" />
              <span className={classes.menu_item_name}>Home</span>
            </Link>
          </div>

          <div className={`${classes.menu_items} dark:hover:bg-dbeats-dark-alt hover:bg-blue-50`}>
            <Link
              className="text-black 2xl:text-xl lg:text-md text-bold dark:text-white  "
              id="contact"
              to="/music"
            >
              <i id={classes.menu_item} className="fas fa-music" />
              <span className={classes.menu_item_name}>Music </span>
            </Link>
          </div>
          {/* {user ? (
            <div
              className={`${classes.menu_item_logout} text-black 2xl:text-xl lg:text-md text-bold dark:text-white`}
            >
              <i id={classes.menu_item}  className="fas fa-upload"></i>

              <a href="/upload" className={classes.menu_item_name}>
                Upload
              </a>
            </div>
          ) : (
            <> </>
          )} */}
          {user ? (
            <div
              className={`${classes.menu_item_logout} text-black 2xl:text-xl lg:text-md text-bold dark:text-white dark:hover:bg-dbeats-dark-alt hover:bg-blue-50`}
              onClick={handleLogout}
            >
              <i id={classes.menu_item} className="fas fa-door-open" />
              <span className={classes.menu_item_name}> Logout </span>
            </div>
          ) : (
            <> </>
          )}
          <div className="h-max w-max flex items-center justify-center  fixed bottom-28 ">
            <div className="relative flex ml-2 ">
              <Toggle toggled={toggled} onClick={handleClick} />
            </div>
          </div>
        </Menu>
      </div>

      <div
        expand="lg"
        id="navbarScroll"
        className={` w-max fixed top-0 ${darkMode && 'dark'} z-50 `}
      >
        <div
          className={`2xl:p-3 lg:p-2 p-3 w-screen shadow-sm z-50  absolute 
          bg-white dark:bg-dbeats-dark-primary dark:text-gray-100  
          bg-opacity-60 dark:bg-opacity-90  dark:backdrop-filter  
          dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md`}
        >
          <div className="flex w-full self-center">
            <div
              id="side-bar"
              className="mr-5 cursor-pointer  rounded  self-center"
              onClick={handleOnOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 lg:h-5  2xl:h-7 2xl:w-7 self-center  "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <div className="flex items-center">
              <Link to="/" className="  self-center cursor-pointer sm:flex hidden">
                <img
                  src={logo}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max dark:hidden"
                ></img>
                <img
                  src={logoDark}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max hidden dark:block"
                ></img>
                <span className="mr-5 text-lg font-bold ml-2"> </span>
              </Link>
              <Link to="/" className="flex self-center cursor-pointer sm:hidden ">
                <img
                  src={CircleLogo}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max dark:hidden"
                ></img>
                <img
                  src={CircleLogo}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max hidden dark:block"
                ></img>
                <span className="mr-5 text-lg font-bold ml-2"> </span>
              </Link>
              <p
                className="px-2 -ml-3.5 flex pb-0.5 mt-1 text-sm text-white dark:text-dbeats-light 
              bg-dbeats-light dark:bg-dbeats-alt border border-white dark:border-dbeats-light font-semibold rounded-lg"
              >
                beta
              </p>
            </div>

            <div className="w-2/3 sm:w-1/3 mx-auto  self-center ">
              <div className="  self-center rounded-full  flex bg-gray-100 dark:bg-dbeats-dark-primary">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full lg:h-8 2xl:h-10 h-10 rounded-full border-0 bg-gray-100 self-center focus:ring-0  px-5 dark:bg-dbeats-dark-secondary"
                  value={wordEntered}
                  onChange={handleFilter}
                ></input>
                <Link
                  to={'/search'}
                  className="self-center text-gray-900"
                  onClick={() => {
                    console.log('searchData : ', searchData);
                    setFilteredData([]);
                    setFilteredVideoData([]);

                    window.sessionStorage.setItem('searchResult', JSON.stringify(searchData));
                  }}
                >
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="2xl:h-6 2xl:w-6 lg:h-5 lg:w-5 h-6 w-6 self-center mx-3 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#aaa"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Link>
              </div>
              <div
                ref={wrapperRef}
                className=" bg-white  dark:bg-dbeats-dark-alt dark:text-white self-center absolute lg:w-1/3 w-3/5 h-max max-h-80 overflow-hidden overflow-y-auto"
                hidden={filterResultDisplay}
              >
                {filteredVideoData.length !== 0 && (
                  <>
                    {filteredVideoData.slice(0, 15).map((value, key) => {
                      return (
                        <Link
                          to="/search"
                          key={key}
                          className="w-full h-10"
                          onClick={() => {
                            setFilteredData([]);
                            setFilteredVideoData([]);
                            window.sessionStorage.setItem(
                              'searchResult',
                              JSON.stringify(searchData),
                            );
                          }}
                        >
                          <div className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary">
                            {value.video.videoName}{' '}
                          </div>
                        </Link>
                      );
                    })}
                  </>
                )}
                {filteredData.length !== 0 && (
                  <>
                    {filteredData.slice(0, 15).map((value, key) => {
                      return (
                        <Link
                          to="/search"
                          key={key}
                          className="w-full h-10 "
                          onClick={() => {
                            setFilteredData([]);
                            setFilteredVideoData([]);
                            window.sessionStorage.setItem(
                              'searchResult',
                              JSON.stringify(searchData),
                            );
                          }}
                        >
                          <div className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary">
                            {value.username}{' '}
                          </div>
                        </Link>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
            {user ? (
              <div className="flex items-center 2xl:mr-3 lg:mr-2">
                <Dropdown as="div" className="relative inline-block text-left mr-2 self-center">
                  <Dropdown.Button className="flex h-full items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="2xl:h-7 2xl:w-7 w-5 h-5 text-dbeats-light"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Dropdown.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Dropdown.Items className="absolute right-0 lg:mt-6 2xl:mt-8 origin-top-right  divide-y divide-gray-100 rounded-md shadow-sm  focus:outline-none w-max  ">
                      <Dropdown.Item className="w-full  text-gray-700 text-left 2xl:text-lg text-md lg:text-xs  flex lg:flex-row flex-col justify-between align-center  rounded-md   2xl:px-3 2xl:py-4 lg:px-2 lg:py-3 py-2 px-3  bg-white dark:bg-dbeats-dark-primary border border-dbeats-light border-opacity-10">
                        <div className=" m-10 font-bold dark:text-white ">
                          <button
                            className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border border-opacity-10 
                            dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto font-semibold cursor-pointer px-3 
                             hover:text-white dark:text-white dark:hover:bg-dbeats-light"
                            onClick={() => {
                              handleShowAnnouncement();
                              handleCloseVideoUpload();
                              handleCloseTrackUpload();
                              handleCloseNFTUpload();
                            }}
                          >
                            Create Post
                          </button>

                          <button
                            className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
                            onClick={() => {
                              handleCloseAnnouncement();
                              handleShowVideoUpload();
                              handleCloseTrackUpload();
                              handleCloseNFTUpload();
                            }}
                          >
                            Upload Video
                          </button>
                          <button
                            className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
                            onClick={() => {
                              handleCloseAnnouncement();
                              handleShowTrackUpload();
                              handleCloseVideoUpload();
                              handleCloseNFTUpload();
                            }}
                          >
                            Upload Track
                          </button>
                          <button
                            onClick={() => {
                              handleShowNFTUpload();
                              handleCloseVideoUpload();
                              handleCloseTrackUpload();
                              handleCloseAnnouncement();
                            }}
                            className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
                          >
                            Mint NFT
                          </button>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Items>
                  </Transition>
                </Dropdown>
              </div>
            ) : null}
            {user ? (
              <div id="login-btn" className="flex items-center">
                <Dropdown as="div" className="relative inline-block text-left  self-center">
                  <Dropdown.Button className="flex h-full items-center">
                    <div onClick={handleNotification}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="2xl:h-7 2xl:w-7 w-5 h-5 text-dbeats-light cursor-pointer z-50 self-center  "
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      {newNotification > 0 ? (
                        <div
                          className="bg-red-500 rounded-full shadow  
                        h-6 w-6 text-sm self-center text-center font-semibold  
                        absolute -bottom-2  -right-2  
                         text-white"
                        >
                          {newNotification}
                        </div>
                      ) : null}
                    </div>
                  </Dropdown.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Dropdown.Items
                      className="absolute right-0 w-96 mt-2 origin-top-right 
                    dark:bg-dbeats-dark-primary bg-white divide-y divide-gray-100 rounded-md shadow-lg 
                     focus:outline-none"
                    >
                      {notification.map((value, i) => {
                        return (
                          <div className="px-1   " key={i}>
                            <Dropdown.Item className="w-full h-full self-center dark:bg-dbeats-dark-primary">
                              <NotificationContent data={value} />
                            </Dropdown.Item>
                          </div>
                        );
                      })}
                    </Dropdown.Items>
                  </Transition>
                </Dropdown>
                <Link
                  to={`/streamer/${user.username}`}
                  className="border-dbeats-light 2xl:border-1 invisible lg:visible text-dbeats-light hover:bg-dbeats-light hover:text-white rounded font-bold mx-2 "
                >
                  <div className="flex lg:py-1 2xl:py-2.5 py-1.5 2xl:px-3 lg:px-2 px-1.5 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 lg:self-center mt-1 lg:mt-0 md:mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    <span className="self-center md:flex   lg:text-xs 2xl:text-lg ">Go Live</span>
                  </div>
                </Link>
                <Link
                  to={`/profile/${user.username}`}
                  className="shadow-sm 2xl:h-10  2xl:w-10 self-center  h-7 w-7 bg-gradient-to-r from-dbeats-secondary-light to-dbeats-light text-white rounded-full font-bold mx-2 flex"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="2xl:h-7 2xl:w-7  h-5 w-5  mx-auto self-center"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            ) : (
              <Link
                to="/signup"
                className="shadow-sm px-2  2xl:px-3 lg:px-1.5 2xl:py-1 lg:py-0.5 bg-gradient-to-r from-dbeats-secondary-light to-dbeats-light dark:bg-gradient-to-r 
                dark:from-dbeats-secondary-light dark:to-dbeats-light text-white rounded font-bold ml-2 md:mx-2 md:ml-0 flex"
              >
                <i className="fas fa-sign-in-alt text-xs lg:text-sm 2xl:text-lg self-center mr-2 hidden md:block"></i>
                <span className="self-center text-sm lg:text-xs 2xl:text-lg">SignUp</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <AnnouncementModal
        showAnnouncement={showAnnouncement}
        setShowAnnouncement={setShowAnnouncement}
        handleCloseAnnouncement={handleCloseAnnouncement}
        handleShowAnnouncement={handleShowAnnouncement}
        loader={loader}
        setLoader={setLoader}
      />
      <UploadVideoModal
        showVideoUpload={showVideoUpload}
        setShowVideoUpload={setShowVideoUpload}
        handleCloseVideoUpload={handleCloseVideoUpload}
        handleShowVideoUpload={handleShowVideoUpload}
        loader={loader}
        setLoader={setLoader}
      />
      <UploadTrackModal
        showTrackUpload={showTrackUpload}
        setShowTrackUpload={setShowTrackUpload}
        handleCloseTrackUpload={handleCloseTrackUpload}
        handleShowTrackUpload={handleShowTrackUpload}
        loader={loader}
        setLoader={setLoader}
      />

      <UploadNFTModal
        showNFTUpload={showNFTUpload}
        setShowNFTUpload={setShowNFTUpload}
        handleCloseNFTUpload={handleCloseNFTUpload}
        handleShowNFTUpload={handleShowNFTUpload}
        loader={loader}
        setLoader={setLoader}
      />
    </>
  );
};

export default NavBar;
