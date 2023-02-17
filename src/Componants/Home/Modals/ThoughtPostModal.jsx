import axios from "axios";
import React from "react";
import { useState, useContext, useCallback } from "react";
import { Bulb, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import useUserActions from "../../../Hooks/useUserActions";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";
import { UserContext } from "../../../Store";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import { toPng } from "html-to-image";
import { useRef } from "react";
import { uploadFile } from "../../../Helper/uploadHelper";
import useLoadNfts from "../../../Hooks/useLoadNfts";
import { useEffect } from "react";
import "./MentionsInputCSS.css";
import {
  mintNFTOnSolana,
  signTransaction,
  partialSignWithWallet,
  listNFTOnSolana,
} from "../../../Helper/mintOnSolana";
import {
  mintNFTOnSolana2,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import NftCard from "../NftCard";
import { Walkthrough } from "../../Walkthrough/Walkthrough";

function ThoughtPostModal({ setthoughtPostModalOpen }) {
  const mentionsRef = useRef();
  const State = useContext(UserContext);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  const [loadFeed] = useUserActions();
  const [tagged, setTagged] = useState([]);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [solanaMintId, setSolanaMintId] = useState(null);
  const [listSuccess, setListSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [btnText, setbtnText] = useState("Flick Thought");

  const [showWalkthrough, setshowWalkthrough] = useState(true);
  //walkthrough data
  const walkthroughData = [
    {
      heading: "Let it out 📢",
      text: "Let the world know what you think!",
      id: "walkthroughThoughtStep1",
    },
    {
      heading: "Make this an NFT🃏",
      text: "Transform your thoughts into NFTs worthy of admiration and ownership.",
      id: "walkthroughThoughtStep2",
    },
  ];
  const textRef = useRef();
  const [loadNfts] = useLoadNfts();

  useEffect(() => {
    mentionsRef.current.style.overflow = "scroll";
  }, []);
  // async function signTransaction(network, transaction, callback) {
  //   //const phantom = new PhantomWalletAdapter();
  //   //await phantom.connect();
  //   const solanaWallet = new SolanaWallet(State.database.provider); // web3auth.provider

  //   const rpcUrl = clusterUrl(network);
  //   console.log(rpcUrl);
  //   const connection = new Connection(rpcUrl, "confirmed");
  //   //console.log(connection.rpcEndpoint);
  //   const ret = await confirmTransactionFromFrontend(
  //     connection,
  //     transaction,
  //     solanaWallet
  //   );
  //   // const checks = await connection.confirmTransaction({signature:ret},'finalised');

  //   // console.log(checks);
  //   // await connection.confirmTransaction({
  //   //     blockhash: transaction.blockhash,
  //   //     signature: ret,
  //   //   });
  //   connection.onSignature(ret, callback, "finalized");
  //   return ret;
  // }

  const handleThoughtNFTListing = (e) => {
    console.log("listed", nftPrice);
    e.preventDefault();
    setUploadingPost(true);
    // var raw = JSON.stringify({
    //   network: "devnet",
    //   marketplace_address: process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS,
    //   nft_address: solanaMintId,
    //   price: parseInt(nftPrice),
    //   seller_wallet: State.database.walletAddress,
    // });

    // console.log(raw);
    // axios
    //   .post(`https://api.shyft.to/sol/v1/marketplace/list`, raw, {
    //     headers: {
    //       "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
    //       "content-type": "application/json",
    //     },
    //   })
    listNFTOnSolana(solanaMintId, nftPrice, State.database?.walletAddress)
      .then(async (data) => {
        console.log(data.data);
        // await signTransaction(
        //   "devnet",
        //   data.data.result.encoded_transaction,
        //   async () => {
        //     setListSuccess(true);
        //     setSuccessMsg("NFT Listed Successfully");
        //     setUploadingPost(false);
        //     await loadFeed();
        //     await loadNfts();
        //   }
        // );
        await signTransaction(
          data.data.result.encoded_transaction,
          `${process.env.REACT_APP_FEEPAYER_PRIVATEKEY}`
        )
          .then(async (res) => {
            partialSignWithWallet(res, State.database?.provider).then(
              async () => {
                setListSuccess(true);
                setSuccessMsg("NFT Listed Successfully");
                setUploadingPost(false);
                await loadFeed();
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

  const nftMinted = (data, mintId) => {
    setSolanaMintId(mintId);
    data.tokenId = mintId;
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, data, {
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async () => {
        setMintSuccess(true);
        setSuccessMsg("NFT Minted Successfully");

        await loadFeed();
        // setUploadingPost(false);
        setthoughtPostModalOpen(false);

        clearData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const convertTextToImage = (myData) => {
    if (textRef.current === null) {
      return;
    }

    toPng(document.getElementById("my-nft"), { cacheBust: true })
      .then(async (dataUrl) => {
        console.log(dataUrl);
        console.log(caption);
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "meta.png", {
          type: "image/jpeg",
          lastModified: new Date(),
        });

        // const res = await fetch(dataUrl);
        // const buf = await res.arrayBuffer();
        // const file = new File([buf], "meta.png");
        console.log(file);
        setbtnText("Uploading Files");
        uploadFile([file])
          .then(async (cid) => {
            let name =
              State.database.userData?.data?.user?.name - caption.slice(0, 5);
            let url = "https://ipfs.io/ipfs/" + cid + "/" + "meta.png";

            const mintRequest = await mintNFTOnSolana2(
              State.database.walletAddress,
              "Mintflick Collection",
              caption,
              url,
              file
            );
            setbtnText("Minting NFT");
            const signedTx = await signTransactionWithWallet(
              mintRequest.data.result.encoded_transaction,
              State.database.provider
            );
            await signWithRelayer(signedTx)
              .then((response) => {
                response.success
                  ? State.toast("success", "NFT Minted successfully")
                  : State.toast("error", response.message);
              })
              .catch((error) => State.toast("error", error));
            console.log(mintRequest);
            mintRequest && setbtnText("NFT Minted");
            mintRequest && nftMinted(myData, mintRequest.data?.result.mint);
          })
          .catch((err) => {
            console.log(err);
            State.toast("error", "Error minting NFT. Please try again!");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Minting
  // const [minting, setMinting] = useState(null);
  // const [mintingProgress, setMintingProgress] = useState(0);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const handleAdd = (e) => {
    tagged.push(e);
    console.log(tagged);
  };

  //handle thought submit
  const handleThoughtPost = () => {
    setUploadingPost(true);
    let filter = [];
    tagged.forEach((value) => {
      if (caption.includes(value)) {
        filter.push(value);
      }
    });
    console.log(filter);
    const data = {
      announcement: caption,
      tagged: filter,
    };

    if (isNFT) {
      convertTextToImage(data);
    } else {
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, data, {
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
          },
        })
        .then(async () => {
          clearData();
          await loadFeed();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const clearData = () => {
    setthoughtPostModalOpen(false);
    setCaption("");
    setTagged([]);
    setMintSuccess(false);
    setUploadingPost(false);
    setSolanaMintId(null);
    setListSuccess(false);
    setSuccessMsg("");
  };

  return (
    <>
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Bulb />
              Post a Thought
            </h3>
            <X
              onClick={() => {
                clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="w-full p-4 space-y-3">
            {/* <textarea
            className="textarea  w-full"
            placeholder="Whats on your mind!"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea> */}
            <div id="walkthroughThoughtStep1" ref={textRef}>
              <MentionsInput
                multiline
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={defaultStyle}
                className="textarea w-full h-24  pt-2 focus:outline-0 overflow-scroll mentionsinputoverflow"
                placeholder={"Whats on your mind!"}
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
            </div>
            {mintSuccess || (mintSuccess && listSuccess) ? (
              <div className="w-fit flex space-x-2 text-green-500">
                {successMsg}
              </div>
            ) : (
              <></>
            )}
            <div className="w-fit flex space-x-2">
              {mintSuccess ? (
                <div className="flex items-center">
                  {!listSuccess ? (
                    <span className="label-text text-brand3">List NFT</span>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <label
                  id="walkthroughThoughtStep2"
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
              {isNFT && mintSuccess && !listSuccess && (
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
            {isNFT && caption && (
              <div className="mx-auto w-fit m-4">
                <NftCard
                  id="my-nft"
                  name={State.database.userData.data.user.name}
                  userName={State.database.userData.data.user.username}
                  text={caption}
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

            {!mintSuccess ? (
              <button
                type={"submit"}
                onClick={handleThoughtPost}
                // onClick={onButtonClick}
                className={`btn capitalize w-full  ${
                  caption ? "btn-brand" : "btn-disabled"
                }  ${uploadingPost ? "loading" : ""}`}
              >
                {btnText}
              </button>
            ) : (
              <>
                {listSuccess ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearData();
                    }}
                    className={`btn  ${
                      !caption ? "btn-disabled" : "btn-brand"
                    } w-full `}
                  >
                    Close
                  </button>
                ) : (
                  <div className="w-full flex justify-around space-x-1">
                    <button
                      onClick={handleThoughtNFTListing}
                      className={`btn  ${
                        !caption ? "btn-disabled" : "btn-brand"
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
                        !caption ? "btn-disabled" : "btn-brand"
                      } w-1/2 `}
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
      {showWalkthrough && (
        <Walkthrough
          data={walkthroughData}
          func={() => setshowWalkthrough(false)}
          show={showWalkthrough}
        />
      )}
    </>
  );
}

export default ThoughtPostModal;
