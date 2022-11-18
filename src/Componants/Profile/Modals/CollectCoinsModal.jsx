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
  CircleCheck,
} from "tabler-icons-react";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import Emoji from "react-emojis";

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
            {/* <Bucket /> */}
            Complete Tasks & Earn 🤑
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
      <div className="w-full flex  text-brand2 bg-slate-200 dark:bg-slate-800 px-6 py-4">
        <button
          className={`my-auto btn btn-sm btn-square btn-primary ${
            step === 0 && "btn-disabled"
          }`}
        >
          <ChevronLeft
            size={26}
            onClick={() => {
              setStep(step - 1);
            }}
          />
        </button>
        <ul className="steps steps-horizontal flex-grow">
          <li
            className={`step text-sm ${
              (step == 0 || step == 1 || step == 2) && "step-primary"
            }`}
          >
           Social 
          </li>
          <li className={`step text-sm ${(step == 1 || step == 2) && "step-primary"}`}>
           Activity
          </li>
          <li className={`step text-sm ${step == 2 && "step-primary"}`}>Community</li>
        </ul>
        <button
          className={`my-auto btn btn-sm btn-square btn-primary ${
            step === 2 && "btn-disabled"
          }`}
        >
          <ChevronRight
            size={26}
            onClick={() => {
              setStep(step + 1);
            }}
          />
        </button>
      </div>
      <div className="w-fill p-4 space-y-3 text-brand2">
        {step == 0 ? (
          <div className="w-full space-y-1 ">
            <div className="flex justify-between items-center">
              <p className="flex mb-2 mx-auto text-lg font-semibold">
                Follow our social handles &#128525;
              </p>
            </div>

            <div className="flex items-center justify-between w-full hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-lg">
              <div className="flex space-x-2">
                <span>
                  <BrandTwitter size={24} color="#0084b4" />
                </span>
                <p>Twitter </p>
              </div>
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followedTwitter ? (
                <a href="https://twitter.com/mintflickApp" target="_blank">
                  <button
                    onClick={() => {
                      handleUserCoins("twitter");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow on twitter
                  </button>
                </a>
              ) : (
                <div className="flex text-success">
                  {/* <CircleCheck className="mx-1" size={24} /> */}
                  🎉 claimed 10 coins
                </div>
              )}
            </div>
            <div className="flex items-center justify-between w-full  hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-lg">
              <div className="flex space-x-2">
                <span>
                  <BrandInstagram size={24} color="#E4405F" />
                </span>{" "}
                <p>Instagram </p>
              </div>
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followedInstagram ? (
                <a
                  href="https://www.instagram.com/mintflick.app/"
                  target="_blank"
                >
                  <button
                    onClick={() => {
                      handleUserCoins("instagram");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Follow on Instagram
                  </button>
                </a>
              ) : (
                <div className="flex text-success">
                  {/* <CircleCheck className="mx-1" size={24} /> */}
                  🎉 claimed 10 coins
                </div>
              )}
            </div>
            <div className="flex items-center justify-between w-full  hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-lg">
              <div className="flex space-x-2">
                <span>
                  <BrandLinkedin size={24} color="#0077b5" />
                </span>{" "}
                <p>Linkedin </p>
              </div>
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followedLinkedin ? (
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
                    Follow on linkedin
                  </button>
                </a>
              ) : (
                <div className="flex text-success">
                  {/* <CircleCheck className="mx-1" size={24} /> */}
                  🎉 claimed 10 coins
                </div>
              )}
            </div>
            <div className="flex items-center justify-between w-full  hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-lg">
              <div className="flex space-x-2">
                <span>
                  <BrandDiscord size={24} color="#7289d9" />
                </span>{" "}
                <p>Discord </p>
              </div>
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followedDiscord ? (
                <a href="https://discord.com/invite/xZavZyAbx4" target="_blank">
                  <button
                    onClick={() => {
                      handleUserCoins("discord");
                    }}
                    className="btn btn-sm btn-primary btn-outline capitalize"
                  >
                    Join Server
                  </button>
                </a>
              ) : (
                <div className="flex text-success">
                  {/* <CircleCheck className="mx-1" size={24} /> */}
                  🎉 claimed 10 coins
                </div>
              )}
            </div>
          </div>
        ) : step == 1 ? (
          <div className="w-full space-y-2 ">
            <div className="flex justify-between items-center">
              <p className="flex mb-2 mx-auto text-lg font-semibold">
                Task 2 - Make your 1st post 🤩
              </p>
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
                <div className="flex text-success">🎉 claimed 20 coins</div>
              )}
            </div>
          </div>
        ) : step == 2 ? (
          <div className="w-full space-y-2 ">
            <div className="flex items-center">
              <p className="flex mb-2 mx-auto text-lg font-semibold">
                Task 3 - Follow 5 creators 😊
              </p>
            </div>

            <div className="flex space-y-6 justify-center items-center">
              {!State.database.userData.data?.user?.coins?.tasksPerformed
                ?.followFive ? (
                <div
                  className={`relative overflow-clip flex items-center justify-center gap-2 bg-slate-300 dark:bg-slate-500 p-4 rounded-lg cursor-pointer ${
                    State.database.userData.data?.user?.followee_count.length >=
                    5
                      ? ""
                      : ""
                  } normal-case w-1/2 mb-2 `}
                  onClick={() => {
                    State.database.userData.data?.user?.followee_count.length >=
                      5 && handleClaimReward("follow");
                  }}
                >
                  <Award size={20} className="text-white z-50 " />
                  <span className="z-50 font-semibold text-white">
                    Claim Reward
                  </span>
                  <div
                    className={`h-full z-10 absolute left-0 bg-success  ${
                      State.database.userData.data?.user?.followee_count.length ===
                      1
                        ? "w-1/5"
                        : State.database.userData.data?.user?.followee_count
                            .length === 2
                        ? "w-2/5"
                        : State.database.userData.data?.user?.followee_count
                            .length === 3
                        ? "w-3/5"
                        : State.database.userData.data?.user?.followee_count
                            .length === 4
                        ? "w-4/5"
                        : "w-full"
                    }`}
                  ></div>
                </div>
              ) : (
                <div className="flex text-success">🎉 claimed 50 coins</div>
              )}
            </div>
            <div className="w-full ">
              {State.database.userData.data?.user?.followee_count.length <
                5 && (
                <span className="font-semibold flex justify-center text-success">
                  Hurry up!! Follow{" "}
                  {5 -
                    State.database.userData.data?.user?.followee_count
                      .length}{" "}
                  more accounts to claim 50 coins 🥳
                </span>
              )}{" "}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CollectCoinsModal;
