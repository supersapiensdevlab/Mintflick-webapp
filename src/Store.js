import React, { createContext, useState } from "react";

export const UserContext = createContext();

function Store(props) {
  const [store, setstore] = useState({
    dark: true,
    walletAddress: "",
    provider: {},
    userData: {},
    liveUsers: [],
    feedData: [],
    //report post modal
    reportPostValue: {},
    reportModalOpen: false,
    //share post modal
    sharePostUrl: "",
    shareModalOpen: false,
    //buy nft modal
    buyNFTModalOpen: false,
    //Toast messages
    toasts: [],
  });
  const updateStore = (data) => {
    setstore((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const toast = (type, msg) => {
    updateStore({ toasts: [...store.toasts, { type: type, msg: msg }] });
  };
  const deleteToast = () => {
    updateStore({ toasts: [] });
  };
  const addLiveUsers = (data) => {
    setstore((prev) => ({
      ...prev,
      liveUsers: [...prev.liveUsers, data],
    }));
  };
  const addFeed = (data) => {
    setstore((prev) => ({
      ...prev,
      feedData: data,
    }));
  };
  return (
    <UserContext.Provider
      value={{
        database: store,
        updateDatabase: updateStore,
        toast: toast,
        deleteToast: deleteToast,
        addLiveUsers: addLiveUsers,
        addFeed: addFeed,
      }}
    >
      {props.data}
    </UserContext.Provider>
  );
}

export default Store;
