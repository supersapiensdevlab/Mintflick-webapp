import axios from "axios";
import React, { useState, useContext } from "react";
import {
  X,
  Bucket,
  BrandTwitter,
  BrandInstagram,
  BrandLinkedin,
  BrandDiscord,
  Coin,
} from "tabler-icons-react";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

const CollectCoinsModal = ({ setCollectCoinsModalVisible, setTotalCoins }) => {
  const [updateHandleFollow, setUpdateHandleFollow] = useState({
    twitter: false,
    instagram: false,
    linkedin: false,
    discord: false,
  });

  const State = useContext(UserContext);

  const [loadFeed, loadUser] = useUserActions();

  console.log(updateHandleFollow);

  const handleUserCoins = (social) => {
    let data;
    switch (social) {
      case "twitter":
        data = {
          coins: 10,
          receivedBy: "following twitter",
        };
        setUpdateHandleFollow((prevState) => {
          return {
            ...prevState,
            twitter: true,
          };
        });
        break;
      case "instagram":
        data = {
          coins: 10,
          receivedBy: "following instagram",
        };
        setUpdateHandleFollow((prevState) => {
          return {
            ...prevState,
            instagram: true,
          };
        });
        break;
      case "linkedin":
        data = {
          coins: 10,
          receivedBy: "following linkedin",
        };
        setUpdateHandleFollow((prevState) => {
          return {
            ...prevState,
            linkedin: true,
          };
        });
        break;
      case "discord":
        data = {
          coins: 10,
          receivedBy: "following discord",
        };
        setUpdateHandleFollow((prevState) => {
          return {
            ...prevState,
            discord: true,
          };
        });
        break;
    }
    data.type = "social";
    data.prevBalance =
      State.database.userData.data?.user?.coins[
        State.database.userData.data?.user?.coins?.length - 1
      ].balance;

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/send_gems`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async () => {
        setTotalCoins((prev) => prev + 10);
        await loadUser();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Bucket />
            Complete Tasks & Earn
          </h3>
          <X
            onClick={() => {
              setCollectCoinsModalVisible(false);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <div className="w-fill p-4 space-y-3 text-white">
        <div className="w-full space-y-1">
          <p className="flex">
            Follow our social handles & earn 10 <Coin className="mx-1" /> for
            each &#128525;
          </p>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <p>Twitter </p>
              <span>
                <BrandTwitter size={24} color="#0084b4" />
              </span>
            </div>
            {!updateHandleFollow.twitter ? (
              <button
                onClick={() => {
                  handleUserCoins("twitter");
                }}
                className="btn btn-sm btn-primary btn-outline capitalize"
              >
                Follow
              </button>
            ) : (
              <div className="flex">
                10 <Coin className="mx-1" /> claimed
              </div>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <p>Instagram </p>
              <span>
                <BrandInstagram size={24} color="#E4405F" />
              </span>
            </div>
            {!updateHandleFollow.instagram ? (
              <button
                onClick={() => {
                  handleUserCoins("instagram");
                }}
                className="btn btn-sm btn-primary btn-outline capitalize"
              >
                Follow
              </button>
            ) : (
              <div className="flex">
                10 <Coin className="mx-1" /> claimed
              </div>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <p>Linkedin </p>
              <span>
                <BrandLinkedin size={24} color="#0077b5" />
              </span>
            </div>
            {!updateHandleFollow.linkedin ? (
              <button
                onClick={() => {
                  handleUserCoins("linkedin");
                }}
                className="btn btn-sm btn-primary btn-outline capitalize"
              >
                Follow
              </button>
            ) : (
              <div className="flex">
                10 <Coin className="mx-1" /> claimed
              </div>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <p>Discord </p>
              <span>
                <BrandDiscord size={24} color="#7289d9" />
              </span>
            </div>
            {!updateHandleFollow.discord ? (
              <button
                onClick={() => {
                  handleUserCoins("discord");
                }}
                className="btn btn-sm btn-primary btn-outline capitalize"
              >
                Follow
              </button>
            ) : (
              <div className="flex">
                10 <Coin className="mx-1" /> claimed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectCoinsModal;
