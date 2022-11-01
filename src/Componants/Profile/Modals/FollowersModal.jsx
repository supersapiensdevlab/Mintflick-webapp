import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import { Search, X } from "tabler-icons-react";
import placeholderImage from "../../../Assets/profile-pic.png";
import { filterData } from "../../../functions/searchFunction";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import axios from "axios";

function FollowersModal(props) {
  const State = useContext(UserContext);

  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [superfans, setsuperfans] = useState([]);

  const [filteredFollowersData, setFilteredFollowersData] = useState([]);
  const [filteredfollowingData, setFilteredfollowingData] = useState([]);
  const [filteredSuperfansData, setFilteredSuperfansData] = useState([]);

  useEffect(() => {
    setfollowers(State.database.userProfileData?.data.follower_count);
    setfollowing(State.database.userProfileData?.data.followee_count);
    setsuperfans(State.database.userProfileData?.data.superfan_of);

    setFilteredFollowersData(
      State.database.userProfileData?.data.follower_count
    );
    setFilteredfollowingData(
      State.database.userProfileData?.data.followee_count
    );
    setFilteredSuperfansData(State.database.userProfileData?.data.superfan_of);
  }, [
    State.database.userProfileData?.data?.follower_count,
    State.database.userProfileData?.data?.followee_count,
    State.database.userProfileData?.data?.superfan_of,
  ]);

  const handleFollowUser = async (toFollow) => {
    const followData = {
      following: toFollow,
    };
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: followData,
    })
      .then(async function (response) {
        await loadUser();
        loadProfileCard();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleUnfollowUser = async (toUnfollow) => {
    const unfollowData = {
      following: toUnfollow,
    };
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: unfollowData,
    })
      .then(async function (response) {
        await loadUser();
        await loadProfileCard();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div
      className={`${
        props.open && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="flex flex-col modal-box h-screen p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Image
                width={28}
                height={28}
                className="h-full rounded-full border-2"
                src={
                  State.database.userProfileData?.data.profile_image
                    ? State.database.userProfileData?.data.profile_image
                    : placeholderImage
                }
                alt="profileImage"
                placeholderSrc={placeholderImage}
              />
              {State.database.userProfileData?.data.username}
            </h3>
            <X
              onClick={() => props.setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="flex w-full  bg-slate-200 dark:bg-slate-600  ">
          <span
            onClick={() => props.settab(1)}
            className={`flex-grow flex justify-center font-semibold cursor-pointer text-sm text-brand2 p-2 ${
              props.tab === 1 &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            {followers.length} Followers
          </span>
          <span
            onClick={() => props.settab(2)}
            className={`flex-grow flex justify-center font-semibold cursor-pointer text-sm text-brand2  p-2 ${
              props.tab === 2 &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            {following.length} Following
          </span>
          <span
            onClick={() => props.settab(3)}
            className={`flex-grow flex justify-center font-semibold cursor-pointer text-sm text-brand2  p-2 ${
              props.tab === 3 &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            {superfans.length} Superfans
          </span>
        </div>

        {props.tab === 1 && (
          <div className="flex flex-col flex-grow overflow-y-auto pt-2  sm:p-2 w-full  justify-start">
            {/* search bar */}
            <div className="flex items-center px-2 mb-2">
              <input
                onChange={(e) =>
                  filterData(
                    e.target.value,
                    followers,
                    setFilteredFollowersData
                  )
                }
                type="text"
                placeholder="Search…"
                className="input input-sm  w-full"
              />
              <span className="-ml-8">
                <Search size={16} className=" dark:text-slate-100"></Search>
              </span>
            </div>
            {filteredFollowersData.map((follower) => (
              <div
                onClick={() => {}}
                // to={`/homescreen/chat/${conv.username}`}
                // state={{
                //   isDM: conv.isGroup ? false : true,
                //   user2: { id: conv.user_id },
                // }}
                className={`rounded-md
                  group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/20`}
              >
                <Image
                  width={46}
                  height={46}
                  className="h-full rounded-full border-2"
                  src={placeholderImage}
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
                <div className="flex flex-grow flex-col">
                  <p className="cursor-pointer text-base font-semibold text-brand3">
                    {follower}
                  </p>
                  <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                    Name{" "}
                  </p>
                </div>
                {State.database.userData.data &&
                  State.database.userData.data.user.username ===
                    State.database.userProfileData?.data.username && (
                    <button className="p-1 px-2 bg-slate-500/10 rounded-md text-error text-sm capitalize">
                      Remove
                    </button>
                  )}
                {State.database.userData.data.user.followee_count.includes(
                  follower
                ) ? (
                  <button
                    onClick={() => handleUnfollowUser(follower)}
                    className="p-1 px-2 bg-slate-500/10 rounded-md text-brand3 text-sm capitalize"
                  >
                    unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollowUser(follower)}
                    className="p-1 bg-slate-500/10 rounded-md text-primary px-4 text-sm capitalize"
                  >
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {props.tab === 2 && (
          <div className="flex flex-col flex-grow overflow-y-auto pt-2  sm:p-2 w-full  justify-start">
            {/* search bar */}
            <div className="flex items-center px-2 mb-2">
              <input
                onChange={(e) =>
                  filterData(
                    e.target.value,
                    following,
                    setFilteredfollowingData
                  )
                }
                type="text"
                placeholder="Search…"
                className="input input-sm  w-full"
              />
              <span className="-ml-8">
                <Search size={16} className=" dark:text-slate-100"></Search>
              </span>
            </div>
            {filteredfollowingData.map((followee) => (
              <div
                onClick={() => {}}
                // to={`/homescreen/chat/${conv.username}`}
                // state={{
                //   isDM: conv.isGroup ? false : true,
                //   user2: { id: conv.user_id },
                // }}
                className={`rounded-md
                  group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/20`}
              >
                <Image
                  width={46}
                  height={46}
                  className="h-full rounded-full border-2"
                  src={placeholderImage}
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
                <div className="flex flex-grow flex-col">
                  <p className="cursor-pointer text-base font-semibold text-brand3">
                    {followee}
                  </p>
                  <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                    Name{" "}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleUnfollowUser(followee);
                  }}
                  className="p-1 px-2 bg-slate-500/10 rounded-md text-brand3 text-sm capitalize"
                >
                  unfollow
                </button>
              </div>
            ))}
          </div>
        )}
        {props.tab === 3 && (
          <div className="flex flex-col flex-grow overflow-y-auto pt-2  sm:p-2 w-full  justify-start">
            {/* search bar */}
            <div className="flex items-center px-2 mb-2">
              <input
                onChange={(e) =>
                  filterData(
                    e.target.value,
                    superfans,
                    setFilteredSuperfansData
                  )
                }
                type="text"
                placeholder="Search…"
                className="input input-sm  w-full"
              />
              <span className="-ml-8">
                <Search size={16} className=" dark:text-slate-100"></Search>
              </span>
            </div>
            {filteredSuperfansData.map((fan) => (
              <div
                onClick={() => {}}
                // to={`/homescreen/chat/${conv.username}`}
                // state={{
                //   isDM: conv.isGroup ? false : true,
                //   user2: { id: conv.user_id },
                // }}
                className={`rounded-md
                  group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/20`}
              >
                <Image
                  width={46}
                  height={46}
                  className="h-full rounded-full border-2"
                  src={placeholderImage}
                  alt="profileImage"
                  placeholderSrc={placeholderImage}
                />
                <div className="flex flex-grow flex-col">
                  <p className="cursor-pointer text-base font-semibold text-brand3">
                    {fan.username}
                  </p>
                  <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                    Name{" "}
                  </p>
                </div>
                <button className="p-1 px-2 bg-brand rounded-md text-primary text-sm capitalize">
                  {fan.plan}
                </button>
                {State.database.userData.data.user.followee_count.includes(
                  fan.username
                ) ? (
                  <button
                    onClick={() => handleUnfollowUser(fan.username)}
                    className="p-1 px-2 bg-slate-500/10 rounded-md text-brand3 text-sm capitalize"
                  >
                    unfollow
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollowUser(fan.username)}
                    className="p-1 bg-slate-500/10 rounded-md text-primary px-4 text-sm capitalize"
                  >
                    Follow
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FollowersModal;
