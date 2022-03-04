// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Noty from "noty";
// import Multiselect from "multiselect-react-dropdown";
// import logo from "../assets/graphics/DBeatsHori.png";
import { Transition } from '@headlessui/react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
//import Dropdown from "./dropdown.component";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//import Switch from "./switch.component";
import { useDispatch, useSelector } from 'react-redux';
import { toggleAudius } from '../actions/index';
import logo from '../assets/images/logo.svg';
import BottomBar from './bottom-player.component';
import PopUp from './popup.component';

export default function Track() {
  // constructor(props) {
  //   super(props);
  // const dispatch = useDispatch();

  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.toggleDarkMode);
  const audius = useSelector((state) => state.toggleAudius);
  const user = JSON.parse(window.localStorage.getItem('user'));

  const [firstPlayed, setFirstPlay] = useState(false);
  const [songDetails, setDetails] = useState({
    id: '',
    songLink: '',
    artwork: '',
    songTitle: '',
    author: '',
    playing: false,
  });
  const [playId, setPlayId] = useState(null);
  const [favorites, setFavorites] = useState(null);

  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    items: [],
    topTrack: null,
    play: false,
  });

  const [dbeatsTracks, setDbeatsTrack] = useState({
    error: null,
    isLoaded: false,
    items: [],
    topTrack: null,
    play: false,
  });

  //   getTodos = getTodos.bind(this);
  // }
  const get_favorites = async () => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/user/${user.username}/favorites`)
      .then((value) => {
        setFavorites(value.data);
        //console.log('Favorites fetched!');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let audio = new Audio('');

  const getTodos = async () => {
    if (user) get_favorites();
    let data = await axios
      .get('https://discoveryprovider.audius.co/v1/tracks/trending')
      .then(function (response) {
        ////console.log(response.data.data);
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
    if (data) setState({ todos: data.data.data });
  };

  const getDBeatsTracks = async () => {
    let data = await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/dbeats-music`)
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(data.data[0].tracks);
    if (data.data[0]) {
      let tracksArray = [];
      tracksArray.push(data.data[0].tracks);
      if (data) setDbeatsTrack({ dbeatsTracks: data.data[0].tracks });
    }
  };

  useEffect(() => {
    // Anything in here is fired on component mount.
    //console.log('GrandChild did mount.');
    getTodos();
    getDBeatsTracks();

    audio.addEventListener('ended', () => setState({ play: false }));
    return () => {
      // Anything in here is fired on component unmount.
      audio.removeEventListener('ended', () => setState({ play: false }));
    };
    // eslint-disable-next-line
  }, []);

  const pauseResume = async () => {
    if (state.play) {
      //   // audio.pause();
      setPlayId(null);
      let details = {
        id: songDetails.id,
        songLink: songDetails.songLink,
        artwork: songDetails.artwork,
        songTitle: songDetails.songTitle,
        author: songDetails.author,
        playing: false,
      };
      setDetails(details);
      state.play = false;
      //console.log('SONG PAUSED');
    } else {
      //   // audio.play();
      state.play = true;
      let details = {
        id: songDetails.id,
        songLink: songDetails.songLink,
        artwork: songDetails.artwork,
        songTitle: songDetails.songTitle,
        author: songDetails.author,
        playing: true,
      };
      setDetails(details);
      setPlayId(songDetails.id);

      //console.log('SONG RESUME');
    }
  };

  const setFavorite = async (props) => {
    let postData = {
      username: user.username,
      track_id: props,
    };

    //console.log(postData);

    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/favorite`,
      data: postData,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    });
    get_favorites();
    //console.log(result);
  };

  const removeFavorite = async (props) => {
    let postData = {
      username: user.username,
      track_id: props,
    };

    //console.log(postData);

    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/unfavorite`,
      data: postData,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    });
    get_favorites();
    //console.log(result);
  };

  var seconds = 0;
  var timex;
  function startTimer(trackId) {
    let postData = {
      trackId: trackId,
    };
    timex = setTimeout(async () => {
      seconds++;

      if (seconds > 3) {
        await axios({
          method: 'post',
          url: `${process.env.REACT_APP_SERVER_URL}/count-play`,
          data: postData,
        });

        clearTimeout(timex);
      } else {
        startTimer(trackId);
      }
    }, 1000);
  }

  const playAudiusAudio = async (id, artwork, title, author) => {
    if (!firstPlayed) {
      setFirstPlay(true);
    }
    getDBeatsTracks();
    let url = `https://discoveryprovider.audius.co/v1/tracks/${id}/stream`;

    if (url !== songDetails.songLink) {
      state.play = true;
      clearTimeout(timex);
      startTimer(id);
      let details = {
        id: id,
        songLink: url,
        artwork: artwork,
        songTitle: title,
        author: author,
        playing: true,
      };
      setDetails(details);
      setPlayId(id);
      //console.log('NEW SONG');
    } else {
      pauseResume();
    }
  };

  const playUserAudio = async (id, link, artwork, title, author) => {
    if (!firstPlayed) {
      setFirstPlay(true);
    }
    getDBeatsTracks();

    let url = link;
    if (url !== songDetails.songLink) {
      state.play = true;
      clearTimeout(timex);
      startTimer(id);
      let details = {
        id: id,
        songLink: url,
        artwork: artwork,
        songTitle: title,
        author: author,
        playing: true,
      };
      setDetails(details);
      setPlayId(id);
      //console.log('NEW SONG');
    } else {
      pauseResume();
    }
  };

  return (
    <>
      <div id="outer-container" className="h-full ">
        <div id="page-wrap" className={`${darkMode && 'dark'}  `}>
          <div className="pb-10 pt-4 bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary mx-auto  self-center  relative w-full h-screen     ">
            <div className="w-full pt-16 justify-center text-center mx-auto">
              <p
                id="song-title"
                className="mb-3 w-max mx-auto   self-center text-center  drop-shadow text-2xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800"
              >
                <span className=" bg-red-900 animate-ping mr-2 rounded-full   inline-block  h-2 w-2 self-center ">
                  &middot;
                </span>
                LIVE
              </p>
              <Splide
                options={{
                  drag: true,
                  arrows: false,
                  rewind: true,
                  perPage: window.innerWidth >= '768' ? 6 : 4,
                }}
                className="lg:w-2/3 w-full mx-auto p-7 m-5 "
              >
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 1" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 2" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 3" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 4" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 5" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 6" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 7" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 8" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 9" />
                </SplideSlide>
                <SplideSlide className=" md:px-5">
                  <img className="mx-auto self-center" src={logo} alt="live 10" />
                </SplideSlide>
              </Splide>{' '}
            </div>
            <div className="flex  w-full lg:w-2/3 justify-between px-5 self-center mx-auto">
              <p
                id="song-title"
                className="mb-3   w-max    drop-shadow 2xl:text-2xl lg:text-lg md:text-md text-lg  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800"
              >
                TRENDING NOW
              </p>
              <label className="flex items-center cursor-pointer mx-3 self-center">
                <div className="relative ">
                  <input
                    type="checkbox"
                    id="audius"
                    defaultChecked={audius}
                    onClick={() => dispatch(toggleAudius())}
                    className="sr-only"
                  ></input>

                  <div className="block bg-blue-200 dark:bg-gray-800 w-14 h-8 rounded-full  shadow-inner"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full  transition shadow"></div>
                </div>

                <div className="ml-3 text-gray-500 font-medium">
                  <img
                    src="https://audius.org/img/audius@2x.png"
                    className={`${!audius ? 'filter grayscale-75 ' : ''}w-10 h-10 filter`}
                    alt="audius"
                  ></img>
                </div>
              </label>
            </div>
            <Transition
              show={audius}
              enter="transition ease-in-out duration-800"
              enterFrom="transform opacity-0  -translate-x-full "
              enterTo="transform opacity-100   translate-x-0 "
              leave="transition ease-in-out duration-800"
              leaveFrom="transform opacity-100   translate-x-0"
              leaveTo="transform   opacity-0 -translate-x-full"
              className="dark:bg-dbeats-dark-primary"
            >
              {audius &&
                state.todos &&
                state.todos.map((todo) => {
                  return (
                    <div
                      id="tracks-section"
                      className={` text-gray-200  lg:w-2/3 w-full mx-auto  py-1 md:py-2 w-full  px-5 my-0 group `}
                      key={todo.id}
                      style={{ zIndex: -1 }}
                    >
                      {/* header */}
                      <div className=" group " style={{ zIndex: -1 }}>
                        <div
                          className="bg-white  group dark:bg-dbeats-dark-alt dark:text-blue-300 shadow-md  flex p-2  mx-auto  rounded-lg  w-full hover:scale-101 transform transition-all "
                          style={{ zIndex: -1 }}
                        >
                          <div
                            onClick={() =>
                              playAudiusAudio(
                                todo.id,
                                todo.artwork['150x150'],
                                todo.title,
                                todo.user.name,
                              )
                            }
                            className="items-center h-26 w-30 md:h-48 md:w-52 flex   cursor-pointer mr-4"
                          >
                            <img
                              id="album-artwork"
                              src={todo.artwork['150x150']}
                              className="mr-4 w-full h-full 2 rounded  "
                              alt=""
                            ></img>
                            <div className="opacity-80  h-max w-max mx-auto rounded-full  absolute    sm:hidden hover:opacity-100    cursor-pointer mr-2   text-center  text-white    hover:scale-95 transform transition-all">
                              <i
                                name={todo.id}
                                align="center"
                                style={{
                                  marginLeft: '65%',
                                  marginTop: '10%',
                                }}
                                className={`${
                                  state.play && playId === todo.id
                                    ? 'fa-pause-circle'
                                    : 'fa-play-circle'
                                } fas text-5xl md:text-6xl   text-center  `}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col justify-center m-0 p-0  w-full  truncate  ">
                            {/* content */}
                            <div className="flex justify-between w-full ">
                              <h4 className="playlist  mt-0  uppercase text-gray-500 tracking-widest text-sm">
                                {todo.genre}
                              </h4>
                              <p className="font-semibold text-gray-500">
                                {Math.floor(todo.duration / 60)}:
                                {todo.duration - Math.floor(todo.duration / 60) * 60}
                              </p>
                            </div>

                            <p
                              id="song-title"
                              className=" overflow-ellipsis  w-full max-w-full mt-0 mb-1 md:mb-2 drop-shadow xl:text-3xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                            >
                              {todo.title}
                            </p>

                            <p
                              id="song-author"
                              className="mt-0  mb-1 md:mb-2   text-gray-600 tracking-widest  text-sm flex font-semibold"
                            >
                              {todo.user.name}&nbsp;
                              {todo.user.is_verified ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5  text-blue-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                ''
                              )}
                            </p>

                            <div className=" flex mt-2">
                              <p
                                id="plays"
                                className="mt-0   md:mb-2 mr-3   text-gray-400 text-sm flex   "
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                &nbsp;
                                {todo.play_count > 1000
                                  ? (todo.play_count / 1000).toFixed(2)
                                  : todo.play_count.toFixed(2)}
                                K&nbsp;Plays
                              </p>

                              <p
                                id="favorites"
                                className="mt-0   md:mb-2  text-gray-400 text-sm flex"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 "
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                &nbsp;{todo.favorite_count}&nbsp;Favorites
                              </p>
                            </div>

                            {/* action buttons */}

                            <div className=" flex mt-2   ">
                              <div className=" sm:flex ">
                                <button
                                  onClick={() =>
                                    playAudiusAudio(
                                      todo.id,
                                      todo.artwork['150x150'],
                                      todo.title,
                                      todo.user.name,
                                    )
                                  }
                                  name={todo.id}
                                  className="hidden lg:block  cursor-pointer mr-2 uppercase font-bold  bg-gradient-to-r from-green-400 to-blue-500   text-white block py-2 px-10   hover:scale-95 transform transition-all"
                                >
                                  {`${state.play && playId === todo.id ? 'Pause' : 'Play'}`}
                                </button>
                                <div className="flex">
                                  {user ? (
                                    <button
                                      onClick={
                                        favorites
                                          ? favorites.indexOf(todo.id) > -1
                                            ? () => removeFavorite(todo.id)
                                            : () => setFavorite(todo.id)
                                          : null
                                      }
                                      className={`${
                                        favorites
                                          ? favorites.indexOf(todo.id) > -1
                                            ? 'text-red-900'
                                            : 'text-gray-600 hover:text-red-300'
                                          : false
                                      } mr-2 block p-2 rounded-full hover:scale-95 dark:hover:bg-dbeats-dark-secondary transform transition-all`}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg "
                                        className={`  h-6 w-6  `}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                      </svg>
                                    </button>
                                  ) : (
                                    false
                                  )}
                                  <div className="opacity-0 group-hover:opacity-100">
                                    <PopUp />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Transition>
            <Transition
              show={!audius}
              enter="transition ease-in-out duration-800"
              enterFrom="transform opacity-0  -translate-x-full "
              enterTo="transform opacity-100   translate-x-0 "
              leave="transition ease-in-out duration-800"
              leaveFrom="transform opacity-100   translate-x-0"
              leaveTo="transform   opacity-0 -translate-x-full"
              className="dark:bg-dbeats-dark-primary "
            >
              {!audius &&
                dbeatsTracks.dbeatsTracks &&
                dbeatsTracks.dbeatsTracks.map((todo) => {
                  return (
                    <div
                      id="tracks-section"
                      className={` text-gray-200  md:w-2/3 mx-auto  py-2 w-full  px-5 my-0 `}
                      key={todo.trackId}
                    >
                      {/* header */}
                      <div className="  ">
                        <div className="bg-white  dark:bg-dbeats-dark-alt dark:text-blue-300 shadow-md flex p-3  mx-auto  rounded-lg  w-full hover:scale-101 transform transition-all">
                          <div className="items-center h-50 w-56 flex   mr-4">
                            <img
                              id="album-artwork"
                              src={todo.trackImage}
                              className="mr-4 w-full h-full 2 rounded  "
                              alt=""
                            ></img>
                            <div className="opacity-80  h-max w-max mx-auto rounded-full  absolute    sm:hidden hover:opacity-100    cursor-pointer mr-2   text-center  text-white    hover:scale-95 transform transition-all">
                              <i
                                onClick={() =>
                                  playUserAudio(
                                    todo.trackId,
                                    todo.link,
                                    todo.artwork['150x150'],
                                    todo.trackName,
                                    todo.user.name,
                                  )
                                }
                                name={todo.trackId}
                                align="center"
                                style={{ marginLeft: '55%' }}
                                className={`${
                                  state.play && playId === todo.trackId
                                    ? 'fa-pause-circle'
                                    : 'fa-play-circle'
                                } fas text-6xl   text-center  `}
                              />
                            </div>
                          </div>

                          <div className="flex flex-col justify-center   w-full  truncate ">
                            {/* content */}
                            <div className="flex justify-between w-full ">
                              <h4 className="playlist  mt-0  uppercase text-gray-500 tracking-widest text-sm ">
                                {todo.genre}
                              </h4>
                            </div>

                            <p
                              id="song-title"
                              className=" overflow-ellipsis  w-full max-w-full mt-0 mb-2 drop-shadow xl:text-3xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                            >
                              {todo.trackName}
                            </p>

                            {/* action buttons */}

                            <div className=" flex mt-2   ">
                              <div className=" sm:flex hidden">
                                <button
                                  onClick={() =>
                                    playUserAudio(
                                      todo.trackId,
                                      todo.link,
                                      todo.trackImage,
                                      todo.trackName,
                                      todo.trackName,
                                    )
                                  }
                                  name={todo.trackId}
                                  className="  cursor-pointer mr-2 uppercase font-bold  bg-gradient-to-r from-green-400 to-blue-500   text-white block py-2 px-10   hover:scale-95 transform transition-all"
                                >
                                  {`${state.play && playId === todo.trackId ? 'Pause' : 'Play'}`}
                                </button>
                                {user ? (
                                  <button
                                    onClick={
                                      favorites
                                        ? favorites.indexOf(todo.trackId) > -1
                                          ? () => removeFavorite(todo.trackId)
                                          : () => setFavorite(todo.trackId)
                                        : null
                                    }
                                    className={`${
                                      favorites
                                        ? favorites.indexOf(todo.trackId) > -1
                                          ? 'text-red-900'
                                          : 'text-gray-600 hover:text-red-300'
                                        : false
                                    } mr-2  block p-2 rounded-full hover:scale-95 dark:hover:bg-dbeats-dark-secondary transform transition-all`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`  h-6 w-6 `}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      />
                                    </svg>
                                  </button>
                                ) : (
                                  false
                                )}
                                <PopUp />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Transition>
          </div>
          <BottomBar
            songDetails={songDetails}
            playing={state.play}
            setState={() => pauseResume()}
            firstPlayed={firstPlayed}
          />
        </div>
      </div>
    </>
  );
}
