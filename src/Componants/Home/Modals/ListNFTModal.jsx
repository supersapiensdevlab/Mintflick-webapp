import React, { useContext } from "react";
import { useState } from "react";
import { Award, CheckupList, Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import {
  mintNFTOnSolana,
  signTransaction,
  partialSignWithWallet,
} from "../../../Helper/mintOnSolana";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";

function ListNFTModal({ listModalOpen, setListModalOpen }) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please confirm to mint this post as an NFT"
  );
  const [minting, setMinting] = useState(false);
  const [loadFeed, loadUser] = useUserActions();

  //   const uploadToServer = (mintId) => {
  //     let data = {
  //       tokenId: mintId,
  //       contentId: id,
  //     };
  //     axios
  //       .post(`${process.env.REACT_APP_SERVER_URL}/user/add_tokenid`, data, {
  //         headers: {
  //           "content-type": "application/json",
  //           "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
  //         },
  //       })
  //       .then(async (res) => {
  //         State.toast("success", "Your Photo uploded successfully!");
  //         await loadFeed();
  //         await loadUser();
  //       })
  //       .catch((err) => {
  //         State.toast("error", "Oops!somthing went wrong uplaoding photo!");
  //         console.log(err);
  //         clearData();
  //       });
  //   };

  //   const nftMinted = (mintId) => {
  //     uploadToServer(mintId);
  //     setMinting(false);
  //     setSuccessMessage("NFT minted successfully!");
  //   };

  //   const clearData = () => {
  //     setMinting(false);
  //     setSuccessMessage("Please confirm to mint this post as an NFT");
  //   };

  //   const handleMinting = async () => {
  //     setMinting(true);

  //     const response = await fetch(content);
  //     // here image is url/location of image
  //     const blob = await response.blob();
  //     const file = new File([blob], "image.jpg", { type: blob.type });
  //     console.log(file);
  //     await mintNFTOnSolana(
  //       State.database.walletAddress,
  //       name,
  //       name,
  //       content,
  //       file
  //     )
  //       .then(async (data) => {
  //         console.log("MintID", data.data.result.mint);
  //         await signTransaction(
  //           data.data.result.encoded_transaction,
  //           `${process.env.REACT_APP_FEEPAYER_PRIVATEKEY}`
  //         )
  //           .then((res) => {
  //             console.log(res);
  //             partialSignWithWallet(res, State.database?.provider).then(() => {
  //               nftMinted(data.data.result.mint);
  //             });
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         State.toast("error", "Error minting NFT. Please try again!");
  //         clearData();
  //       });
  //   };
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
                // clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="flex flex-wrap p-4 w-full space-y-4 justify-center text-white">
          <p className="py-5">Comming Soon !</p>
        </div>
      </div>
    </div>
  );
}

export default ListNFTModal;
