import React, { useContext, useState } from "react";
import { UserContext } from "../../Store";
import axios from "axios";
import { transactionWithFee } from "../Home/Utility/mintflickTransaction";
import { X } from "tabler-icons-react";

function BuyPlatformPlan(props) {
  const State = useContext(UserContext);

  const [loading, setloading] = useState(false);

  const uploadPlanInfo = (data) => {
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/buyPlan`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        console.log(res);
        let temp = {
          data: {
            user: res.data,
          },
        };
        State.updateDatabase({
          userData: temp,
          walletAddress: temp.data.user.wallet_id,
        });
        State.toast(
          "success",
          "Congratulations ! Pro plan bought successfully!"
        );
        console.log("in 3");
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBuyPlan = async (price, validity) => {
    console.log("in 1");
    setloading(true);
    if (!State.database.provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("in 2");

    await transactionWithFee(
      State.database.walletAddress,
      process.env.REACT_APP_FEEPAYER_WALLET,
      price,
      0,
      State.database.provider
    )
      .then((receipt) => {
        console.log(receipt);
        if (receipt) {
          props.setNftLimit(0);
          setloading(false);
          uploadPlanInfo({
            type: "platform",
            plan: "Pro",
            validity: validity,
            txnHash: receipt,
          });
        } else {
          setloading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Transaction failed. Please try again");
        setloading(false);
      });
  };

  function clearData() {
    props.setOpen(false);
  }
  return (
    <div
      className={` modal 
        ${props.open && "modal-open"} modal-bottom  sm:modal-middle `}
    >
      <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
          <div className="flex items-center justify-between p-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
              Buy Platform Plan
            </h3>
            <X
              onClick={() => {
                clearData();
              }}
              className="cursor-pointer text-brand2"
            ></X>
          </div>
        </div>
        <div className="w-full p-8 ">
          <button
            onClick={() => handleBuyPlan(0.001, 30)}
            className={`capitalize btn btn-brand btn-sm mx-auto ${
              loading && "loading"
            }`}
          >
            Buy Pro for 1 sol
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyPlatformPlan;
