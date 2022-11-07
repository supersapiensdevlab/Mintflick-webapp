import React from "react";
import { useEffect, useState } from "react";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../Store";

function ProfileVisitCard({ username }) {
  const State = useContext(UserContext);
  const [cardUser, setCardUser] = useState(null);

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
    getUser();
  }, [username]);

  return (
    <div className="flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <img
        src={cardUser?.cover_image ? cardUser?.cover_image : coverImage}
        alt="Girl in a jacket"
        className="w-full h-24 rounded-lg object-cover"
      />
      <img
        src={cardUser?.profile_image ? cardUser?.profile_image : coverImage}
        alt="Girl in a jacket"
        className="w-20 h-20 -mt-10 object-cover rounded-full"
      />
      <div className="flex flex-col items-center w-full h-fit space-y-2">
        <p className="text-lg text-brand1 font-bold">{cardUser?.name}</p>
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
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {cardUser?.follower_count?.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Followers
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {cardUser?.follower_count?.length}
            <p className="flex items-center  text-xs text-primary font-medium">
              Following
            </p>
          </span>
          <span className="flex flex-col items-center gap-1 text-lg text-brand3 font-bold">
            {cardUser?.superfan_to?.length}
            <p className="flex items-center gap-1 text-xs text-primary font-medium">
              SuperFans
            </p>
          </span>
        </div>
        <div className="flex flex-col p-4 w-full gap-1">
          <button className="btn btn-brand btn-sm w-full">follow</button>
          <button className="btn btn-primary btn-outline btn-sm w-full">
            become superfan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileVisitCard;
