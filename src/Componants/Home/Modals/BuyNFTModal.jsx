import React, { useContext, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  At,
  Eye,
  InfoCircle,
  ShoppingCart,
  X,
} from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { UserContext } from "../../../Store";
import axios from "axios";

function BuyNFTModal() {
  const State = useContext(UserContext);
  const [step, setStep] = useState(1);

  const buyNft = () => {
    let buyNftData = {
      network: "devnet",
      marketplace_address: `${process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS}`,
      nft_address: State.database?.buyNFTModalData?.tokenId,
      price: State.database?.buyNFTModalData?.nftPrice,
      seller_address: State.database?.buyNFTModalData?.sellerAddress,
      buyer_wallet: State.database.walletAddress,
    };
    axios
      .post(`https://api.shyft.to/sol/v1/marketplace/buy`, buyNftData, {
        headers: {
          "x-api-key": "6ENAkcg4YJcHhlYf",
          "content-type": "application/json",
        },
      })
      .then(async (data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className={`${
        State.database.buyNFTModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              {step === 1 ? (
                <ShoppingCart />
              ) : (
                <ArrowLeft
                  className="cursor-pointer text-brand4"
                  onClick={() => setStep(1)}
                />
              )}
              {step === 1 && "Buy NFT"}
              {step === "buyNow" && "Checkout"}
              {step === "makeOffer" && "Make an offer"}
            </h3>
            <X
              onClick={() => State.updateDatabase({ buyNFTModalOpen: false })}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        {step === 1 && (
          <div className="p-4 space-y-2">
            <div className="w-full  flex flex-col sm:flex-row bg-white dark:bg-slate-700 rounded-lg overflow-clip">
              <img
                src={State.database?.buyNFTModalData?.nftImage}
                alt="NFT image"
                className="h-full w-28  bg-red-100"
              />
              <div className="p-3 flex-grow space-y-1 ">
                <div className="text-lg text-brand1 font-bold">
                  {State.database?.buyNFTModalData?.nftName}
                </div>
                <div className="text-sm text-brand3 font-medium">
                  {State.database?.buyNFTModalData?.nftDescription}
                </div>
                <div className="flex items-center gap-1 text-brand3">
                  <p className="font-medium text-sm ">Owned by</p>
                  <At size={16}></At>
                  <p className="cursor-pointer font-semibold text-sm text-primary">
                    {State.database?.buyNFTModalData?.ownedBy}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                  <Eye size={16} />
                  12M
                </span>
                <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                  Creater fees{" "}
                  <InfoCircle className="cursor-pointer" size={16} />
                </span>
                {/* <div className="h-[2px] rounded-full bg-slate-200 dark:bg-slate-600"></div> */}
              </div>
              <div className="flex flex-col p-4 sm:items-end justify-center text-brand1">
                <p className="flex items-center gap-2 cursor-pointer font-semibold text-3xl text-brand-gradient">
                  <PolygonToken size={16}></PolygonToken>{" "}
                  {State.database?.buyNFTModalData?.nftPrice}
                </p>
                <span className="text-sm font-normal text-brand4">($1234)</span>
              </div>
            </div>
            <div
              tabindex="0"
              className="collapse collapse-arrow border-2 cursor-pointer  dark:border-slate-600 text-brand3 rounded-lg"
            >
              <div className="collapse-title text-lg font-semibold ">
                Offers
              </div>
              <div className="collapse-content">
                <p>Offers list will come here </p>
              </div>
            </div>
            <div className="w-full flex ">
              <div className="p-1 w-1/2">
                <button
                  onClick={() => {
                    // setStep("buyNow");
                    buyNft();
                  }}
                  className="btn btn-brand w-full "
                >
                  BUY NOW
                </button>
              </div>
              <div className="p-1 w-1/2">
                <button
                  onClick={() => setStep("makeOffer")}
                  className="btn btn-primary btn-outline w-full"
                >
                  Make AN offer
                </button>
              </div>
            </div>
            {/* <input
            type="date"
            id="birthday"
            name="birthday"
            className="input"
          ></input> */}
          </div>
        )}
        {step === "buyNow" && (
          <div className="w-full p-4 space-y-3">
            <div className="w-full ">
              <img
                src="https://lh3.googleusercontent.com/yCbypC0JI61YbUFf_5ULkHJonhKZpLt63wY4ZAP5DZLYuMfcwr28zdq5TDSyhtl0Ifg2mNrtrJ3tbBOW_XKEWNctFdx1LEaLTaDExg=w600"
                alt="NFT image"
                className="h-36 w-36 rounded-lg mx-auto"
              />
              <div className="p-2 space-y-2 ">
                <div className="text-lg text-brand1 text-center font-bold ">
                  Diamond Pass
                </div>
                <div className="flex gap-1 items-center justify-center text-brand1">
                  <p className="flex items-center gap-2 cursor-pointer font-semibold text-3xl text-brand-gradient">
                    <PolygonToken size={16}></PolygonToken> {}
                  </p>
                  <span className="text-sm font-normal text-brand4">
                    ($1234)
                  </span>
                </div>
                <div className=" p-2 rounded-md border border-slate-500">
                  <p className="text-brand4 truncate">
                    Wallet: {localStorage.getItem("walletAddress")}
                  </p>
                  <p className="cursor-pointer text-brand3 font-semibold">
                    Balance: 11 Matic
                  </p>
                </div>
                <div className="flex justify-between p-2 rounded-md border border-error text-error font-semibold">
                  <p className="flex gap-2">
                    <AlertTriangle />
                    You need 12 Matic.
                  </p>
                  <p className="cursor-pointer text-primary hover:underline">
                    Add funds with card
                  </p>
                </div>
              </div>
            </div>
            <button
              //   onClick={() => setStep("buyNow")}
              className="btn btn-brand w-full "
            >
              checkout
            </button>
          </div>
        )}
        {step === "makeOffer" && (
          <div className="w-full p-4 space-y-3">
            <div className="w-full p-2 space-y-2 ">
              <div className=" p-2 rounded-md border border-slate-500">
                <p className="text-brand4 truncate">
                  Wallet: {localStorage.getItem("walletAddress")}
                </p>
                <p className="cursor-pointer text-brand3 font-semibold">
                  Balance: 11 Matic
                </p>
              </div>
              <div className="flex justify-between p-2 rounded-md border border-error text-error font-semibold">
                <p className="flex gap-2">
                  <AlertTriangle />
                  You dont have enough Matics.
                </p>
                <p className="cursor-pointer text-primary hover:underline">
                  Add funds with card
                </p>
              </div>
              <div className="flex gap-2">
                <div className="form-control">
                  <p className="text-brand2">Offer ammount</p>
                  <label className="input-group">
                    <input
                      min={1}
                      type="number"
                      placeholder="1"
                      className="input input-bordered input-sm w-24"
                      // value={nftPrice}
                      // onChange={(e) => setNFTPrice(e.target.value)}
                      required={true}
                    />
                    <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
                      <PolygonToken></PolygonToken> &nbsp;
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <p className="text-brand2">Offer expiration</p>

                  <input
                    type="date"
                    className="input input-bordered input-sm w-48"
                    // value={nftPrice}
                    // onChange={(e) => setNFTPrice(e.target.value)}
                    required={true}
                  />
                </div>
              </div>
            </div>
            <button
              //   onClick={() => setStep("buyNow")}
              className="btn btn-brand w-full "
            >
              make offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyNFTModal;
