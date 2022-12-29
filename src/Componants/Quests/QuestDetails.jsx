import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Scan,
  Share,
  Ticket,
  Trophy,
  Wallet,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import MintWalletModal from "../Profile/Modals/MintWalletModal";
import { QrReader } from "react-qr-reader";
import adapter from "webrtc-adapter";
import axios from "axios";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function TaskCard({ name, description, action, points, openScanner }) {
  return (
    <div className="flex flex-col  items-start w-full  rounded-md bg-white dark:bg-slate-600 p-4 shadow-md hover:shadow-xl">
      <span className="text-lg font-semibold text-brand1">{name}</span>
      <p className="text-base font-normal text-brand3">{description}</p>
      <div className="w-full flex items-center justify-between mt-4">
        <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
          <div className="flex items-center gap-2 text-success">{points}</div>
          <span className="text-sm text-brand3">Points</span>
        </span>
        <button
          onClick={() => {
            openScanner(true);
          }}
          className="btn btn-sm gap-1 btn-brand rounded-full capitalize  ml-auto"
        >
          {action === "scan" && <Scan size={16} />}

          {action}
        </button>
      </div>
    </div>
  );
}

function QuestDetails() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [open, setopen] = useState(false);
  const [openRedeem, setopenRedeem] = useState(false);
  const [data, setData] = useState("No result");

  const [points, setpoints] = useState(200);

  const [walletModalOpen, setwalletModalOpen] = useState(false);
  const [questStarted, setquestStarted] = useState(false);
  const [tasks, settasks] = useState([
    {
      name: "task1",
      description:
        "dasda asdasd dasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdas as  df",
      action: "scan",
    },

    {
      name: "task1",
      description:
        "dasda asdasd dasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdas as  df",

      action: "scan",
    },
    {
      name: "task1",
      description:
        "dasda asdasd dasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdasdasda asdas as  df",
      action: "scan",
    },
  ]);
  const [questsDetails, setQuestsDetails] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const { questId } = useParams();

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
    console.log(questId);
    async function fetchData() {
      try {
        let questsDetails = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/quest/` + questId
        );
        setQuestsDetails(questsDetails.data);
        console.log("QUEST:", questsDetails);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();

    async function fetchUserDetails() {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,

        data: {
          walletId: localStorage.getItem("walletAddress"),
        },
      })
        .then((response) => {
          State.updateDatabase({
            userData: response,
            walletAddress: response.data.user.wallet_id,
          });

          // console.log(State?.database?.userData?.data?.user?.quests);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    let questsStarted = State?.database?.userData?.data?.user?.quests;
    if (questsStarted?.includes(questsDetails.questId)) {
      console.log(questsDetails.questId);
      setquestStarted(true);
    }
  }, [questsDetails]);

  function handleQrScan(qrId) {
    State.toast("success", qrId + "Hurreyy...Task Completed!!");
    setopen(false);
  }

  const startQuest = () => {
    let data = {
      walletId: State.database.walletAddress,
      questId: questsDetails?.questId,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/questStart`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", questsDetails.name + " Quest started");
        setquestStarted(true);
        // await clearState();
      })
      .catch((err) => {
        State.toast("error", "Oops!somthing went wrong!");
        console.log(err);
        //clearState();
      });
  };

  return (
    <div className="flex flex-col items-center  md:gap-4     w-screen h-screen  bg-white dark:bg-slate-900 overflow-auto">
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("../quests")}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="text-xl font-bold text-brand1 mx-auto">
          {questsDetails?.name || (
            <Skeleton
              width={100}
              height={24}
              baseColor="#0c2543"
              highlightColor="#10172a"
            />
          )}
        </span>
        {/* <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span> */}
      </div>
      <div className="flex-grow flex flex-col gap-4 w-full  overflow-y-auto">
        {/* <div className="mx-auto w-full flex justify-between items-center max-w-2xl">
        <div className="flex flex-col gap-2 px-2">
          <span className="flex items-center gap-3 text-2xl font-bold text-brand1">
            Event name{" "}
            <div className="tooltip tooltip-right " data-tip="Share">
              <Share className="text-brand5 cursor-pointer" size={16} />
            </div>
          </span>
          <span className="text-base font-semibold text-success">
            19 NOV 2022, 4:00 PM - 7:00 PM
          </span>
          <div className="flex gap-2">
            <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
              Online
            </div>
            <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
              Meetup
            </div>
          </div>
        </div>
      </div> */}
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl  mx-auto w-full justify-start     items-start max-w-2xl">
          <img
            className="aspect-video w-full object-cover sm:rounded-lg"
            src={questsDetails?.banner}
            alt="banner"
          />
        </div>
        {questStarted && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start   max-w-2xl">
            <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
              <div className="flex items-center gap-2 text-success">
                {points}
              </div>
              <span className="text-sm text-brand3">Points</span>
            </span>
            <button
              onClick={() => setopenRedeem(true)}
              className="btn btn-xs btn-primary rounded-full capitalize"
            >
              Redeem
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Details</span>
          <p className="text-base font-normal text-brand1">
            {questsDetails?.description || (
              <Skeleton
                width={100}
                height={24}
                baseColor="#0c2543"
                highlightColor="#10172a"
              />
            )}
          </p>
        </div>

        <div className="hidden flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Map</span>
          <img
            className="aspect-video w-full object-cover rounded-lg"
            src={
              "https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png"
            }
            alt="banner"
          />
        </div>
        {questStarted && (
          <div
            // onClick={() => setquestStarted(false)}
            className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl"
          >
            <span className="text-lg font-semibold text-brand1">Tasks</span>
            {questsDetails?.tasks.map((task) => (
              <TaskCard
                name={task.name}
                description={task.description}
                points={task.points}
                action={task.action}
                openScanner={setopen}
              />
            ))}
          </div>
        )}
        {!questStarted && (
          <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
            <button
              onClick={() => startQuest()}
              className="btn w-full btn-brand rounded-full capitalize"
            >
              Start Quest
            </button>
          </div>
        )}
      </div>
      <MintWalletModal open={walletModalOpen} setOpen={setwalletModalOpen} />
      <div
        className={`${
          open && "modal-open"
        } modal  modal-bottom sm:modal-middle `}
      >
        <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
            <div className="flex justify-between items-center p-2">
              <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                <Scan /> Scan QR Code
              </h3>
              <X
                onClick={() => setopen()}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <div className="w-full">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                  handleQrScan(result?.text);
                }
                if (!!error) {
                  console.info(error);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          openRedeem && "modal-open"
        } modal  modal-bottom sm:modal-middle `}
      >
        <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
            <div className="flex justify-between items-center p-2">
              <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                {/* <Trophy />{" "} */}
                <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                  <div className="flex items-center gap-2 text-success">
                    {points}
                  </div>
                  <span className="text-sm text-brand3">Points</span>
                </span>
              </h3>
              <X
                onClick={() => setopenRedeem()}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 p-2">
            <div
              className={`${
                points < 100 && "grayscale"
              } flex    items-center w-full  rounded-md bg-white dark:bg-slate-600  shadow-md hover:shadow-xl`}
            >
              <img
                className="h-24 aspect-square object-cover  rounded-l-md"
                src={
                  "https://www.mydesignation.com/wp-content/uploads/2019/08/malayali-tshirt-mydesignation-mockup-image-latest-golden-.jpg"
                }
                alt="murch"
              />
              <div className="p-4">
                <span className="text-lg font-semibold text-brand1">Kit</span>
                {/* <p className="text-base font-normal text-brand3">
                  
                </p> */}
                <div className="w-full  flex items-center justify-between ">
                  <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                    <div className="flex items-center gap-2 text-success">
                      100
                    </div>
                    <span className="text-sm text-brand3">Points</span>
                  </span>
                </div>
              </div>
              {points >= 100 && (
                <button
                  onClick={() => {}}
                  className="btn btn-sm gap-1 btn-brand rounded-full capitalize  ml-auto mr-2"
                >
                  Redeem
                </button>
              )}
            </div>
            <div
              className={`${
                points < 200 && "grayscale"
              } flex    items-center w-full  rounded-md bg-white dark:bg-slate-600  shadow-md hover:shadow-xl`}
            >
              <img
                className="h-24 aspect-square object-cover  rounded-l-md"
                src={
                  "https://www.mydesignation.com/wp-content/uploads/2019/08/malayali-tshirt-mydesignation-mockup-image-latest-golden-.jpg"
                }
                alt="murch"
              />
              <div className="p-4">
                <span className="text-lg font-semibold text-brand1">Cap</span>
                {/* <p className="text-base font-normal text-brand3">
                  
                </p> */}
                <div className="w-full  flex items-center justify-between ">
                  <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                    <div className="flex items-center gap-2 text-success">
                      200
                    </div>
                    <span className="text-sm text-brand3">Points</span>
                  </span>
                </div>
              </div>
              {points >= 200 && (
                <button
                  onClick={() => {}}
                  className="btn btn-sm gap-1 btn-brand rounded-full capitalize  ml-auto mr-2"
                >
                  Redeem
                </button>
              )}
            </div>{" "}
            <div
              className={`${
                points < 300 && "grayscale"
              } flex    items-center w-full  rounded-md bg-white dark:bg-slate-600  shadow-md hover:shadow-xl`}
            >
              <img
                className="h-24 aspect-square object-cover  rounded-l-md"
                src={
                  "https://www.mydesignation.com/wp-content/uploads/2019/08/malayali-tshirt-mydesignation-mockup-image-latest-golden-.jpg"
                }
                alt="murch"
              />
              <div className="p-4">
                <span className="text-lg font-semibold text-brand1">
                  T-shirt
                </span>
                {/* <p className="text-base font-normal text-brand3">
                  
                </p> */}
                <div className="w-full  flex items-center justify-between ">
                  <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                    <div className="flex items-center gap-2 text-success">
                      300
                    </div>
                    <span className="text-sm text-brand3">Points</span>
                  </span>
                </div>
              </div>
              {points >= 300 && (
                <button
                  onClick={() => {}}
                  className="btn btn-sm gap-1 btn-brand rounded-full capitalize  ml-auto mr-2"
                >
                  Redeem
                </button>
              )}
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestDetails;
