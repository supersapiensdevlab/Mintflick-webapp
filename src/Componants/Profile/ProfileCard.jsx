import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";
import superfan_logo from "../../Assets/logos/icons/superfans/superfan.svg";

import useUserActions from "../../Hooks/useUserActions";
import { UserContext } from "../../Store";
import JoinSuperfanModal from "../Home/Modals/JoinSuperfanModal";
import MarketplaceModal from "../Home/Modals/MarketplaceModal";
import SetupMarketplaceModal from "../Home/Modals/SetupMarketplaceModal";
import FollowersModal from "./Modals/FollowersModal";
import SettingsModal from "./Modals/SettingsModal";
import { NavLink } from "react-router-dom";
import { Image } from "react-img-placeholder";

function ProfileCard(props) {
  //Join superfan modal
  const [joinsuperfanModalOpen, setJoinsuperfanModalOpen] = useState(false);
  const State = useContext(UserContext);
  // const [marketPlaceModalOpen, setMarketPlaceModalOpen] = useState(false);
  const [settingsModalOpen, setsettingsModalOpen] = useState(false);
  const [followersModalOpen, setfollowersModalOpen] = useState(false);
  const [tab, settab] = useState(0);

  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  async function isUserAvaliable() {
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
    !State.database.userData.data && isUserAvaliable();
  }, []);

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
    <div className="flex flex-col items-center w-full rounded-lg bg-slate-100 dark:bg-slate-800 h-fit ">
      <div className="w-full ">
        <Image
          className="w-full aspect-[6/2] lg:rounded-t-lg object-cover "
          width="100%"
          height="100%"
          src={props.coverImage ? props.coverImage : coverImage}
          alt={"coverimage Image"}
          placeholder={
            <div className="w-full  aspect-[6/2] border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg flex flex-col justify-center items-center gap-1">
              <span className="text-lg font-bold text-brand6">Loading...</span>
            </div>
          }
        />
        {/* <img
          src={props.coverImage ? props.coverImage : coverImage}
          alt="coverimage"
          className="object-cover w-full h-full rounded-t-lg"
        /> */}
      </div>
      <img
        src={props.profileImage ? props.profileImage : coverImage}
        alt="Profileimage"
        className="object-cover w-20 h-20 -mt-10 rounded-full"
      />
      <div className="flex flex-col items-center w-full m-2 space-y-1 h-fit">
        <p className="text-lg font-bold text-brand1">{props.name}</p>
        <span className="flex items-center gap-2 text-base font-medium text-brand3">
          {"@" + `${props.userName}`}
          <p className="flex items-center gap-1 text-sm font-medium text-primary">
            {State.database.userProfileData &&
              State.database.userData.data &&
              State.database.userData.data.user.username !== props.userName &&
              (State.database.userData.data.user.followee_count.includes(
                props.userName
              ) ? (
                <button
                  onClick={() => handleUnfollowUser(props.userName)}
                  className="flex-grow btn btn-primary btn-outline btn-xs"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollowUser(props.userName)}
                  className="flex-grow btn btn-primary btn-outline btn-xs"
                >
                  Follow
                </button>
              ))}
          </p>
        </span>
        <div className="flex justify-around w-full p-2">
          <span
            onClick={() => {
              settab(1);
              setfollowersModalOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-lg font-bold cursor-pointer text-brand3"
          >
            {props.follower_count}
            <p className="flex items-center text-xs font-medium text-primary">
              Followers
            </p>
          </span>
          <span
            onClick={() => {
              settab(2);
              setfollowersModalOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-lg font-bold cursor-pointer text-brand3"
          >
            {props.followee_count}
            <p className="flex items-center text-xs font-medium text-primary">
              Following
            </p>
          </span>
          <span
            onClick={() => {
              settab(3);
              setfollowersModalOpen(true);
            }}
            className="flex flex-col items-center gap-1 text-lg font-bold cursor-pointer text-brand3"
          >
            {props.superfan_to}
            <p className="flex items-center gap-1 text-xs font-medium text-primary">
              SuperFans
            </p>
          </span>
        </div>

        <div className="flex flex-col w-full gap-1 p-4">
          {State.database.userData.data &&
            (State.database.userData.data.user.username === props.userName ? (
              <>
                {/* <button
                  onClick={() => {
                    setMarketPlaceModalOpen(true);
                  }}
                  className="w-full btn btn-primary btn-outline btn-sm"
                >
                  Setup Marketplace
                </button> */}
                <button
                  onClick={() => setsettingsModalOpen(true)}
                  className="w-full font-medium capitalize btn btn-primary btn-outline btn-sm"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <NavLink
                  className="w-full"
                  to={`/homescreen/chat/${
                    State.database.userProfileData
                      ? State.database.userProfileData.data.username
                      : ""
                  }`}
                  state={{
                    isDM: true,
                    user2: State.database.userProfileData
                      ? State.database.userProfileData.data
                      : null,
                  }}
                >
                  <button className="w-full font-medium capitalize btn btn-primary btn-outline btn-sm">
                    Message
                  </button>
                </NavLink>

                <button
                  className="font-medium capitalize btn btn-brand btn-sm"
                  onClick={() => setJoinsuperfanModalOpen(true)}
                >
                  <img className="w-5 mr-1" src={superfan_logo} />
                  Join Superfans
                </button>
              </div>
            ))}
        </div>
      </div>
      {/* <div
        className={`${
          marketPlaceModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <MarketplaceModal setMarketPlaceModalOpen={setMarketPlaceModalOpen} />
        <SetupMarketplaceModal
          setMarketPlaceModalOpen={setMarketPlaceModalOpen}
        />
      </div> */}
      <SettingsModal open={settingsModalOpen} setOpen={setsettingsModalOpen} />
      <FollowersModal
        open={followersModalOpen}
        setOpen={setfollowersModalOpen}
        tab={tab}
        settab={settab}
      />
      <div
        className={`${
          joinsuperfanModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <JoinSuperfanModal
          setJoinSuperfanModal={setJoinsuperfanModalOpen}
          // content={props.content}
          superfan_data={State.database.userProfileData?.data?.superfan_data}
          toPay={State.database.userProfileData?.data?.wallet_id}
          postUsername={State.database.userProfileData?.data?.username}
        />
      </div>
    </div>
  );
}

export default ProfileCard;
