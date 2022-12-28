import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wallet } from "tabler-icons-react";
import MintWalletModal from "../Componants/Profile/Modals/MintWalletModal";
import QuestCard from "../Componants/Quests/QuestCard";
import { UserContext } from "../Store";

function Quests() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [walletModalOpen, setwalletModalOpen] = useState(false);

  const [data, setData] = useState([
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
  ]);

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("../home")}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="text-xl font-bold text-brand1 mx-auto">Quests</span>
        <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span>
      </div>
      <div className="py-2 px-4 w-full max-w-3xl mx-auto flex gap-2 sm:rounded-xl bg-slate-100 dark:bg-slate-800">
        <input
          type="text"
          placeholder="Search Quests"
          className="input input-bordered w-full  flex-grow"
        />
      </div>
      <div className="flex-grow w-full py-4 overflow-y-auto">
        <div className="w-full sm:w-fit h-fit  grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
          {data.map((event) => (
            <QuestCard
              selectedPostImg={event.img}
              name={event.topic}
              description={event.description}
              status={event.status}
            />
          ))}
        </div>
      </div>
      <MintWalletModal open={walletModalOpen} setOpen={setwalletModalOpen} />
    </div>
  );
}

export default Quests;
