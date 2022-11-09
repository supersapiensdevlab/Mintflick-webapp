import React, { useContext } from "react";
import { useState } from "react";
import { Award, CheckupList, Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import {
  signTransaction,
  partialSignWithWallet,
  listNFTOnSolana,
} from "../../../Helper/mintOnSolana";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import useLoadNfts from "../../../Hooks/useLoadNfts";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import PolygonToken from "../../../Assets/logos/PolygonToken";

function ListNFTModal({ listModalOpen, setListModalOpen, content, tokenId }) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please enter the price & confirm to list the NFT for sale"
  );
  const [listing, setListing] = useState(false);
  const [loadFeed, loadUser] = useUserActions();
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

      listNFTOnSolana(tokenId, price, State.database?.walletAddress)
        .then(async (data) => {
          console.log(data);
          await signTransaction(
            data.data.result.encoded_transaction,
            `${process.env.REACT_APP_FEEPAYER_PRIVATEKEY}`
          )
            .then(async (res) => {
              partialSignWithWallet(res, State.database?.provider).then(
                async () => {
                  setListing(false);
                  setSuccessMessage("NFT listed successfully !");
                  await loadNfts();
                  await loadFeed();
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          State.toast("error", "Error listing NFT. Please try again!");
        });
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
          <img src={content} className="h-96 w-full object-cover rounded-lg" />
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
                  <>
                    <SolanaToken></SolanaToken>&nbsp; SOL
                  </>
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
            confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListNFTModal;
