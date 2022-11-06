import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import { Search, X } from "tabler-icons-react";
import placeholderImage from "../../../Assets/profile-pic.png";
import { filterData } from "../../../functions/searchFunction";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import axios from "axios";
import { Link } from "react-router-dom";

function FollowersModal(props) {
  const State = useContext(UserContext);

  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  const [followers, setfollowers] = useState([]);
  const [following, setfollowing] = useState([]);
  const [superfans, setsuperfans] = useState([]);
  const [superfansTo, setSuperfansTo] = useState([]);

  const [superfanTab, setSuperfanTab] = useState(0);

  const [filteredFollowersData, setFilteredFollowersData] = useState([]);
  const [filteredfollowingData, setFilteredfollowingData] = useState([]);
  const [filteredSuperfansData, setFilteredSuperfansData] = useState([]);
  const [filteredSuperfansToData, setFilteredSuperfansToData] = useState([]);

  useEffect(() => {
    setFilteredFollowersData([]);
    setFilteredfollowingData([]);
    setFilteredSuperfansData([]);
    setFilteredSuperfansToData([]);
    setfollowers(State.database.userProfileData?.data?.follower_count);
    setfollowing(State.database.userProfileData?.data?.followee_count);
    setsuperfans(State.database.userProfileData?.data?.superfan_to);
    setSuperfansTo(State.database.userProfileData?.data?.superfan_of);

    // setFilteredFollowersData(
    //   State.database.userProfileData?.data.follower_count
    // );
    // setFilteredfollowingData(
    //   State.database.userProfileData?.data.followee_count
    // );
    // setFilteredSuperfansData(State.database.userProfileData?.data.superfan_to);
    if (State.database.userProfileData) {
      if (State.database.userProfileData.data.follower_count) {
        filterData(
          "",
          State.database.userProfileData.data.follower_count,
          setFilteredFollowersData
        );
      }
      if (State.database.userProfileData.data.followee_count) {
        filterData(
          "",
          State.database.userProfileData.data.followee_count,
          setFilteredfollowingData
        );
      }
      if (State.database.userProfileData.data.superfan_to) {
        filterData(
          "",
          State.database.userProfileData.data.superfan_to,
          setFilteredSuperfansData
        );
      }
      if (State.database.userProfileData.data.superfan_of) {
        filterData(
          "",
          State.database.userProfileData.data.superfan_of,
          setFilteredSuperfansToData
        );
      }
    }
  }, [
    State.database.userProfileData?.data?.follower_count,
    State.database.userProfileData?.data?.followee_count,
    State.database.userProfileData?.data?.superfan_to,
    State.database.userProfileData?.data?.superfan_oo,
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
                className="h-full aspect-square object-cover rounded-full "
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
              <Link to={`/homescreen/profile/${follower.username}`}>
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
                    className="h-full aspect-square object-cover rounded-full  "
                    src={
                      follower.profile_image
                        ? follower.profile_image
                        : placeholderImage
                    }
                    alt="profileImage"
                    placeholderSrc={placeholderImage}
                  />
                  <div className="flex flex-grow flex-col">
                    <p className="cursor-pointer text-base font-semibold text-brand3">
                      {follower.username}
                    </p>
                    <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                      {follower.name}
                    </p>
                  </div>

                  {State.database.userData.data.user.followee_count.includes(
                    follower.username
                  ) ? (
                    <button
                      onClick={() => handleUnfollowUser(follower.username)}
                      className="p-1 px-2  rounded-md bg-slate-500/20 text-opacity-20 btn-primary btn-outline   text-sm capitalize"
                    >
                      unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollowUser(follower.username)}
                      className="p-1 btn-primary btn-outline  bg-slate-500/20   rounded-md  text-white px-4 text-sm capitalize"
                    >
                      Follow
                    </button>
                  )}
                  {State.database.userData.data &&
                    State.database.userData.data.user.username ===
                      State.database.userProfileData?.data.username && (
                      <button className="p-1 px-2 bg-transparent rounded-md text-error text-sm capitalize">
                        Remove
                      </button>
                    )}
                </div>
              </Link>
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
              <Link to={`/homescreen/profile/${followee.username}`}>
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
                    className="h-full aspect-square object-cover rounded-full  "
                    src={
                      followee.profile_image
                        ? followee.profile_image
                        : placeholderImage
                    }
                    alt="profileImage"
                    placeholderSrc={placeholderImage}
                  />
                  <div className="flex flex-grow flex-col">
                    <p className="cursor-pointer text-base font-semibold text-brand3">
                      {followee.username}
                    </p>
                    <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                      {followee.name}
                    </p>
                  </div>
                  {State.database.userData.data.user.followee_count.includes(
                    followee.username
                  ) ? (
                    <button
                      onClick={() => handleUnfollowUser(followee.username)}
                      className="p-1 px-2 bg-slate-500/10 rounded-md text-brand3 text-sm capitalize"
                    >
                      unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFollowUser(followee.username)}
                      className="p-1 bg-slate-500/10 rounded-md text-primary px-4 text-sm capitalize"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        <hr className=" text-white" />
        {props.tab === 3 && (
          <>
            <div className="flex w-full  bg-slate-200 dark:bg-slate-600 ">
              <span
                onClick={() => setSuperfanTab(0)}
                className={`flex-grow flex justify-center font-semibold cursor-pointer text-sm text-brand2 p-2 ${
                  superfanTab === 0 &&
                  "bg-slate-100  border-b-2 border-success dark:bg-slate-800"
                }`}
              >
                {superfans.length} Superfans
              </span>
              <span
                onClick={() => setSuperfanTab(1)}
                className={`flex-grow flex justify-center font-semibold cursor-pointer text-sm text-brand2  p-2 ${
                  superfanTab === 1 &&
                  "bg-slate-100  border-b-2 border-success dark:bg-slate-800"
                }`}
              >
                {superfansTo.length} Superfan To
              </span>
            </div>
            {superfanTab == 0 ? (
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
                  <Link to={`/homescreen/profile/${fan.username}`}>
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
                        className={`h-full aspect-square object-cover rounded-full   ${
                          fan.plan == "Basic"
                            ? "border-super_platinum"
                            : fan.plan == "Silver"
                            ? "border-super_silver"
                            : "border-super_gold"
                        }`}
                        src={
                          fan.profile_image
                            ? fan.profile_image
                            : placeholderImage
                        }
                        alt="profileImage"
                        placeholderSrc={placeholderImage}
                      />
                      <div className="flex flex-grow flex-col">
                        <p className="cursor-pointer text-base font-semibold text-brand3">
                          {fan.username}
                        </p>
                        <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                          {fan.name}
                        </p>
                      </div>
                      <button
                        className={`p-1 px-2 ${
                          fan.plan == "Basic"
                            ? "bg-super_platinum"
                            : fan.plan == "Silver"
                            ? "bg-super_silver"
                            : "bg-super_gold"
                        } rounded-md text-white text-sm capitalize`}
                      >
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col flex-grow overflow-y-auto pt-2  sm:p-2 w-full  justify-start">
                {/* search bar */}
                <div className="flex items-center px-2 mb-2">
                  <input
                    onChange={(e) =>
                      filterData(
                        e.target.value,
                        superfansTo,
                        setFilteredSuperfansToData
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
                {filteredSuperfansToData.map((fan) => (
                  <Link to={`/homescreen/profile/${fan.username}`}>
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
                        className={`h-full aspect-square object-cover rounded-full   ${
                          fan.plan == "Basic"
                            ? "border-super_platinum"
                            : fan.plan == "Silver"
                            ? "border-super_silver"
                            : "border-super_gold"
                        }`}
                        src={
                          fan.profile_image
                            ? fan.profile_image
                            : placeholderImage
                        }
                        alt="profileImage"
                        placeholderSrc={placeholderImage}
                      />
                      <div className="flex flex-grow flex-col">
                        <p className="cursor-pointer text-base font-semibold text-brand3">
                          {fan.username}
                        </p>
                        <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                          {fan.name}
                        </p>
                      </div>
                      <button
                        className={`p-1 px-2 ${
                          fan.plan == "Basic"
                            ? "bg-super_platinum"
                            : fan.plan == "Silver"
                            ? "bg-super_silver"
                            : "bg-super_gold"
                        } rounded-md text-white text-sm capitalize`}
                      >
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
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FollowersModal;
