import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  AlertTriangle,
  Award,
  CheckupList,
  Share,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../../Store";

import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import useLoadNfts from "../../../Hooks/useLoadNfts";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import {
  listNFTOnSolana2,
  signTransactionWithWallet,
  signTransactionWithWalletAndSend,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import { signTransaction } from "../../../Helper/mintOnSolana";
import ReactPlayer from "react-player";
import NftCard from "../NftCard";
import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { loadBalance } from "../../../Helper/getWalletBalance";
import BuySol from "../../Wallet/BuySol";

function ListNFTModal({
  text,
  contentType,
  listModalOpen,
  setListModalOpen,
  setNftPrice,
  content,
  tokenId,
  videoUrl,
}) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please enter the price & confirm to list the NFT for sale"
  );
  const [listing, setListing] = useState(false);
  const [loadFeed, loadUser, loadProfileCard, loadNftsData] = useUserActions();
  const [loadNfts] = useLoadNfts();
  const [price, setPrice] = useState(0);
  const [balance, setbalance] = useState(0);

  const clearData = () => {
    setListing(false);
    setSuccessMessage(
      "Please enter the price & confirm to list the NFT for sale"
    );
  };

  const handleListing = async (e) => {
    e.preventDefault();
    if (price > 0) {
      setListing(true);
      setSuccessMessage("Please sign the transaction to list the NFT");

      listNFTOnSolana2(tokenId, price, State.database?.walletAddress)
        .then((response) => {
          console.log(response);
          signTransactionWithWalletAndSend(
            response.data.result.encoded_transaction,
            State.database.provider
          )
            .then((response) => {
              console.log(response);
              response.data.success
                ? State.toast("success", "NFT listed successfully")
                : State.toast(
                    "error",
                    "Error while listing your NFT,please try again!"
                  );

              response.data.success && setNftPrice(1);
              response.data.success && loadNftsData();
              response.data.success
                ? setListModalOpen(false)
                : setListing(false);
            })
            .catch((error) => {
              console.log(error);
              State.toast("error", "Signing transaction with wallet failed!");
              setListing(false);
            });
        })
        .catch((error) => {
          State.toast(
            "error",
            "Error while listing your NFT,please try again!"
          );
          setListing(false);
        });
    } else {
      setSuccessMessage("Price should be greater than 0 !");
      return;
    }
  };
  async function loadbalance() {
    const x = await loadBalance(State.database.walletAddress);

    setbalance(x);
  }
  useEffect(() => {
    loadbalance();
  }, []);

  return (
    <div
      className={`${
        listModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
          <div className="flex items-center justify-between p-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
              <CheckupList />
              List NFT for sale
            </h3>
            <X
              onClick={() => {
                setListModalOpen(false);
                clearData();
              }}
              className="cursor-pointer text-brand2"
            ></X>
          </div>
        </div>

        <div className="flex flex-col flex-wrap justify-center w-full p-4 space-y-4 text-white">
          {contentType === "video" && (
            <div className="object-cover w-full overflow-hidden rounded-lg aspect-video dark:bg-slate-900 bg-slate-300">
              <ReactPlayer
                className="w-full"
                width="100%"
                height={"100%"}
                playing={true}
                muted={true}
                volume={0.5}
                url={videoUrl}
                controls={true}
              />
            </div>
          )}

          {contentType === "post" && (
            <img src={content} className="object-cover w-full rounded-lg " />
          )}
          <div className="form-control">
            <label className="input-group">
              <input
                min={1}
                type="number"
                placeholder="1"
                className="w-24 input input-bordered input-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={true}
              />
              <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
                {State.database.chainId === 0 ? (
                  <div className="flex">
                    <SolanaToken></SolanaToken> &nbsp; SOL
                  </div>
                ) : (
                  <>
                    <PolygonToken></PolygonToken> &nbsp; Matic
                  </>
                )}
              </span>
            </label>
          </div>
          <p>{successMessage}</p>
          {balance > 0.01 ? (
            <button
              onClick={handleListing}
              className={`btn  
                    btn-brand
                  w-full ${listing ? "loading" : ""} `}
            >
              {listing ? "Listing NFT for sale" : "confirm"}
            </button>
          ) : (
            <div className="font-bold text-white shadow-lg alert alert-error">
              <div>
                <AlertTriangle />
                <span>Oops! Low wallet balance to pay gas fee</span>
                <BuySol text={"Buy SOL"} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListNFTModal;
