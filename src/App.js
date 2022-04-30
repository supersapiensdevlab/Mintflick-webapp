import axios from 'axios';
import React, { useEffect } from 'react';

import { Redirect } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { clearProvider, createProvider } from './actions/web3Actions';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/noty/lib/noty.css';
import '../node_modules/noty/lib/themes/metroui.css';
import { toggleDarkMode } from '../src/actions/index';
import NavBar from '../src/component/Navbar/Navbar';
import './App.css';
import Loader from './component/Loader/Loader';
import SearchPage from './component/Navbar/SearchResult';
import PageNotFound from './component/PageNotFound/PageNotFound';
import PinnedPanel from './component/Pinned_Panel/Pinned_Panel';
import UploadPage from './component/switcher.component';
import Track from './component/track.component';
import TopLoader from './hooks/TopLoader';
import VideoHome from './pages/Home/Home';
import GamerHome from './pages/Home/Home-gamer';

import Login from './pages/Login/Login';
import NewPassword from './pages/Login/NewPassword';
import VerifyEmail from './pages/Login/VerifyEmail';
import Profile from './pages/Profile/Profile';
import ChatRoom from './pages/Profile/ProfileSections/ChatRoom/ChatRoom';
//import Ticket from './pages/Profile/ProfileSections/Ticket/Ticket';
import UserRoomPage from './pages/VideoPages/Pages/GoLive_UserPage/UserRoomPage';
import PublicRoom from './pages/VideoPages/Pages/LivePublicPage/PublicRoomPage';
import Playback from './pages/VideoPages/Pages/PlayBack/PlaybackRoomPage';
import TrackPlayback from './pages/VideoPages/Pages/TrackPage/TrackInfo';
import ResetWallet from './pages/Login/ResetWallet';

// components

import HeaderStats from './component/Headers/HeaderStats';
import FooterAdmin from './component/Footers/FooterAdmin';

// views

import Dashboard from './views/admin/Dashboard.js';
import Maps from './views/admin/Maps.js';
import Settings from './views/admin/Settings.js';
import Tables from './views/admin/Tables.js';

import { useState } from 'react';

import Ticket from './Ticket.js';
import useWeb3Modal from './hooks/useWeb3Modal';

// Redux
import { loadUser } from './actions/userActions';
import SpinGame from './pages/SpinGame/SpinGame';

