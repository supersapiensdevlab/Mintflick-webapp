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
} from "tabler-icons-react";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

const TreasuryConvertModal = ({ setShowConversionModal }) => {
  const [coinValue, setCoinValue] = useState(0);
  const State = useContext(UserContext);
  const [insufficientCoins, setInsufficientCoins] = useState(null);
  const [loadFeed, loadUser] = useUserActions();
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const handleConvert = () => {
    if (State.database.userData.data?.user?.coins?.balance < coinValue) {
      setInsufficientCoins("Insufficient coins to convert");
      return;
    }
    const data = {
      value: coinValue,
      // id: State.database.userData.data?.user?.id,
    };
    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/user/convert_treasury/`,
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
            "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
          },
        }
      )
      .then(async () => {
        console.log("in");
        await loadUser();
        setConversionSuccess(true);
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
             
            <p className="flex space-x-2 items-center">
              <p>Convert</p> <Coin size={24} /> <ArrowRight size={24} />{" "}
              <Diamond size={24} />
            </p>
          </h3>

          <X
            onClick={() => {
              setShowConversionModal(false);
              setInsufficientCoins(null);
              setCoinValue(0);
              setConversionSuccess(false);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <div className="flex flex-col p-4 w-full">
        <div className="flex w-full justify-center space-x-4">
          <p className=" text-white">Coins to convert</p>
          <div className=" flex text-white justify-center space-x-3">
            <Plus
              size={24}
              className="bg-white text-slate-800 rounded-sm cursor-pointer"
              onClick={() => {
                setCoinValue(coinValue + 100);
              }}
            />
            <p>{coinValue}</p>
            <Minus
              size={24}
              className="bg-white text-slate-800 rounded-sm cursor-pointer"
              onClick={
                coinValue > 0
                  ? () => {
                      setCoinValue(coinValue - 100);
                    }
                  : null
              }
            />
          </div>

          <p className="text-white flex">Avl. {State.database.userData.data?.user?.coins?.balance}<Coin size={24} /></p> 
        </div>
        {insufficientCoins && (
          <div className="text-red-500 text-center w-full mt-6">
            {insufficientCoins}
          </div>
        )}
        {conversionSuccess ? (
          <div className="w-full  mt-6 flex justify-center text-white">
            Converted <Checkbox size={24} className="ml-2" />
          </div>
        ) : (
          <div className={`w-full ${!insufficientCoins ? "mt-3" : ""}`}>
            <button
              className={`flex space-x-2 items-center justify-center  btn ${
                coinValue > 0 ? "btn-brand" : "btn-disabled"
              } w-full mt-2 `}
              onClick={handleConvert}
            >
              Convert to {coinValue / 10}{" "}
              <Diamond size={20} className="ml-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasuryConvertModal;
