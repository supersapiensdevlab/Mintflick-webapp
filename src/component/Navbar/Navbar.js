import { Menu as Dropdown, Transition } from '@headlessui/react';
import axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { push as Menu } from 'react-burger-menu';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleDarkMode } from '../../actions/index';
import logoDark from '../../assets/images/dark-logo.svg';
import CircleLogoDark from '../../assets/images/dark-logo-svg.svg';

import CircleLogo from '../../assets/images/dbeats-logo.png';
import logo from '../../assets/images/white-logo.svg';
import useWeb3Modal from '../../hooks/useWeb3Modal';
import moment from 'moment';
import Toggle from '../toggle.component';
import classes from './Navbar.module.css';
import person from '../../assets/images/profile.svg';
import Web3 from 'web3';
import { clearProvider } from '../../actions/web3Actions';
import { useHistory } from 'react-router-dom';
import { web3Login } from '../../actions/userActions';

moment().format();

const NavBar = () => {
  // eslint-disable-next-line no-unused-vars
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);

  const [notification, setNotification] = useState([]);

  const user = JSON.parse(window.localStorage.getItem('user'));

  const wrapperRef = useRef(null);

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const [alluser, setAllUser] = useState([]);
  const [filterResultDisplay, setFilterResultDisplay] = useState(true);
  const [newNotification, setNewNotification] = useState(0);

  //  Modal
  const [showOpen, setOnOpen] = useState(false);

  // Sidebar functions
  const handleOnOpen = () => setOnOpen(true);
  const isMenuOpen = (state) => setOnOpen(state.isOpen);

  const [userLiveTime, setUserLiveTime] = useState(null);

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
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
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

  const convertTimestampToTime = (timeValue) => {
    const timestamp = new Date(timeValue.timestamp); // This would be the timestamp you want to format
    setUserLiveTime(moment(timestamp).fromNow());
  };

  const NotificationContent = ({ data }) => {
    // console.log(data);
    convertTimestampToTime(data);
    return (
      <div className="h-full my-1">
        <a
          href={`/live/${data.username}`}
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
          {data.announcement.includes('was') ? (
            <div className="col-span-3 rounded-sm ">
              <p className="pl-2 line-clamp-3 text-sm font-semibold break-words">
                {data.announcement + ` ${userLiveTime} ago`}
              </p>
            </div>
          ) : (
            <div className="col-span-3 rounded-sm ">
              <p className="pl-2 line-clamp-3 text-sm font-semibold break-words">
                {data.announcement}
              </p>
              <p className="pl-2 line-clamp-3 text-xs font-normal break-words">{userLiveTime}</p>
            </div>
          )}
        </a>
      </div>
    );
  };

  const EmptyNotificationContent = () => {
    return (
      <div className="h-full my-1">
        <div
          rel="noopener noreferrer"
          className="grid grid-cols-4 justify-center p-2 dark:bg-dbeats-dark-alt dark:hover:bg-dbeats-dark-secondary dark:text-white text-gray-500"
        >
          <p>No new Notifications</p>
        </div>
      </div>
    );
  };

  const [account, setAccount] = useState(null);
  const history = useHistory();
  const login = async () => {
    if (!provider) {
      const web3 = new Web3(await loadWeb3Modal());
      const address = (await web3.eth.getAccounts())[0];
      const balance = await web3.eth.getBalance(address);
      setAccount(address);
      //console.log('USER LOGGED IN', address, balance);
      if (address) {
        console.log('ADDRESS', address);
        await axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet/${address}`)
          .then((value) => {
            window.localStorage.setItem('user', JSON.stringify(value.data.user));
            dispatch(web3Login(value.data));
            // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
            // //window.location.href = '/';
            console.log(value.data);
            history.push('/');
          });
      }
    } else if (account) {
      await logoutOfWeb3Modal();
      dispatch(clearProvider());
      console.log('logged ou!!!');
      setAccount(null);
    }
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
              className="mr-1 sm:mr-5 cursor-pointer  rounded  self-center"
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
              <a href="/" className="  self-center cursor-pointer sm:flex hidden">
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
                <span className="mr-5 text-lg font-bold   sm:ml-2"> </span>
              </a>
              <a href="/" className="flex self-center cursor-pointer sm:hidden ">
                <img
                  src={CircleLogo}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max dark:hidden"
                ></img>
                <img
                  src={CircleLogoDark}
                  alt="dbeats_logo"
                  className="h-10 lg:h-7 2xl:h-10 w-max hidden dark:block  "
                ></img>
                <span className="mr-5 text-lg font-bold   sm:ml-2"> </span>
              </a>
              <p
                className="px-2 -ml-3.5 flex pb-0.5 mt-1 text-xs text-white dark:text-dbeats-light 
              bg-dbeats-light dark:bg-dbeats-alt border border-white dark:border-dbeats-light font-semibold rounded-lg"
              >
                beta
              </p>
            </div>

            <div className="w-2/5 sm:w-1/3 mx-auto  self-center dark:focus:ring-dbeats-light">
              <div className="dark:focus:ring-dbeats-light  self-center rounded-full  flex bg-gray-100 dark:bg-dbeats-dark-primary">
                <input
                  type="text"
                  placeholder="Search"
                  className="dark:focus:ring-dbeats-light   w-full lg:h-8 2xl:h-10 h-10 rounded-full border-0 bg-gray-100 self-center    px-5 dark:bg-dbeats-dark-secondary"
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
                  <i className="fas fa-search text-gray-500 hover:text-dbeats-light self-center mx-3 text-lg"></i>
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
            {/* {user ? (
              <div className="flex items-center  ">
                <Dropdown as="div" className="relative inline-block text-left  self-center">
                  <Dropdown.Button className="flex h-full items-center">
                    <i className="fas fa-plus text-dbeats-light hover:text-dbeats-secondary-light"></i>
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
            ) : null} */}
            {user ? (
              <div id="login-btn" className="flex items-center">
                <Link
                  to={`/streamer/${user.username}`}
                  className="border-dbeats-light 2xl:border-1   text-dbeats-light hover:bg-dbeats-light hover:text-white rounded font-bold mx-2 "
                >
                  <div className="flex lg:py-1   py-1.5 2xl:px-3 lg:px-2 px-1.5 ">
                    <i className="fas fa-video self-center md:mr-2"></i>
                    <span className="self-center     lg:text-xs 2xl:text-lg md:flex hidden">
                      Go Live
                    </span>
                  </div>
                </Link>
                <Dropdown as="div" className="relative inline-block text-left  self-center mr-1">
                  <Dropdown.Button className="flex h-full items-center">
                    <div onClick={handleNotification}>
                      <i className="fas fa-bell text-dbeats-light text-lg hover:text-dbeats-secondary-light"></i>
                      {newNotification > 0 ? (
                        <div
                          className="bg-red-500 rounded-full shadow  
                        h-4 w-4 text-xs self-center text-center font-semibold  
                        absolute -top-1  -right-2  
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
                      className="absolute right-0 w-96 mt-6 origin-top-right max-h-125 overflow-y-scroll	overflow-x-hidden
                    dark:bg-dbeats-dark-primary   divide-y divide-white divide-opacity-20 rounded-md shadow-lg 
                     focus:outline-none"
                    >
                      {notification.length > 0 ? (
                        <>
                          {notification.map((value, i) => {
                            return (
                              <div className="px-1   " key={i}>
                                <Dropdown.Item className="w-full h-full self-center dark:bg-dbeats-dark-primary">
                                  <NotificationContent data={value} />
                                </Dropdown.Item>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="px-1   ">
                          <Dropdown.Item className="w-full h-full self-center  nm-flat-dbeats-dark-primary rounded">
                            <EmptyNotificationContent />
                          </Dropdown.Item>
                        </div>
                      )}
                    </Dropdown.Items>
                  </Transition>
                </Dropdown>

                <Link
                  to={`/profile/${user.username}`}
                  className="shadow-sm 2xl:h-10  2xl:w-10 self-center  h-8 w-8 p-0.5 nm-flat-dbeats-dark-primary hover:nm-inset-dbeats-dark-primary text-white rounded-full font-bold mx-2 flex"
                >
                  <img
                    src={user.profile_image ? user.profile_image : person}
                    className=" mx-auto self-center rounded-full"
                  ></img>
                </Link>
              </div>
            ) : (
              <div
                onClick={login}
                className="shadow-sm p-0.5 dark:bg-gradient-to-r 
                dark:from-dbeats-secondary-light dark:to-dbeats-light  ml-2 md:mx-2 md:ml-0 transform-gpu  transition-all duration-300 ease-in-out my-1 
                cursor-pointer relative inline-flex items-center justify-center   mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl 
                 bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary   hover:text-white dark:text-white  "
              >
                <div className=" px-5 py-1   bg-gradient-to-br from-dbeats-light to-dbeats-secondary-light hover:nm-inset-dbeats-secondary-light  rounded-3xl flex self-center align-middle">
                  <i className="fas fa-sign-in-alt text-xs lg:text-sm 2xl:text-lg self-center mr-2 hidden md:block align-middle justify-center"></i>{' '}
                  <p className=" text-xs lg:text-sm 2xl:text-lg self-center mr-2 hidden md:block align-middle justify-center">
                    signup
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
