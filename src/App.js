import { useContext, useEffect } from "react";
import "./App.css";
import HomeScreen from "./Screens/HomeScreen";
import { UserContext } from "./Store";

function App() {
  const State = useContext(UserContext);
  useEffect(() => {}, []);

  return (
    <div className={State.database.dark ? `dark` : " "}>
      <HomeScreen />
    </div>
  );
}

export default App;
