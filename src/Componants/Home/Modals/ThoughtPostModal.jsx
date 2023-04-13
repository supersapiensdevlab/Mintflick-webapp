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
  signTransactionKeyWallet,
  signTransactionWithWallet,
  signWithRelayer,
} from "../../../Helper/mintOnSolana2";
import NftCard from "../NftCard";
import { Walkthrough } from "../../Walkthrough/Walkthrough";
import CustomInput from "../../CustomInputs/CustomInput";
import { TypeAnimation } from "react-type-animation";
import NftLimit from "../NftLimit";

function ThoughtPostModal({ setthoughtPostModalOpen }) {
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

  const [nftLimit, setNftLimit] = useState(0);

  const [showWalkthrough, setshowWalkthrough] = useState(
    State.database.userData?.data.user?.seenIntro?.thoughtWalkthrough
      ? false
      : true
  );
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

  // useEffect(() => {
  //   mentionsRef.current.style.overflow = "scroll";
  // }, []);
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
    //   network: process.env.REACT_APP_SOLANA_NETWORK,
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
        //   process.env.REACT_APP_SOLANA_NETWORK,
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
        setSuccessMsg("NFT Minted Successfully");

        await loadFeed();
        // setUploadingPost(false);
        setbtnText("Uploading Thought");
        setthoughtPostModalOpen(false);
        setMintSuccess(true);
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
            let url = "https://nftstorage.link/ipfs/" + cid + "/" + "meta.png";

            mintNFTOnSolana2(
              State.database.walletAddress,
              "Mintflick Collection",
              caption,
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
                    setbtnText("NFT Minted");
                    nftMinted(myData, mintRequest.data?.result.mint);
                  })
                  .catch((error) => {
                    console.log(error);
                    State.toast(
                      "error",
                      "Error while signing transaction,please try again!"
                    );
                    setUploadingPost(false);
                    setbtnText("Flick thought");
                  });
                // signTransactionWithWallet(
                //   mintRequest.data.result.encoded_transaction,
                //   State.database.provider
                // )
                //   .then((signedTx) => {
                //     signWithRelayer(signedTx)
                //       .then((response) => {
                //         State.toast("success", "NFT Minted successfully");
                //         setbtnText("NFT Minted");
                //         nftMinted(myData, mintRequest.data?.result.mint);
                //       })
                //       .catch((error) => {
                //         State.toast(
                //           "error",
                //           "Gas Station Signing transaction failed!"
                //         );
                //         setUploadingPost(false);
                //       });
                //   })
                //   .catch((error) => {
                //     State.toast(
                //       "error",
                //       "Signing transaction with wallet failed!"
                //     );
                //     setUploadingPost(false);
                //   });
              })
              .catch((error) => {
                State.toast(
                  "error",
                  "Error while minting your NFT,please try again!"
                );
                setUploadingPost(false);
              });
          })
          .catch((err) => {
            console.log(err);
            State.toast("error", err.message);
            setbtnText("Flick thought");
          });
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", err.message);
        setbtnText("Flick thought");
      });
  };

  // Minting
  // const [minting, setMinting] = useState(null);
  // const [mintingProgress, setMintingProgress] = useState(0);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count?.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const handleAdd = (e) => {
    tagged.push(e);
    console.log(tagged);
  };

  //handle thought submit
  const handleThoughtPost = () => {
    setUploadingPost(true);
    // let filter = [];
    // tagged.forEach((value) => {
    //   if (caption.includes(value)) {
    //     filter.push(value);
    //   }
    // });
    console.log(tagged);
    const data = {
      announcement: caption,
      tagged: tagged,
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
      <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
          <div className="flex items-center justify-between p-2">
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
              <Bulb />
              Post a Thought
            </h3>
            <X
              onClick={() => {
                clearData();
              }}
              className="cursor-pointer text-brand2"
            ></X>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="w-full p-4 space-y-3">
            {/* <textarea
            className="w-full textarea"
            placeholder="Whats on your mind!"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea> */}{" "}
            {isNFT && caption && (
              <div className="m-4 mx-auto w-fit">
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
            <div id="walkthroughThoughtStep1">
              <CustomInput
                placeholder={"Whats on your mind!"}
                className="w-full textarea"
                value={caption}
                setValue={setCaption}
                mentions={tagged}
                setMentions={setTagged}
              />
              {/* <MentionsInput
                multiline
                value={caption}
                onChange={(e) => caption(e.target.value)}
                style={defaultStyle}
                className="w-full h-24 pt-2 overflow-scroll textarea focus:outline-0 mentionsinputoverflow"
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
              </MentionsInput> */}
            </div>
            {mintSuccess || (mintSuccess && listSuccess) ? (
              <div className="flex space-x-2 text-green-500 w-fit">
                {successMsg}
              </div>
            ) : (
              <></>
            )}
            <div className="flex space-x-2 w-fit">
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
                  className="flex items-center gap-2 p-2 pr-4 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-700"
                >
                  <input
                    type="checkbox"
                    value={isNFT}
                    onChange={() => setIsNFT(!isNFT)}
                    className="rounded-full checkbox checkbox-primary"
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
                      className="w-24 input input-bordered input-sm"
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
            {isNFT && (
              <div className="p-2 pr-4 text-sm font-semibold tracking-wide text-white rounded-md bg-emerald-600">
                <TypeAnimation
                  sequence={[
                    "✨Exciting! A Non Fungible Token (NFT) will be created on the Blockchain to preserve your content for all eternity and make it publicly accessible to everyone. Your connected wallet will be the proud owner of this unique digital asset, ensuring that your creation is forever enshrined in the blockchain's immutable ledger.",
                    () => {
                      // console.log("Done typing!"); // Place optional callbacks anywhere in the array
                    },
                  ]}
                  wrapper="div"
                  cursor={true}
                  repeat={0}
                  speed={60}
                />
                {/* <span>
                  ✨Exciting! A Non Fungible Token (NFT) will be created on the
                  Blockchain to preserve your content for all eternity and make
                  it publicly accessible to everyone. Your connected wallet will
                  be the proud owner of this unique digital asset, ensuring that
                  your creation is forever enshrined in the blockchain's
                  immutable ledger.
                </span> */}
              </div>
            )}
            {isNFT && (
              <NftLimit
                username={State.database.userData?.data?.user?.username}
                setNftLimit={setNftLimit}
                isNFT={isNFT}
              />
            )}
            {!mintSuccess ? (
              <button
                type={"submit"}
                onClick={handleThoughtPost}
                // onClick={onButtonClick}
                className={`btn capitalize w-full  ${
                  caption && nftLimit < 5 ? "btn-brand" : "btn-disabled"
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
                  <div className="flex justify-around w-full space-x-1">
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
          type={"thoughtWalkthrough"}
          func={() => setshowWalkthrough(false)}
          show={showWalkthrough}
        />
      )}
    </>
  );
}

export default ThoughtPostModal;
