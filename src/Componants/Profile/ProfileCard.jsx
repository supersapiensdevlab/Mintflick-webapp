import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Share } from "tabler-icons-react";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";
import MarketplaceModal from "../Home/Modals/MarketplaceModal";
function ProfileCard(props) {
  const State = useContext(UserContext);
  const [marketPlaceModalOpen, setMarketPlaceModalOpen] = useState(false);

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

  return (
    <div className='flex flex-col items-center  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg '>
      <img
        src={props.coverImage ? props.coverImage : coverImage}
        alt='cover image'
        className='w-full aspect-{4/2} rounded-lg object-cover'
      />
      <img
        src={props.profileImage ? props.profileImage : coverImage}
        alt='Profile image'
        className='w-20 h-20 -mt-10 object-cover rounded-full'
      />
      <div className='flex flex-col items-center w-full h-fit space-y-1 m-2'>
        <p className='text-lg text-brand1 font-bold'>{props.name}</p>
        <span className='flex items-center gap-2 text-base text-brand3 font-medium'>
          {"@" + `${props.userName}`}
          <p className='flex items-center gap-1 text-sm text-primary font-medium'>
            <Share size={12}></Share>share
          </p>
        </span>
        <div className='w-full flex p-2 justify-around'>
          <span className='flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.follower_count}
            <p className='flex items-center  text-xs text-primary font-medium'>
              Followers
            </p>
          </span>
          <span className='flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.followee_count}
            <p className='flex items-center  text-xs text-primary font-medium'>
              Following
            </p>
          </span>
          <span className='flex flex-col items-center gap-1 text-lg text-brand3 font-bold'>
            {props.superfan_of}
            <p className='flex items-center gap-1 text-xs text-primary font-medium'>
              SuperFans
            </p>
          </span>
        </div>

        <div className='flex flex-col p-4 w-full gap-1'>
          {State.database.userData.data &&
            (State.database.userData.data.user.username === props.userName ? (
              <>
                <button
                  onClick={() => {
                    setMarketPlaceModalOpen(true);
                  }}
                  className='btn btn-primary btn-outline btn-sm w-full'>
                  Setup Marketplace
                </button>
                <button className='btn btn-primary btn-outline btn-sm w-full'>
                  Edit profile
                </button>
              </>
            ) : (
              <>
                <button className='btn btn-brand btn-sm w-full'>follow</button>
                <button className='btn btn-primary btn-outline btn-sm w-full'>
                  become superfan
                </button>
              </>
            ))}
        </div>
      </div>
      <div
        className={`${
          marketPlaceModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}>
        <MarketplaceModal setMarketPlaceModalOpen={setMarketPlaceModalOpen} />
      </div>
    </div>
  );
}

export default ProfileCard;
