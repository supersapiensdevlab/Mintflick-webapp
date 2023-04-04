import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../Store";
import { io } from "socket.io-client";
import axios from "axios";
import { makeStorageClient } from "../../Helper/uploadHelper";
import ReactPlayer from "react-player";
import {
  AccessPointOff,
  CalendarEvent,
  CalendarTime,
  Cardboards,
  ChevronDown,
  Edit,
  PlayCard,
  PlayerPlay,
  PlayerRecord,
  VideoMinus,
  VideoPlus,
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
import { Player } from "@livepeer/react";

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

  //livepeer record
  const [livepeerRecording, setlivepeerRecording] = useState(false);

  // Thumbnail
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [copied, setCopied] = useState(null);

  const [viewColor, setViewColor] = useState("white");
  const [viewAnimate, setViewAnimate] = useState("animate-none");

  const [uploading, setUploading] = useState(0);

  const [hideButton, setHideButton] = useState(false);

  const liveUrl = `${process.env.REACT_APP_CLIENT_URL}/homescreen/live/${user.database.userData?.data?.user?.username}`;

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
  const [streamSchedule, setStreamSchedule] = useState(new Date().getTime());
  function countdown(targetDate) {
    const targetTime = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return `${0}days ${0}hours ${0}minutes`;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}days ${hours}hours ${minutes}minutes`;
  }
  const dateTimePicker = useRef(null);
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

  const [streamDetails, setStreamDetails] = useState(
    user.database.userData?.data?.user?.streamDetails
  );
  const [editOption, setEditOption] = useState(streamDetails ? false : true);

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
    loadUser();
  }, []);

  useEffect(() => {
    if (user.database.userData?.data) {
      if (
        user.database.userData?.data.user &&
        user.database.userData?.data.user.multistream_platform
      ) {
        ////console.log("hello",user.database.userData?.data.user.multistream_platform)
        let new_array = [];
        for (
          let i = 0;
          i < user.database.userData?.data.user.multistream_platform.length;
          i++
        ) {
          new_array.push(
            user.database.userData?.data.user.multistream_platform[i]
          );
        }
        setMultiStreamConnected(new_array);
        //setPatchStream(new_array)
      } else {
        setMultiStreamConnected([]);
      }
      setPlaybackUrl(
        `https://cdn.livepeer.com/hls/${user.database.userData?.data.user.livepeer_data.playbackId}/index.m3u8`
      );
      //setName(user.database.userData?.data.user.livepeer_data.name);
      setUserStreams(user.database.userData?.data.user.livepeer_data);
      setlivepeerRecording(
        user.database.userData?.data.user.livepeer_data.record
      );
    }
    // eslint-disable-next-line
  }, [user.database.userData?.data?.user]);

  // Todo:enable this when user live count will fix

  // useEffect(() => {
  //   if (user.database.userData?.data) {
  //     const socket = io(`${process.env.REACT_APP_VIEWS_URL}`, {
  //       transports: ["websocket", "polling"],
  //       upgrade: false,
  //       secure: true,
  //       withCredentials: true,
  //       extraHeaders: {
  //         "my-custom-header": "abcd",
  //       },
  //     });
  //     socket.on("connection");
  //     socket.emit("joinlivestream", user.database.userData?.data.user.username);
  //     socket.on("count", (details) => {
  //       if (details.room === user.database.userData?.data.user.username) {
  //         setLivestreamViews(details.roomSize);
  //       }
  //     });
  //     socket.on("livecount", (details) => {
  //       setLivestreamViews(details.roomSize);
  //       // console.log('emitted');
  //       // console.log('inc', livestreamViews);
  //       setViewColor("green-500");
  //       setViewAnimate("animate-pulse");
  //       setTimeout(() => {
  //         setViewColor("white");
  //         setViewAnimate("animate-none");
  //       }, 3000);
  //     });
  //     socket.on("removecount", (roomSize) => {
  //       setLivestreamViews(roomSize);
  //       // console.log('removecount emitted');
  //       // console.log('dec', livestreamViews);
  //       setViewColor("red-500");
  //       setViewAnimate("animate-pulse");
  //       setTimeout(() => {
  //         setViewColor("white");
  //         setViewAnimate("animate-none");
  //       }, 3000);
  //     });
  //   }
  // }, [user.database.userData?.data?.user]);

  //set Stream Key
  const handleChange = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  };

  //add Stream Platform
  const addStreamingPlatform = async (props) => {
    setLoader(false);
    let postData = {
      username: user.database.userData?.data.user.username,
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
      url: `${process.env.REACT_APP_SERVER_URL}/user.database.userData?.data.user/add_multistream_platform`,
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
              `${process.env.REACT_APP_SERVER_URL}/user.database.userData?.data.user/getLoggedInUser`,
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
  async function handleRecord() {
    console.log("recording", !livepeerRecording, userStreams.id);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/toggleRecording`,
      data: {
        username: user.database.userData?.data.user.username,
        recording: !livepeerRecording,
        id: userStreams.id,
      },
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then((res) => {
        console.log(res);
        setlivepeerRecording(!livepeerRecording);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function uploadThumbnail(e) {
    e.preventDefault();
    if (selectedFile) {
      setUploadingFile(true);
      storeThumbnail(selectedFile.file)
        .then(async (cid) => {
          setUploadingFile(false);
          console.log(
            "https://nftstorage.link/ipfs/" +
              cid +
              "/" +
              selectedFile.file[0].name
          );
          const data = {
            url:
              "https://nftstorage.link/ipfs/" +
              cid +
              "/" +
              selectedFile.file[0].name,
            username: user.database.userData?.data.user.username,
          };
          axios({
            method: "POST",
            url: `${process.env.REACT_APP_SERVER_URL}/user/uploadThumbnail`,
            data: data,
            headers: {
              "content-type": "application/json",
              "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
            },
          })
            .then((res) => {
              console.log(res);
              user.toast("success", "Thumbnail Uploaded Successfully!");
            })
            .catch((err) =>
              user.toast("error", "Something went wrong please try again")
            );
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

  // console.log(user.database.userData?.data.user);

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
    if (user.database.userData?.data) {
      if (user.database.userData?.data.user.streamDetails) {
        setStreamDetails(user.database.userData?.data.user.streamDetails);
      }
    }
  }, [user.database.userData?.data?.user]);

  async function partialSignWithWallet(encodedTransaction) {
    //we have to pass the recoveredTransaction received in the previous step in the encodedTransaction parameter
    const connection = new Connection(
      clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK),
      "confirmed"
    );
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
      const connection = new Connection(
        clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK),
        "confirmed"
      );
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
          network: process.env.REACT_APP_SOLANA_NETWORK,
          creator_wallet: user.database.walletAddress,
          name: recordvideo?.videoName,
          symbol: "FLICK",
          attributes: JSON.stringify([{ trait_type: "Power", value: "100" }]),
          description: recordvideo?.description,
          external_url:
            "https://nftstorage.link/ipfs/" +
            cid +
            "/" +
            recordvideo.videoFile.name,
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
    if (streamDetails.name !== "" && streamDetails.category !== "") {
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
            setEditOption(false);
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
    if (user.database.userData?.data.user.streamDetails) {
      setStreamDetails(user.database.userData?.data.user.streamDetails);
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
            "https://nftstorage.link/ipfs/" +
              cid +
              "/" +
              selectedLinkFile.file[0].name
          );
          const data = {
            image:
              "https://nftstorage.link/ipfs/" +
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
    const now = new Date().getTime();
    const difference = s - now;
    difference > 0
      ? axios({
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
          })
      : user.toast(
          "error",
          "Please select a future date. Note that you cannot select a date that has already passed."
        );
  };
  return user.database.userData?.data ? (
    <div className="pt-20 bg-white  dark:bg-slate-900">
      <div className="flex flex-col gap-2 p-4 lg:flex-row">
        <div className="flex-1 space-y-2">
          <div className="overflow-hidden rounded-sm">
            {user.database.userData?.data.user &&
            user.database.userData?.data.user.livepeer_data.isActive ? (
              <Player
                title={
                  user.database.userData?.data.user &&
                  user.database.userData?.data.user.streamDetails
                    ? user.database.userData?.data.user.streamDetails.name
                    : "Mintflick Stream"
                }
                playbackId={
                  user.database.userData?.data.user.livepeer_data.playbackId
                }
                showPipButton
                autoPlay
                priority
                showTitle={false}
                poster={
                  user.database.userData?.data?.user.thumbnail
                    ? user.database.userData?.data.user.thumbnail
                    : placeholder
                }
                aspectRatio="16to9"
                controls={{
                  autohide: 3000,
                }}
                theme={{
                  borderStyles: { containerBorderStyle: "hidden" },
                  radii: { containerBorderRadius: "0px" },
                }}
              />
            ) : (
              // <ReactPlayer
              //   controls={true}
              //   width={"100%"}
              //   height={"max-content"}
              //   url={playbackUrl}
              //   creatorData={user.database.userData?.data.user}
              //   footer={false}
              // />
              <img
                className="object-cover w-full border-2 rounded-lg border-slate-500 aspect-video"
                src={
                  user.database.userData?.data?.user.thumbnail
                    ? user.database.userData?.data.user.thumbnail
                    : placeholder
                }
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-start w-full gap-2">
            <button
              onClick={() => setScheduleStreamModal(true)}
              className="flex items-center gap-1 px-3 py-2 font-semibold text-white rounded-full cursor-pointer hover:bg-primary-focus w-fit bg-primary"
            >
              <CalendarTime size={24} />
              Schedule upcoming Stream
            </button>
            {/* this is for making nft */}
            {/* {recording ? (
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer text-brand2 hover:bg-slate-50 hover:dark:bg-slate-700 w-fit bg-slate-100 dark:bg-slate-800"
                onClick={stopRecording}
              >
                <PlayerRecord className="text-error" size={24} />
                <p className="text-sm font-semibold">Stop Recording</p>
              </button>
            ) : (
              <button
                className="flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer text-brand2 hover:bg-slate-50 hover:dark:bg-slate-700 w-fit bg-slate-100 dark:bg-slate-800"
                onClick={startRecording}
              >
                <>
                  <PlayCard className="text-success" size={24} />
                  <p className="text-sm font-semibold">Create NFT</p>
                </>
              </button>
            )} */}

            {user.database.userData?.data.user &&
            user.database.userData?.data.user.streamSchedule > Date.now() &&
            !user.database.userData?.data.user.livepeer_data.isActive ? (
              <span className="flex items-center p-2 rounded-full w-fit bg-slate-100 dark:bg-slate-800">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-teal-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex w-full h-full bg-teal-600 rounded-full"></span>
                </span>
                <p className="mx-2 text-sm font-semibold text-brand2">
                  Stream Starting on{" "}
                  <span className="text-teal-600">
                    {moment(
                      user.database.userData?.data.user.streamSchedule * 1
                    ).format("MMMM Do YYYY, h:mm a")}
                  </span>
                </p>
              </span>
            ) : (
              <></>
            )}
            {user.database.userData?.data.user &&
            user.database.userData?.data.user.livepeer_data.isActive ? (
              <span className="flex items-center gap-1 px-3 py-2 rounded-full w-fit bg-slate-100 dark:bg-slate-800">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex w-full h-full bg-red-600 rounded-full"></span>
                </span>
                <p className="text-sm font-semibold text-brand2 ">Live now</p>
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-2 rounded-full text-brand2 w-fit bg-slate-100 dark:bg-slate-800">
                <AccessPointOff className="text-error" size={24} />
                <p className="text-sm font-semibold ">Offline</p>
              </span>
            )}
            <div
              onClick={handleRecord}
              className="flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer text-brand2 hover:bg-slate-50 hover:dark:bg-slate-700 w-fit bg-slate-100 dark:bg-slate-800"
            >
              {!livepeerRecording ? (
                <>
                  <VideoPlus className="text-success" size={24} />
                  <p className="text-sm font-semibold">Enable recording</p>
                </>
              ) : (
                <>
                  <VideoMinus className="text-error" size={24} />
                  <p className="text-sm font-semibold">Disable Recording</p>
                </>
              )}
            </div>
          </div>
          <div className="flex w-full gap-2">
            <div
              className={`${
                editOption && "modal-open"
              } modal  modal-bottom sm:modal-middle`}
            >
              <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
                <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
                  <div className="flex items-center justify-between p-2">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                      <Edit />
                      Stream details
                    </h3>
                    <X
                      onClick={() => {
                        setEditOption(false);
                      }}
                      className="cursor-pointer text-brand2"
                    ></X>
                  </div>
                </div>
                <form className="p-4" onSubmit={handleStreamDetails}>
                  <div>
                    <label className="text-sm  text-brand3">
                      Stream Title
                      <span className="mx-2 text-sm text-brand5 font-base ">
                        required
                      </span>
                    </label>
                    <input
                      className="w-full input"
                      required={true}
                      value={streamDetails?.name}
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
                    <label className="text-sm  text-brand3">
                      Stream Description{" "}
                    </label>
                    <textarea
                      value={streamDetails?.description}
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
                  <div className="mt-1">
                    <label className="text-sm  text-brand3">
                      Stream Category{" "}
                      <span className="mx-2 text-sm text-brand5 font-base ">
                        required
                      </span>
                    </label>
                    <select
                      required={true}
                      className="block w-full select"
                      onChange={(e) => {
                        setStreamDetails({
                          ...streamDetails,
                          category: e.target.value,
                        });
                        setUndoButton(true);
                      }}
                      value={streamDetails?.category}
                    >
                      <option disabled selected>
                        Categories
                      </option>
                      {category.map((c) => (
                        <option>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
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
                    <button className="w-full btn btn-success" type="submit">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-col flex-grow gap-1 p-2 text-brand3 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl ">
              <div className="flex items-center justify-start gap-2 text-base font-semibold text-brand5">
                Stream Title
                <span
                  className="text-xs cursor-pointer text-primary"
                  onClick={() => setEditOption(true)}
                >
                  edit
                </span>
              </div>
              <div className="text-base text-brand2 ">
                {streamDetails?.name}
              </div>
            </div>
            <div className="flex flex-col gap-1 p-2 w-fit text-brand3 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl ">
              <div className="flex items-center justify-start gap-2 text-base font-semibold text-brand5">
                Stream Category{" "}
                <span
                  className="text-xs cursor-pointer text-primary"
                  onClick={() => setEditOption(true)}
                >
                  edit
                </span>
              </div>
              <div className="text-base text-brand2 w-fit ">
                {streamDetails?.category}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col gap-1 p-2 text-brand3 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl ">
              <div className="flex items-center justify-start gap-2 text-base font-semibold text-brand5">
                Stream Description{" "}
                <span
                  className="text-xs cursor-pointer text-primary"
                  onClick={() => setEditOption(true)}
                >
                  edit
                </span>
              </div>
              <div className="text-base text-brand2 ">
                {streamDetails?.description}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col gap-1 p-2 text-brand3 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl ">
              <div className="text-base font-semibold text-brand5">
                Add banners to live stream (Max 4)
              </div>
              <div className="flex flex-wrap w-full">
                {user.database.userData?.data.user.streamLinks &&
                  user.database.userData?.data.user.streamLinks.map(
                    (link, index) => (
                      <div key={index} className="relative w-1/2 p-2">
                        <img
                          className="object-cover w-full rounded-md aspect-video"
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
              {user.database.userData?.data.user.streamLinks.length < 4 && (
                <form onSubmit={uploadLink} className="space-y-1">
                  <progress
                    hidden={!uploadingLink}
                    className="w-full progress progress-success dark:bg-slate-400"
                  ></progress>
                  <label
                    htmlFor="file"
                    className="flex items-center justify-start w-full gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer  border-slate-400 dark:border-slate-600 text-brand4"
                  >
                    {selectedLinkFile ? (
                      selectedLinkFile.file ? (
                        `${selectedLinkFile.file[0].name.substring(0, 10)}`
                      ) : null
                    ) : (
                      <>
                        Choose Image( PNG, JPG, GIF)
                        <span className="text-xl text-red-600">*</span>
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
                  <div className="flex flex-col w-full gap-2 sm:flex-row">
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
                      className="flex-grow input"
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

        <div className="flex flex-col w-full gap-2 lg:w-96">
          <div className="w-full collapse collapse-open text-brand3 bg-slate-100 dark:bg-slate-800 rounded-xl ">
            <input type="checkbox" />
            <div className="text-xl font-medium collapse-title">
              <span className="text-base font-semibold ">
                Streaming Details
              </span>
            </div>
            <div className="w-full space-y-2 collapse-content">
              <div className="flex w-full gap-2 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">Name</span>
                <p className="text-base text-brand4">
                  {user.database.userData?.data.user.name}
                </p>
              </div>
              <div className="flex w-full gap-2 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">Username</span>
                <p className="text-base text-brand4">
                  {user.database.userData?.data.user.username}
                </p>
              </div>
              <div className="flex flex-col gap-1 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">RTMP URL</span>
                <p className="flex gap-1 text-base text-brand4">
                  rtmp://rtmp.livepeer.com/live
                  <CopyToClipboard text="rtmp://rtmp.livepeer.com/live" />
                </p>
              </div>
              <div className="flex flex-col gap-1 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">Streamer Key</span>
                <p className="flex gap-1 text-base text-brand4">
                  {userStreams.streamKey}
                  <CopyToClipboard text={userStreams.streamKey} />
                </p>
              </div>
              <div className="flex flex-col gap-1 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">Playback URL</span>
                <p className="flex gap-1 text-base text-brand4">
                  <span className="w-5/6 truncate">{playbackUrl}</span>
                  <CopyToClipboard text={playbackUrl} />
                </p>
              </div>
              <div className="flex flex-col gap-1 p-2 border-2 rounded-md border-slate-200 dark:border-slate-700 text-brand3">
                <span className="text-base font-semibold">
                  Live URL{" "}
                  <span className="ml-2 text-sm text-brand6">
                    Share this with viwers.
                  </span>
                </span>
                <p className="flex gap-1 text-base text-brand4">
                  <a
                    className="w-5/6 truncate"
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {liveUrl}
                  </a>
                  <CopyToClipboard text={liveUrl} />
                </p>
              </div>
              {/* Stream Title */}
              {/* Stream Schedule */}
              {/* Stream Links */}
              <div className="hidden">
                <div className="flex flex-col">
                  <p className="mb-1 text-center">Currently Connected :</p>
                  <div className="flex flex-wrap justify-center">
                    {multiStreamConnected.map((value, index) => {
                      ////console.log(value);
                      return (
                        <div key={index} className="m-1">
                          <img
                            src={value.platform.logo}
                            alt="logo"
                            className="w-auto h-6 lg:h-10"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-1 mx-auto nm-flat-dbeats-dark-primary-sm rounded-3xl hover:nm-inset-dbeats-dark-secondary-xs w-max">
                    <button
                      variant="primary"
                      className="flex content-center justify-center px-2 py-3 font-bold tracking-widest text-center text-white align-middle bg-dbeats-dark-secondary hover:nm-inset-dbeats-light rounded-3xl w-max"
                      type="button"
                      onClick={
                        multiStreamConnected.length < 3
                          ? () => setShowDestinationModal(true)
                          : () => setShowPriceModal(true)
                      }
                    >
                      Add MultiStream Platforms
                      <i className="pt-1 mx-2 cursor-pointer fas fa-solid fa-video"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2 text-brand3 h-fit bg-slate-100 dark:bg-slate-800 rounded-xl ">
            <span className="text-base font-semibold">Thumbnail</span>
            {selectedFile ? (
              <img
                src={selectedFile.localurl}
                className="object-cover w-full rounded-md aspect-video"
              ></img>
            ) : user.database.userData?.data.user.thumbnail ? (
              <img
                src={user.database.userData?.data.user.thumbnail}
                className="object-cover w-full rounded-md aspect-video"
              ></img>
            ) : null}
            <progress
              hidden={!uploadingFile}
              className="w-full progress progress-success dark:bg-slate-400"
            ></progress>
            <form
              className="flex flex-col items-center gap-1"
              onSubmit={uploadThumbnail}
            >
              <input
                className="w-full p-0 input h-fit "
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
        </div>
      </div>

      {/* {newRecord === 1 ? (
        <div className="flex justify-between px-10 py-6 m-6 bg-dbeats-dark-secondary">
          <div className="flex justify-center w-full">
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
                    className="block text-sm font-medium text-gray-700 2xl:text-sm lg:text-xs dark:text-gray-100"
                  >
                    Video Title
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="videoName"
                      id="videoName"
                      value={recordvideo.videoName}
                      onChange={handleVideoInputs}
                      className="flex-1 block w-full border border-gray-300 rounded-md focus:ring-dbeats-dark-primary dark:border-dbeats-alt dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary ring-0 sm:text-sm "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                <div className="col-span-8 lg:col-span-4 sm:col-span-4">
                  <label
                    htmlFor="company-website"
                    className="block text-sm font-medium text-gray-700 2xl:text-sm lg:text-xs dark:text-gray-100"
                  >
                    Category
                  </label>
                  <div className="flex rounded-md shadow-sm"></div>
                </div>
                <div className="col-span-8 lg:col-span-4 sm:col-span-4">
                  <label
                    htmlFor="videoName"
                    className="block mr-2 text-sm font-medium text-gray-700 2xl:text-sm lg:text-xs dark:text-gray-100"
                  >
                    Pricing
                  </label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={recordvideo.price}
                      onChange={handleVideoInputs}
                      className="flex-1 block w-full border border-gray-300 rounded-md focus:ring-dbeats-dark-primary dark:border-dbeats-alt dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary ring-0 sm:text-sm "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 2xl:text-sm lg:text-xs dark:text-gray-100"
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
                    className="flex-1 block w-full border border-gray-300 rounded-md dark:placeholder-gray-600 focus:ring-dbeats-dark-primary dark:border-dbeats-alt dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary ring-0 sm:text-sm "
                    placeholder="Any Behind the scenes you'll like your Audience to know!"
                  />
                </div>
              </div>

              <div className="flex items-center float-right pt-20">
                <div
                  hidden={hideButton}
                  onClick={() => {
                    // mintNFT();
                    // setHideButton(true);
                  }}
                  className="px-12 py-2 font-bold text-white rounded-md cursor-pointer w-max nowrap text-md bg-dbeats-light"
                >
                  Mint NFT
                </div>

                {recordvideo.cid == null ? (
                  <div
                    hidden={!hideButton}
                    className="flex items-center w-64 mx-5 "
                  >
                    <input
                      type="range"
                      defaultValue={uploading}
                      min="0"
                      max="100"
                      hidden={!hideButton}
                      className="w-full h-3 bg-green-400 rounded-full appearance-none cursor-pointer font-white slider-thumb backdrop-blur-md"
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
        <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
            <div className="flex items-center justify-between p-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                Mint video
              </h3>
              <X
                onClick={() => clearNftMintModalData()}
                className="cursor-pointer text-brand2"
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
              className="w-full progress progress-success dark:bg-slate-400"
            ></progress>
            <div className="flex gap-2">
              <input
                type="text"
                name="videoName"
                id="videoName"
                value={recordvideo.videoName}
                onChange={handleVideoInputs}
                className="w-full input "
                placeholder="Enter video title..."
              />
              <input
                type="text"
                name="price"
                id="price"
                value={recordvideo.price}
                onChange={handleVideoInputs}
                className="w-full input"
                placeholder="Enter price..."
              />
            </div>
            <select className="w-full select" onChange={(e) => {}}>
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
              className="w-full textarea"
              placeholder="Any Behind the scenes you'll like your Audience to know!"
            />
            {mintSuccess && (
              <p className="w-full my-2 text-center text-green-500">
                {mintSuccess}
              </p>
            )}
            <div className="flex w-full px-1 -ml-1 space-x-2">
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
                <button className="w-1/2 btn btn-brand " onClick={saveStream}>
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
        <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
            <div className="flex items-center justify-between p-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                <CalendarEvent /> Select Date and Time
              </h3>
              <X
                onClick={() => setScheduleStreamModal(false)}
                className="cursor-pointer text-brand2"
              ></X>
            </div>
          </div>
          <form onSubmit={handleStreamSchedule} className="m-4 space-y-2 ">
            <div className="flex flex-col items-center justify-center w-full gap-4 py-8 ">
              <span
                onClick={() => dateTimePicker.current.showPicker()}
                className="flex items-center gap-1 mx-auto text-4xl font-bold text-center text-brand1 underline-offset-8"
              >
                {moment(streamSchedule).format("Do MMMM  YYYY h:mm a")}
                <CalendarEvent
                  className="w-10 h-10 p-2 rounded-full cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-900 text-primary"
                  size={24}
                />
              </span>
              <span
                onClick={() => dateTimePicker.current.showPicker()}
                className="w-full text-2xl font-bold text-center text-brand5 "
              >
                {countdown(streamSchedule)}{" "}
                <span className="w-full text-xl font-bold text-center text-brand7">
                  From now
                </span>
              </span>
              <input
                ref={dateTimePicker}
                className="sr-only"
                value={streamSchedule}
                onChange={(e) => {
                  setStreamSchedule(e.target.value);
                  console.log(e.target.value);
                }}
                type={"datetime-local"}
                min={moment().format("Do MMMM  YYYY")}
              />
            </div>
            <input
              className="w-full capitalize btn btn-brand "
              value={"Schedule stream"}
              type={"submit"}
            />
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-screen h-screen bg-slate-100 dark:bg-slate-800 ">
      <Loading />
    </div>
  );
}

export default GoLive;
