import React, { useContext, useState, useRef, useEffect } from "react";
import {
  AccessPoint,
  Bell,
  DoorExit,
  MessageDots,
  Search,
  Moon,
  Sun,
  HomeCog,
  Settings,
  User,
  Wallet,
  Copy,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import axios from "axios";
import Main_logo from "../../Assets/logos/Main_logo";
import TopNavigation from "./TopNavigation";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import { Link, NavLink, useNavigate } from "react-router-dom";
import coverImage from "../../Assets/backgrounds/cover.png";
import NotificationContent from "./NotificationContent";
import EmptyNotification from "./EmptyNotification";
import { Image } from "react-img-placeholder";
import placeholderImage from "../../Assets/profile-pic.png";
import useWeb3Auth from "../../Hooks/useWeb3Auth";
import ChatModal from "../ChatRoom/ChatModal";
import SettingsModal from "../Profile/Modals/SettingsModal";
import { SolanaWallet } from "@web3auth/solana-provider";

import PolygonToken from "../../Assets/logos/PolygonToken";
import SolanaToken from "../../Assets/logos/SolanaToken";
import {
  clusterUrl,
  confirmTransactionFromFrontend,
} from "../Home/Utility/utilityFunc";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import CopyToClipboard from "../CopyButton/CopyToClipboard";

function Header() {
  const State = useContext(UserContext);

  //const [login, logout] = useWeb3Auth();
  const navigateTo = useNavigate();
  //get all users
  const [alluser, setAllUser] = useState([]);
  const [chatModalOpen, setchatModalOpen] = useState(false);
  //filtered search data
  // const [filteredData, setFilteredData] = useState([]);
  // const [filteredVideoData, setFilteredVideoData] = useState([]);

  //searched word in search bar
  const [wordEntered, setWordEntered] = useState("");

  //Search div display
  const [filterResultDisplay, setFilterResultDisplay] = useState(true);

  //reference to search div
  const wrapperRef = useRef(null);

  //settings modal
  const [settingsModalOpen, setsettingsModalOpen] = useState(false);

  //new notification
  const [newNotification, setNewNotification] = useState(0);

  const [onlyOnce, setOnlyOnce] = useState(false);

  const [notification, setNotification] = useState([]);

  async function getUserData() {
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
    !State.database.userData.data && getUserData();
  }, []);

  useEffect(() => {
    if (
      State.database.userData.data?.user &&
      State.database.userData.data?.user.notification &&
      !onlyOnce
    ) {
      // setOnlyOnce(true);
      if (State.database.userData.data?.user.notification.length > 0) {
        setNewNotification(
          State.database.userData.data?.user.notification.length
        );
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data?.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.oldnotification[i]);
        }
        for (
          let i = 0;
          i < State.database.userData.data?.user.notification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.notification[i]);
        }
        setNotification(data.reverse());
      } else {
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data?.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data?.user.oldnotification[i]);
        }
        setNotification(data.reverse());
      }
    }
  }, [State.database.userData?.data?.user?.notification]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilterResultDisplay(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER_URL}/user`,
    })
      .then((response) => {
        setAllUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // eslint-disable-next-line
  }, []);

  const handleNotification = () => {
    if (State.database.userData?.data?.user && newNotification > 0) {
      setNewNotification(0);
      const data = {
        username: State.database.userData.data.user?.username,
      };
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_SERVER_URL}/user/seennotification`,
        data: data,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleFilter = (event) => {
    setFilterResultDisplay(false);
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = alluser.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });

    const newVideoFilter = [];

    alluser.map((value) => {
      if (value.videos) {
        value.videos.map(async (video, index) => {
          if (
            video.videoName.toLowerCase().includes(searchWord.toLowerCase())
          ) {
            let data = {
              username: value.username,
              index: index,
              video: video,
            };
            newVideoFilter.push(data);
          }
          return 0;
        });
      }
      return 0;
    });

    if (searchWord === "") {
      State.updateDatabase({
        filteredData: [],
        filteredVideoData: [],
      });
    } else {
      State.updateDatabase({
        filteredData: newFilter,
        filteredVideoData: newVideoFilter,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && wordEntered.length > 0) {
      navigateTo("/homescreen/explore");
    }
  };

  const showListedNFTs = () => {
    // console.log("in");
    // var myHeaders = new Headers();
    // myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);

    // var requestOptions = {
    //   method: "GET",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };
    // fetch(
    //   `https://api.shyft.to/sol/v1/marketplace/active_listings?network=${process.env.REACT_APP_SOLANA_NETWORK}&marketplace_address=${process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS}`,
    //   requestOptions
    // )
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log("error", error));
    const superfanData = {
      txnHash: "jhsdvfkjugvdsuyfguersgyftuerygtu",
      superfanof: "orion",
      plan: "Basic",
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/superfan`, superfanData, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (data) => {})
      .catch((err) => {
        console.log(err);
        State.toast("error", "Transaction failed. Please try again");
      });
  };

  const handleAuthorityUpdate = async () => {
    // let data = {
    //   network: process.env.REACT_APP_SOLANA_NETWORK,
    //   marketplace_address: "48y3xy4e4YbYKYfbGUjojdqDxJ59HwLXpqCyoTckuQhR",
    //   authority_wallet: "4uHdbP7FkB4BSx6QAL15wgaphNn33jtpRq9ohMoMC8U2",
    //   new_authority_address: "8RLBjB2P1ttf5tvn1CimRfrzDg1eThn7dvADXUsbTnPK",
    // };
    // await axios
    //   .post(`https://api.shyft.to/sol/v1/marketplace/update`, data, {
    //     headers: {
    //       "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
    //       "content-type": "application/json",
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    let data = {
      network: process.env.REACT_APP_SOLANA_NETWORK,
      creator_wallet: `${process.env.REACT_APP_FEEPAYER_WALLET}`,
      transaction_fee: 10,
    };
    await axios
      .post(`https://api.shyft.to/sol/v1/marketplace/create`, data, {
        headers: {
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      })
      .then(async (res) => {
        await signTransaction(
          process.env.REACT_APP_SOLANA_NETWORK,
          res.data.result.encoded_transaction,
          () => {
            console.log("callback");
          }
        )
          .then(() => {
            console.log("success");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function signTransaction(network, transaction, callback) {
    //const phantom = new PhantomWalletAdapter();
    //await phantom.connect();
    const solanaWallet = new SolanaWallet(State.database.provider); // web3auth.provider

    const rpcUrl = clusterUrl(network);
    console.log(rpcUrl);
    const connection = new Connection(rpcUrl, "confirmed");
    //console.log(connection.rpcEndpoint);
    const ret = await confirmTransactionFromFrontend(
      connection,
      transaction,
      solanaWallet
    );
    // const checks = await connection.confirmTransaction({signature:ret},'finalised');

    // console.log(checks);
    // await connection.confirmTransaction({
    //     blockhash: transaction.blockhash,
    //     signature: ret,
    //   });
    connection.onSignature(ret, callback, "finalized");
    return ret;
  }

  return (
    <>
      <div
        // className={`${State.database.showHeader ? "" : "-translate-y-24"}
        className={`transition-all ease-in-out hidden lg:flex fixed z-50  top-0  px-4 lg:px-12 justify-between items-center h-20 bg-white/25 dark:bg-slate-900/25 backdrop-blur-sm w-full border-b-[1px] border-gray-300/20 shadow-mintflick`}
      >
        <div
          className="flex items-center w-1/3 h-full -ml-2 space-x-4"
          onClick={handleAuthorityUpdate}
        >
          <Link to={`/homescreen/home`}>
            {!State.database.dark ? (
              <Main_logo_dark></Main_logo_dark>
            ) : (
              <Main_logo></Main_logo>
            )}
          </Link>
          <div className="relative w-full">
            <div className="items-center flex-grow hidden lg:flex">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full max-w-xl input input-bordered "
                onChange={handleFilter}
                value={wordEntered}
                onKeyDown={handleKeyDown}
              ></input>
              <Link to={`/homescreen/explore`}>
                <Search className="-translate-x-8 cursor-pointer dark:text-slate-100"></Search>
              </Link>
            </div>
            <div
              ref={wrapperRef}
              className=" bg-white  dark:bg-slate-700 dark:text-white ml-1.5 mt-1 rounded-lg absolute self-center lg:w-11/12 w-3/5 h-max max-h-80 overflow-hidden overflow-y-auto"
              hidden={filterResultDisplay}
            >
              {State.database.filteredVideoData.length !== 0 && (
                <>
                  {State.database.filteredVideoData
                    ?.slice(0, 15)
                    .map((value, key) => {
                      return (
                        <div
                          onClick={() => {
                            setWordEntered(value.video.videoName.toLowerCase());
                            setFilterResultDisplay(true);
                          }}
                        >
                          <Link to={`/homescreen/explore`}>
                            <div
                              key={key}
                              className="flex items-center p-2 pl-3 cursor-pointer hover:bg-slate-600"
                            >
                              <Search
                                className="mr-2 dark:text-slate-100 opacity-60"
                                size={16}
                              ></Search>
                              {value.video.videoName.toLowerCase()}{" "}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </>
              )}
              {State.database.filteredData.length !== 0 && (
                <>
                  {State.database.filteredData
                    ?.slice(0, 15)
                    .map((value, key) => {
                      return (
                        <div
                          onClick={() => {
                            setWordEntered(value.username.toLowerCase());
                            setFilterResultDisplay(true);
                          }}
                        >
                          <Link to={`/homescreen/explore`}>
                            <div
                              key={key}
                              className="flex items-center p-2 pl-3 cursor-pointer hover:bg-slate-600"
                            >
                              <Search
                                className="mr-2 dark:text-slate-100 opacity-60"
                                size={16}
                              ></Search>
                              {value.username.toLowerCase()}{" "}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="items-center justify-center hidden w-1/3 h-full lg:flex ">
          <TopNavigation></TopNavigation>
        </div>
        <div className="flex items-center justify-end w-1/3 h-full space-x-4 ">
          <NavLink
            to={"/homescreen/golive"}
            className="hidden gap-2 rounded-full lg:flex btn btn-outline btn-primary"
          >
            <AccessPoint size={28}></AccessPoint>
            GO LIVE
          </NavLink>
          {/* <button class="btn btn-circle btn-ghost">
          <Bell size={28}></Bell>
        </button> */}
          <div class="dropdown dropdown-end relative">
            <label tabindex="0" className=" avatar">
              <button
                class="btn btn-circle btn-ghost"
                onClick={handleNotification}
              >
                <Bell size={28}></Bell>
              </button>
              {newNotification > 0 ? (
                <div className="absolute self-center w-4 h-4 text-xs font-semibold text-center text-white rounded-full shadow bg-rose-600 top-1 right-2">
                  {newNotification}
                </div>
              ) : null}
            </label>
            <div
              tabindex="0"
              className="mt-3 overflow-y-scroll rounded-lg shadow-xl menu menu-compact dropdown-content bg-slate-100 dark:bg-slate-700 w-80 max-h-96"
            >
              {notification.length > 0 ? (
                <div className="w-full p-2">
                  {notification.map((value, i) => {
                    return (
                      <div key={i} className="w-full ">
                        <NotificationContent data={value} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full p-2">
                  <EmptyNotification />
                </div>
              )}
            </div>
          </div>

          <div>
            <NavLink
              to={`/homescreen/chat/${
                State.database.userData.data
                  ? State.database.userData.data.user.username
                  : ""
              }`}
              state={{
                isDM: false,
                user2: {},
              }}
            >
              <button
                class="btn btn-circle btn-ghost "
                // onClick={showListedNFTs}
              >
                <MessageDots size={28}></MessageDots>
              </button>
            </NavLink>
          </div>
          {/* <button
          class="btn btn-circle btn-ghost "
          onClick={() => setchatModalOpen(true)}
        >
          <MessageDots size={28}></MessageDots>
        </button> */}

          <div class="dropdown dropdown-end">
            <label tabindex="0" className=" avatar">
              <div className="w-10 rounded-full cursor-pointer">
                {/* <img
                src={
                  State.database.userData.data?.user.profile_image
                    ? State.database.userData.data.user.profile_image
                    : coverImage
                }
              /> */}
                <Image
                  width={50}
                  height={50}
                  src={
                    State.database.userData.data?.user.profile_image
                      ? State.database.userData.data.user.profile_image
                      : coverImage
                  }
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
              </div>
            </label>
            <ul
              tabindex="0"
              className="p-2 mt-3 text-base font-medium border-2 rounded-lg shadow-xl menu menu-compact dropdown-content border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-brand1 w-52"
            >
              <li>
                <NavLink
                  to={`/homescreen/profile/${
                    State.database.userData.data
                      ? State.database.userData.data.user.username
                      : ""
                  }`}
                  className=" hover:dark:bg-slate-900"
                >
                  <User size={22}></User>Profile
                </NavLink>
              </li>
              <li onClick={() => setsettingsModalOpen(true)}>
                <a className=" hover:dark:bg-slate-900">
                  <Settings size={22}></Settings>Settings
                </a>
              </li>
              {/* <label className="swap swap-rotate dark:text-gray-100">
              <input
                onChange={() =>
                  State.updateDatabase({
                    dark: !State.database.dark,
                  })
                }
                type="checkbox"
              />

              <MoonStars className="swap-on"></MoonStars>
              <Sun className="swap-off"></Sun>
            </label> */}
              <li>
                <a
                  className=" hover:dark:bg-slate-900"
                  onClick={() =>
                    State.updateDatabase({
                      dark: !State.database.dark,
                    })
                  }
                >
                  {State.database.dark ? (
                    <Moon size={22}></Moon>
                  ) : (
                    <Sun size={22}></Sun>
                  )}{" "}
                  Mode
                </a>
              </li>
              <li>
                {" "}
                <div
                  onClick={() =>
                    State.database.chainId === 0
                      ? State.database.provider?.showWallet()
                      : ""
                  }
                >
                  <Wallet size={22} /> My Wallet
                </div>
              </li>
              <li>
                <NavLink
                  onClick={() => {
                    //logout();
                    State.database.walletProvider === "torus" &&
                      State.database.provider.logout();
                    localStorage.removeItem("authtoken");
                    localStorage.removeItem("walletAddress");
                    window.localStorage.clear();
                  }}
                  to={"/"}
                  className="hover:bg-rose-500 "
                >
                  <DoorExit size={22}></DoorExit> Logout
                </NavLink>
              </li>
              <li>
                <span className="flex flex-col items-start gap-0 p-0 mt-1 truncate bg-slate-200 dark:bg-slate-900">
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(
                        State.database.walletAddress
                      );
                      State.toast("success", "Wallet Address Copied!");
                    }}
                    className="flex items-center justify-center w-full gap-2 p-2 font-bold text-center text-white capitalize bg-emerald-600 hover:bg-emerald-700"
                  >
                    <span className="text-center ">
                      {localStorage.getItem("walletAddress")?.slice(0, 6)}...
                      {localStorage
                        .getItem("walletAddress")
                        ?.slice(
                          localStorage.getItem("walletAddress")?.length - 4,
                          localStorage.getItem("walletAddress")?.length
                        )}
                    </span>
                    <Copy size={18} />
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* <ChatModal
        open={chatModalOpen}
        setOpen={setchatModalOpen}
        userName={State.database.userData?.data?.user?.username}
        state={{
          isDM: false,
          user2: {},
        }}
      /> */}
      </div>
      <SettingsModal open={settingsModalOpen} setOpen={setsettingsModalOpen} />
    </>
  );
}

export default Header;
