import { useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import TestConnection from "../src/Componants/Wallet/testConnect";
import { UserContext } from "./Store";
import HomeScreen from "./Pages/HomeScreen";
import Home from "./Componants/Home/Home";
import Live from "./Componants/Live/Live";
import Events from "./Componants/Event/Events";
import ConnectWallet from "./Pages/ConnectWallet";
import ConnectWalletComponant from "./Componants/Wallet/ConnectWalletComponant";
import CreateNewUser from "./Componants/Wallet/CreateNewUser";
import axios from "axios";
import Profile from "./Pages/Profile";
import ProfileMedia from "./Componants/Profile/ProfileMedia";
import Posts from "./Componants/Profile/ProfileMedia/Posts";
import Playlists from "./Componants/Profile/ProfileMedia/Playlists";
import Music from "./Componants/Profile/ProfileMedia/Music";
import Videos from "./Componants/Profile/ProfileMedia/Videos";
import GoLive from "./Componants/GoLive/GoLive";
import UserLivestream from "./Componants/Live/UserLivestream";
import ShareModal from "./Componants/Home/Modals/ShareModal";
import BuyNFTModal from "./Componants/Home/Modals/BuyNFTModal";
import ChatRoom from "./Componants/ChatRoom/ChatRoom";
import UserLiveFullScreen from "./Componants/Live/UserLiveFullScreen";
import useWeb3Auth from "./Hooks/useWeb3Auth";
import Explore from "./Pages/Explore";
import MobileNotifications from "./Pages/MobileNotifications";
import PostDetails from "./Pages/PostDetails";
import SpinWheel from "./Componants/Games/SpinWheel";
import AllGames from "./Componants/Games/AllGames";
import SpinGame from "./Componants/Games/SpinGame/SpinGame";
import RollDice from "./Componants/Games/RollDice/RollDice";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import CreateEvent from "./Componants/Event/CreateEvent";
function App() {
  const State = useContext(UserContext);
  const [login, logout] = useWeb3Auth();

  async function isUserAvaliable() {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: localStorage.getItem("walletAddress"),
      },
    })
      .then((response) => {
        console.log(response);
        fetchLiveUserData();
        State.updateDatabase({
          userData: response,
          walletAddress: response.data.user.wallet_id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    !State.database.userData.data &&
      localStorage.getItem("walletAddress") &&
      isUserAvaliable();
    console.log(State.database.userData);

    console.log(localStorage.getItem("authtoken"));
  }, []);

  function fetchLiveUserData() {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`)
      .then(async (repos) => {
        for (let i = 0; i < repos.data.length; i++) {
          console.log(repos);
          await axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`
            )
            .then((value) => {
              if (value.data !== "") State.addLiveUsers(value.data);
            });
        }
      });
  }

  // For Live Users
  // useEffect(() => {
  // fetchLiveUserData();
  // }, [ ]);

  //update Price
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/price_updates`)
      .then((repos) => {
        State.updateDatabase({ price: repos.data });
      });
  }, []);

  // useEffect(() => {
  //   if (State.database?.provider == null) {
  //     login();
  //     console.log("login useEffect called");
  //   }
  // }, [State.database.userData?.data]);

  return (
    <div className={State.database.dark ? `dark` : " "}>
      <Routes>
        <Route path="/" element={<ConnectWallet />}>
          <Route path="" element={<ConnectWalletComponant />} />
          <Route path="create_new_user" element={<CreateNewUser />} />
        </Route>

        <Route path="/test" element={<TestConnection />}></Route>
        <Route path="/homescreen" element={<HomeScreen />}>
          <Route path="home" element={<Home />} />

          <Route path="live" element={<Live />} />
          <Route path="golive" element={<GoLive />} />
          <Route path="liveuser/:username" element={<UserLivestream />} />

          <Route path="marketPlace" element={<Events></Events>} />
          <Route path="create-event" element={<CreateEvent/>} />

          <Route path="explore" element={<Explore />} />
          <Route path="notifications" element={<MobileNotifications />} />
          <Route path="allgames" element={<AllGames />} />
          <Route path="game/spinwheel" element={<SpinWheel />} />
          <Route path="game/rolldice" element={<RollDice />} />
          <Route path="game/spingame" element={<SpinGame />} />
          <Route path="profile/:userName" element={<Profile></Profile>}></Route>
          <Route path="chat/:username" element={<ChatRoom></ChatRoom>}></Route>
          <Route path=":userName/:type/:id" element={<PostDetails />}></Route>
        </Route>
      </Routes>
      <ShareModal />
      <BuyNFTModal />
    </div>
  );
}
serviceWorkerRegistration.register();
export default App;
