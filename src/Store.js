import React, { createContext, useState } from "react";

export const UserContext = createContext();

function Store(props) {
  const [store, setstore] = useState({
    dark: true,
    walletAddress: "",
    provider: {},
    userData: {},
    liveUsers: [],
  });
  const updateStore = (data) => {
    setstore({
      ...store,
      ...data,
    });
  };
  const addLiveUsers = (data) => {
    setstore((prev) => ({
      ...prev,
      liveUsers: [...prev.liveUsers, data],
    }));
  };
  return (
    <UserContext.Provider
      value={{
        database: store,
        updateDatabase: updateStore,
        addLiveUsers: addLiveUsers
      }}
    >
      {props.data}
    </UserContext.Provider>
  );
}

export default Store;
