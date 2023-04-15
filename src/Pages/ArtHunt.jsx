import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Store";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "tabler-icons-react";
import ArtCard from "../Componants/ArtHunt/ArtCard";

function ArtHunt() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const [quests, setQuests] = useState([
    1, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8,
  ]);
  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-white lg:px-12 dark:bg-slate-900 lg:pt-20">
      {/* <div className='flex-col hidden w-1/4 h-full pt-24 ml-12 space-y-6 overflow-y-auto lg:flex'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="flex items-center w-full max-w-3xl p-4 mx-auto">
        <button
          onClick={() => navigateTo("../home")}
          className="flex items-center justify-center font-semibold text-brand3"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="mx-auto text-xl font-bold -translate-x-8 text-brand1">
          Arthunt
        </span>
        {/* <span
          onClick={() => setwalletModalOpen(true)}
          className=" text-brand1"
        >
          <Wallet />
        </span> */}
      </div>
      <div className="flex flex-col w-full max-w-3xl gap-2 px-4 py-2 mx-auto sm:rounded-xl bg-slate-100 dark:bg-slate-800">
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search Art"
            className="flex-grow w-full input input-bordered"
          />{" "}
          <button className="mx-auto capitalize btn btn-brand">
            Submit Art
          </button>
        </div>
        <div className="flex w-full max-w-3xl gap-2 mx-auto overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8].map(() => (
            <div className="px-3 py-1 text-sm font-semibold border-2 rounded-full whitespace-nowrap border-slate-500 dark:border-slate-400 text-brand3">
              hunt 1
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow w-full pt-2 overflow-y-auto ">
        <div className="grid w-full grid-cols-1 px-2 sm:w-fit h-fit gap-x-4 gap-y-4 sm:mx-auto">
          {quests?.map((quest) => (
            <ArtCard></ArtCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtHunt;
