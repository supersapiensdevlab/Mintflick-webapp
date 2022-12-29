import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "tabler-icons-react";

function QuestDetailsAdmin() {
  const navigateTo = useNavigate();

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
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("../quest-admin")}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="text-xl font-bold text-brand1 mx-auto">
          Quest name
        </span>
      </div>
      <div className="flex-grow w-full py-4 overflow-y-auto space-y-4">
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl  mx-auto w-full justify-start     items-start max-w-2xl">
          <img
            className="aspect-video w-full object-cover sm:rounded-lg"
            src={
              "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg"
            }
            alt="banner"
          />
        </div>
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Details</span>
          <p className="text-base font-normal text-brand1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sints
          </p>
        </div>
        <div
          // onClick={() => setquestStarted(false)}
          className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-4 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl"
        >
          <span className="text-lg font-semibold text-brand1">Tasks</span>
          {tasks.map((task) => (
            <div className="flex flex-col  items-start w-full  rounded-md bg-white dark:bg-slate-600 p-4 shadow-md hover:shadow-xl">
              <span className="text-lg font-semibold text-brand1">
                {task.name}
              </span>
              <p className="text-base font-normal text-brand3">
                {task.description}
              </p>
              <div className="w-full flex items-center justify-between mt-4">
                <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                  <div className="flex items-center gap-2 text-success">0</div>
                  <span className="text-sm text-brand3">Points</span>
                </span>
                <span className="text-lg font-semibold text-brand1">
                  Action: {task.action}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
        <button
          // onClick={() => setquestStarted(true)}
          className="btn w-full btn-error rounded-full capitalize"
        >
          Close Quest
        </button>
      </div>
    </div>
  );
}

export default QuestDetailsAdmin;
