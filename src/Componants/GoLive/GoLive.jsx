import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import { io } from "socket.io-client";
import axios from "axios";
import { makeStorageClient } from "../../Helper/uploadHelper";
import ReactPlayer from "react-player";
import { CalendarTime, X } from "tabler-icons-react";
import moment from "moment";
import useUserActions from "../../Hooks/useUserActions";
import CopyToClipboard from "../CopyButton/CopyToClipboard";
import { motion, useDragControls } from "framer-motion";
import useWindowDimensions from "../../Hooks/useWindowDimentions";

function GoLive() {
  const user = useContext(UserContext);
  const [playbackUrl, setPlaybackUrl] = useState("");
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
  const [mintingProgress, setMintingProgress] = useState(0);

  const [isNFT, setIsNFT] = useState(true);
  const [NFTprice, setPrice] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sharable_data, setsharable_data] = useState();
  const [tokenId, setTokenId] = useState(null);
  const [formData, setFormData] = useState(null);

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

  useEffect(() => {
    console.log(streamDetails);
  }, [streamDetails]);
  useEffect(() => {
    if (user.database.userData.data) {
      if (user.database.userData.data.user.streamDetails) {
        setStreamDetails(user.database.userData.data.user.streamDetails);
      }
    }
  }, [user.database.userData.data?.user]);
  // on Stream Details Submit
  const handleStreamDetails = async (e) => {
    e.preventDefault();
    if (streamDetails.name != "" && streamDetails.description != "") {
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
            loadUser();
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const cancelStreamDetails = () => {
    if (user.database.userData.data.user.streamDetails) {
      setStreamDetails(user.database.userData.data.user.streamDetails);
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
  const deleteStreamLink = (link) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/deleteStreamLink`,
      data: link,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then((res) => {
        loadUser();
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
      <div className="flex p-4 gap-2">
        <div className="w-96 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl p-2 space-y-2">
          <div className="flex gap-2">
            <div className="w-1/2 p-2 flex gap-2 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
              <span className="font-semibold text-base">Name</span>
              <p className="text-base text-brand4">
                {user.database.userData.data.user.name}
              </p>
            </div>
            <div className="w-1/2 p-2 flex gap-2 border-2 border-slate-200 dark:border-slate-700  rounded-md text-brand3">
              <span className="font-semibold text-base">Username</span>
              <p className="text-base text-brand4">
                {user.database.userData.data.user.username}
              </p>
            </div>
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
                href={`https://beta.mintflick.app/live/${user.database.userData.data.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${process.env.REACT_APP_CLIENT_URL}/live/${user.database.userData.data.user.username}`}
              </a>
              <CopyToClipboard text={playbackUrl} />
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

        <div className="flex-1 space-y-2">
          <div className="rounded-xl overflow-hidden">
            <ReactPlayer
              controls={true}
              width={"100%"}
              height={"max-content"}
              url={playbackUrl}
              creatorData={user.database.userData.data.user}
              footer={false}
            />
          </div>
          <div className="w-full flex justify-start gap-2">
            <button
              onClick={() => setScheduleStreamModal(true)}
              className="btn btn-outline btn-primary rounded-full gap-1"
            >
              <CalendarTime />
              Schedule The Stream
            </button>

            <div className=" flex items-center  w-fit bg-slate-100 dark:bg-slate-800  rounded-full ">
              <p className="text-sm font-semibold text-brand2 mx-4">
                To create NFT
              </p>
              {!recording ? (
                <button
                  className="btn  btn-success rounded-full"
                  onClick={startRecording}
                >
                  Start Recording
                </button>
              ) : (
                <button
                  className="btn  btn-error rounded-full"
                  onClick={stopRecording}
                >
                  Stop Recording
                </button>
              )}
            </div>
          </div>
          <div className="mt-4">
            {user.database.userData.data.user &&
            new Date(user.database.userData.data.user.streamSchedule) >
              new Date() &&
            !user.database.userData.data.user.livepeer_data.isActive ? (
              <span className="border px-5 py-3 mt-2 rounded  mr-1 md:text-lg ml-2 text-sm tracking-wider text-slate-200">
                <i className="fa-solid text-red-500 fa-circle text-sm mr-2"></i>
                Stream Starting on{" "}
                {moment(
                  user.database.userData.data.user.streamSchedule,
                  "YYYY-MM-DDThh:mm"
                ).format("MMMM Do YYYY, h:mm a")}
              </span>
            ) : null}
          </div>
          <div className="mt-2">
            <div className="text-white text-base font-semibold mb-2">
              Banners (Max 4)
            </div>
            {user.database.userData.data.user.streamLinks.length < 4 && (
              <div className="mt-3">
                <form onSubmit={uploadLink}>
                  <div>Create new banner </div>
                  <div className="flex">
                    <div className="border-2 border-white border-dashed p-3 mt-1">
                      <div className="text-center">
                        <i className="fa-solid text-3xl fa-file-image"></i>
                      </div>
                      <label
                        htmlFor="file"
                        className="whitespace-nowrap text-sm text-center rounded py-1 px-2 text-dbeats-light bg-dbeats-alt cursor-pointer"
                      >
                        {selectedLinkFile ? (
                          selectedLinkFile.file ? (
                            `${selectedLinkFile.file[0].name.substring(0, 10)}`
                          ) : null
                        ) : (
                          <>
                            Choose Image{" "}
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

                      <div className="text-center text-sm text-gray-500">
                        PNG, JPG, GIF
                      </div>
                    </div>
                    <div className="flex-1 mt-1">
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
                        className="w-full bg-transparent text-sm ml-2 border border-gray-300 py-2"
                        type={"url"}
                      />
                      <div className="flex mt-1 justify-end  items-center">
                        <input
                          disabled={uploadingLink}
                          type={"submit"}
                          value="Add Banner"
                          className="mt-1 cursor-pointer bg-dbeats-alt   text-dbeats-light border-dbeats-light px-2 py-1  rounded-md"
                        />
                        <div
                          className="animate-spin rounded-full h-5 w-5 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                          hidden={!uploadingLink}
                        ></div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
            <div className="mt-3">
              <div className="text-white text-base font-semibold mb-2">
                Banners
              </div>
              <div className="flex flex-wrap mx-6">
                {user.database.userData.data.user.streamLinks
                  ? user.database.userData.data.user.streamLinks.map(
                      (link, index) => {
                        return (
                          <div
                            key={index}
                            className="border border-dbeats-light rounded-md w-32 mx-6 pb-2 pt-1 my-1"
                          >
                            <div className="text-dbeats-light text-right">
                              <X
                                onClick={() => deleteStreamLink(link)}
                                className="ml-auto pr-1 cursor-pointer"
                              ></X>
                            </div>
                            <img src={link.image} className="w-full pt-2" />
                            <div className="text-center p-1 pt-3">
                              <div className="break-words">{link.url}</div>
                              {/* <button><i className="text-md fa-solid mx-2 fa-trash"></i></button> */}
                            </div>
                          </div>
                        );
                      }
                    )
                  : null}
              </div>
            </div>
          </div>
          {user.database.userData.data.user.livepeer_data
            ? user.database.userData.data.user.livepeer_data.isActive && (
                <div className="dark:text-dbeats-white mt-3 ml-2">
                  <p className="text-md">To create NFT start Recording</p>
                  <div className="flex justify-between items-center w-full pt-2 text-white">
                    <div className="flex w-1/2">
                      <button
                        className={`text-center rounded-md w-60 
                    ${recording ? "bg-green-300" : "bg-green-600"} mx-2 py-2`}
                        disabled={recording}
                        onClick={startRecording}
                      >
                        Start Recording
                      </button>
                      {recording ? (
                        <button
                          className={`text-center rounded-md w-60 
                    ${!recording ? "bg-red-300" : "bg-red-600"} mx-2 py-2`}
                          disabled={!recording}
                          onClick={stopRecording}
                        >
                          Stop Recording
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    <p
                      className={`text-white text-lg text-center pr-2 flex flex-col`}
                    >
                      <span
                        className={` text-${viewColor}  ${viewAnimate} font-bold`}
                      >
                        {livestreamViews}
                      </span>
                      viewers
                    </p>
                  </div>
                </div>
              )
            : null}
        </div>

        <div className="w-64 flex flex-col gap-2">
          <div className="p-2 flex flex-col gap-1 text-brand3 h-fit bg-slate-100 dark:bg-slate-800  rounded-xl ">
            <form onSubmit={handleStreamDetails}>
              <div>
                <label className=" text-sm text-brand3">Stream Title </label>
                <input
                  className="input w-full"
                  required={true}
                  value={streamDetails.name}
                  onChange={(e) =>
                    setStreamDetails({
                      ...streamDetails,
                      name: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setStreamDetails({
                      ...streamDetails,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full textarea"
                  type="text"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelStreamDetails}
                  className="btn btn-sm btn-ghost"
                >
                  reset
                </button>
                <input
                  className="btn btn-sm btn-success"
                  type="submit"
                  value="update"
                />
              </div>
            </form>
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
          </div>
        </div>
      </div>
      {newRecord === 1 ? (
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
      ) : null}

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
                Schedule The Stream
              </h3>
              <X
                onClick={() => setScheduleStreamModal(false)}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <div className="mx-10 mb-5">
            <form onSubmit={handleStreamSchedule}>
              <label className="text-sm text-white">Select Date & Time</label>
              <input
                value={streamSchedule}
                onChange={(e) => setStreamSchedule(e.target.value)}
                className="w-full"
                type={"datetime-local"}
                min={moment().format("YYYY-MM-DDThh:mm")}
                required={true}
              />
              <div className="flex justify-end">
                <input
                  className="mt-5  bg-transparent text-base px-3 py-2 cursor-pointer rounded border text-slate-200"
                  value={"Schedule"}
                  type={"submit"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default GoLive;
