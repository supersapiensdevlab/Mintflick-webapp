import axios from "axios";
import React from "react";
import { useState, useContext } from "react";
import { Camera, File, FileCheck, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";
import { UserContext } from "../../../Store";
import { SolanaWallet } from "@web3auth/solana-provider";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  clusterUrl,
  confirmTransactionFromFrontend,
} from "../Utility/utilityFunc";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import { createPandoraExpressSDK } from "pandora-express";
import Web3 from "web3";
import { useEffect } from "react";

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
  //Instance of pandora
  const ExpressSDK = createPandoraExpressSDK();

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
    setSelectedPost({
      file: event.target.files,
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

  const nftMinted = (mintId) => {
    setSolanaMintId(mintId);
    setShowListingOption(true);
    setUploadingPost(false);
  };

  const mintOnSolana = (formData) => {
    uploadFile(selectedPost.file[0]).then(async (cid) => {
      console.log("stored files with cid:", cid);
      console.log(State.database);
      let nftSolanaData = {
        network: "devnet",
        wallet: State.database.walletAddress,
        name: caption,
        symbol: "FLICK",
        attributes: JSON.stringify([{ trait_type: "Power", value: "100" }]),
        description: caption,
        external_url:
          "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
        max_supply: 1,
        royalty: 5,
        file: selectedPost.file[0],
      };

      console.log(nftSolanaData);
      axios
        .post(`https://api.shyft.to/sol/v1/nft/create_detach`, nftSolanaData, {
          headers: {
            "x-api-key": "6ENAkcg4YJcHhlYf",
            "content-type": "multipart/form-data",
          },
        })
        .then(async (data) => {
          console.log("MintID", data.data.result.mint);
          setTokenAddress(data.data.result.mint);
          await signTransaction(
            "devnet",
            data.data.result.encoded_transaction,
            nftMinted(data.data.result.mint)
          );
          uploadToServer(formData, data.data.result.mint);
        })
        .catch((err) => {
          console.log(err);
          clearData();
        });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadingPost) {
      let filter = [];
      tagged.forEach((value) => {
        if (caption.includes(value)) {
          filter.push(value);
        }
      });
      setUploadingPost(true);
      uploadFile(selectedPost.file)
        .then(async (cid) => {
          let formData = new FormData();
          formData.append("announcement", caption);
          formData.append("postImage", selectedPost.file[0]);
          formData.append("announcementHash", cid);
          formData.append("tagged", filter);
          console.log(filter);
          if (isNFT) {
            var ts = Math.round(new Date().getTime() / 1000);
            let metadata = {
              image:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
              external_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
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
              blob.name = fileName;
              return blob;
            }

            const blob = new Blob([JSON.stringify(metadata)], {
              type: "application/json",
            });
            var file = convertBlobToFile(blob, "meta.json");
            console.log(file);

            //  uploadFile(selectedPost.file[0]).then(async (cid) => {
            //     console.log("stored files with cid:", cid);
            //     console.log(State.database);
            //     let nftSolanaData = {
            //       network: "devnet",
            //       wallet: State.database.walletAddress,
            //       name: caption,
            //       symbol: "FLICK",
            //       attributes: JSON.stringify([
            //         { trait_type: "Power", value: "100" },
            //       ]),
            //       description: caption,
            //       external_url:
            //         "https://ipfs.io/ipfs/" +
            //         cid +
            //         "/" +
            //         selectedPost.file[0].name,
            //       max_supply: 1,
            //       royalty: 5,
            //       file: selectedPost.file[0],
            //     };

            //     console.log(nftSolanaData);
            //     axios
            //       .post(
            //         `https://api.shyft.to/sol/v1/nft/create_detach`,
            //         nftSolanaData,
            //         {
            //           headers: {
            //             "x-api-key": "6ENAkcg4YJcHhlYf",
            //             "content-type": "multipart/form-data",
            //           },
            //         },
            //       )
            //       .then(async (data) => {
            //         // setUploadingPost(false);
            //         // setSelectedPost(null);
            //         // setCaption("");
            //         // setTagged([]);
            //         // setphotoPostModalOpen(false);
            //         // await loadFeed();
            //         console.log("MintID", data.data.result.mint);
            //         setTokenAddress(data.data.result.mint);
            //         await signTransaction(
            //           "devnet",
            //           data.data.result.encoded_transaction,
            //           listNFTForSale(data.data.result.mint, nftPrice, formData),
            //         );
            //       })
            //       .catch((err) => {
            //         console.log(err);
            //         clearData();
            //       });
            //   });
            if (State.database.chainId == 1) {
              mintOnPolygon(formData, file);
            } else if (State.database.chainId == 0) {
              mintOnSolana(formData, file);
            }
          } else {
            uploadToServer(formData, null);
          }
        })
        .catch((err) => {
          State.toast("error", "Oops!somthing went wrong uplaoding photo!");
          console.log(err);
          setUploadingPost(false);
          setSelectedPost(null);
          setCaption("");
        });
    }
  };

  const listNFTForSale = async (e) => {
    e.preventDefault();
    var raw = JSON.stringify({
      network: "devnet",
      marketplace_address: process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS,
      nft_address: solanaMintId,
      price: parseInt(nftPrice),
      seller_wallet: State.database.walletAddress,
    });

    console.log(raw);
    axios
      .post(`https://api.shyft.to/sol/v1/marketplace/list`, raw, {
        headers: {
          "x-api-key": "6ENAkcg4YJcHhlYf",
          "content-type": "application/json",
        },
      })
      .then(async (data) => {
        console.log(data.data);
        await signTransaction("devnet", data.data.result.encoded_transaction);
      })
      .catch((err) => {
        console.log(err);
        clearData();
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
        State.toast("success", "Your Photo uploded successfully!");
        await loadFeed();
      })
      .catch((err) => {
        State.toast("error", "Oops!somthing went wrong uplaoding photo!");
        console.log(err);
        clearData();
      });
  };

  const clearData = () => {
    setUploadingPost(false);
    setSelectedPost(null);
    setCaption("");
    setTagged([]);
    setphotoPostModalOpen(false);
    setShowListingOption(false);
  };

  console.log(isNFT);

  function Log() {
    console.log("NFT Minted");
  }

  async function signTransaction(network, transaction, callback) {
    //const phantom = new PhantomWalletAdapter();
    //await phantom.connect();
    const solanaWallet = new SolanaWallet(State.database.provider); // web3auth.provider

    const rpcUrl = clusterUrl(network);
    console.log(rpcUrl);
    const connection = new Connection(rpcUrl, "confirmed");
    //console.log(connection.rpcEndpoint);
    const ret = await confirmTransactionFromFrontend(
      connection,
      transaction,
      solanaWallet
    );
    // const checks = await connection.confirmTransaction({signature:ret},'finalised');

    // console.log(checks);
    // await connection.confirmTransaction({
    //     blockhash: transaction.blockhash,
    //     signature: ret,
    //   });
    connection.onSignature(ret, callback, "finalized");
    return ret;
  }

  return (
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
        <div className="w-full p-4 space-y-3">
          <label
            htmlFor="post_announcement_image"
            className=" cursor-pointer flex justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
          >
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
              <div className="flex items-center gap-1">
                <File />
                Choose file *
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
                <div className="flex-grow rounded-lg overflow-clip">
                  <img src={selectedPost.localurl}></img>
                </div>
              ) : null
            ) : (
              <></>
            )}
          </label>

          {/* <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea> */}
          <MentionsInput
            multiline
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={defaultStyle}
            className="textarea w-full h-24  pt-2 focus:outline-0"
            placeholder={"Enter caption."}
            a11ySuggestionsListLabel={"Suggested mentions"}
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
              NFT Minted Successfully
            </div>
          ) : (
            <></>
          )}
          <div className="w-fit flex space-x-2">
            {showListingOption ? (
              <div className="flex items-center">
                <span className="label-text text-brand3">List NFT</span>
              </div>
            ) : (
              <label className="flex items-center cursor-pointer gap-2">
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
          <progress
            class="progress progress-success w-56 hidden"
            value="50"
            max="100"
          ></progress>
          {showListingOption ? (
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
                onClick={() => {
                  clearData();
                }}
                className={`btn  ${
                  !selectedPost?.file[0] ? "btn-disabled" : "btn-brand"
                } w-1/2 ${uploadingPost ? "loading " : ""}`}
              >
                Close
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className={`btn  ${
                !selectedPost?.file[0] ? "btn-disabled" : "btn-brand"
              } w-full ${uploadingPost ? "loading " : ""}`}
            >
              Post photo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PhotoPostModal;
