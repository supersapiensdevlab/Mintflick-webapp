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

function App() {
  const State = useContext(UserContext);
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
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    isUserAvaliable();
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
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_id/${repos.data[i].id}`,
            )
            .then((value) => {
              if (value.data !== "") State.addLiveUsers(value.data);
            });
        }
      });
  }, []);

  return (
    <div className={State.database.dark ? `dark` : " "}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ConnectWallet />}>
            <Route path='' element={<ConnectWalletComponant />} />
            <Route path='create_new_user' element={<CreateNewUser />} />
          </Route>

          <Route path='/test' element={<HomeScreen />}></Route>
          <Route path='/homescreen' element={<HomeScreen />}>
            <Route path='home' element={<Home />} />
            <Route path='live' element={<Live />} />
            <Route path='marketPlace' element={<Events></Events>} />
            <Route path='profile' element={<Profile></Profile>}>
              <Route path='' element={<ProfileMedia></ProfileMedia>}>
                <Route path='posts' element={<Posts></Posts>} />
                <Route path='videos' element={<Videos></Videos>} />
                <Route path='music' element={<Music></Music>} />
                <Route path='playlists' element={<Playlists></Playlists>} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
