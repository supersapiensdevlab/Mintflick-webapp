import React, { useContext, useState, useRef, useEffect } from "react";
import { AccessPoint, Bell, MessageDots, Search } from "tabler-icons-react";
import { UserContext } from "../../Store";
import axios from "axios";
import Main_logo from "../../Assets/logos/Main_logo";
import TopNavigation from "./TopNavigation";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import { NavLink } from "react-router-dom";
import coverImage from "../../Assets/backgrounds/cover.png";
import NotificationContent from "./NotificationContent";
import EmptyNotification from "./EmptyNotification";
import { Image } from "react-img-placeholder";
import placeholderImage from "../../Assets/profile-pic.png";

function Header() {
  const State = useContext(UserContext);

  //get all users
  const [alluser, setAllUser] = useState([]);

  //filtered search data
  const [filteredData, setFilteredData] = useState([]);
  const [filteredVideoData, setFilteredVideoData] = useState([]);

  //searched word in search bar
  const [wordEntered, setWordEntered] = useState("");

  //Search div display
  const [filterResultDisplay, setFilterResultDisplay] = useState(true);

  //reference to search div
  const wrapperRef = useRef(null);

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
      setOnlyOnce(true);
      if (State.database.userData.data.user.notification.length > 0) {
        setNewNotification(
          State.database.userData.data.user.notification.length
        );
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data.user.oldnotification[i]);
        }
        for (
          let i = 0;
          i < State.database.userData.data.user.notification.length;
          i++
        ) {
          data.push(State.database.userData.data.user.notification[i]);
        }
        setNotification(data.reverse());
      } else {
        let data = [];
        for (
          let i = 0;
          i < State.database.userData.data.user.oldnotification.length;
          i++
        ) {
          data.push(State.database.userData.data.user.oldnotification[i]);
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
      setFilteredData([]);
      setFilteredVideoData([]);
    } else {
      setFilteredData(newFilter);
      setFilteredVideoData(newVideoFilter);
    }
  };

  return (
    <div className="hidden lg:flex fixed z-50  top-0  px-4 lg:px-12 justify-between items-center h-20 bg-white dark:bg-slate-900 w-full shadow-mintflick	">
      <div className="flex items-center space-x-4 h-full w-1/3 -ml-2">
        {!State.database.dark ? (
          <Main_logo_dark></Main_logo_dark>
        ) : (
          <Main_logo></Main_logo>
        )}
        <div className="relative w-full">
          <div className="hidden lg:flex items-center flex-grow">
            <input
              type="text"
              placeholder="Search for anything..."
              className="input input-bordered w-full max-w-xl "
              onChange={handleFilter}
              value={wordEntered}
            ></input>
            <Search className="-translate-x-8 dark:text-slate-100"></Search>
          </div>
          <div
            ref={wrapperRef}
            className=" bg-white  dark:bg-slate-700 dark:text-white ml-1.5 mt-1 rounded-lg absolute self-center lg:w-11/12 w-3/5 h-max max-h-80 overflow-hidden overflow-y-auto"
            hidden={filterResultDisplay}
          >
            {filteredVideoData.length !== 0 && (
              <>
                {filteredVideoData.slice(0, 15).map((value, key) => {
                  return (
                    <div
                      key={key}
                      className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary flex items-center"
                    >
                      <Search
                        className=" dark:text-slate-100  opacity-60 mr-2"
                        size={16}
                      ></Search>
                      {value.video.videoName.toLowerCase()}{" "}
                    </div>
                  );
                })}
              </>
            )}
            {filteredData.length !== 0 && (
              <>
                {filteredData.slice(0, 15).map((value, key) => {
                  return (
                    <div
                      key={key}
                      className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary flex items-center"
                    >
                      <Search
                        className=" dark:text-slate-100 opacity-60 mr-2"
                        size={16}
                      ></Search>
                      {value.username.toLowerCase()}{" "}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/3 items-center justify-center h-full  ">
        <TopNavigation></TopNavigation>
      </div>
      <div className="flex w-1/3 justify-end items-center space-x-4 h-full   ">
        <NavLink
          to={'/homescreen/golive'}
          className="hidden lg:flex  btn btn-outline btn-primary gap-2 rounded-full"
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
              <div
                className="bg-rose-600 rounded-full shadow  
                        h-4 w-4 text-xs self-center text-center font-semibold  
                        absolute top-1  right-2  
                         text-white"
              >
                {newNotification}
              </div>
            ) : null}
          </label>
          <div
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 shadow-xl bg-slate-100 dark:bg-slate-700  rounded-lg w-80 overflow-y-scroll	max-h-96"
          >
            {notification.length > 0 ? (
              <div className="w-full p-2">
                {notification.map((value, i) => {
                  return (
                    <div key={i} className="w-full ">
                      {console.log(value)}
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

        <button class="btn btn-circle btn-ghost ">
          <MessageDots size={28}></MessageDots>
        </button>

        <div class="dropdown dropdown-end">
          <label tabindex="0" className=" avatar">
            <div className="w-10 rounded-full">
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
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-xl   bg-slate-100 dark:bg-slate-800 text-brand1 text-base font-medium rounded-lg w-52"
          >
            <li>
              <NavLink
                to={`/homescreen/profile/${
                  State.database.userData.data
                    ? State.database.userData.data.user.username
                    : ""
                }/posts`}
                className="  hover:dark:bg-slate-900"
              >
                Profile
              </NavLink>
            </li>

            <li>
              <a className=" hover:dark:bg-slate-900">Settings</a>
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
                Dark mode {State.database.dark ? "off" : "on"}
              </a>
            </li>
            <li>
              <NavLink
                onClick={() => {
                  localStorage.clear();
                }}
                to={"/"}
                className="hover:bg-rose-500 "
              >
                Logout
              </NavLink>
            </li>
            <li>
              <a className="truncate hover:dark:bg-slate-900 text-emerald-600">
                {localStorage.getItem("walletAddress") && "Wallet connected"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
