import React, { useContext } from "react";
import { useState } from "react";
import { Award, Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import {
  mintNFTOnSolana,
  signTransaction,
  partialSignWithWallet,
} from "../../../Helper/mintOnSolana";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";
import {
  mintNFTOnSolana2,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";

function MintNFTModal({
  mintModalOpen,
  setMintModalOpen,
  content,
  videoImage,
  name,
  id,
  contentType,
}) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please confirm to mint this post as an NFT"
  );
  const [minting, setMinting] = useState(false);
  const [loadFeed, loadUser] = useUserActions();

  const uploadToServer = (mintId) => {
    let data = {
      tokenId: mintId,
      contentId: id,
      contentType: contentType,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/add_tokenid`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", "Your Photo uploded successfully!");
        await loadFeed();
        await loadUser();
      })
      .catch((err) => {
        State.toast("error", "Oops!somthing went wrong uplaoding photo!");
        console.log(err);
        clearData();
      });
  };

  const nftMinted = (mintId) => {
    uploadToServer(mintId);
    setMinting(false);
    setSuccessMessage("NFT minted successfully!");
  };

  const clearData = () => {
    setMinting(false);
    setSuccessMessage("Please confirm to mint this post as an NFT");
  };

  const handleMinting = async () => {
    setMinting(true);

    const response = await fetch(content);
    // here image is url/location of image
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    console.log(file);

    const mintRequest = await mintNFTOnSolana2(
      State.database.walletAddress,
      name,
      name,
      videoImage ? videoImage : content,
      file
    );

    const signedTx = await signTransactionWithWallet(
      mintRequest.data.result.encoded_transaction,
      State.database.provider
    );

    const finalTx = await signWithRelayer(signedTx).catch((error) =>
      State.toast("error", error)
    );
    console.log(finalTx);
    finalTx.success === true
      ? State.toast("success", "NFT Minted successfully")
      : State.toast("error", finalTx.message);
    console.log(mintRequest);
    setMintModalOpen(false);
    loadFeed();
  };
  return (
    <div
      className={`${
        mintModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Award />
              Mint as NFT
            </h3>
            <X
              onClick={() => {
                setMintModalOpen(false);
                clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="flex flex-wrap p-4 w-full space-y-4 justify-center text-white">
          {(videoImage || content) && (
            <img
              src={videoImage ? videoImage : content}
              className="h-96 w-full object-cover rounded-lg"
            />
          )}
          <p>{successMessage}</p>
          <button
            onClick={handleMinting}
            className={`btn  
                    btn-brand
                  w-full ${minting ? "loading" : ""} `}
          >
            confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default MintNFTModal;
