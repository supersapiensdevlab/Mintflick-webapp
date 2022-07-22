import { createContext } from "react";
import "./App.css";
import Header from "./Componants/Header";
import HomeScreen from "./Screens/HomeScreen";
import Store from "./Store";

function App() {
  return <Store data={<HomeScreen className=''></HomeScreen>}></Store>;
}

export default App;
