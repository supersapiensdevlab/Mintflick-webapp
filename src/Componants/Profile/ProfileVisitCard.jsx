import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../Store";
import useUserActions from "../../Hooks/useUserActions";
import JoinSuperfanModal from "../Home/Modals/JoinSuperfanModal";
import FollowersModal from "./Modals/FollowersModal";
import SettingsModal from "./Modals/SettingsModal";

function ProfileVisitCard({ username }) {
  const State = useContext(UserContext);
  const [cardUser, setCardUser] = useState(null);
  const [loadFeed, loadUser] = useUserActions();
  const [joinsuperfanModalOpen, setJoinsuperfanModalOpen] = useState(false);
  const [followersModalOpen, setfollowersModalOpen] = useState(false);
  const [settingsModalOpen, setsettingsModalOpen] = useState(false);
  const [tab, settab] = useState(0);

  async function getUser() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/user/${username}`,
    })
      .then((response) => {
        setCardUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    console.log("called");
    getUser();
  }, [username, cardUser]);

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
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  console.log(cardUser);

  return (
    <div className="flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <Link to={`/homescreen/profile/${cardUser?.username}`} className="w-full">
        <img
          src={cardUser?.cover_image ? cardUser?.cover_image : coverImage}
          alt="Girl in a jacket"
          className="w-full h-24 rounded-lg object-cover"
        />
      </Link>
      <Link to={`/homescreen/profile/${cardUser?.username}`}>
        <img
          src={cardUser?.profile_image ? cardUser?.profile_image : coverImage}
          alt="Girl in a jacket"
          className="w-20 h-20 -mt-10 object-cover rounded-full"
        />
      </Link>
      <div className="flex flex-col items-center w-full h-fit space-y-2">
        <Link to={`/homescreen/profile/${cardUser?.username}`}>
          <p className="text-lg text-brand1 font-bold">{cardUser?.name}</p>
        </Link>
        <span className="flex items-center gap-2 text-base text-brand3 font-medium">
          {cardUser?.username}
          <p
            className="flex items-center gap-1 text-sm text-primary font-medium cursor-pointer"
            onClick={() =>
              State.updateDatabase({
                shareModalOpen: true,
                sharePostUrl: `${process.env.REACT_APP_CLIENT_URL}/homescreen/profile/${cardUser?.username}`,
              })
            }
          >
            <Share size={12}></Share>share
          </p>
        </span>
        <div className="w-full flex justify-around">
          <span
            className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold"
            onClick={() => {
              settab(1);
              setfollowersModalOpen(true);
            }}
          >
            {cardUser?.follower_count?.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Followers
            </p>
          </span>
          <span
            className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold"
            onClick={() => {
              settab(2);
              setfollowersModalOpen(true);
            }}
          >
            {cardUser?.followee_count?.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Following
            </p>
          </span>
          <span
            className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold"
            onClick={() => {
              settab(3);
              setfollowersModalOpen(true);
            }}
          >
            {cardUser?.superfan_to?.length}
            <p className="flex items-center gap-1 text-xs text-primary font-medium">
              SuperFans
            </p>
          </span>
        </div>
        {State.database.userData?.data?.user?.username === username ? (
          <div className="p-4 w-full">
            <button
              onClick={() => setsettingsModalOpen(true)}
              className="btn btn-primary btn-outline btn-sm w-full capitalize"
            >
              Settings
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-4 w-full gap-1">
            {State.database.userData.data?.user?.followee_count?.includes(
              username
            ) ? (
              <button
                onClick={() => handleUnfollowUser(username)}
                className="btn  btn-primary btn-outline btn-sm flex-grow"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollowUser(username)}
                className="btn  btn-brand btn-outline btn-sm flex-grow"
              >
                Follow
              </button>
            )}
            <button
              className="btn btn-primary btn-outline btn-sm w-full"
              onClick={() => {
                setJoinsuperfanModalOpen(true);
              }}
            >
              Join Superfans
            </button>
          </div>
        )}
      </div>
      <div
        className={`${
          joinsuperfanModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <JoinSuperfanModal
          setJoinSuperfanModal={setJoinsuperfanModalOpen}
          // content={props.content}
          superfan_data={cardUser?.superfan_data}
          toPay={cardUser?.wallet_id}
          postUsername={cardUser?.username}
        />
      </div>
      <FollowersModal
        open={followersModalOpen}
        setOpen={setfollowersModalOpen}
        tab={tab}
        cardUser={cardUser}
        settab={settab}
      />
      <SettingsModal open={settingsModalOpen} setOpen={setsettingsModalOpen} />
    </div>
  );
}

export default ProfileVisitCard;
