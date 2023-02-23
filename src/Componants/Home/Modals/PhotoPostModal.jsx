import axios from "axios";
import React, { useRef } from "react";
import { useState, useContext } from "react";
import Compressor from "compressorjs";

import { Camera, File, FileCheck, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { storeWithProgress2, uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";
import { UserContext } from "../../../Store";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import { createPandoraExpressSDK } from "pandora-express";
import Web3 from "web3";
import { useEffect } from "react";
import useLoadNfts from "../../../Hooks/useLoadNfts";
import {
  mintNFTOnSolana,
  signTransaction,
  partialSignWithWallet,
  listNFTOnSolana,
  confirmTransactionFromFrontend,
} from "../../../Helper/mintOnSolana";
import {
  mintNFTOnSolana2,
  signTransaction2,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import Main_logo_dark from "../../../Assets/logos/Main_logo_dark";
import Main_logo from "../../../Assets/logos/Main_logo";
import { sanitizeFilename } from "../../../functions/sanitizeFilename";
import { Walkthrough } from "../../Walkthrough/Walkthrough";

function PhotoPostModal({ setphotoPostModalOpen }) {
  const State = useContext(UserContext);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  const [loadFeed] = useUserActions();
  const [tokenAddress, setTokenAddress] = useState("");
  const [showListingOption, setShowListingOption] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [solanaMintId, setSolanaMintId] = useState(null);
  const [mintSuccess, setMintSuccess] = useState("");

  const [btnText, setbtnText] = useState("Flick Photo");
  const [step, setstep] = useState(0);
  const [showWalkthrough, setshowWalkthrough] = useState(
    State.database.userData?.data.user.seenIntro?.photoWalkthrough
      ? false
      : true
  );

  const [loadNfts] = useLoadNfts();

  //walkthrough data
  const walkthroughData = [
    {
      heading: "Choose a Unique Photo🖼️",
      text: "Transform this captivating photo into a one-of-a-kind NFT, making it a truly unique and valuable digital masterpiece!",
      id: "walkthroughStep1",
    },
    {
      heading: "Add an Interesting Caption💬",
      text: "Share your unique story with the world and create a timeless masterpiece that will last a lifetime and beyond.",
      id: "walkthroughStep2",
    },
    {
      heading: "Make this an NFT🃏",
      text: "Turn a Moment into a Masterpiece: Create an NFT of Your Favorite Photo",
      id: "walkthroughStep3",
    },
  ];
  //Instance of pandora
  const ExpressSDK = createPandoraExpressSDK();

  const mentionsRef = useRef();

  useEffect(() => {
    mentionsRef.current.style.overflow = "scroll";
  }, []);

  // Minting
  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const web3 = new Web3(State.database.provider);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const handleImageChange = (event) => {
    // Update the state

    const file = sanitizeFilename(event.target.files[0]);

    setSelectedPost({
      file: [file],
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleAdd = (e) => {
    tagged.push(e);
    console.log(tagged);
  };

  const [tagged, setTagged] = useState([]);

  // console.log(window?.ethereum);
  // console.log(State.database?.provider);

  const nftMinted = (formData, mintId) => {
    setSolanaMintId(mintId);
    setShowListingOption(true);
    setUploadingPost(false);
    setMintSuccess("NFT Minted Successfully");
    uploadToServer(formData, mintId);
  };

  const mintOnSolana = async (formData, file, cid) => {
    console.log("stored files with cid:", cid);
    let url = "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name;
    let image = selectedPost.file[0];
    await mintNFTOnSolana(
      State.database.walletAddress,
      caption,
      caption,
      url,
      image
    )
      .then(async (data) => {
        console.log(data);
        console.log("MintID", data.data.result.mint);
        setTokenAddress(data.data.result.mint);
        partialSignWithWallet(
          data.data.result.encoded_transaction,
          State.database?.provider
        ).then(() => {
          nftMinted(formData, data.data.result.mint);
          confirmTransactionFromFrontend(data.data.result.encoded_transaction);
        });

        await signTransaction(
          data.data.result.encoded_transaction,
          `${process.env.REACT_APP_SIGNER_PRIVATE_KEY}`
        )
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Error minting NFT. Please try again!");
        clearData();
      });
  };

  const mintOnPolygon = (formData, file) => {
    uploadFile(file)
      .then(async (cid) => {
        let itemUri = "https://ipfs.io/ipfs/" + cid + "/meta.json";
        console.log("web3", web3);
        //Get ChainID of current account
        const chainId = await web3.eth.net.getId();
        //Mint NFT using SDK erc721 nft mint
        await ExpressSDK.erc1155.nft
          .mint(
            web3, // web3 instance of provider
            chainId, // network id of blockchain
            State.database?.walletAddress, // wallet address of minter
            1, // amount of token to create

            itemUri, // tokenuri string
            [[State.database?.walletAddress, 10]] // royalties
          )
          .then(async (data) => {
            console.log(data);
            const tokenId = data.events.TransferSingle.returnValues.id;
            console.log(tokenId);
            setTokenId(tokenId);
            setShowListingOption(true);
            setUploadingPost(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        clearData();
      });
  };

  const handleNFTListing = async (e) => {
    e.preventDefault();
    const chainId = await web3.eth.net.getId();
    await ExpressSDK.erc1155.order
      .sellNFT(
        web3, // Web3 instance configured with metamask provider
        chainId, // Network id of blockchain
        tokenId, // Token Id of NFT
        nftPrice, // Selling Price of NFT
        State.database?.walletAddress, // Address of current owner
        1 // Amount of token to sell
      )
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    if (!uploadingPost) {
      let filter = [];
      tagged.forEach((value) => {
        if (caption.includes(value)) {
          filter.push(value);
        }
      });
      setUploadingPost(true);
      setbtnText("Uploading file");

      uploadFile(selectedPost.file)
        .then(async (cid) => {
          let formData = new FormData();
          formData.append("announcement", caption);
          formData.append("postImage", sanitizeFilename(selectedPost.file[0]));
          formData.append("announcementHash", cid);
          formData.append("tagged", filter);
          console.log(filter);
          if (isNFT) {
            setbtnText("Minting Photo NFT");
            console.log("Minting...");
            // Display the key/value pairs
            for (var pair of formData.entries()) {
              console.log(pair[0] + ", " + pair[1]);
            }

            var ts = Math.round(new Date().getTime() / 1000);
            let metadata = {
              image: "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0],
              external_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0],
              description: `Post description`,
              name: caption,
              attributes: [
                {
                  display_type: "date",
                  trait_type: "Created On",
                  value: ts,
                },
                {
                  trait_type: "Category",
                  value: "Category",
                },
              ],
              animation_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
            };

            function convertBlobToFile(blob, fileName) {
              blob.lastModifiedDate = new Date();
              blob.name = fileName.replace(/[^a-zA-Z0-9]/g, "_");
              return blob;
            }

            const blob = new Blob([JSON.stringify(metadata)], {
              type: "application/json",
            });
            var file = convertBlobToFile(blob, "meta.json");
            console.log(file);

            if (State.database.chainId === 1) {
              console.log("Polygon...");
              mintOnPolygon(formData, file);
            } else if (State.database.chainId === 0) {
              console.log("Solana...");
              // mintOnSolana(formData, file, cid);
              let url =
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name;
              let image = selectedPost.file[0];
              console.log("Compressed Image", image);
              new Compressor(image, {
                quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
                success: (compressedResult) => {
                  // compressedResult has the compressed file.
                  // Use the compressed file to upload the images to your server.
                  image = compressedResult;
                  console.log("Compressed Image", image);
                },
              });
              mintNFTOnSolana2(
                State.database.walletAddress,
                caption,
                caption,
                url,
                image
              )
                .then((mintRequest) => {
                  console.log(mintRequest);
                  signTransactionWithWallet(
                    mintRequest.data.result.encoded_transaction,
                    State.database.provider
                  )
                    .then((signedTx) => {
                      signWithRelayer(signedTx)
                        .then((response) => {
                          State.toast("success", "NFT Minted successfully");
                          setbtnText("NFT Minted");
                          uploadToServer(
                            formData,
                            mintRequest.data?.result.mint
                          );
                        })
                        .catch((error) => State.toast("error", error.message));
                    })
                    .catch((error) => State.toast("error", error.message));
                })
                .catch((error) => State.toast("error", error.message));
            }
          } else {
            uploadToServer(formData, null);
          }
        })
        .catch((err) => {
          State.toast("error", "Oops!something went wrong uploading photo!");
          console.log(err);
          setUploadingPost(false);
          setSelectedPost(null);
          setCaption("");
        });
    }
  };

  const listNFTForSale = async (e) => {
    e.preventDefault();
    setUploadingPost(true);
    listNFTOnSolana(solanaMintId, nftPrice, State.database?.walletAddress)
      .then(async (data) => {
        console.log(data);
        await signTransaction(
          data.data.result.encoded_transaction,
          `${process.env.REACT_APP_FEEPAYER_PRIVATEKEY}`
        )
          .then(async (res) => {
            partialSignWithWallet(res, State.database?.provider).then(
              async () => {
                setMintSuccess("NFT Listed Successfully");
                setUploadingPost(false);
                await loadNfts();
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
  };

  const uploadToServer = (formData, mintId) => {
    formData.append("tokenId", mintId);
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", "Your Photo uploaded successfully!");
        setbtnText("Uploading Photo");
        await loadFeed();
        clearData();
      })
      .catch((err) => {
        State.toast("error", "Oops!something went wrong uploading photo!");
        console.log(err);
        clearData();
      });
  };

  const clearData = (e) => {
    setUploadingPost(false);
    setbtnText("Flick Photo");
    setSelectedPost(null);
    setCaption("");
    setTagged([]);
    setphotoPostModalOpen(false);
    setShowListingOption(false);
    setMintSuccess("");
  };

  return (
    <>
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Camera />
              Upload Photo
            </h3>
            <X
              onClick={() => clearData()}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <form>
          <div className=" w-full p-4 space-y-3">
            <label
              id="walkthroughStep1"
              htmlFor="post_announcement_image"
              className="relative cursor-pointer flex flex-col justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
            >
              {uploadingPost && (
                <div className="text-white gap-2 font-semibold absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center">
                  <Main_logo /> {btnText}
                </div>
              )}
              <input
                id="post_announcement_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
                required={true}
                onClick={(event) => {
                  event.target.value = null;
                  setSelectedPost(null);
                }}
              />
              {selectedPost ? (
                selectedPost.file ? (
                  <div className="w-72 flex items-center justify-center rounded-lg aspect-square  dark:bg-slate-900 bg-slate-300 overflow-clip">
                    <img src={selectedPost.localurl}></img>
                  </div>
                ) : null
              ) : (
                <></>
              )}{" "}
              {selectedPost ? (
                selectedPost.file ? (
                  <div className="flex items-center">
                    <FileCheck className="text-emerald-700" />
                    {selectedPost.file[0].name.substring(0, 16)}
                  </div>
                ) : (
                  "No file choosen!"
                )
              ) : (
                <div className="w-full flex items-center gap-1">
                  <File />
                  Choose file *
                </div>
              )}
            </label>
            {/* <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea> */}
            <MentionsInput
              id="walkthroughStep2"
              multiline
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={defaultStyle}
              className="textarea w-full h-24  pt-2 focus:outline-0 overflow-scroll mentionsinputoverflow"
              placeholder={"Enter caption."}
              a11ySuggestionsListLabel={"Suggested mentions"}
              inputRef={mentionsRef}
            >
              <Mention
                trigger="@"
                data={renderData}
                markup="@__display__"
                appendSpaceOnAdd
                onAdd={handleAdd}
              />
            </MentionsInput>
            {showListingOption ? (
              <div className="w-fit flex space-x-2 text-green-500">
                {mintSuccess}
              </div>
            ) : (
              <></>
            )}
            {mintSuccess == "" || mintSuccess == "NFT Minted Successfully" ? (
              <div className="w-fit flex space-x-2">
                {showListingOption ? (
                  <div className="flex items-center">
                    <span className="label-text text-brand3">List NFT</span>
                  </div>
                ) : (
                  <label
                    id="walkthroughStep3"
                    className="flex items-center cursor-pointer gap-2"
                  >
                    <input
                      type="checkbox"
                      value={isNFT}
                      onChange={() => setIsNFT(!isNFT)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text text-brand3">Mint as NFT</span>
                  </label>
                )}
                {showListingOption && (
                  <div className="form-control">
                    <label className="input-group">
                      <input
                        min={1}
                        type="number"
                        placeholder="1"
                        className="input input-bordered input-sm w-24"
                        value={nftPrice}
                        onChange={(e) => setNFTPrice(e.target.value)}
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
                )}
              </div>
            ) : null}
            {mintSuccess == "NFT Minted Successfully" ? (
              <div className="w-full flex justify-around space-x-1">
                <button
                  onClick={
                    State.database?.chainId == 1
                      ? handleNFTListing
                      : listNFTForSale
                  }
                  className={`btn  ${
                    !selectedPost?.file[0] ? "btn-disabled" : "btn-brand"
                  } w-1/2 ${uploadingPost ? "loading " : ""}`}
                >
                  List NFT
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    clearData();
                  }}
                  className={`btn  ${
                    !selectedPost?.file[0] ? "btn-disabled" : "btn-brand"
                  } w-1/2`}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {!mintSuccess == "" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearData();
                    }}
                    className={`btn  ${
                      !selectedPost?.file[0]
                        ? "btn-disabled"
                        : "btn-outline btn-error"
                    } w-full `}
                  >
                    Close
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className={`btn  ${
                      selectedPost?.file[0] && caption !== ""
                        ? "btn-brand"
                        : "btn-disabled"
                    } w-full capitalize ${uploadingPost ? "loading " : ""}`}
                  >
                    {btnText}
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
      {showWalkthrough && (
        <Walkthrough
          data={walkthroughData}
          type={"photoWalkthrough"}
          func={() => setshowWalkthrough(false)}
          show={showWalkthrough}
        />
      )}
    </>
  );
}

export default PhotoPostModal;
