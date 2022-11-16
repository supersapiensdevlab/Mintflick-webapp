import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import { io } from "socket.io-client";
import axios from "axios";
import { makeStorageClient } from "../../Helper/uploadHelper";
import ReactPlayer from "react-player";
import {
  AccessPointOff,
  CalendarTime,
  PlayerPlay,
  PlayerRecord,
  X,
} from "tabler-icons-react";
import moment from "moment";
import useUserActions from "../../Hooks/useUserActions";
import CopyToClipboard from "../CopyButton/CopyToClipboard";
import { motion, useDragControls } from "framer-motion";
import useWindowDimensions from "../../Hooks/useWindowDimentions";
import Loading from "../Loading/Loading";
import { uploadFile } from "../../Helper/uploadHelper";
import { decode } from "bs58";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Keypair, Transaction } from "@solana/web3.js";
import placeholder from "../../Assets/Gaming Posters/liveplaceholder.jpg";

function GoLive() {
  const user = useContext(UserContext);
  const [StreamKey, setKey] = useState("");
  const [loader, setLoader] = useState(true);
  const [loadFeed, loadUser] = useUserActions();

  const { height, width } = useWindowDimensions();
  //framer motion
  const controls = useDragControls();

  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [scheduleStreamModal, setScheduleStreamModal] = useState(false);
  const [mintClipModal, setmintClipModal] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(null);
  //

  //MultiStreams
  const [userStreams, setUserStreams] = useState([]);
  const [multiStreamValue, setMultiStreamValue] = useState({});
  const [multiStreamConnected, setMultiStreamConnected] = useState([]);
  const [patchStream, setPatchStream] = useState([]);

  //Recording
  const [recording, setRecording] = useState(false);
  const [newRecord, setNewRecord] = useState(0);
  const [recordUrl, setRecordUrl] = useState("");

  // Thumbnail
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [copied, setCopied] = useState(null);

  const [viewColor, setViewColor] = useState("white");
  const [viewAnimate, setViewAnimate] = useState("animate-none");

  const [uploading, setUploading] = useState(0);

  const [hideButton, setHideButton] = useState(false);

  const liveUrl = `${process.env.REACT_APP_CLIENT_URL}/homescreen/liveuser/${user.database.userData?.data?.user?.username}`;

  //nft video
  const category = [
    "Autos & Vehicles",
    " Music",
    "Pets & Animals",
    "Sports",
    "Travel & Events",
    "Gaming",
    "People & Blogs",
    "Comedy",
    "Entertainment",
    "News & Politics",
    " Howto & Style",
    "Education",
    "Science & Technology",
    "Nonprofits & Activism",
  ];
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [recordvideo, setRecordVideo] = useState({
    videoName: "",
    videoFile: null,
    category: "",
    description: "",
    price: "",
    royality: "",
  });

  //socket
  const [currentSocket, setCurrentSocket] = useState(null);
  const [livestreamViews, setLivestreamViews] = useState(0);

  const [minting, setMinting] = useState(null);
  const [mintSuccess, setMintSuccess] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const [tokenAddress, setTokenAddress] = useState("");

  const [isNFT, setIsNFT] = useState(true);
  const [NFTprice, setPrice] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sharable_data, setsharable_data] = useState();
  const [tokenId, setTokenId] = useState(null);
  const [formData, setFormData] = useState(null);

  const [undoButton, setUndoButton] = useState(false);

  // Schedule Date & Time
  const [streamSchedule, setStreamSchedule] = useState(null);
  useEffect(() => {
    console.log(streamSchedule);
  }, [streamSchedule]);

  const text = "Copy Link To Clipboard";

  const [video, setVideo] = useState({
    videoName: "",
    videoImage: "",
    videoFile: "",
    category: "",
    ratings: "",
    tags: [],
    description: "",
    allowAttribution: "",
    commercialUse: "",
    derivativeWorks: "",
  });

  const [streamDetails, setStreamDetails] = useState({
    name: "",
    description: "",
    category: "other",
  });
  const [streamLink, setStreamLink] = useState({
    image: "",
    url: "",
  });
  const [uploadingLink, setUploadingLink] = useState(false);
  const [selectedLinkFile, setSelectedLinkFile] = useState(null);
  const onLinkFileChange = (event) => {
    // Update the state
    setSelectedLinkFile({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  useEffect(() => {
    if (user.database.userData.data) {
      if (
        user.database.userData.data.user &&
        user.database.userData.data.user.multistream_platform
      ) {
        ////console.log("hello",user.database.userData.data.user.multistream_platform)
        let new_array = [];
        for (
          let i = 0;
          i < user.database.userData.data.user.multistream_platform.length;
          i++
        ) {
          new_array.push(
            user.database.userData.data.user.multistream_platform[i]
          );
        }
        setMultiStreamConnected(new_array);
        //setPatchStream(new_array)
      } else {
        setMultiStreamConnected([]);
      }
      setPlaybackUrl(
        `https://cdn.livepeer.com/hls/${user.database.userData.data.user.livepeer_data.playbackId}/index.m3u8`
      );
      //setName(user.database.userData.data.user.livepeer_data.name);
      setUserStreams(user.database.userData.data.user.livepeer_data);
    }
    // eslint-disable-next-line
  }, [user.database.userData.data?.user]);

  useEffect(() => {
    if (user.database.userData.data) {
      const socket = io(`${process.env.REACT_APP_VIEWS_URL}`, {
        transports: ["websocket", "polling"],
        upgrade: false,
        secure: true,
        withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd",
        },
      });
      socket.on("connection");
      socket.emit("joinlivestream", user.database.userData.data.user.username);
      socket.on("count", (details) => {
        if (details.room === user.database.userData.data.user.username) {
          setLivestreamViews(details.roomSize);
        }
      });
      socket.on("livecount", (details) => {
        setLivestreamViews(details.roomSize);
        // console.log('emitted');
        // console.log('inc', livestreamViews);
        setViewColor("green-500");
        setViewAnimate("animate-pulse");
        setTimeout(() => {
          setViewColor("white");
          setViewAnimate("animate-none");
        }, 3000);
      });
      socket.on("removecount", (roomSize) => {
        setLivestreamViews(roomSize);
        // console.log('removecount emitted');
        // console.log('dec', livestreamViews);
        setViewColor("red-500");
        setViewAnimate("animate-pulse");
        setTimeout(() => {
          setViewColor("white");
          setViewAnimate("animate-none");
        }, 3000);
      });
    }
  }, [user.database.userData.data?.user]);

  //set Stream Key
  const handleChange = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  };

  //add Stream Platform
  const addStreamingPlatform = async (props) => {
    setLoader(false);
    let postData = {
      username: user.database.userData.data.user.username,
      platform: {
        title: multiStreamValue.title,
        logo: multiStreamValue.logo,
        image: multiStreamValue.image,
        rtmp: props,
      },
    };

    //console.log(postData);

    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user.database.userData.data.user/add_multistream_platform`,
      data: postData,
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("authtoken"),
      },
    });

    setMultiStreamConnected([...multiStreamConnected, postData]);
    setShowStreamModal(false);
    setLoader(true);
  };

  //create Mutlistream
  const createMultiStream = async () => {
    ////console.log(patchStream);

    setLoader(false);

    let multi_data = {
      patchStreamData: [],
      stream_id: userStreams.id,
    };

    for (let i = 0; i < patchStream.length; i++) {
      let data = {
        profile: "source",
        spec: {
          name: patchStream[i].platform.title,
          url: patchStream[i].platform.rtmp,
        },
      };
      multi_data.patchStreamData.push(data);
    }

    // let patchStreamData = {
    //     name: `${multiStreamValue.title}`,
    //     url: `${props}`,
    //     stream_id: userStreams.id
    // }

    ////console.log("patchStream:", multi_data);

    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/patch_multistream`,
      data: multi_data,
    });

    ////console.log(patchingStream);

    setLoader(true);
    alert(" Multistream Connection Successfull !!!");
    setShowStreamModal(false);
  };

  const clearNftMintModalData = () => {
    setTokenAddress("");
    setMinting(false);
    setMintSuccess(null);
    setRecordVideo({
      videoName: "",
      videoFile: null,
      category: "",
      description: "",
      price: "",
      royality: "",
    });
    setmintClipModal(false);
    setSaveSuccess(null);
  };

  //edit platform
  const editPlatform = (value, index) => {
    if (value.selected === 1) {
      let newArr = [...multiStreamConnected];
      newArr[index].selected = 0;

      setMultiStreamConnected(newArr);
    } else {
      let newArr = [...multiStreamConnected];
      newArr[index].selected = 1;

      setMultiStreamConnected(newArr);

      setPatchStream((oldArray) => [...oldArray, newArr[index]]);
      setMultiStreamConnected(newArr);
    }
  };

  //Recording
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [chunks, setChunks] = useState([]);

  const startRecording = async () => {
    setNewRecord(0);
    setRecordVideo({
      videoName: "",
      videoFile: null,
      category: "",
      description: "",
      price: "",
      royality: "",
    });
    setChunks([]);

    let data = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: { mediaSource: "screen" },
    });
    setStream(data);
    if (data) {
      setRecording(true);
    }

    let recorderdata = new MediaRecorder(data);
    setRecorder(recorderdata);
    recorderdata.ondataavailable = (e) => chunks.push(e.data);
    recorderdata.onstop = async () => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      const videoFile = new File(chunks, `video.webm`, { type: "video/webm" });

      setRecordUrl(URL.createObjectURL(completeBlob));
      setRecordVideo({ ...recordvideo, videoFile: videoFile });
      setRecording(false);
      setNewRecord(1);
    };
    recorderdata.start();
  };

  const stopRecording = () => {
    setRecording(false);
    setNewRecord(1);
    recorder.stop();
    stream.getVideoTracks()[0].stop();
    setmintClipModal(true);
  };

  //video functions
  const handleVideoInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setRecordVideo({ ...recordvideo, [name]: value });
  };

  useEffect(() => {
    setRecordVideo({
      ...recordvideo,
      category: selectedCategory,
    });
    // eslint-disable-next-line
  }, [selectedCategory]);

  useEffect(() => {
    // eslint-disable-next-line
  }, [recordvideo.videoFile]);

  const handleNFT = () => {
    setIsNFT(!isNFT);
  };

  useEffect(() => {
    async function uploadVideoToDB() {}

    console.log("TOKEN ID", tokenId);
    if (tokenId && mintingProgress == 66) {
      formData.append("tokenId", tokenId);
      console.log("Saving FIles to DB", formData);
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/upload_video`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            "auth-token": localStorage.getItem("authtoken"),
          },
        })
        .then((res) => {
          setMintingProgress(100);
          axios
            .get(
              `${process.env.REACT_APP_SERVER_URL}/user.database.userData.data.user/getLoggedInUser`,
              {
                headers: {
                  "content-type": "application/json",
                  "auth-token": JSON.stringify(
                    localStorage.getItem("authtoken")
                  ),
                },
              }
            )
            .then((res) => {
              let latestVideoId =
                res.data.videos[res.data.videos.length - 1].videoId;
              setsharable_data(
                `${process.env.REACT_APP_CLIENT_URL}/playback/${res.data.username}/${latestVideoId}`
              );
              setShow(true);
            });

          setVideo({
            videoName: "",
            videoImage: "",
            videoFile: "",
            category: "",
            ratings: "",
            tags: [],
            description: "",
            allowAttribution: "",
            commercialUse: "",
            derivativeWorks: "",
          }); // reset the form
        });
    }
  }, [mintingProgress]);

  // Thumbnail
  async function storeThumbnail(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {};
    const file = [files[0]];
    const totalSize = files[0].size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      // setUploading(10 - pct);
      // console.log(`Uploading... ${pct}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(file, { onRootCidReady, onStoredChunk });
  }
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };
  async function uploadThumbnail(e) {
    e.preventDefault();
    if (selectedFile) {
      setUploadingFile(true);
      storeThumbnail(selectedFile.file)
        .then(async (cid) => {
          setUploadingFile(false);
          console.log(
            "https://ipfs.io/ipfs/" + cid + "/" + selectedFile.file[0].name
          );
          const data = {
            url:
              "https://ipfs.io/ipfs/" + cid + "/" + selectedFile.file[0].name,
            username: user.database.userData.data.user.username,
          };
          const res = await axios({
            method: "POST",
            url: `${process.env.REACT_APP_SERVER_URL}/user/uploadThumbnail`,
            data: data,
            headers: {
              "content-type": "application/json",
              "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
            },
          });
          user.toast("success", "Thumbnail Uploaded Successfully!");
        })
        .catch((err) => {
          setUploadingFile(false);
          console.log(err);
          setSelectedFile(null);
        });
      return;
    }
  }
  // async function storeWithProgress(files) {
  //   // show the root cid as soon as it's ready
  //   const onRootCidReady = (cid) => {};
  //   const file = [files[0]];
  //   const totalSize = files[0].size;
  //   let uploaded = 0;
  //   const onStoredChunk = (size) => {
  //     uploaded += size;
  //     const pct = totalSize / uploaded;
  //     // setUploading(10 - pct);
  //     // console.log(`Uploading... ${pct}% complete`);
  //   };

  //   // makeStorageClient returns an authorized Web3.Storage client instance
  //   const client = makeStorageClient();

  //   // client.put will invoke our callbacks during the upload
  //   // and return the root cid when the upload completes
  //   return client.put(file, { onRootCidReady, onStoredChunk });
  // }

  // console.log(user.database.userData.data.user);

  const saveStream = () => {
    const blobobject = new Blob([recordvideo?.videoFile]);
    const blob = window.URL.createObjectURL(blobobject);
    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.href = blob;
    anchor.download = `${recordvideo?.videoFile?.name}`;
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(blob);
    setSaveSuccess(true);
  };

  useEffect(() => {
    if (user.database.userData.data) {
      if (user.database.userData.data.user.streamDetails) {
        setStreamDetails(user.database.userData.data.user.streamDetails);
      }
    }
  }, [user.database.userData.data?.user]);

  async function partialSignWithWallet(encodedTransaction) {
    //we have to pass the recoveredTransaction received in the previous step in the encodedTransaction parameter
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const solanaWallet = new SolanaWallet(user.database?.provider); // web3auth.provider
    const signedTx = await solanaWallet.signTransaction(encodedTransaction);

    //signing transaction with the creator_wallet
    const confirmTransaction = await connection.sendRawTransaction(
      signedTx.serialize()
    );
    return confirmTransaction;
  }

  async function signTransaction(transaction, key) {
    console.log(transaction, key);
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const feePayer = Keypair.fromSecretKey(decode(key));
      const recoveredTransaction = Transaction.from(
        Buffer.from(transaction, "base64")
      );
      recoveredTransaction.partialSign(feePayer); //partially signing transaction with privatekey of the fee_payer
      return recoveredTransaction;
    } catch (error) {
      console.log(error);
    }
  }

  const handleMinting = () => {
    if (recordvideo && recordvideo.videoFile) {
      setMinting(true);
      uploadFile(recordvideo.videoFile).then(async (cid) => {
        console.log("stored files with cid:", cid);
        let nftSolanaData = {
          network: "devnet",
          creator_wallet: user.database.walletAddress,
          name: recordvideo?.videoName,
          symbol: "FLICK",
          attributes: JSON.stringify([{ trait_type: "Power", value: "100" }]),
          description: recordvideo?.description,
          external_url:
            "https://ipfs.io/ipfs/" + cid + "/" + recordvideo.videoFile.name,
          max_supply: 1,
          fee_payer: `${process.env.REACT_APP_FEEPAYER_WALLET}`,
          royalty: 5,
          image: recordvideo.videoFile,
        };

        console.log(nftSolanaData);
        axios
          .post(`https://api.shyft.to/sol/v2/nft/create`, nftSolanaData, {
            headers: {
              "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
              "content-type": "multipart/form-data",
            },
          })
          .then(async (data) => {
            console.log("MintID", data.data.result.mint);
            setTokenAddress(data.data.result.mint);
            await signTransaction(
              data.data.result.encoded_transaction,
              `${process.env.REACT_APP_FEEPAYER_PRIVATEKEY}`
            )
              .then((res) => {
                console.log(res);
                partialSignWithWallet(res).then(() => {
                  console.log("success");
                  setMintSuccess("NFT Minted Successfully");
                  setMinting(false);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
            user.toast("error", "Error minting NFT. Please try again!");
          });
      });
    }
  };

  // on Stream Details Submit
  const handleStreamDetails = async (e) => {
    e.preventDefault();
    if (
      streamDetails.name != "" &&
      streamDetails.description != "" &&
      streamDetails.category != ""
    ) {
      try {
        await axios
          .post(
            `${process.env.REACT_APP_SERVER_URL}/user/streamDetails`,
            streamDetails,
            {
              headers: {
                "content-type": "application/json",
                "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
              },
            }
          )
          .then((data) => {
            user.toast("success", "Stream Details Updated Successfully!");
            loadUser();
          });
      } catch (err) {
        user.toast(
          "error",
          "Oops!somthing went wrong stream details updating!"
        );
        console.log(err);
      }
    }
  };

  const cancelStreamDetails = () => {
    if (user.database.userData.data.user.streamDetails) {
      setStreamDetails(user.database.userData.data.user.streamDetails);
      setUndoButton(false);
    }
  };

  async function uploadLink(e) {
    e.preventDefault();
    if (selectedLinkFile) {
      setUploadingLink(true);
      storeThumbnail(selectedLinkFile.file)
        .then(async (cid) => {
          setUploadingLink(false);
          console.log(
            "https://ipfs.io/ipfs/" + cid + "/" + selectedLinkFile.file[0].name
          );
          const data = {
            image:
              "https://ipfs.io/ipfs/" +
              cid +
              "/" +
              selectedLinkFile.file[0].name,
            url: streamLink.url,
          };

          axios({
            method: "POST",
            url: `${process.env.REACT_APP_SERVER_URL}/user/uploadStreamLink`,
            data: data,
            headers: {
              "content-type": "application/json",
              "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
            },
          }).then((res) => {
            loadUser();
          });
        })
        .catch((err) => {
          setUploadingLink(false);
          console.log(err);
          setSelectedLinkFile(null);
        });
      return;
    }
  }

  // Delete a stream link
  const deleteStreamLink = async (link) => {
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/deleteStreamLink`,
      data: link,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then(async (res) => {
        console.log("loading user");
        await loadUser();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStreamSchedule = (e) => {
    e.preventDefault();
    let s = new Date(streamSchedule).getTime();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/streamSchedule`,
      data: { streamSchedule: s },
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then((res) => {
        setScheduleStreamModal(false);
        loadUser();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return user.database.userData.data ? (
    <div className=" bg-white dark:bg-slate-900 pt-20 ">
      <div className="flex flex-col lg:flex-row p-4 gap-2">
        <div className="flex-1 space-y-2">
          <div className="rounded-sm overflow-hidden">
            {user.database.userData.data.user &&
            user.database.userData.data.user.livepeer_data.isActive ? (
              <ReactPlayer
                controls={true}
                width={"100%"}
                height={"max-content"}
                url={playbackUrl}
                creatorData={user.database.userData.data.user}
                footer={false}
              />
            ) : (
              <img
                className="border-2 border-slate-500 aspect-video w-full object-cover rounded-lg"
                src={
                  user.database.userData.data?.user.thumbnail
                    ? user.database.userData.data.user.thumbnail
                    :
                  placeholder
                }
              />
            )}
          </div>
          <div className="w-full flex items-center flex-wrap justify-start gap-2">
            <button
              onClick={() => setScheduleStreamModal(true)}
              className="btn btn-sm capitalize btn-outline btn-primary rounded-full gap-1"
            >
              <CalendarTime size={16} />
              Schedule upcoming Stream
            </button>

            <div className=" flex items-center  w-fit bg-slate-100 dark:bg-slate-800  rounded-full ">
              <p className="text-sm font-semibold text-brand2 mx-2">
                To create NFT
              </p>
              {!recording ? (
                <button
                  className="flex text-sm items-center text-success p-1 px-2 border-2 border-success rounded-full gap-1"
                  onClick={startRecording}
                >
                  <PlayerPlay size={16} /> Start Recording
                </button>
              ) : (
                <button
                  className="flex items-center text-error p-1 text-sm px-2 border-2 border-error rounded-full gap-1"
                  onClick={stopRecording}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="absolute inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  Stop Recording
                </button>
              )}
            </div>

            {user.database.userData.data.user &&
            user.database.userData.data.user.streamSchedule > Date.now() &&
            !user.database.userData.data.user.livepeer_data.isActive ? (
              <span className="flex items-center  w-fit bg-slate-100 dark:bg-slate-800  rounded-full p-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                  <span className="absolute inline-flex rounded-full h-full w-full bg-teal-600"></span>
                </span>
                <p className="text-sm font-semibold text-brand2 mx-2">
                  Stream Starting on{" "}
                  <span className="text-teal-600">
                    {moment(
                      user.database.userData.data.user.streamSchedule * 1
                    ).format("MMMM Do YYYY, h:mm a")}
                  </span>
                </p>
              </span>
            ) : (
              <></>
            )}
            {user.database.userData.data.user &&
            user.database.userData.data.user.livepeer_data.isActive ? (
              <span className="flex items-center  w-fit bg-slate-100 dark:bg-slate-800  rounded-full p-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="absolute inline-flex rounded-full h-full w-full bg-red-600"></span>
                </span>
                <p className="text-sm font-semibold text-brand2 mx-2">
                  Live now
                </p>
              </span>
            ) : (
              <span className="flex items-center text-brand2 w-fit bg-slate-100 dark:bg-slate-800  rounded-full p-2">
                <AccessPointOff size={16} />
                <p className="text-sm font-semibold  mx-2">Offline</p>
              </span>
            )}
          </div>
          <div className="w-full flex  gap-2">
            <div className="p-2 flex-grow flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
              <div className="text-brand5 text-base font-semibold">
                Stream Title
              </div>
              <div className="text-brand2 text-base ">{streamDetails.name}</div>
            </div>
            <div className="p-2 w-fit flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
              <div className="text-brand5 text-base font-semibold">
                Stream Category
              </div>
              <div className="text-brand2 w-fit text-base ">
                {streamDetails.category}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="p-2 flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
              <div className="text-brand5 text-base font-semibold">
                Stream Description
              </div>
              <div className="text-brand2 text-base ">
                {streamDetails.description}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="p-2 flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
              <div className="text-brand5 text-base font-semibold">
                Add banners to live stream (Max 4)
              </div>
              <div className="w-full flex flex-wrap">
                {user.database.userData.data.user.streamLinks &&
                  user.database.userData.data.user.streamLinks.map(
                    (link, index) => (
                      <div key={index} className="relative w-1/2 p-2">
                        <img
                          className="rounded-md w-full aspect-video object-cover"
                          src={link.image}
                          alt="banner"
                        />
                        <X
                          onClick={() => deleteStreamLink(link)}
                          className="absolute top-3 right-3 btn btn-circle btn-xs "
                        ></X>
                      </div>
                    )
                  )}
              </div>
              {user.database.userData.data.user.streamLinks.length < 4 && (
                <form onSubmit={uploadLink} className="space-y-1">
                  <progress
                    hidden={!uploadingLink}
                    className="progress progress-success w-full dark:bg-slate-400"
                  ></progress>
                  <label
                    htmlFor="file"
                    className=" cursor-pointer flex justify-start items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
                  >
                    {selectedLinkFile ? (
                      selectedLinkFile.file ? (
                        `${selectedLinkFile.file[0].name.substring(0, 10)}`
                      ) : null
                    ) : (
                      <>
                        Choose Image( PNG, JPG, GIF)
                        <span className="text-red-600 text-xl">*</span>
                      </>
                    )}
                    <input
                      accept=".jpg,.png,.jpeg,.gif,.webp"
                      required={true}
                      onChange={onLinkFileChange}
                      type="file"
                      id="file"
                      className="sr-only"
                    />
                  </label>
                  <div className="w-full flex flex-col sm:flex-row gap-2">
                    <input
                      required={true}
                      value={streamLink.url}
                      onChange={(e) =>
                        setStreamLink({
                          ...streamLink,
                          url: e.target.value,
                        })
                      }
                      placeholder="URL"
                      className="input flex-grow"
                      type={"url"}
                    />
                    <input
                      disabled={uploadingLink}
                      type={"submit"}
                      value="Add Banner"
                      className="btn btn-success"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-2">
          <div className="collapse collapse-arrow w-full text-brand3  bg-slate-100 dark:bg-slate-800  rounded-xl  ">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              <span className="font-semibold text-base ">Sreaming Details</span>
            </div>
            <div className="collapse-content w-full space-y-2">
              <div className="w-full p-2 flex gap-2 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">Name</span>
                <p className="text-base text-brand4">
                  {user.database.userData.data.user.name}
                </p>
              </div>
              <div className="w-full p-2 flex gap-2 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">Username</span>
                <p className="text-base text-brand4">
                  {user.database.userData.data.user.username}
                </p>
              </div>
              <div className="p-2 flex flex-col gap-1 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">RTMP URL</span>
                <p className="text-base flex gap-1 text-brand4">
                  rtmp://rtmp.livepeer.com/live
                  <CopyToClipboard text="rtmp://rtmp.livepeer.com/live" />
                </p>
              </div>
              <div className="p-2 flex flex-col gap-1 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">Streamer Key</span>
                <p className="text-base flex gap-1 text-brand4">
                  {userStreams.streamKey}
                  <CopyToClipboard text={userStreams.streamKey} />
                </p>
              </div>
              <div className="p-2 flex flex-col gap-1 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">Playback URL</span>
                <p className="text-base flex gap-1 text-brand4">
                  <span className="w-5/6 truncate">{playbackUrl}</span>
                  <CopyToClipboard text={playbackUrl} />
                </p>
              </div>
              <div className="p-2 flex flex-col gap-1 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
                <span className="font-semibold text-base">Live URL</span>
                <p className="text-base flex gap-1 text-brand4">
                  <a
                    className="w-5/6 truncate"
                    href={`${process.env.REACT_APP_CLIENT_URL}/liveuser/${user.database.userData.data.user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${process.env.REACT_APP_CLIENT_URL}/liveuser/${user.database.userData.data.user.username}`}
                  </a>
                  <CopyToClipboard text={liveUrl} />
                </p>
              </div>
              {/* Stream Title */}
              {/* Stream Schedule */}
              {/* Stream Links */}
              <div className="hidden">
                <div className="flex flex-col">
                  <p className="text-center mb-1">Currently Connected :</p>
                  <div className="flex flex-wrap justify-center">
                    {multiStreamConnected.map((value, index) => {
                      ////console.log(value);
                      return (
                        <div key={index} className="m-1">
                          <img
                            src={value.platform.logo}
                            alt="logo"
                            className="h-6 lg:h-10 w-auto"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="nm-flat-dbeats-dark-primary-sm p-1 rounded-3xl hover:nm-inset-dbeats-dark-secondary-xs w-max mx-auto">
                    <button
                      variant="primary"
                      className="bg-dbeats-dark-secondary text-center content-center justify-center align-middle hover:nm-inset-dbeats-light flex text-white rounded-3xl font-bold px-2 py-3 tracking-widest w-max"
                      type="button"
                      onClick={
                        multiStreamConnected.length < 3
                          ? () => setShowDestinationModal(true)
                          : () => setShowPriceModal(true)
                      }
                    >
                      Add MultiStream Platforms
                      <i className="fas fa-solid fa-video mx-2 cursor-pointer pt-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
            <span className="font-semibold text-base">Thumbnail</span>
            {selectedFile ? (
              <img
                src={selectedFile.localurl}
                className="aspect-video object-cover w-full rounded-md"
              ></img>
            ) : user.database.userData.data.user.thumbnail ? (
              <img
                src={user.database.userData.data.user.thumbnail}
                className="aspect-video object-cover w-full rounded-md"
              ></img>
            ) : null}
            <progress
              hidden={!uploadingFile}
              className="progress progress-success w-full dark:bg-slate-400"
            ></progress>
            <form
              className="flex flex-col items-center gap-1"
              onSubmit={uploadThumbnail}
            >
              <input
                className="p-0 input h-fit w-full "
                name="Thumbnail image"
                type="file"
                accept=".jpg,.png,.jpeg,.gif,.webp"
                required={true}
                onChange={onFileChange}
              />
              <button
                disabled={uploadingFile}
                type="submit"
                className={`btn btn-sm btn-success w-full ${
                  uploadingFile || !selectedFile ? " btn-disabled" : ""
                }`}
              >
                <p>Upload</p>
              </button>
            </form>
          </div>{" "}
          <div className="p-2 flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
            <form onSubmit={handleStreamDetails}>
              <div>
                <label className=" text-sm text-brand3">Stream Title </label>
                <input
                  className="input w-full"
                  required={true}
                  value={streamDetails.name}
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      name: e.target.value,
                    });
                    setUndoButton(true);
                  }}
                  type="text"
                />
              </div>
              <div className="mt-2">
                <label className=" text-sm text-brand3">
                  Stream Description
                </label>
                <textarea
                  required={true}
                  value={streamDetails.description}
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      description: e.target.value,
                    });
                    setUndoButton(true);
                  }}
                  rows={2}
                  className="w-full textarea"
                  type="text"
                />
              </div>
              <div className="mt-2">
                <label className=" text-sm text-brand3">Stream Category</label>
                <select
                  className="select block w-full"
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      category: e.target.value,
                    });
                    setUndoButton(true);
                  }}
                  value={streamDetails.category}
                >
                  <option disabled selected>
                    Categories
                  </option>
                  {category.map((c) => (
                    <option>{c}</option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex gap-2 justify-end">
                {undoButton ? (
                  <button
                    onClick={cancelStreamDetails}
                    className="btn btn-sm btn-ghost"
                  >
                    Undo
                  </button>
                ) : (
                  <></>
                )}
                <button className="btn btn-sm btn-success" type="submit">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* {newRecord === 1 ? (
        <div className="flex justify-between m-6 py-6 px-10 bg-dbeats-dark-secondary">
          <div className="w-full flex justify-center">
            <video
              src={recordUrl}
              width="90%"
              height="90%"
              controls
              autoPlay={true}
              muted={false}
            />
          </div>

          <div className="w-full">
            <div className="space-y-6 text-gray-500 dark:text-gray-100">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                <div className="col-span-1 sm:col-span-1">
                  <label
                    htmlFor="videoName"
                    className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Video Title
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="videoName"
                      id="videoName"
                      value={recordvideo.videoName}
                      onChange={handleVideoInputs}
                      className="focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                  <label
                    htmlFor="company-website"
                    className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Category
                  </label>
                  <div className="flex rounded-md shadow-sm"></div>
                </div>
                <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                  <label
                    htmlFor="videoName"
                    className="block mr-2 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Pricing
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={recordvideo.price}
                      onChange={handleVideoInputs}
                      className="focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="description"
                  className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="videoDescription"
                    name="description"
                    rows={3}
                    value={recordvideo.description}
                    onChange={handleVideoInputs}
                    className="dark:placeholder-gray-600 focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                    placeholder="Any Behind the scenes you'll like your Audience to know!"
                  />
                </div>
              </div>

              <div className="float-right pt-20 flex items-center">
                <div
                  hidden={hideButton}
                  onClick={() => {
                    // mintNFT();
                    // setHideButton(true);
                  }}
                  className="w-max font-bold cursor-pointer px-12 nowrap py-2 rounded-md text-md text-white bg-dbeats-light"
                >
                  Mint NFT
                </div>

                {recordvideo.cid == null ? (
                  <div
                    hidden={!hideButton}
                    className=" mx-5 flex items-center w-64"
                  >
                    <input
                      type="range"
                      defaultValue={uploading}
                      min="0"
                      max="100"
                      hidden={!hideButton}
                      className="appearance-none cursor-pointer w-full h-3 bg-green-400 
                font-white rounded-full slider-thumb  backdrop-blur-md"
                    />
                    <p
                      className="mx-2 text-base font-medium text-white"
                      hidden={!hideButton}
                    >
                      {Math.round(uploading)}%
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null} */}
      {/* minting clip */}
      <div
        className={`${
          mintClipModal && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
            <div className="flex justify-between items-center p-2">
              <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                Mint video
              </h3>
              <X
                onClick={() => clearNftMintModalData()}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <video
              src={recordUrl}
              width="100%"
              height="100%"
              controls
              autoPlay={true}
              muted={false}
              className="rounded-md"
            />
            <progress
              hidden={!hideButton}
              value={uploading}
              max="100"
              className="progress progress-success w-full dark:bg-slate-400"
            ></progress>
            <div className="flex gap-2">
              <input
                type="text"
                name="videoName"
                id="videoName"
                value={recordvideo.videoName}
                onChange={handleVideoInputs}
                className="input w-full "
                placeholder="Enter video title..."
              />
              <input
                type="text"
                name="price"
                id="price"
                value={recordvideo.price}
                onChange={handleVideoInputs}
                className="input w-full"
                placeholder="Enter price..."
              />
            </div>
            <select className="select  w-full" onChange={(e) => {}}>
              <option disabled selected>
                Categories
              </option>
              {category.map((c) => (
                <option>{c}</option>
              ))}
            </select>
            <textarea
              id="videoDescription"
              name="description"
              rows={3}
              value={recordvideo.description}
              onChange={handleVideoInputs}
              className="textarea w-full"
              placeholder="Any Behind the scenes you'll like your Audience to know!"
            />
            {mintSuccess && (
              <p className="w-full text-center my-2 text-green-500">
                {mintSuccess}
              </p>
            )}
            <div className="w-full px-1 flex space-x-2 -ml-1">
              <div
                disabled={hideButton}
                onClick={() => {
                  // mintNFT();
                  // setHideButton(true);
                  handleMinting();
                }}
                className={`btn btn-brand ${
                  recordvideo?.videoFile ? "w-1/2" : "w-full"
                }  ${minting ? "loading" : ""}`}
              >
                Mint as NFT
              </div>
              {recordvideo?.videoFile ? (
                <button className="btn btn-brand w-1/2 " onClick={saveStream}>
                  {saveSuccess ? "Saved" : "Save Stream"}
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Schedule Stream Modal */}
      <div
        className={`${
          scheduleStreamModal && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
            <div className="flex justify-between items-center p-2">
              <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                Schedule upcoming Stream
              </h3>
              <X
                onClick={() => setScheduleStreamModal(false)}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <form onSubmit={handleStreamSchedule} className="space-y-2 m-4">
            <label className="text-sm  text-brand2">Select Date & Time</label>
            <input
              value={streamSchedule}
              onChange={(e) => setStreamSchedule(e.target.value)}
              className="w-full input"
              type={"datetime-local"}
              min={moment().format("YYYY-MM-DDThh:mm")}
              required={true}
            />

            <input
              className="btn btn-brand w-full"
              value={"Schedule stream"}
              type={"submit"}
            />
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-screen w-screen bg-slate-100 dark:bg-slate-800 ">
      <Loading />
    </div>
  );
}

export default GoLive;
