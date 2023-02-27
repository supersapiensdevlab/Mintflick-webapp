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
    <div className='flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg '>
      <div className='w-full  '>
        <Image
          className='w-full aspect-[6/2] rounded-lg object-cover '
          width='100%'
          height='100%'
          src={props.coverImage ? props.coverImage : coverImage}
          alt={"coverimage Image"}
          placeholder={
            <div className='w-full  aspect-[6/2] border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg flex flex-col justify-center items-center gap-1'>
              <span className='text-lg font-bold text-brand6'>Loading...</span>
            </div>
          }
        />
        {/* <img
          src={props.coverImage ? props.coverImage : coverImage}
          alt="coverimage"
          className="w-full h-full rounded-t-lg object-cover"
        /> */}
      </div>
      <img
        src={props.profileImage ? props.profileImage : coverImage}
        alt='Profileimage'
        className='w-20 h-20 -mt-10 object-cover rounded-full'
      />
      <div className='flex flex-col items-center w-full h-fit space-y-1 m-2'>
        <p className='text-lg text-brand1 font-bold'>{props.name}</p>
        <span className='flex items-center gap-2 text-base text-brand3 font-medium'>
          {"@" + `${props.userName}`}
          <p className='flex items-center gap-1 text-sm text-primary font-medium'>
            {State.database.userProfileData &&
              State.database.userData.data &&
              State.database.userData.data.user.username !== props.userName &&
              (State.database.userData.data.user.followee_count.includes(
                props.userName,
              ) ? (
                <button
                  onClick={() => handleUnfollowUser(props.userName)}
                  className='btn  btn-primary btn-outline btn-xs flex-grow'>
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => handleFollowUser(props.userName)}
                  className='btn  btn-primary btn-outline btn-xs flex-grow'>
                  Follow
                </button>
              ))}
          </p>
        </span>
        <div className='w-full flex p-2 justify-around'>
          <span
            onClick={() => {
              settab(1);
              setfollowersModalOpen(true);
            }}
            className='cursor-pointer flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.follower_count}
            <p className='flex items-center  text-xs text-primary font-medium'>
              Followers
            </p>
          </span>
          <span
            onClick={() => {
              settab(2);
              setfollowersModalOpen(true);
            }}
            className='cursor-pointer flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.followee_count}
            <p className='flex items-center  text-xs text-primary font-medium'>
              Following
            </p>
          </span>
          <span
            onClick={() => {
              settab(3);
              setfollowersModalOpen(true);
            }}
            className='cursor-pointer flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.superfan_to}
            <p className='flex items-center gap-1 text-xs text-primary font-medium'>
              SuperFans
            </p>
          </span>
        </div>

        <div className='flex flex-col p-4 w-full gap-1'>
          {State.database.userData.data &&
            (State.database.userData.data.user.username === props.userName ? (
              <>
                {/* <button
                  onClick={() => {
                    setMarketPlaceModalOpen(true);
                  }}
                  className="btn btn-primary btn-outline btn-sm w-full"
                >
                  Setup Marketplace
                </button> */}
                <button
                  onClick={() => setsettingsModalOpen(true)}
                  className='btn btn-primary btn-outline btn-sm w-full capitalize font-medium'>
                  Edit Profile
                </button>
              </>
            ) : (
              <div className='flex flex-col gap-1'>
                <NavLink
                  className='w-full'
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
                  }}>
                  <button className='btn btn-primary btn-outline btn-sm w-full capitalize font-medium'>
                    Message
                  </button>
                </NavLink>

                <button
                  className='btn btn-brand btn-sm capitalize font-medium'
                  onClick={() => setJoinsuperfanModalOpen(true)}>
                  <img className='w-5 mr-1' src={superfan_logo} />
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
        } modal modal-bottom sm:modal-middle`}>
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
