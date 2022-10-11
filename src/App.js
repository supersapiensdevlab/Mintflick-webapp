import { useContext, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

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
import Web3Connect from "./Componants/Wallet/Web3Connect";
import UserLivestream from "./Componants/Live/UserLivestream";
import ShareModal from "./Componants/Home/Modals/ShareModal";
import BuyNFTModal from "./Componants/Home/Modals/BuyNFTModal";
import ChatRoom from "./Componants/ChatRoom/ChatRoom";
import UserLiveFullScreen from "./Componants/Live/UserLiveFullScreen";
import useWeb3Auth from "./Hooks/useWeb3Auth";
function App() {
  const State = useContext(UserContext);
  const  [login, logout] = useWeb3Auth();
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
    !State.database.userData.data && isUserAvaliable();
    console.log(State.database.userData);

    console.log(localStorage.getItem("authtoken"));
  }, []);

  // For Live Users
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/get_activeusers`)
      .then(async (repos) => {
        for (let i = 0; i < repos.data.length; i++) {
          await axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`
            )
            .then((value) => {
              if (value.data !== "") State.addLiveUsers(value.data);
            });
        }
      });
  }, []);

  //update Price
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/price_updates`)
      .then((repos) => {
        State.updateDatabase({ price: repos.data });
      });
  }, []);

  useEffect(() => {
    if(State.database.provider == null ){
      login();
    }
  }, [State.database?.provider]);
  return (
    <div className={State.database.dark ? `dark` : " "}>
        <Routes>
          <Route path="/" element={<ConnectWallet />}>
            <Route path="" element={<ConnectWalletComponant />} />
            <Route path="create_new_user" element={<CreateNewUser />} />
          </Route>

          <Route path="/test" element={<HomeScreen />}></Route>
          <Route path="/homescreen" element={<HomeScreen />}>
            <Route path="home" element={<Home />} />
            <Route path="live" element={<Live />} />
            <Route path="golive" element={<GoLive />} />
            <Route path="liveuser/:username" element={<UserLivestream />} />
            <Route path="marketPlace" element={<Events></Events>} />
            <Route
              path="profile/:userName"
              element={<Profile></Profile>}
            ></Route>
            <Route
              path="chat/:username"
              element={<ChatRoom></ChatRoom>}
            ></Route>
          </Route>
        </Routes>
        <ShareModal />
        <BuyNFTModal />
    </div>
  );
}

export default App;
