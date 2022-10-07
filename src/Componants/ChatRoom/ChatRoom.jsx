import React, { useEffect, useRef, useState } from "react";
import "./chatroom.css";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import person from "../../Assets/profile-pic.png";
import ReactAudioPlayer from "react-audio-player";
import LoadingBar from "react-top-loading-bar";
import Loading from "../Loading/Loading";
import ChatLinkPreview from "./ChatLinkPreview";
import InfiniteScroll from "react-infinite-scroller";
import { useContext } from "react";
import { UserContext } from "../../Store";
import { Link, useLocation, useParams } from "react-router-dom";
import { makeStorageClient } from "../../Helper/uploadHelper";
import { detectURLs } from "../../Helper/uploadHelperWeb3Storage";
import placeholderImage from "../../Assets/profile-pic.png";

import {
  ArrowBackUp,
  ChevronDown,
  CloudDownload,
  File,
  Send,
  Video,
} from "tabler-icons-react";
import ReactPlayer from "react-player";
import TextChannels from "../Profile/TextChannels";
import ChatsList from "./ChatsList";
import { Image } from "react-img-placeholder";
import axios from "axios";
import ProfileVisitCard from "../Profile/ProfileVisitCard";

// https://mintflickchats.herokuapp.com
const socket = io(`${process.env.REACT_APP_CHAT_URL}`, {
  autoConnect: false,
});

