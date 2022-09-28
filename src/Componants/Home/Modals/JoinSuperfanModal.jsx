import React, { useState, useContext } from "react";
import { X, Comet } from "tabler-icons-react";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import { UserContext } from "../../../Store";
import { Link } from "react-router-dom";
import { ChevronLeft } from "tabler-icons-react";
import RPC from "../../../Componants/Wallet/solanaRPC";
import { useEffect } from "react";

const JoinSuperfanModal = ({
  setJoinSuperfanModal,
  content,
  superfan_data,
  toPay,
  postUsername,
}) => {
  const [plans, setPlans] = useState([
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU",
      name: "Basic",
      description: `${superfan_data?.perks}`,
      price: `${superfan_data?.price}`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLL5-aWLswOM1S1pvyzl_K9pPV0WL2KDSjJA&usqp=CAU",
      name: "Silver",
      description: `Silver Plan + ${superfan_data?.perks2}`,
      price: `${superfan_data?.price2}`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQASf34hYLt1x9akOACzs-0nCeYzmKP1zeeow&usqp=CAU",
      name: "Gold",
      description: `Gold Plan + ${superfan_data?.perks3}`,
      price: `${superfan_data?.price}`,
    },
  ]);
  const [loadFeed] = useUserActions();
  const State = useContext(UserContext);
  const [whatToShow, setWhatToShow] = useState(null);
  const [explorerLink, setExplorerLink] = useState(null);
  const [isSuperfan, setIsSuperfan] = useState(false);

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
    console.log("called");
    if (State.database.userData) {
      State.database.userData?.data?.user?.superfan_of?.forEach((value) => {
        if (value.username === postUsername) {
          setIsSuperfan(true);
        }
      });
    }
  }, [State.database.userData?.data?.user?.superfan_of]);

  const handleTransactionSucess = (receipt, plan) => {
    const link = `https://explorer.solana.com/tx/${receipt}?cluster=devnet`;
    console.log(link, plan);
    const superfanData = {
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
      .then(async (data) => {
        setExplorerLink(link);
        State.toast("success", "Yay! You are now a superfan");
        await axios({
          method: "post",
          url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,

          data: {
            walletId: localStorage.getItem("walletAddress"),
          },
        })
          .then((response) => {
            console.log(response);

            State.updateDatabase({
              userData: response,
              walletAddress: response.data.user.wallet_id,
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Transaction failed. Please try again");
      });
  };

  const handleBuySuperfanPlan = async () => {
    if (!State.database.provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(State.database.provider);
    await rpc
      .sendTransaction(
        parseFloat(whatToShow?.price * 0.05) + parseFloat(whatToShow?.price),
        toPay
      )
      .then((receipt) => {
        console.log(typeof receipt);
        if (typeof receipt != "object") {
          handleTransactionSucess(receipt, whatToShow?.name);
        }
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

      {isSuperfan ? (
        <div className="w-full flex justify-center items-center p-4">
          <p className="text-brand">
            You are already {postUsername}'s superfan!
          </p>
        </div>
      ) : (
        <>
          {whatToShow == null ? (
            <div className="w-full p-4 space-y-3">
              <img
                src="https://media.newyorker.com/photos/5d72cf9af8ab740008388389/master/w_2560%2Cc_limit/190916_r34943.jpg"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="space-y-1 w-full flex justify-center">
                <p className="text-white">
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
                      {plan.description}
                    </h5>
                  </span>
                  <button
                    onClick={() => {
                      handleJoinSuperfan(plan.name);
                    }}
                  >
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
              ))}
            </div>
          ) : (
            <div className="flex-col space-y-3 text-white p-2">
              <div className="flex space-x-2 items-center">
                <button
                  className=" btn btn-circle btn-sm "
                  onClick={() => {
                    setWhatToShow(null);
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="font-semibold">SUMMARY</h2>
              </div>
              <hr className="text-white mx-2 opacity-10" />
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
                <hr className="text-white mx-2 opacity-10" />
                <div className="flex-col space-y-0">
                  <p className="text-brand font-semibold text-xl">Perks</p>
                  <p>{whatToShow?.description}</p>
                </div>
                <hr className="text-white mx-2 opacity-10" />
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
                </div>
                <div className="w-full pr-4 pb-2">
                  {explorerLink ? (
                    <div className="flex-col space-y-1">
                      <a
                        href={explorerLink}
                        target="_blank"
                        className="text-primary underline"
                      >
                        View on Solana Explorer
                      </a>
                    </div>
                  ) : (
                    <button
                      onClick={handleBuySuperfanPlan}
                      className="btn btn-brand w-full "
                    >
                      Pay{" "}
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
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JoinSuperfanModal;
