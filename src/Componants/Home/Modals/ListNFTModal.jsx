import React, { useContext } from "react";
import { useState } from "react";
import { Award, CheckupList, Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";

import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import useLoadNfts from "../../../Hooks/useLoadNfts";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import {
  listNFTOnSolana2,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import { signTransaction } from "../../../Helper/mintOnSolana";
import ReactPlayer from "react-player";
import NftCard from "../NftCard";

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

          signTransactionWithWallet(
            response.data.result.encoded_transaction,
            State.database.provider
          )
            .then((signedTx) => {
              console.log(signedTx);
              signWithRelayer(signedTx)
                .then((response) => {
                  State.toast("success", "NFT listed successfully");

                  response.success && setNftPrice(1);
                  loadNftsData();
                  setListModalOpen(false);
                })
                .catch((error) => State.toast("error", error.message));
            })
            .catch((error) => State.toast("error", error.message));
        })
        .catch((error) => State.toast("error", error.message));
    } else {
      setSuccessMessage("Price should be greater than 0 !");
      return;
    }
  };
  return (
    <div
      className={`${
        listModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <CheckupList />
              List NFT for sale
            </h3>
            <X
              onClick={() => {
                setListModalOpen(false);
                clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="flex flex-col flex-wrap p-4 w-full space-y-4 justify-center text-white">
          {contentType === "video" && (
            <div className="w-full rounded-lg    overflow-hidden aspect-video  dark:bg-slate-900 bg-slate-300 object-cover">
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
            <img src={content} className="  w-full object-cover rounded-lg" />
          )}
          <div className="form-control">
            <label className="input-group">
              <input
                min={1}
                type="number"
                placeholder="1"
                className="input input-bordered input-sm w-24"
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
          <button
            onClick={handleListing}
            className={`btn  
                    btn-brand
                  w-full ${listing ? "loading" : ""} `}
          >
            {listing ? "Listing NFT for sale" : "confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListNFTModal;
