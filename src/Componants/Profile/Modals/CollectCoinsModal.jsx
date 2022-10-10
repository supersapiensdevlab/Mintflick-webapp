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
  Checkbox,
  ChevronRight,
  ChevronLeft,
  Award,
} from "tabler-icons-react";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

const CollectCoinsModal = ({ setCollectCoinsModalVisible }) => {
  const State = useContext(UserContext);

  const [loadFeed, loadUser] = useUserActions();

  const [step, setStep] = useState(0);

  const handleUserCoins = (social) => {
    const timer = setTimeout(() => {
      console.log("in");
      let data;
      switch (social) {
        case "twitter":
          data = {
            coins: 10,
            receivedBy: "following twitter",
            update: "followedTwitter",
            tasksPerformed:
              State.database.userData.data?.user?.coins?.tasksPerformed,
          };
          break;
        case "instagram":
          data = {
            coins: 10,
            receivedBy: "following instagram",
            update: "followedInstagram",
            tasksPerformed:
              State.database.userData.data?.user?.coins?.tasksPerformed,
          };

          break;
        case "linkedin":
          data = {
            coins: 10,
            receivedBy: "following linkedin",
            update: "followedLinkedin",
            tasksPerformed:
              State.database.userData.data?.user?.coins?.tasksPerformed,
          };

          break;
        case "discord":
          data = {
            coins: 10,
            receivedBy: "following discord",
            update: "followedDiscord",
            tasksPerformed:
              State.database.userData.data?.user?.coins?.tasksPerformed,
          };
          break;
      }
      data.type = "social";
      if (State.database.userData.data?.user?.coins) {
        data.prevBalance = State.database.userData.data?.user?.coins?.balance;
      }

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/send_gems`, data, {
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
          },
        })
        .then(async () => {
          await loadUser();
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000);
    return () => clearTimeout(timer);
  };

  const handleClaimReward = (rewardFor) => {
    let data;
    if (rewardFor == "follow") {
      data = {
        coins: 50,
        receivedBy: "Following 5 users",
        update: "follow",
        tasksPerformed:
          State.database.userData.data?.user?.coins?.tasksPerformed,
      };
    }
    if (rewardFor == "firstPost") {
      data = {
        coins: 20,
        receivedBy: "Creating First Post on Mintflick",
        update: "firstPost",
        tasksPerformed:
          State.database.userData.data?.user?.coins?.tasksPerformed,
      };
    }
    data.type = "platformTasks";
    if (State.database.userData.data?.user?.coins) {
      data.prevBalance = State.database.userData.data?.user?.coins?.balance;
    }
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/send_gems`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async () => {
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
              setStep(0);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <div className="w-fill p-4 space-y-3 text-white">
        {step == 0 ? (
          <div className="w-full space-y-2 ">
            <div className="flex justify-between items-center">
              <p className="flex mb-2">
                Task 1 - Follow our social handles & earn 10{" "}
                <Coin className="mx-1" /> for each &#128525;
              </p>
              <span className="mb-2">
                <ChevronRight
                  size={26}
                  className="text-white"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                />
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex space-x-2">
                <p>Twitter </p>
                <span>
                  <BrandTwitter size={24} color="#0084b4" />
                </span>
              </div>
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                .followedTwitter ? (
                <a href="https://mintflick.network" target="_blank">
                  <button
                    onClick={() => {
                      handleUserCoins("twitter");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow
                  </button>
                </a>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
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
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                .followedInstagram ? (
                <a href="https://mintflick.network" target="_blank">
                  <button
                    onClick={() => {
                      handleUserCoins("instagram");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow
                  </button>
                </a>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
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
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                .followedLinkedin ? (
                <a
                  href="https://www.linkedin.com/company/mintflick"
                  target="_blank"
                >
                  <button
                    onClick={() => {
                      handleUserCoins("linkedin");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow
                  </button>
                </a>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
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
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                .followedDiscord ? (
                <a href="https://discord.com/invite/xZavZyAbx4" target="_blank">
                  <button
                    onClick={() => {
                      handleUserCoins("discord");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow
                  </button>
                </a>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
                </div>
              )}
            </div>
          </div>
        ) : step == 1 ? (
          <div className="w-full space-y-2 ">
            <div className="flex justify-between items-center">
              <span className="mb-2">
                <ChevronLeft
                  size={26}
                  className="text-white"
                  onClick={() => {
                    setStep(step - 1);
                  }}
                />
              </span>
              <p className="flex mb-2">
                Task 2 - Make your 1st post & earn 20 <Coin className="mx-1" />{" "}
                &#128525;
              </p>
              <span className="mb-2">
                <ChevronRight
                  size={26}
                  className="text-white"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                />
              </span>
            </div>
            <div className="flex space-y-6 justify-center items-center">
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.firstPost ? (
                <button
                  className={`btn ${
                    State.database.userData.data?.user?.videos.length +
                      State.database.userData.data?.user?.tracks.length +
                      State.database.userData.data?.user?.posts.length +
                      State.database.userData.data?.user?.polls.length >=
                    1
                      ? "btn-brand"
                      : "btn-disabled"
                  } normal-case w-1/2 mb-2`}
                  onClick={() => {
                    handleClaimReward("firstPost");
                  }}
                >
                  <span>
                    <Award size={20} className="mx-1" />
                  </span>
                  Claim reward
                </button>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
                </div>
              )}
            </div>
          </div>
        ) : step == 2 ? (
          <div className="w-full space-y-2 ">
            <div className="flex items-center">
              <span className="mb-2">
                <ChevronLeft
                  size={26}
                  className="text-white"
                  onClick={() => {
                    setStep(step - 1);
                  }}
                />
              </span>
              <p className="flex mb-2 ml-6">
                Task 3 - Follow 5 creators & earn 10 <Coin className="mx-1" />{" "}
                for each &#128525;
              </p>
            </div>
            <div className="flex space-y-6 justify-center items-center">
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followFive ? (
                <button
                  className={`btn ${
                    State.database.userData.data?.user?.followee_count.length >=
                    5
                      ? "btn-brand"
                      : "btn-disabled"
                  } normal-case w-1/2 mb-2`}
                  onClick={() => {
                    handleClaimReward("follow");
                  }}
                >
                  <span>
                    <Award size={20} className="mx-1" />
                  </span>
                  Claim reward
                </button>
              ) : (
                <div className="flex">
                  claimed{" "}
                  <Checkbox className="mx-1" size={24} color="rgb(21 128 61)" />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CollectCoinsModal;
