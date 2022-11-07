import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import {
  Currency,
  Diamond,
  X,
  Coin,
  ArrowRight,
  Minus,
  Plus,
  Checkbox,
  BuildingStore,
  ShoppingCart,
} from "tabler-icons-react";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import useRazorpay from "react-razorpay";

const BuyGemsModal = ({ setShowBuyGemsModal }) => {
  const State = useContext(UserContext);
  const [loadFeed, loadUser] = useUserActions();
  const Razorpay = useRazorpay();
  const [selectedGemsPlan, setSelectedGemsPlan] = useState(null);
  const [buySuccess, setBuySuccess] = useState(null);
  const [buyError, setBuyError] = useState(null);

  const gemPlans = [
    {
      gems: 100,
      value: 10,
    },
    {
      gems: 200,
      value: 20,
    },
    {
      gems: 300,
      value: 30,
    },
    {
      gems: 500,
      value: 50,
    },
  ];

  const handlePayment = async (amount) => {
    setBuySuccess(null);
    setBuyError(null);
    const orderUrl = `${process.env.REACT_APP_SERVER_URL}/order`;
    const response = await axios.post(orderUrl, { amount: amount });
    const { data } = response;
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      name: "Mintflick",
      description: "Decentralised platform for creators",
      order_id: data.id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `${process.env.REACT_APP_SERVER_URL}/capture/${paymentId}`;
          await axios
            .post(url, {
              amount: amount,
              username: State.database.userData.data?.user?.username,
            })
            .then(async (response) => {
              console.log(response.data);
              await loadUser();
              setBuySuccess(`${amount * 10} gems bought successfully!`);
            });
        } catch (err) {
          console.log(err);
          setBuyError(`Error buying gems`);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <p className="flex space-x-2 items-center">
              <BuildingStore size={24} />
              <p>Purchase Gems</p>
            </p>
          </h3>

          <X
            onClick={() => {
              setShowBuyGemsModal(false);
              setBuySuccess(null);
              setBuyError(null);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <div className="flex flex-col p-4 w-full text-white">
        <div className="flex w-full mt-3">
          {gemPlans.map((value, i) => {
            return (
              <div
                key={i}
                className={`${
                  i === selectedGemsPlan?.i ? "border border-white" : ""
                } w-1/4 flex flex-col justify-center items-center py-3 space-y-1 rounded-lg cursor-pointer`}
                onClick={() => {
                  setSelectedGemsPlan({
                    value: { gems: value.gems, value: value.value },
                    i: i,
                  });
                }}
              >
                <div className="flex space-x-1 items-center justify-center ">
                  <p>{value.gems}</p>
                  <Diamond size={20} className="text-blue-400" />
                </div>
                <div className="mt-3">{value.value} INR</div>
              </div>
            );
          })}
        </div>
        {buySuccess && (
          <p className={`text-center mt-5 text-green-500 `}>{buySuccess}</p>
        )}
        {buyError && (
          <p className={`text-center mt-5 text-rose-500 `}>{buyError}</p>
        )}
        <div className="w-full">
          <button
            className={`flex space-x-2 items-center justify-center  btn ${
              selectedGemsPlan ? "btn-brand" : "btn-disabled"
            } w-full ${buySuccess ? "mt-2" : "mt-6"} `}
            onClick={() => {
              handlePayment(selectedGemsPlan.value.value);
            }}
          >
            <ShoppingCart size={20} />
            <p>Buy</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyGemsModal;
