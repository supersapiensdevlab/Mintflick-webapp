import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import { transactionWithFee } from "./Utility/mintflickTransaction";

function NftLimit(props) {
  const State = useContext(UserContext);

  const [mintLimit, setmintLimit] = useState(0);
  const [loading, setloading] = useState(false);
  const [isPro, setisPro] = useState(false);

  const getNftLimit = () => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/user/limitCheck/${props.username}`
      )
      .then(async (res) => {
        console.log(res);
        setmintLimit(res.data.count);
        props.setNftLimit(res.data.count);
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

    // const rpc = new RPC(State.database.provider);
    // console.log(rpc);
    // await rpc
    //   .sendTransaction(
    //     // parseFloat(whatToShow?.price * 0.05) + parseFloat(whatToShow?.price),
    //     whatToShow?.price,
    //     toPay,
    //   )
    //   .then((receipt) => {
    //     console.log(receipt);
    //     if (typeof receipt != "object") {
    //       handleTransactionSucess(receipt, whatToShow?.name);
    //       console.log("in 3");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     setloading(false);
    //   });
  };
  const hasPro = () => {
    State.database.userData?.data?.user?.subscription?.map((s) => {
      s.type === "platform" &&
        s.validity >= Math.round(Date.now() / 1000) &&
        setisPro(true);
    });
  };
  useEffect(() => {
    hasPro();
    console.log(isPro);
    getNftLimit();
  }, []);

  return (
    !isPro &&
    (mintLimit < 5 ? (
      mintLimit >= 3 && (
        <div className="font-semibold text-white shadow-lg alert alert-success">
          <div>
            <span>You have {5 - mintLimit} free nft mints left for today.</span>
          </div>
        </div>
      )
    ) : (
      <div className="font-semibold text-white shadow-lg alert alert-error">
        <div className="flex flex-col">
          <span>
            Oops! You've reached your daily limit of 5 digital collectibles.
            Upgrade to Pro or wait 24 hours for more fun to begin!
          </span>{" "}
          <button
            onClick={() => handleBuyPlan(0.001, 30)}
            className={`capitalize btn btn-brand btn-sm ${
              loading && "loading"
            }`}
          >
            Buy Pro for 1 sol
          </button>
        </div>
      </div>
    ))
  );
}

export default NftLimit;
