import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/noty/lib/noty.css';
import '../node_modules/noty/lib/themes/metroui.css';
import { toggleDarkMode } from '../src/actions/index';
import NavBar from '../src/component/Navbar/Navbar';
import './App.css';
import Loader from './component/Loader/Loader';
import SearchPage from './component/Navbar/SearchResult';
import NFTFeed from './component/nft.component';
import PageNotFound from './component/PageNotFound/PageNotFound';
import PinnedPanel from './component/Pinned_Panel/Pinned_Panel';
import UploadPage from './component/switcher.component';
import Track from './component/track.component';
import TopLoader from './hooks/TopLoader';
import VideoHome from './pages/Home/Home';
import Login from './pages/Login/Login';
import NewPassword from './pages/Login/NewPassword';
import Profile from './pages/Profile/Profile';
import ChatRoom from './pages/Profile/ProfileSections/ChatRoom/ChatRoom';
import Ticket from './pages/Profile/ProfileSections/Ticket/Ticket';
import PublicRoom from './pages/VideoPages/Pages/LivePublicPage/PublicRoomPage';
import Playback from './pages/VideoPages/Pages/PlayBack/PlaybackRoomPage';
import TrackPlayback from './pages/VideoPages/Pages/TrackPage/TrackInfo';

export default function App() {
  let user = JSON.parse(window.localStorage.getItem('user'));
  const darkMode = useSelector((state) => state.toggleDarkMode);
  let darkmode = JSON.parse(window.localStorage.getItem('darkmode'));
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
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

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Router>
        <div className={`${darkMode && 'dark'}  `}>
          <div className=" h-full  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary   ">
            <div className=" ">
              <Switch>
                <Route exact path="/">
                  <TopLoader page="home" />
                  <NavBar />
                  <PinnedPanel />
                  <VideoHome />
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
                <Route exact path="/nft">
                  <TopLoader page="nft" />
                  <NavBar />
                  <PinnedPanel />
                  <NFTFeed />
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
                {/* <Route exact path="/" component={LandingPage} /> */}
                {/* <Route exact path="/home" component={VideoHome} />  */}
                {/* <Route exact path="/streamer/:roomID" component={UserRoom} /> */}

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
