import React, { useState, useContext } from "react";
import { X, Comet, ExternalLink } from "tabler-icons-react";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import { UserContext } from "../../../Store";
import { Link } from "react-router-dom";
import { ChevronLeft } from "tabler-icons-react";
import RPC from "../../../Componants/Wallet/solanaRPC";
import { useEffect } from "react";
import superfan_basic from "../../../Assets/logos/icons/superfans/superfan_basic.svg";
import superfan_gold from "../../../Assets/logos/icons/superfans/superfan_gold.svg";

import superfan_silver from "../../../Assets/logos/icons/superfans/superfan_silver.svg";

import superfanBasic from "../../../Assets/SuperfanPlans/basic.webp";
import superfanSilver from "../../../Assets/SuperfanPlans/silver.webp";
import superfanGold from "../../../Assets/SuperfanPlans/gold.webp";

import { transactionWithFee } from "../Utility/mintflickTransaction";

const JoinSuperfanModal = ({
  setJoinSuperfanModal,
  content,
  superfan_data,
  toPay,
  postUsername,
}) => {
  const [plans, setPlans] = useState([
    {
      img: superfanBasic,
      name: "Basic",
      description: `${superfan_data?.perks}`,
      price: `${superfan_data?.price}`,
    },
    {
      img: superfanSilver,
      name: "Silver",
      description: `${superfan_data?.perks2}`,
      price: `${superfan_data?.price2}`,
    },
    {
      img: superfanGold,
      name: "Gold",
      description: `${superfan_data?.perks3}`,
      price: `${superfan_data?.price3}`,
    },
  ]);

  useEffect(() => {
    setPlans([
      {
        img: superfanBasic,
        name: "Basic",
        description: `${superfan_data?.perks}`,
        price: `${superfan_data?.price}`,
      },
      {
        img: superfanSilver,
        name: "Silver",
        description: `${superfan_data?.perks2}`,
        price: `${superfan_data?.price2}`,
      },
      {
        img: superfanGold,
        name: "Gold",
        description: `${superfan_data?.perks3}`,
        price: `${superfan_data?.price3}`,
      },
    ]);
  }, [superfan_data]);

  const [loadFeed] = useUserActions();
  const State = useContext(UserContext);
  const [whatToShow, setWhatToShow] = useState(null);
  const [explorerLink, setExplorerLink] = useState(null);
  const [isSuperfan, setIsSuperfan] = useState(null);
  const [buyingPlan, setBuyingPlan] = useState(false);

  const [expiry, setexpiry] = useState(null);

  const handleJoinSuperfan = (plan) => {
    switch (plan) {
      case "Basic":
        setWhatToShow(plans[0]);
        break;
      case "Silver":
        setWhatToShow(plans[1]);
        break;
      case "Gold":
        setWhatToShow(plans[2]);
        break;
    }
  };

  useEffect(() => {
    State.database.userData?.data?.user?.superfan_of?.map(
      (value) => value.username === postUsername && setIsSuperfan(value)
    );
  }, [State.database.userData?.data?.user?.superfan_of]);

  const handleTransactionSucess = (receipt, plan) => {
    const link = `https://explorer.solana.com/tx/${receipt}?cluster=devnet`;
    const date2 = new Date();
    const timestamp = date2.getTime();
    console.log("date", timestamp);
    const superfanData = {
      timestamp: timestamp,
      txnHash: link,
      superfanof: postUsername,
      plan: plan,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/superfan`, superfanData, {
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
        setExplorerLink(link);
        State.toast("success", "Yay! You are now a superfan");
        setBuyingPlan(false);

        setWhatToShow(null);
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Transaction failed. Please try again");
        setBuyingPlan(false);
      });
  };

  const handleBuySuperfanPlan = async () => {
    console.log("in 1");
    setBuyingPlan(true);
    if (!State.database.provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("in 2");

    await transactionWithFee(
      State.database.walletAddress,
      toPay,
      whatToShow?.price,
      0.05,
      State.database.provider
    )
      .then((receipt) => {
        console.log(receipt);
        if (receipt) {
          handleTransactionSucess(receipt, whatToShow?.name);
          console.log("in 3");
        } else {
          setBuyingPlan(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setBuyingPlan(false);
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
    //     setBuyingPlan(false);
    //   });
  };

  const getDaysLeft = () => {
    // retunn days left between superfan.boughtOn + 30 days and current date

    const date1 = new Date(isSuperfan.boughtOn);
    const date2 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.ceil(30 - Difference_In_Days);
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Comet className="-rotate-90" />
            Become a Superfan
          </h3>
          <X
            onClick={() => {
              setJoinSuperfanModal(false);
              setWhatToShow(null);
              setExplorerLink(null);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>

      {/* {isSuperfan? ? (
        <div className="w-full flex justify-center items-center p-4">
          <p className="text-brand">
            You are already {postUsername}'s superfan!
          </p>
        </div>
      ) : ( */}
      {/* <> */}
      {whatToShow === null ? (
        <div className="w-full p-4 ">
          {superfan_data ? (
            <>
              {plans.map((plan) => (
                <>
                  {isSuperfan?.plan === plan.name && (
                    <div className="flex justify-end">
                      <span className="bg-primary w-fit text-base font-medium text-slate-100 px-2 mr-1   rounded-t-lg">
                        {getDaysLeft()} days left
                      </span>
                      <h5 className="bg-success w-fit text-base font-semibold text-slate-100 px-2 mr-2   rounded-t-lg">
                        Subscribed
                      </h5>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      handleJoinSuperfan(plan.name);
                    }}
                    className={`${
                      isSuperfan?.plan === plan.name &&
                      "border-2 border-success mt-0"
                    } my-2 flex w-full cursor-pointer bg-slate-200 dark:bg-slate-700 h-fit rounded-lg overflow-hidden hover:ring-2 ring-primary dark:ring-brand`}
                  >
                    <img
                      src={plan.img}
                      className="aspect-[4/3] w-32 bg-red-600 object-cover"
                    />
                    <span className="p-2 h-full flex-grow ">
                      <h3 className="text-xl font-semibold text-primary dark:text-brand1 flex gap-1">
                        <img
                          className="w-5"
                          src={
                            plan.name === "Silver"
                              ? superfan_silver
                              : superfan_gold
                          }
                        />
                        {plan.name}
                      </h3>
                      <h5 className="w-full text-sm font-medium text-brand4">
                        {plan.description}
                      </h5>
                    </span>
                    <button>
                      <span className="flex items-center justify-center w-28 gap-2 p-4 h-full  bg-slate-300 dark:bg-slate-600">
                        {State.database.chainId === 1 ? (
                          <PolygonToken size={24}></PolygonToken>
                        ) : State.database.chainId === 0 ? (
                          <SolanaToken size={24}></SolanaToken>
                        ) : null}
                        <h3 className="text-xl font-semibold text-brand2">
                          {plan.price}
                        </h3>
                      </span>
                    </button>
                  </div>
                </>
              ))}
            </>
          ) : (
            <p className="w-full text-center text-brand1">
              {postUsername} haven't set up any plans yet &#128533;
            </p>
          )}
          <div className="m-2 w-full flex justify-start items-center">
            <p className="text-brand1">
              Don't have SOL ?{" "}
              <a
                href={`https://staging-global.transak.com/?apiKey=a0aac8e7-6e2c-43b4-9434-394165e36bd5&redirectURL=https://transak.com&cryptoCurrencyList=ETH,DAI,USDT&defaultCryptoCurrency=SOL&walletAddress=${State.database.walletAddress}&disableWalletAddressForm=true&exchangeScreenTitle=My%20dApp%20is%20the%20best&isFeeCalculationHidden=true&fiatCurrency=USD&defaultPaymentMethod=google_pay&countryCode=IN`}
                className="text-primary"
                target="_blank"
              >
                Buy here
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-col space-y-3 text-brand1 p-2">
          <div className="flex space-x-2 items-center w-full">
            <button
              className="  "
              onClick={() => {
                setWhatToShow(null);
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="flex-grow text-center font-semibold text-lg">
              Summary
            </h2>
          </div>
          <hr className="text-brand1 mx-2 opacity-10" />
          <div className="space-x-2 w-full space-y-2">
            <div className="flex justify-between items-end w-full px-1">
              <div className="flex-col space-y-0 pl-1">
                <p className="text-brand font-semibold text-xl">Plan</p>
                <p>{whatToShow?.name}</p>
              </div>
              <span className="flex justify-center items-center px-2 space-x-2">
                {State.database.chainId === 1 ? (
                  <PolygonToken size={16}></PolygonToken>
                ) : State.database.chainId === 0 ? (
                  <SolanaToken size={16}></SolanaToken>
                ) : null}
                <p>{whatToShow?.price}</p>
              </span>
            </div>
            <hr className="text-brand1 mx-2 opacity-10" />
            <div className="flex-col space-y-0">
              <p className="text-brand font-semibold text-xl">Perks</p>
              <p>{whatToShow?.description}</p>
            </div>
            <hr className="text-brand1 mx-2 opacity-10" />
            <div className="flex-col space-y-0">
              <p className="text-brand font-semibold text-xl">Duration</p>
              <p className="flex space-x-1 items-center">
                <p>{whatToShow?.price}</p>
                <p>
                  {State.database.chainId === 1 ? (
                    <PolygonToken size={16}></PolygonToken>
                  ) : State.database.chainId === 0 ? (
                    <SolanaToken size={16}></SolanaToken>
                  ) : null}
                </p>
                <p>for 1 month</p>
              </p>
            </div>
            {/* <hr className="text-brand1 mx-2 opacity-10" />
            <div className="flex-col space-y-0">
              <p className="text-brand font-semibold text-xl">
                You should know
              </p>
              <p className="flex ">
                5% platform fees +{" "}
                <span className="flex justify-center items-center px-2 space-x-2">
                  {State.database.chainId === 1 ? (
                    <PolygonToken size={16}></PolygonToken>
                  ) : State.database.chainId === 0 ? (
                    <SolanaToken size={16}></SolanaToken>
                  ) : null}
                  <p>{whatToShow?.price}</p>
                </span>{" "}
                ={" "}
                <span className="flex justify-center items-center px-2 space-x-2">
                  {State.database.chainId === 1 ? (
                    <PolygonToken size={16}></PolygonToken>
                  ) : State.database.chainId === 0 ? (
                    <SolanaToken size={16}></SolanaToken>
                  ) : null}
                  <p>
                    {parseFloat(whatToShow?.price * 0.05) +
                      parseFloat(whatToShow?.price)}
                  </p>
                </span>
              </p>
            </div> */}
            <div className="w-full pr-4 pb-2">
              {isSuperfan?.plan === whatToShow?.name ? (
                <div className="flex flex-col space-y-1">
                  <div className="btn btn-success text-white capitalize text-lg">
                    Already subscribed
                  </div>{" "}
                  <a
                    href={explorerLink}
                    target="_blank"
                    className="text-primary underline text-center flex items-center justify-center gap-1 "
                  >
                    View on Solana Explorer <ExternalLink size={16} />
                  </a>
                </div>
              ) : (
                <button
                  onClick={() =>
                    isSuperfan?.plan !== whatToShow?.name &&
                    handleBuySuperfanPlan()
                  }
                  className={`btn btn-brand w-full capitalize text-lg ${
                    buyingPlan ? "loading" : ""
                  } `}
                >
                  Subscribe for
                  <span className="flex justify-center items-center px-2 space-x-2">
                    {State.database.chainId === 1 ? (
                      <PolygonToken size={16}></PolygonToken>
                    ) : State.database.chainId === 0 ? (
                      <SolanaToken size={16}></SolanaToken>
                    ) : null}
                    <p>
                      {/* {parseFloat(whatToShow?.price * 0.05) +
                        parseFloat(whatToShow?.price)} */}
                      {whatToShow?.price}
                    </p>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* </> */}
      {/* )} */}
    </div>
  );
};

export default JoinSuperfanModal;
