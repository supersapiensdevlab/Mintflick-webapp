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

function App() {
  const State = useContext(UserContext);
  useEffect(() => {}, []);

  return (
    <div className={State.database.dark ? `dark` : " "}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<ConnectWallet />}></Route>
          <Route exact path="/homescreen" element={<HomeScreen />}>
            <Route exact path="" element={<Home />} />
            <Route exact path="live" element={<Live />} />
            <Route exact path="marketPlace" element={<Events></Events>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