export default function App() {
  const user = useSelector((state) => state.User.user);
  const darkMode = useSelector((state) => state.toggleDarkMode);
  let darkmode = JSON.parse(window.localStorage.getItem('darkmode'));
  const dispatch = useDispatch();
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const provider = useSelector((state) => state.web3Reducer.provider);
  const userType = useSelector((state) => state.toggleUserType);
  //dispatch(toggleUserType(userType));

  const [arrayData, setArrayData] = useState([]);

  const [latestVideo, setLatestVideo] = useState([]);
  const [latestTrack, setLatestTrack] = useState([]);
  const [latestUploads, setLatestUploads] = useState(null);

  const fetchData = async () => {
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    for (let i = 0; i < fileRes.data.length; i++) {
      setArrayData((prevState) => [...prevState, fileRes.data[i]]);
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

  useEffect(async () => {
    if (!provider) {
      dispatch(createProvider(await loadWeb3Modal()));
    }
  }, []);

  useEffect(async () => {
    if (user) {
      //console.log('THIS IS BEING PASSED', user);
      axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${user.username}`).then((value) => {
        window.localStorage.setItem('user', JSON.stringify(value.data));
      });
    }
    if (darkmode === null) {
      window.localStorage.setItem('darkmode', darkMode);
      if (darkMode) {
        document.body.style.backgroundColor = '#101010';
      } else {
        document.body.style.backgroundColor = '#fff';
      }
    } else {
      dispatch(toggleDarkMode(darkmode));
      if (darkmode) {
        document.body.style.backgroundColor = '#101010';
      } else {
        document.body.style.backgroundColor = '#fff';
      }
    }

    fetchData();

    // Redux loading already login user;
    dispatch(loadUser());
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        <div className={`${darkMode && 'dark'}  `}>
          <div className=" ">
            <div className=" ">
              {/* {userType !== null ? '' : <OnboardingModal></OnboardingModal>} */}

              <Switch>
                <Route exact path="/">
                  {/* <OnboardingModal /> */}
                  <TopLoader page="home" />
                  <NavBar />
                  <PinnedPanel />
                  {userType === 0 ? <VideoHome /> : null}

                  {userType === 1 ? <GamerHome /> : null}
                  {userType === 2 ? <VideoHome /> : null}
                </Route>
                <Route exact path="/ticket">
                  <Ticket></Ticket>
                </Route>
                <Route exact path="/signup">
                  <TopLoader page="signup" />
                  <NavBar />
                  <PinnedPanel />
                  <Login />
                </Route>
                <Route exact path="/profile/:username/:tab?">
                  <TopLoader page="profile" />
                  <NavBar />
                  <PinnedPanel />
                  <Profile />
                </Route>
                <Route exact path="/search">
                  <TopLoader page="search" />
                  <NavBar />
                  <PinnedPanel />
                  <SearchPage />
                </Route>

                <Route exact path="/live/:username">
                  <TopLoader page="public" />
                  <NavBar />
                  <PinnedPanel />
                  <PublicRoom />
                </Route>
                <Route exact path="/playback/:username/:video_id">
                  <TopLoader page="playback" />
                  <NavBar />
                  <PinnedPanel />
                  <Playback />
                </Route>
                <Route exact path="/track/:username/:track_id">
                  <TopLoader page="track" />
                  <NavBar />
                  <PinnedPanel />
                  <TrackPlayback />
                </Route>
                <Route exact path="/chat/:username">
                  <TopLoader page="chatroom" />
                  <NavBar />
                  <PinnedPanel />
                  <ChatRoom />
                </Route>

                <Route exact path="/upload">
                  <TopLoader page="upload" />
                  <NavBar />
                  <PinnedPanel />
                  <UploadPage />
                </Route>
                <Route exact path="/music">
                  <TopLoader page="track" />
                  <NavBar />
                  <PinnedPanel />
                  <Track />
                </Route>

                <Route exact path="/loader">
                  <TopLoader page="loader" />
                  <NavBar />
                  <PinnedPanel />
                  <Loader />
                </Route>
                <Route exact path="/unlock">
                  <TopLoader page="ticket" />
                  <NavBar />
                  <PinnedPanel />
                  <Ticket />
                </Route>

                <Route exact path="/reset/:token" component={NewPassword} />
                <Route exact path="/resetwallet/:token" component={ResetWallet} />
                <Route exact path="/verifyemail/:token" component={VerifyEmail} />
                {/* <Route exact path="/" component={LandingPage} /> */}
                {/* <Route exact path="/home" component={VideoHome} />  */}
                <Route exact path="/streamer/:roomID">
                  <TopLoader page="streaming" />
                  <NavBar />
                  <PinnedPanel />
                  <UserRoomPage />
                </Route>
                <Route exact path="/spingame">
                  <TopLoader page="spingame" />
                  <NavBar />
                  <PinnedPanel />
                  <SpinGame />
                </Route>

                {/* ADMIN ROUTES */}

                <div className="">
                  <div className="relative ">
                    <NavBar />
                    {/* Header */}
                    {(user && user.username === 'orion') ||
                    (user && user.username === 'rishikeshk9') ? (
                      <>
                        <HeaderStats data={arrayData} />
                        <div className="px-4 md:px-10 mx-auto w-full -m-24">
                          <Switch>
                            <Route
                              path="/admin/dashboard"
                              exact
                              component={() => <Dashboard data={arrayData} />}
                            />

                            <Route
                              path="/admin/maps"
                              exact
                              component={() => <Maps data={arrayData} />}
                            />
                            <Route
                              path="/admin/settings"
                              exact
                              component={() => <Settings data={arrayData} />}
                            />
                            <Route
                              path="/admin/tables"
                              exact
                              component={() => <Tables data={arrayData} />}
                            />

                            <Redirect from="/admin" to="/admin/dashboard" />
                          </Switch>
                          <FooterAdmin />
                        </div>
                      </>
                    ) : (
                      <Redirect from="/admin" to="/" />
                    )}
                  </div>
                </div>

                <Route>
                  <TopLoader page="pagenotfound" />
                  <NavBar />
                  <PinnedPanel />
                  <PageNotFound />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </>
  );
}
