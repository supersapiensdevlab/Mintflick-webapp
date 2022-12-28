import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Scan,
  Share,
  Ticket,
  Wallet,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import MintWalletModal from "../Profile/Modals/MintWalletModal";
import { QrReader } from "react-qr-reader";
import adapter from "webrtc-adapter";

function TaskCard({ name, description, action, openScanner }) {
  return (
    <div className="flex flex-col  items-start w-full  rounded-md bg-white dark:bg-slate-600 p-4 shadow-md hover:shadow-xl">
      <span className="text-lg font-semibold text-brand1">{name}</span>
      <p className="text-base font-normal text-brand3">{description}</p>
      <div className="w-full flex items-center justify-between mt-4">
        <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
          <div className="flex items-center gap-2 text-success">0</div>
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

  const [open, setopen] = useState(false);
  const [data, setData] = useState("No result");

  const navigateTo = useNavigate();
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
          Quest Name
        </span>
        <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span>
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
            src={
              "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg"
            }
            alt="banner"
          />
        </div>
        {questStarted && (
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start   max-w-2xl">
            <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
              <div className="flex items-center gap-2 text-success">0</div>
              <span className="text-sm text-brand3">Points</span>
            </span>
            <button
              onClick={() => {}}
              className="btn btn-xs btn-primary rounded-full capitalize"
            >
              Redeem
            </button>
          </div>
        )}

        {!questStarted && (
          <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
            <span className="text-lg font-semibold text-brand1">Details</span>
            <p className="text-base font-normal text-brand1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sints
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
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
            {tasks.map((task) => (
              <TaskCard
                name={task.name}
                description={task.description}
                action={task.action}
                openScanner={setopen}
              />
            ))}
          </div>
        )}
        {!questStarted && (
          <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
            <button
              onClick={() => setquestStarted(true)}
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
        } modal  modal-bottom sm:modal-middle`}
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
          <div className="w-full  ">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
            />
            <p>{data}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestDetails;
