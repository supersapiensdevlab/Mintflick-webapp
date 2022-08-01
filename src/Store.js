import React, { createContext, useState } from "react";

export const UserContext = createContext();

function Store(props) {
  const [store, setstore] = useState({
    dark: true,
    walletAddress: "",
    provider: {},
    userData: {},
  });
  const updateStore = (data) => {
    setstore({
      ...store,
      ...data,
    });
  };
  return (
    <UserContext.Provider
      value={{
        database: store,
        updateDatabase: updateStore,
      }}
    >
      {props.data}
    </UserContext.Provider>
  );
}

export default Store;
