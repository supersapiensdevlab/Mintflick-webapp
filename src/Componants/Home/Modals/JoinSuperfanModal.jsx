import React, { useState } from "react";
import { X, Comet } from "tabler-icons-react";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import PolygonToken from "../../../Assets/logos/PolygonToken";

const JoinSuperfanModal = ({
  setJoinSuperfanModal,
  content,
  superfan_data,
}) => {
  const [plans, setPlans] = useState([
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU",
      name: "Basic",
      discription: `${superfan_data?.perks}`,
      prise: `${superfan_data?.price}`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLL5-aWLswOM1S1pvyzl_K9pPV0WL2KDSjJA&usqp=CAU",
      name: "Silver",
      discription: `Silver Plan + ${superfan_data?.perks2}`,
      prise: `${superfan_data?.price2}`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQASf34hYLt1x9akOACzs-0nCeYzmKP1zeeow&usqp=CAU",
      name: "Gold",
      discription: `Gold Plan + ${superfan_data?.perks3}`,
      prise: `${superfan_data?.price}`,
    },
  ]);
  const [loadFeed] = useUserActions();

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Comet className="-rotate-90" />
            Become a Superfan
          </h3>
          <X
            onClick={() => setJoinSuperfanModal(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <div className="w-full p-4 space-y-3">
        <img
          src="https://media.newyorker.com/photos/5d72cf9af8ab740008388389/master/w_2560%2Cc_limit/190916_r34943.jpg"
          className="w-full h-48 object-cover rounded-lg"
        />
        <h3 className="sm:px-8 font-semibold text-base text-brand2 text-center">
          The transaction amount will be sent directly to the Creators Wallet.
        </h3>
        {plans.map((plan) => (
          <div className="flex w-full bg-slate-200 dark:bg-slate-700 h-20 rounded-lg overflow-hidden hover:ring-2 ring-primary dark:ring-brand">
            <img
              src={plan.img}
              className="h-full w-32 bg-red-600 object-cover"
            />
            <span className="p-2 h-full flex-grow ">
              <h3 className="text-xl font-semibold text-primary dark:text-brand">
                {plan.name}
              </h3>
              <h5 className="w-full text-sm font-medium text-brand4">
                {plan.discription}
              </h5>
            </span>
            <span className="flex items-center justify-start w-28 gap-2 p-4 h-full  bg-slate-300 dark:bg-slate-600">
              <PolygonToken size={24} />
              <h3 className="text-xl font-semibold text-brand2">
                {plan.prise}
              </h3>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinSuperfanModal;
