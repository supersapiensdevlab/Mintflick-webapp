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
  signTransactionKeyWallet,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import { toPng } from "html-to-image";
import { uploadFile } from "../../../Helper/uploadHelper";
import { upload } from "@testing-library/user-event/dist/upload";
import ReactPlayer from "react-player";
import NftCard from "../NftCard";
import NftLimit from "../NftLimit";

function MintNFTModal({
  mintModalOpen,
  setMintModalOpen,
  setTokenId,
  setOwner,
  content,
  videoImage,
  description,
  name,
  id,
  contentType,
  videoName,
}) {
  const State = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState(
    "Please confirm to mint this post as an NFT"
  );
  const [nftLimit, setNftLimit] = useState(0);

  const [minting, setMinting] = useState(false);
  const [loadFeed, loadUser] = useUserActions();
  // console.log(content);
  const uploadToServer = (mintId) => {
    let data = {
      tokenId: mintId,
      contentId: id,
      contentType: contentType, //`post` or `video`
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/add_tokenid`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", "Nft Minted successfully!");
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
    // setSuccessMessage("NFT minted successfully!");
  };

  const clearData = () => {
    setMinting(false);
    setSuccessMessage("Please confirm to mint this post as an NFT");
  };

  const postsNft = async (content) => {
    const response = await fetch(content);
    const blob = await response.blob();
    const file = new File([blob], videoImage ? "video.mp4" : "image.jpg", {
      type: blob.type,
    });
    await mintNFTOnSolana2(
      State.database.walletAddress,
      name,
      description,
      content,
      file,
      [
        {
          trait_type: "Creator",
          value: State.database.userData?.data?.user?.username,
        },
      ]
    )
      .then((mintRequest) => {
        console.log(mintRequest);
        signTransactionKeyWallet(
          mintRequest.data.result.encoded_transaction,
          process.env.REACT_APP_FEEPAYER_PRIVATEKEY,
          State.database.provider
        )
          .then((response) => {
            State.toast("success", "NFT Minted successfully");

            nftMinted(mintRequest.data.result.mint);
            setTokenId(mintRequest.data.result.mint);
            setOwner(State.database.walletAddress);
            setMintModalOpen(false);
            loadFeed();
          })
          .catch((error) => {
            console.log(error);
            State.toast(
              "error",
              "Error while signing transaction,please try again!"
            );
            setMinting(false);
          });
        // signTransactionWithWallet(
        //   mintRequest.data.result.encoded_transaction,
        //   State.database.provider
        // )
        //   .then((signedTx) => {
        //     signWithRelayer(signedTx)
        //       .then((finalTx) => {
        //         finalTx.success
        //           ? State.toast("success", "NFT Minted successfully")
        //           : State.toast(
        //               "error",
        //               "Error while minting your NFT,please try again!"
        //             );
        //         finalTx.success && nftMinted(mintRequest.data.result.mint);
        //         finalTx.success && setTokenId(mintRequest.data.result.mint);
        //         finalTx.success && setOwner(State.database.walletAddress);
        //         finalTx.success ? setMintModalOpen(false) : setMinting(false);
        //         finalTx.success && loadFeed();
        //       })
        //       .catch((error) => {
        //         State.toast("error", "Gas Station Signing transaction failed!");
        //         setMinting(false);
        //       });
        //   })
        //   .catch((error) => {
        //     State.toast("error", "Signing transaction with wallet failed!");
        //     setMinting(false);
        //   });
      })
      .catch((error) => {
        State.toast("error", "Error while minting your NFT,please try again!");
        setMinting(false);
      });

    // const signedTx =
    //   mintRequest &&
    //   (await signTransactionWithWallet(
    //     mintRequest.data.result.encoded_transaction,
    //     State.database.provider
    //   ));

    // const finalTx =
    //   signedTx &&
    //   (await signWithRelayer(signedTx).catch((error) =>
    //     State.toast("error", error)
    //   ));
    // console.log(finalTx);
    // finalTx.success === true
    //   ? State.toast("success", "NFT Minted successfully")
    //   : State.toast("error", finalTx.message);
    // console.log(mintRequest);
    // finalTx.success && nftMinted(mintRequest.data.result.mint);
    // finalTx.success && setTokenId(mintRequest.data.result.mint);
    // finalTx.success && setOwner(State.database.walletAddress);
    // setMintModalOpen(false);
    // loadFeed();
  };

  const thoughtNft = () => {
    toPng(document.getElementById("my-nft"), { cacheBust: true })
      .then(async (dataUrl) => {
        console.log(dataUrl);
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "meta.png", {
          type: "image/jpeg",
          lastModified: new Date(),
        });
        uploadFile([file]).then(async (cid) => {
          let url = "https://nftstorage.link/ipfs/" + cid + "/" + "meta.png";
          const mintRequest = await mintNFTOnSolana2(
            State.database.walletAddress,
            "Mintflick Collection",
            name,
            url,
            file,
            [
              {
                trait_type: "Creator",
                value: State.database.userData?.data?.user?.username,
              },
            ]
          )
            .then((mintRequest) => {
              console.log(mintRequest);
              signTransactionKeyWallet(
                mintRequest.data.result.encoded_transaction,
                process.env.REACT_APP_FEEPAYER_PRIVATEKEY,
                State.database.provider
              )
                .then((response) => {
                  State.toast("success", "NFT Minted successfully");
                  nftMinted(mintRequest.data.result.mint);
                  setTokenId(mintRequest.data.result.mint);
                  setOwner(State.database.walletAddress);
                  setMintModalOpen(false);
                  loadFeed();
                })
                .catch((error) => {
                  console.log(error);
                  State.toast(
                    "error",
                    "Error while signing transaction,please try again!"
                  );
                  setMinting(false);
                });
              // signTransactionWithWallet(
              //   mintRequest.data.result.encoded_transaction,
              //   State.database.provider
              // )
              //   .then((signedTx) => {
              //     signWithRelayer(signedTx)
              //       .then((finalTx) => {
              //         State.toast("success", "NFT Minted successfully");
              //         finalTx.success &&
              //           nftMinted(mintRequest.data.result.mint);
              //         finalTx.success
              //           ? setTokenId(mintRequest.data.result.mint)
              //           : setMinting(false);
              //         finalTx.success && setOwner(State.database.walletAddress);
              //         finalTx.success && setMintModalOpen(false);
              //         finalTx.success && loadFeed();
              //       })
              //       .catch((error) => {
              //         State.toast(
              //           "error",
              //           "Gas Station Signing transaction failed!"
              //         );
              //         setMinting(false);
              //       });
              //   })
              //   .catch((error) => {
              //     State.toast(
              //       "error",
              //       "Signing transaction with wallet failed!"
              //     );
              //     setMinting(false);
              //   });
            })
            .catch((error) => {
              State.toast(
                "error",
                "Error while minting your NFT,please try again!"
              );
              setMinting(false);
            });

          // const signedTx =
          //   mintRequest &&
          //   (await signTransactionWithWallet(
          //     mintRequest.data.result.encoded_transaction,
          //     State.database.provider
          //   ));

          // const finalTx =
          //   signedTx &&
          //   (await signWithRelayer(signedTx).catch((error) =>
          //     State.toast("error", error)
          //   ));
          // console.log(finalTx);
          // finalTx.success === true
          //   ? State.toast("success", "NFT Minted successfully")
          //   : State.toast("error", finalTx.message);
          // console.log(mintRequest);
          // finalTx.success && nftMinted(mintRequest.data.result.mint);
          // finalTx.success && setTokenId(mintRequest.data.result.mint);
          // finalTx.success && setOwner(State.database.walletAddress);
          // setMintModalOpen(false);
          // loadFeed();
        });
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Error minting NFT. Please try again!");
      });
  };

  const handleMinting = async () => {
    setMinting(true);

    content ? postsNft(content) : thoughtNft();
  };
  return (
    <div
      className={`${
        mintModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
          <div className="flex items-center justify-between p-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
              <Award />
              Mint as NFT
            </h3>
            <X
              onClick={() => {
                setMintModalOpen(false);
                clearData();
              }}
              className="cursor-pointer text-brand2"
            ></X>
          </div>
        </div>

        <div className="flex flex-wrap justify-center w-full p-4 space-y-4 text-white">
          {!videoImage && content && (
            <img
              src={videoImage ? videoImage : content}
              className="object-cover w-full rounded-lg "
            />
          )}
          {videoImage && (
            <div className="object-cover w-full overflow-hidden rounded-lg aspect-video dark:bg-slate-900 bg-slate-300">
              <ReactPlayer
                className="w-full"
                width="100%"
                height={"100%"}
                playing={true}
                muted={true}
                volume={0.5}
                url={content}
                controls={true}
              />
            </div>
          )}
          {!videoImage && !content && (
            <div className="m-4 mx-auto w-fit">
              <NftCard
                id="my-nft"
                name={State.database.userData?.data?.user?.name}
                userName={State.database.userData?.data?.user?.username}
                text={description}
              />

              <span
                onClick={() =>
                  toPng(document.getElementById("my-nft"), {
                    quality: 2,
                  }).then(function (dataUrl) {
                    var link = document.createElement("a");
                    link.download = "my-thought-nft.png";
                    link.href = dataUrl;
                    link.click();
                  })
                }
                className="link link-primary"
              >
                Download as image
              </span>
            </div>
          )}
          <p>{successMessage}</p>
          {/* <span>
            {name},{description}
          </span> */}
          {
            <NftLimit
              username={State.database.userData?.data?.user?.username}
              setNftLimit={setNftLimit}
            />
          }
          <button
            onClick={handleMinting}
            className={`btn  
                     capitalize
                  w-full ${minting ? "loading" : ""} ${
              nftLimit < 5 ? "btn-brand" : "btn-disabled"
            }`}
          >
            {minting ? "" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MintNFTModal;
