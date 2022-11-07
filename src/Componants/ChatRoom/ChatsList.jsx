import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import axios from "axios";
import { User, Users } from "tabler-icons-react";

async function filterData(value, list, func, isNew = false) {
  list.filter(async (item) => {
    const filteredData = list.filter((item) => {
      return JSON.stringify(Object.values(item))
        .toLowerCase()
        .replace(/[{,},",]/g, "")
        .includes(value.toLowerCase());
    });
    func(filteredData);
    // func(filteredData);
  });
}

function ChatsList({ userName, dms, rooms }) {
  const State = useContext(UserContext);
  const [showChats, setshowChats] = useState(true);
  const location = useLocation();
  const { isDM, user2 } = location.state;

  const [search, setSearch] = useState("");
  const [filteredDm, setFilteredDm] = useState(dms);
  const [filteredRooms, setFilteredRooms] = useState(rooms);

  const [following, setFollowing] = useState([]);

  useEffect(() => {
    setSearch("");
    setFilteredDm(dms);
    setFilteredRooms(rooms);
  }, [dms, rooms]);

  useEffect(() => {
    setSearch("");
  }, [showChats]);

  useEffect(() => {
    async function fun() {
      if (!dms || dms.length <= 0) {
        if (
          State.database.userData?.data?.user.followee_count &&
          State.database.userData?.data?.user.followee_count.length > 0
        ) {
          let arr = [];
          for (
            let i = 0;
            i < State.database.userData?.data?.user.followee_count.length;
            i++
          ) {
            try {
              let puser = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/user/shortDataUsername/${State.database.userData?.data?.user.followee_count[i]}`
              );
              arr.push({ username: puser.data.username, id: puser.data.id });
            } catch (error) {}
          }
          setFollowing(arr);
        }
      }
    }
    fun();
  }, [dms]);

  useEffect(() => {
    if (search != "") {
      if (showChats) {
        filterData(search, dms, setFilteredDm);
      } else {
        filterData(search, rooms, setFilteredRooms);
      }
    } else {
      setFilteredDm(dms);
      setFilteredRooms(rooms);
    }
  }, [search]);

  return (
    <div className="flex flex-col items-start py-2 bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      {State.database.userData.data && (
        <>
          <div className="w-full px-2">
            <div className="tabs tabs-boxed w-full bg-slate-200 dark:bg-slate-700 ">
              <div
                className={`tab ${
                  showChats && "tab-active"
                } text-brand2 font-semibold`}
                onClick={() => setshowChats(true)}
              >
                <User size={16} /> Chats
              </div>
              <div
                className={`tab ${
                  !showChats && "tab-active"
                } text-brand2 font-semibold`}
                onClick={() => setshowChats(false)}
              >
                <Users size={16} /> Channels
              </div>
            </div>
          </div>
          <div className="w-full px-2 flex justify-center my-2  ">
            <input
              type={"search"}
              placeholder="Search here"
              className="input input-bordered w-full max-w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {showChats ? (
            <>
              {dms && dms.length > 0
                ? filteredDm.map((dm) => {
                    let username = dm.usernames
                      ? dm.usernames.find(
                          (u) => u != State.database.userData.data.user.username
                        )
                      : "";
                    let userid = dm.users
                      ? dm.users.find(
                          (u) => u != State.database.userData.data.user.id
                        )
                      : "";
                    return (
                      <Link
                        to={`/homescreen/chat/${username}`}
                        state={{
                          isDM: true,
                          user2: { id: userid },
                        }}
                        className={`${
                          userName === username &&
                          isDM &&
                          "border-r-4 border-green-700 bg-slate-200 dark:bg-slate-900/60"
                        } group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60`}
                      >
                        <Image
                          width={46}
                          height={46}
                          className="h-full rounded-full border-2"
                          src={placeholderImage}
                          alt="profileImage"
                          placeholderSrc={placeholderImage}
                        />
                        <div className="flex flex-col">
                          <p className="cursor-pointer text-base font-semibold text-brand3">
                            {username}

                            <span className=" text-xs font-normal rounded mx-2 px-1 py-0.5 bg-green-500">
                              DM
                            </span>
                          </p>
                          <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                            this is recent message sent by user
                          </p>
                        </div>
                      </Link>
                    );
                  })
                : following != null
                ? following.slice(0, 5).map((followe) => {
                    let username = followe.username;
                    let userid = followe.id;

                    return (
                      <Link
                        to={`/homescreen/chat/${username}`}
                        state={{
                          isDM: true,
                          user2: { id: userid },
                        }}
                        className={`${
                          userName === username &&
                          isDM &&
                          "border-r-4 border-green-700 bg-slate-200 dark:bg-slate-900/60"
                        } group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60`}
                      >
                        <Image
                          width={46}
                          height={46}
                          className="h-full rounded-full border-2"
                          src={placeholderImage}
                          alt="profileImage"
                          placeholderSrc={placeholderImage}
                        />
                        <div className="flex flex-col">
                          <p className="cursor-pointer text-base font-semibold text-brand3">
                            {username}

                            <span className=" text-xs font-normal rounded mx-2 px-1 py-0.5 bg-green-500">
                              DM
                            </span>
                          </p>
                          <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                            Send your first message
                          </p>
                        </div>
                      </Link>
                    );
                  })
                : null}
            </>
          ) : (
            <>
              {filteredRooms.map((room) => (
                <Link
                  to={`/homescreen/chat/${room.room_admin}`}
                  state={{
                    isDM: false,
                  }}
                  className={`${
                    userName === room.room_admin &&
                    !isDM &&
                    "border-r-4 border-green-700 bg-slate-200 dark:bg-slate-900/60"
                  } group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60`}
                >
                  <Image
                    width={46}
                    height={46}
                    className="h-full rounded-full border-2"
                    src={placeholderImage}
                    alt="profileImage"
                    placeholderSrc={placeholderImage}
                  />
                  <div className="flex flex-col">
                    <p className="cursor-pointer text-base font-semibold text-brand3">
                      {room.room_admin}
                      <span className=" text-xs font-normal rounded mx-2 px-1 py-0.5 bg-orange-500">
                        Group
                      </span>
                    </p>
                    <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                      this is recent message sent by user
                    </p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ChatsList;
