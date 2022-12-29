import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import { UserContext } from "../../Store";
import gif from "../../Assets/backgrounds/welcome.gif";
import useWebModal from "../Wallet/useWebModal"; 

function QuestOnboarding() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const modal = useWebModal();
  const {questId, taskId} = useParams();
  const [description, setdescription] = useState(
    "This quest is designed so you can earn some rewards while checking out our new social media platform"
  );



  useEffect(() => {
   localStorage.setItem("questId",questId); 
   localStorage.setItem("taskId",taskId);
   localStorage.setItem("completedTasks",[taskId]);
   localStorage.setItem("questFlow",true);
  }, [questId, taskId])
  
  return (
    <div className="flex flex-col items-center  md:gap-4     w-screen h-screen  bg-white dark:bg-slate-900 overflow-auto">
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <span className="flex items-center text-xl font-bold text-brand1 mx-auto">
          {!State.database.dark ? (
            <Main_logo_dark></Main_logo_dark>
          ) : (
            <Main_logo></Main_logo>
          )}
          Mintflick
        </span>
      </div>

      <div className="flex-grow flex flex-col gap-4 w-full  overflow-y-auto">
        <div className=" px-4 w-full mx-auto  max-w-2xl">
          <img
            className="aspect-video w-full object-cover rounded-lg  "
            src={gif}
            alt="banner"
          />
        </div>
        <span className=" text-center text-lg font-bold text-brand1 mx-auto ">
          Welcome! WE ARE SO HAPPY <br />
          YOU ARE HEREEEE 🥰
        </span>
        <p className="text-center px-4 text-lg text-brand2 font-normal  mx-auto  max-w-2xl">
          {description}
        </p>
        <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
          <button
            onClick={async () => {
              modal(true);
            }}
            className="btn w-full btn-brand rounded-full capitalize "
          >
            Start Quest
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestOnboarding;
