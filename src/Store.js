import React, { createContext, useState } from "react";

export const UserContext = createContext();

function Store(props) {
  const [store, setstore] = useState({
    dark: true,
    walletAddress: "",
    provider: null,
    userData: {},
    liveUsers: [],
    feedData: [],
    nftData: [],
    //chat modal
    chatModalOpen: false,
    //report post modal
    reportPostValue: {},
    reportModalOpen: false,
    //share post modal
    sharePostUrl: "",
    shareModalOpen: false,
    //buy nft modal
    buyNFTModalOpen: false,
    buyNFTModalData: {},
    //Toast messages
    toasts: [],
    //chain id
    chainId: 0,
    filteredData: [],
    filteredVideoData: [],
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
    updateStore({
      liveUsers: data,
    });
  };
  const addFeed = (data) => {
    updateStore({
      feedData: data,
    });
  };

  const addNFT = (data) => {
    updateStore({
      nftData: data,
    });
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
        addNFT: addNFT,
      }}
    >
      {props.data}
    </UserContext.Provider>
  );
}

export default Store;