function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = useContext(UserContext);
  const [showButton, setShowButton] = useState(false);

  const location = useLocation();
  const { username } = useParams();
  const { isDM, user2 } = location.state;
  const chatRef = useRef(null);
  const loadingRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: "",
    replyto: null,
  });

  const imageInput = useRef();
  const soundInput = useRef();
  const videoInput = useRef();
  const fileInput = useRef();

  // For reply click ref
  const scrollTop = useRef(null);
  const messageRef = useRef([]);
  const [goToMessage, setGoToMessage] = useState(false);
  function scrollTo(id) {
    setGoToMessage(id);
  }

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (goToMessage) {
      if (messageRef.current[goToMessage]) {
        console.log("scrolling to " + goToMessage);
        messageRef.current[goToMessage].scrollIntoView();
        setGoToMessage(false);
      } else {
        console.log("loading chats ");
        scrollTop.current.scrollIntoView();
      }
    }
  }, [messages, goToMessage]);
  const dates = new Set();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Smart Links
  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [linkPreviewData, setLinkPreviewData] = useState(null);

  // For Pagination
  const [totalPages, setTotalpages] = useState(0);
  const [currentPage, setCurrentpage] = useState(0);
  const [loadingOldChats, setLoadingOldChats] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setForm({ ...formState, message: formState.message + emojiObject.emoji });
  };

  const [roomId, setRoomId] = useState(null);
  useEffect(() => {
    // initialize gun locally
    if (user.database.userData.data) {
      loadingRef.current.continuousStart();
      socket.connect();
      if (!isDM) {
        socket.emit("joinroom", {
          user_id: user.database.userData.data.user._id,
          room_id: username,
        });
      } else {
        socket.emit("joindm", {
          user_id: user.database.userData.data.user.id,
          room_id: user2.id,
        });
      }
      socket.on("init", (msgs) => {
        if (loadingRef.current) {
          loadingRef.current.complete();
        }
        setMessages(msgs.chats);
        setTotalpages(msgs.totalPages);
        setCurrentpage(msgs.currentPage);
        if (msgs.roomId) setRoomId(msgs.roomId);
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            });
          }
        }, 1000);
      });
      socket.on("getmore", (msgs) => {
        // loadingRef.current.complete();
        setMessages((prevArray) => [...msgs.chats, ...prevArray]);
        setTotalpages(msgs.totalPages);
        setCurrentpage(msgs.currentPage);
        setLoadingOldChats(false);
        // setTimeout(() => {
        //   chatRef.current.scrollIntoView({ behavior: 'smooth' });
        // }, 1500);
      });
      socket.on("message", (msg) => {
        console.log("mesg income");
        setMessages((prevArray) => [...prevArray, msg]);
        setTimeout(() => {
          chatRef.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        }, 200);
      });
    } else {
      window.history.replaceState({}, "Home", "/");
    }
    return () => {
      socket.disconnect();
      socket.off("message");
      socket.off("getmore");
      socket.off("init");
    };
    // eslint-disable-next-line
  }, [username]);

  useEffect(() => {
    console.log("msg");
  }, [messages]);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage(e) {
    e.preventDefault();
    if (selectedFile) {
      setUploadingFile(true);
      storeWithProgress(selectedFile.file)
        .then((cid) => {
          setUploadingFile(false);
          console.log(
            "https://ipfs.io/ipfs/" + cid + "/" + selectedFile.file[0].name
          );
          let room = {
            room_admin: username,
            chat: {
              user_id: user.database.userData.data.user._id,
              type: selectedFile.type,
              message: formState.message,
              createdAt: Date.now(),
              url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedFile.file[0].name,
              size: selectedFile.size,
            },
          };
          if (formState.replyto) {
            room.chat.reply_to = formState.replyto;
          }
          if (!isDM) {
            socket.emit("chatMessage", room);
          } else {
            console.log("emmiting chatDM");
            socket.emit("chatDM", {
              chat: room.chat,
              user_id: user.database.userData.data.user.id,
              user2_id: user2.id,
              room_id: roomId,
            });
          }
          setForm({
            message: "",
            replyto: null,
          });
          setShowEmojis(false);
          setShowAttachmentDropdown(false);
          setSelectedFile(null);
        })
        .catch((err) => {
          console.log(err);
          setForm({
            message: "",
            replyto: null,
          });
          setUploadingFile(false);
          setShowEmojis(false);
          setShowAttachmentDropdown(false);
          setSelectedFile(null);
        });
      return;
    }
    let room = {
      room_admin: username,
      chat: {
        user_id: user.database.userData.data.user._id,
        username: user.database.userData.data.user.username,
        profile_image: user.database.userData.data.user.profile_image,
        type: "text",
        message: formState.message,
        createdAt: Date.now(),
      },
    };
    if (formState.replyto) {
      room.chat.reply_to = formState.replyto;
    }
    if (socket) {
      if (!isDM) {
        socket.emit("chatMessage", room);
      } else {
        socket.emit("chatDM", {
          chat: room.chat,
          user_id: user.database.userData.data.user.id,
          user2_id: user2.id,
          room_id: roomId,
        });
      }
    }
    setForm({
      message: "",
      replyto: null,
    });
    setShowEmojis(false);
  }
  const renderDate = (chat, dateNum) => {
    const timestampDate = new Date(chat.createdAt);
    // Add to Set so it does not render again
    const today = new Date(Date.now());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    dates.add(dateNum);
    if (timestampDate.toDateString() == today.toDateString()) {
      return <p className="text-center text-sm">Today</p>;
    } else if (timestampDate.toDateString() == yesterday.toDateString()) {
      return <p className="text-center text-sm">Yesterday</p>;
    }
    return (
      <p className="text-center text-sm">{timestampDate.toDateString()}</p>
    );
  };
  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  const onreply = (message) => {
    setForm({ ...formState, replyto: message });
  };
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile({
      type: event.target.name,
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
    setShowAttachmentDropdown(false);
  };

  async function storeWithProgress(files) {
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

  // FOr Links
  // use whatever you want here
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
  const renderText = (txt) =>
    txt
      .split(" ")
      .map((part) =>
        URL_REGEX.test(part) ? <a href={part}>{part} </a> : part + " "
      );

  return (
    <div className=" flex h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4 pt-24 space-y-6 overflow-y-auto">
        <ChatsList userName={username} />
      </div>
      <div className=" relative  rounded-lg flex flex-col lg:w-2/4 w-full overflow-clip  mt-14 lg:mt-24 bg-slate-100 dark:bg-slate-800 ">
        <div className=" w-full h-fit p-1 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-300 dark:bg-slate-800">
          <Link
            to={`../profile/${username}`}
            className=" w-full flex cursor-pointer items-center gap-2   p-1"
          >
            <Image
              width={42}
              height={42}
              className="h-full rounded-full border-2"
              src={placeholderImage}
              alt="profileImage"
              placeholderSrc={placeholderImage}
            />
            <p className="cursor-pointer text-base font-medium text-brand3">
              {username}
            </p>
          </Link>
        </div>

        <LoadingBar ref={loadingRef} color="#00d3ff" shadow={true} />

        <div className=" h-full overflow-y-scroll	overflow-x-hidden ">
          <div ref={scrollTop}></div>
          <InfiniteScroll
            className="px-4"
            pageStart={0}
            loadMore={() => {
              if (socket && currentPage > 0 && !loadingOldChats) {
                setLoadingOldChats(true);
                if (isDM) {
                  socket.emit("loaddm", {
                    user_id: user.database.userData.data.user.id,
                    room_id: user2.id,
                    page_no: currentPage - 1,
                  });
                } else {
                  socket.emit("loadmore", {
                    user_id: user.database.userData.data.user._id,
                    room_id: username,
                    page_no: currentPage - 1,
                  });
                }
              }
            }}
            hasMore={currentPage > 0}
            loader={
              <Loading /> // <div className="flex justify-center">
              //   <div className="text-center animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "></div>
              // </div>
            }
            useWindow={false}
            isReverse={true}
          >
            {messages
              ? messages.map((message, index) => {
                  const dateNum = new Date(message.createdAt);
                  let size = 0;
                  let urls = detectURLs(message.message);
                  let urlstext = renderText(message.message);
                  return (
                    <div className="w-full">
                      {dates.has(dateNum.toDateString()) ? null : (
                        <p className="text-sm text-brand4 font-semibold py-1 px-3 w-fit mx-auto my-1 rounded-full bg-slate-200 dark:bg-slate-700">
                          {renderDate(message, dateNum.toDateString())}
                        </p>
                      )}

                      <div
                        className={` w-full my-2`}
                        key={message._id}
                        ref={(el) => (messageRef.current[message._id] = el)}
                      >
                        <div
                          className={
                            message.username &&
                            message.username ===
                              user.database.userData.data.user.username
                              ? "flex items-start md:items-end flex-row-reverse gap-1 group w-full"
                              : "flex items-start md:items-end gap-1 group w-full"
                          }
                        >
                          <div className="hidden md:block w-fit max-w-full h-full space-y-1">
                            <div
                              className="opacity-0 group-hover:opacity-100 cursor-pointer p-1 w-fit text-sm text-teal-700 font-semibold rounded-full bg-slate-200 dark:bg-slate-700"
                              onClick={() => onreply(message)}
                            >
                              <ArrowBackUp />
                            </div>

                            <img
                              className="w-8 h-8 rounded-full object-cover "
                              alt="profile"
                              src={
                                message.profile_image
                                  ? message.profile_image
                                  : person
                              }
                            />
                          </div>
                          <div
                            className={`p-2 bg-slate-200 dark:bg-slate-700 rounded-md space-y-2`}
                          >
                            <p
                              className={`flex gap-1 justify-between items-center text-base font-bold text-brand3`}
                            >
                              {message.username ===
                              user.database.userData.data.user.username
                                ? "You"
                                : message.username}
                              {message.type == "live" ? (
                                <span className="text-white bg-rose-700 rounded-md font-normal px-2 mx-1 text-sm">
                                  LIVE
                                </span>
                              ) : null}
                              <span className="text-sm font-semibold text-brand5 ">
                                {new Date(message.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </span>
                            </p>
                            {message.reply_to ? (
                              <div
                                onClick={() => scrollTo(message.reply_to._id)}
                                className={`cursor-pointer flex justify-between items-center group p-2 border-l-4  bg-slate-300 dark:bg-slate-800 rounded-md ${
                                  message.reply_to.username ===
                                  user.database.userData.data.user.username
                                    ? "border-green-400 drak:border-green-700"
                                    : "border-violet-400 drak:border-violet-700"
                                }`}
                              >
                                <div className="">
                                  <p
                                    className={
                                      "text-base text-brand2 text-semibold"
                                    }
                                  >
                                    {message.reply_to.username ===
                                    user.database.userData.data.user.username
                                      ? "You"
                                      : message.reply_to.username}
                                  </p>
                                  <p className="text-sm w-48  truncate text-brand3">
                                    {message.reply_to.message}
                                  </p>
                                </div>
                                <div className="p-2">
                                  {message.reply_to.type == "image" && (
                                    <i className="fas fa-image text-2xl text-brand3"></i>
                                  )}
                                  {message.reply_to.type == "sound" && (
                                    <i className="fas fa-music text-2xl text-brand3"></i>
                                  )}
                                  {message.reply_to.type == "video" && (
                                    <i className="fas fa-video text-2xl text-brand3"></i>
                                  )}
                                  {message.reply_to.type == "file" && (
                                    <i className="fas fa-file text-2xl text-brand3"></i>
                                  )}
                                </div>
                              </div>
                            ) : null}
                            {message.type == "image" ? (
                              <div className="relative after:w-250 h-fit group rounded-md overflow-clip">
                                <img width={250} src={message.url}></img>
                                {/* <p className="text-brand4 text-xs">
                                  {message.url.split("/").pop()}
                                </p> */}
                                {/* <p className="text-brand4 text-xs ">
                                  Size: {"1024 kb"}
                                </p> */}
                                <a
                                  className=" gap-1 items-center py-1 px-2 rounded-full text-slate-500 text-sm font-semibold bg-slate-50/50  bottom-2 right-2 absolute hidden  group-hover:flex"
                                  href={message.url}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <CloudDownload size={20} />
                                  Download
                                </a>
                              </div>
                            ) : null}
                            {/* audio option desabled  */}
                            {/* {message.type == "sound" ? (
                              <div className=" md:ml-3 p-2 border border-dbeats-light rounded-md">
                                <div className="md:flex items-center">
                                  <i className="fas fa-music text-4xl text-dbeats-light"></i>
                                  <ReactAudioPlayer
                                    className="w-full md:w-44"
                                    src={message.url}
                                    controls
                                  />
                                </div>
                                <p className="text-gray-400 text-xs">
                                  {message.url.split("/").pop()}
                                </p>
                                <p className="text-gray-400 text-xs hidden">
                                  Size: {"1024 kb"}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  <a
                                    href={message.url}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Download
                                  </a>
                                </p>
                              </div>
                            ) : null} */}
                            {message.type == "video" ? (
                              <div className="flex gap-1 items-center p-2 text-brand4 bg-slate-300 dark:bg-slate-800 rounded-md">
                                <Video />
                                <p className="font-semibold text-sm w-24 truncate">
                                  {message.url.split("/").pop()}
                                </p>
                                {/* <p className="text-gray-400 text-xs">
                                  Size: {"1024 kb"}
                                </p> */}
                                <a
                                  className="btn btn-sm btn-ghost text-success ml-auto capitalize"
                                  href={message.url}
                                  download
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  Download
                                </a>
                              </div>
                            ) : null}
                            {message.type == "file" ? (
                              <div className="flex gap-1 items-center p-2 text-brand4 bg-slate-300 dark:bg-slate-800 rounded-md">
                                <File />
                                <p className="font-semibold text-sm w-24 truncate">
                                  {message.url.split("/").pop()}
                                </p>
                                {/* <p className="text-gray-400 text-xs ">
                                  Size: {"1024 kb"}
                                </p> */}
                                <p className="text-gray-400 text-xs">
                                  <a
                                    className="btn btn-sm btn-ghost text-success ml-auto capitalize"
                                    href={message.url}
                                    download
                                    rel="noopener noreferrer"
                                    target="_blank"
                                  >
                                    Download
                                  </a>
                                </p>
                              </div>
                            ) : null}
                            <div className="max-w-xs w-full group">
                              <p className="text-brand4 whitespace-pre-line break-words">
                                {urlstext}
                              </p>
                              {message.type == "live" ? (
                                <a
                                  href={`${process.env.REACT_APP_CLIENT_URL}/live/${username}`}
                                  target="__blank"
                                >
                                  {message.url ? (
                                    <img
                                      src={message.url}
                                      className="w-full max-h-96 max-w-sm"
                                    ></img>
                                  ) : (
                                    <h1 className="text-center text-4xl font-bold text-dbeats-light">
                                      I am Live
                                    </h1>
                                  )}
                                </a>
                              ) : null}

                              {urls &&
                                urls.map((u, index) => {
                                  return (
                                    <a href={u} key={index}>
                                      <ChatLinkPreview
                                        linkurl={u}
                                        setShowLinkPreview={setShowLinkPreview}
                                        setLinkPreviewData={setLinkPreviewData}
                                      />
                                    </a>
                                  );
                                })}
                            </div>
                          </div>
                          <div
                            className="md:hidden opacity-0 group-hover:opacity-100 cursor-pointer p-1 w-fit text-sm text-teal-700 font-semibold rounded-full bg-slate-200 dark:bg-slate-700"
                            onClick={() => onreply(message)}
                          >
                            <ArrowBackUp />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : "<></>"}
          </InfiniteScroll>
          <div
            onClick={() => {
              chatRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }}
            className="p-1 absolute w-full flex justify-center bottom-16   z-100"
          >
            <div className="py-1 px-2 rounded-full bg-slate-400/40 dark:bg-slate-600/40  text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm">
              <ChevronDown /> Recent messages
            </div>
          </div>
          <div ref={chatRef} />
        </div>
        <div className=" border-t-2 border-slate-200 dark:border-slate-700 w-full bg-slate-300 dark:bg-slate-800 ">
          <div className="py-1 px-1 md:px-2">
            {formState.replyto ? (
              <div className="w-full p-2 flex items-center bg-slate-200 dark:bg-slate-800	justify-between rounded-md mb-4">
                <div className="flex-grow flex gap-1">
                  <img
                    className="w-8 h-8 object-cover rounded-full"
                    alt="profile"
                    src={
                      formState.replyto.profile_image
                        ? formState.replyto.profile_image
                        : person
                    }
                  />

                  <div className="flex-grow ">
                    <p className={"text-base font-bold  text-brand2"}>
                      {formState.replyto.username === user.username
                        ? "You"
                        : formState.replyto.username}
                      <span className="text-xs text-brand5 font-light ml-2">
                        {new Date(formState.replyto.createdAt).toLocaleString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </p>
                    <div className="text-sm w-10/12 max-w-xs md:max-w-lg truncate text-brand3">
                      {formState.replyto.message}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-xs btn-error btn-circle  text-white "
                  onClick={() => {
                    setForm({ ...formState, replyto: null });
                  }}
                >
                  <i className="fa-solid fa-xmark text-lg  "></i>
                </button>
              </div>
            ) : null}
            {selectedFile ? (
              <div className="flex gap-2 rounded-md justify-between p-2 bg-slate-200 dark:bg-slate-800 mb-4">
                {selectedFile.type == "image" && (
                  <img src={selectedFile.localurl} className=" h-24 "></img>
                )}
                {selectedFile.type == "sound" && (
                  <div className="ml-3 p-2 border border-dbeats-light rounded-md">
                    <i className="fas fa-music text-3xl text-dbeats-light"></i>
                    <p className="text-gray-400 text-xs">
                      {selectedFile.file[0].name}
                    </p>
                  </div>
                )}
                {selectedFile.type == "video" && (
                  <div className="flex gap-1 items-center p-2 text-brand4 bg-slate-300 dark:bg-slate-700 rounded-md">
                    <Video />
                    <p className="font-semibold text-sm ">
                      {selectedFile.file[0].name}
                    </p>
                  </div>
                )}
                {selectedFile.type == "file" && (
                  <div className="flex gap-1 items-center p-2 text-brand4 bg-slate-300 dark:bg-slate-700 rounded-md">
                    <File />
                    <p className="font-semibold text-sm  ">
                      {selectedFile.file[0].name}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  <div className="btn btn-xs btn-error btn-circle  text-white">
                    <i className="fas fa-times"></i>
                  </div>
                </button>
              </div>
            ) : null}
            <div className="flex justify-start items-center gap-2 ">
              <div>
                <div className="dropdown dropdown-top">
                  <label
                    tabIndex={0}
                    className="m-1 cursor-pointer text-brand2"
                  >
                    <i className="far fa-laugh text-base "></i>
                  </label>
                  <div
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                </div>
              </div>
              {/* <div
              onClick={() => {
                setShowAttachmentDropdown(
                  showAttachmentDropdown ? !showAttachmentDropdown : showAttachmentDropdown,
                );
                setShowEmojis(!showEmojis);
              }}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary-sm   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center md:mx-2">
                  {' '}
                  <i className="far fa-laugh text-base md:text-2xl"></i>
                </p>
              </span>
            </div> */}

              <div className="dropdown dropdown-top">
                <label tabIndex={0} className="m-1 cursor-pointer text-brand2">
                  <i className="fas fa-paperclip text-base "></i>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 mb-4 shadow rounded-box w-52 bg-slate-300 dark:bg-slate-700  text-brand2"
                >
                  <input
                    name="image"
                    type="file"
                    accept=".jpg,.png,.jpeg,.gif,.webp"
                    onChange={onFileChange}
                    className="hidden"
                    ref={imageInput}
                  />
                  <input
                    name="sound"
                    type="file"
                    accept=".mp3, .weba"
                    onChange={onFileChange}
                    className="hidden"
                    ref={soundInput}
                  />
                  <input
                    name="video"
                    type="file"
                    accept=".mp4, .mkv, .mov, .avi"
                    onChange={onFileChange}
                    className="hidden"
                    ref={videoInput}
                  />
                  <input
                    name="file"
                    type="file"
                    onChange={onFileChange}
                    className="hidden"
                    ref={fileInput}
                  />
                  <li
                    onClick={() => {
                      imageInput.current.click();
                    }}
                  >
                    <div className="dark:hover:bg-slate-800">
                      <i className="fas fa-camera "></i>Image
                    </div>
                  </li>
                  {/* <li
                        onClick={() => {
                          soundInput.current.click();
                        }}
                      >
                        <div>
                          <i className="fas fa-music "></i>Sound
                        </div>
                      </li> */}
                  <li
                    onClick={() => {
                      videoInput.current.click();
                    }}
                  >
                    <div className="dark:hover:bg-slate-800">
                      <i className="fas fa-video "></i>Video
                    </div>
                  </li>
                  <li
                    onClick={() => {
                      fileInput.current.click();
                    }}
                  >
                    <div className="dark:hover:bg-slate-800">
                      <i className="fas fa-file "></i>File
                    </div>
                  </li>
                </ul>
              </div>

              {/* <div
              onClick={() => {
                setShowAttachmentDropdown(!showAttachmentDropdown);
                setShowEmojis(showEmojis ? !showEmojis : showEmojis);
              }}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary-sm   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center md:mx-2">
                  {' '}
                  <i className="text-base md:text-2xl fas fa-paperclip"></i>
                </p>
              </span>
            </div> */}

              <form
                className="flex items-center flex-grow gap-1"
                id="chat-form"
                onSubmit={saveMessage}
              >
                {/* <div className="flex-grow rounded-md group w-fit  p-1  mx-1  cursor-pointer            font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                {" "} */}
                <textarea
                  onChange={onChange}
                  value={formState.message}
                  id="msg"
                  rows={1}
                  name="message"
                  type="text"
                  placeholder="Enter Message"
                  required
                  autoComplete="false"
                  className="w-full rounded-md textarea "
                ></textarea>
                {/* </div> */}

                {/* <button
                   
                  type="submit"
                  className={`${
                    uploadingFile || formState.message.length < 1
                      ? 'dark:bg-dbeats-dark-primary'
                      : 'bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:dark:nm-inset-dbeats-dark-primary'
                  }  px-4 py-2  rounded-3xl group flex items-center justify-center  `}
                >
                  <i className="fas fa-paper-plane mr-2" />
                  <p className="hidden md:inline">Send</p>
                </button> */}
                {/*  */}
                <button
                  disabled={formState.message.length < 1}
                  type="submit"
                  className={`
               
                 ${
                   uploadingFile && "loading"
                 } btn btn-square btn-primary  gap-2`}
                >
                  {!uploadingFile && <Send size={20}></Send>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-end h-full w-1/4 pt-24 mr-12 ml-4">
        <ProfileVisitCard />
      </div>
    </div>
  );
}

export default ChatRoom;
