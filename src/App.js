import axios from 'axios';
import React, { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/noty/lib/noty.css';
import '../node_modules/noty/lib/themes/metroui.css';
import { toggleDarkMode } from '../src/actions/index';
import NavBar from '../src/component/Navbar/Navbar';
import './App.css';
import Loader from './component/Loader/Loader';
//import Navbar from "./component/navbar.component";
//import BottomBar from "./component/bottom-player.component";
import NFTFeed from './component/nft.component';
import PageNotFound from './component/PageNotFound/PageNotFound';
import PinnedPanel from './component/Pinned_Panel/Pinned_Panel';
import Track from './component/track.component';
import ChatRoom from './pages/Profile/ProfileSections/ChatRoom/ChatRoom';
import Ticket from './pages/Profile/ProfileSections/Ticket/Ticket';

const VideoHome = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/Home/Home')), 1000);
  });
});

const PublicRoom = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(import('./pages/VideoPages/Pages/LivePublicPage/PublicRoomPage')),
      1000,
    );
  });
});

const Playback = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/VideoPages/Pages/PlayBack/PlaybackRoomPage')), 1000);
  });
});

// eslint-disable-next-line no-unused-vars
const UserRoom = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(import('./pages/VideoPages/Pages/GoLive_UserPage/UserRoomPage')),
      1000,
    );
  });
});

const Profile = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/Profile/Profile')), 1000);
  });
});

const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/Login/Login')), 1000);
  });
});

const NewPassword = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/Login/NewPassword')), 1000);
  });
});

const UploadPage = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./component/switcher.component')), 1000);
  });
});

const SearchPage = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./component/Navbar/SearchResult')), 1000);
  });
});

const TrackPlayback = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./pages/VideoPages/Pages/TrackPage/TrackInfo')), 1000);
  });
});

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
        <Suspense fallback={<Loader />}>
          <div className={`${darkMode && 'dark'}  `}>
            <div className=" h-full  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary   ">
              <div className=" ">
                <Switch>
                  <Route exact path="/">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <VideoHome />
                  </Route>
                  <Route exact path="/signup">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Login />
                  </Route>
                  <Route exact path="/profile/:username/:tab?">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Profile />
                  </Route>
                  <Route exact path="/search">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <SearchPage />
                  </Route>

                  <Route exact path="/live/:username">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <PublicRoom />
                  </Route>
                  <Route exact path="/playback/:username/:video_id">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Playback />
                  </Route>
                  <Route exact path="/track/:username/:track_id">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <TrackPlayback />
                  </Route>
                  <Route exact path="/chat/:username">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <ChatRoom />
                  </Route>

                  <Route exact path="/upload">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <UploadPage />
                  </Route>
                  <Route exact path="/music">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Track />
                  </Route>
                  <Route exact path="/nft">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <NFTFeed />
                  </Route>
                  <Route exact path="/loader">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Loader />
                  </Route>
                  <Route exact path="/unlock">
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <Ticket />
                  </Route>

                  <Route exact path="/reset/:token" component={NewPassword} />
                  {/* <Route exact path="/" component={LandingPage} /> */}
                  {/* <Route exact path="/home" component={VideoHome} />  */}
                  {/* <Route exact path="/streamer/:roomID" component={UserRoom} /> */}

                  <Route>
                    <NavBar />
                    <PinnedPanel userdata={user} />
                    <PageNotFound />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </Suspense>
      </Router>
    </>
  );
}
