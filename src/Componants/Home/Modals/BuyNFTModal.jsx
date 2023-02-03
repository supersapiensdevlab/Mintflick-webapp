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
import { SolanaWallet } from "@web3auth/solana-provider";
import {
  clusterUrl,
  confirmTransactionFromFrontend,
} from "../Utility/utilityFunc";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import useUserActions from "../../../Hooks/useUserActions";
import {
  buyNFTOnSolana2,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import { decode } from "bs58";

function BuyNFTModal() {
  const State = useContext(UserContext);
  const [step, setStep] = useState(1);

  const [buying, setBuying] = useState(false);

  const [loadFeed, loadUser, loadProfileCard, loadNftsData] = useUserActions();

  const signTransaction = async (encodedTransaction, fromPrivateKey) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const feePayer = Keypair.fromSecretKey(decode(fromPrivateKey));
      const recoveredTransaction = Transaction.from(
        Buffer.from(encodedTransaction, "base64")
      );
      const signedTrasaction = recoveredTransaction.partialSign(feePayer);
      const txnSignature = await connection.sendRawTransaction(
        signedTrasaction.serialize()
      );
      State.toast("success", "NFT bought successfully");
      State.updateDatabase({ buyNFTModalOpen: false });
      setBuying(false);
      await loadFeed();
      return txnSignature;
    } catch (error) {
      console.log(error);
    }
  };
  const signTransactionWithWallet = async (encodedTransaction, provider) => {
    let confirmTransaction;
    try {
      const solanaWallet = new SolanaWallet(provider); // web3auth.provider
      console.log(solanaWallet);

      const recoveredTransaction = Transaction.from(
        Buffer.from(encodedTransaction, "base64")
      );
      console.log(recoveredTransaction);
      const signedTx = await provider.signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
      console.log(signedTx);
      await loadFeed();
      confirmTransaction = signedTx;
    } catch (error) {
      console.log(error);
    }
    return confirmTransaction;
  };

  const buyNft = async () => {
    setBuying(true);
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
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      })
      .then(async (data) => {
        console.log(data);
        // await signTransaction(
        //   // "devnet",
        //   data.data.result.encoded_transaction,
        //   "vXJQfc7wgeY7gwyBrfkjQz5VKQd2Dy2E5Psoj5LusaJwxukC5tuLQgUxxZTnoN2fSjG1zHyF45XCA8nz8VK94Tg"
        // );
        const signedTrasaction = await signTransactionWithWallet(
          data.data.result.encoded_transaction,
          State.database.provider
        );
        console.log(signedTrasaction);
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const x = await connection.sendRawTransaction(
          signedTrasaction.serialize()
        );
        console.log(x);
        State.toast("success", "NFT bought successfully");
        State.updateDatabase({ buyNFTModalOpen: false });
        setBuying(false);
        loadFeed();
      })
      .catch((err) => {
        console.log(err);
        State.updateDatabase({ buyNFTModalOpen: false });
        State.toast("error", "Error while buying NFT");
        setBuying(false);
      });

    // const nftBought = await buyNFTOnSolana2(
    //   buyNftData,
    //   State.database.provider
    // );
    // const nftBoughtSuccessful = () => {
    //   State.toast("success", "NFT bought successfully");
    //   State.updateDatabase({ buyNFTModalOpen: false });
    //   setBuying(false);
    //   loadFeed();
    // };

    // const nftBoughtFailed = () => {
    //   State.toast("success", "NFT bought successfully");
    //   State.updateDatabase({ buyNFTModalOpen: false });
    //   setBuying(false);
    //   loadFeed();
    // };

    // nftBought ? nftBoughtSuccessful() : nftBoughtFailed();
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
            <div className="w-full  flex  flex-col bg-white dark:bg-slate-700 rounded-lg overflow-clip">
              <img
                src={State.database?.buyNFTModalData?.nftImage}
                alt="NFT image"
                className="p-4 h-96 w-full object-cover rounded-lg"
              />
              <div className="flex ">
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
                      {State.database?.buyNFTModalData?.ownedBy?.slice(0, 5) +
                        "..." +
                        State.database?.buyNFTModalData?.ownedBy?.slice(-5)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand4 hidden">
                    <Eye size={16} />
                    12M
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                    Platform fees{" "}
                    <div className="tooltip" data-tip="1% of NFT price">
                      <InfoCircle className="cursor-pointer" size={16} />
                    </div>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                    Creator royalties{" "}
                    <div
                      className="tooltip"
                      data-tip="5% on every secondary sale"
                    >
                      <InfoCircle className="cursor-pointer" size={16} />
                    </div>
                  </span>
                  {/* <div className="h-[2px] rounded-full bg-slate-200 dark:bg-slate-600"></div> */}
                </div>
                <div className="flex flex-col p-4 sm:items-end justify-center text-brand1">
                  <p className="flex items-center gap-2 cursor-pointer font-semibold text-3xl text-brand-gradient">
                    {State.database.chainId === 1 ? (
                      <PolygonToken size={16}></PolygonToken>
                    ) : State.database.chainId === 0 ? (
                      <SolanaToken></SolanaToken>
                    ) : null}
                    {State.database?.buyNFTModalData?.nftPrice}
                  </p>
                  <span className="text-sm font-normal text-brand4">
                    $
                    {Math.round(
                      State.database.chainId === 0
                        ? State.database?.price?.solanaPrice *
                            100 *
                            State.database?.buyNFTModalData?.nftPrice
                        : State.database.chainId === 1
                        ? State.database?.price?.maticPrice *
                          100 *
                          State.database?.buyNFTModalData?.nftPrice
                        : 0
                    ) / 100}
                  </span>
                </div>
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
                <p>No Offers</p>
              </div>
            </div>
            <div className="w-full flex ">
              <div className="p-1 w-full">
                <button
                  onClick={() => {
                    // setStep("buyNow");
                    buyNft();
                  }}
                  className={`btn btn-brand w-full ${buying ? "loading" : ""} `}
                >
                  BUY NOW
                </button>
              </div>
              {/* <div className="p-1 w-1/2">
                <button
                  onClick={() => setStep("makeOffer")}
                  className="btn btn-primary btn-outline w-full"
                >
                  Make AN offer
                </button>
              </div> */}
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
