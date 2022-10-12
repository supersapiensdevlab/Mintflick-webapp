import React, { useEffect, useRef, useState } from "react";
import "../ChatRoom/chatroom.css";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import person from "../../Assets/profile-pic.png";
import LoadingBar from "react-top-loading-bar";
import Loading from "../Loading/Loading";
import ChatLinkPreview from "../ChatRoom/ChatLinkPreview";
import InfiniteScroll from "react-infinite-scroller";
import { useContext } from "react";
import { UserContext } from "../../Store";
import { useLocation, useParams } from "react-router-dom";
import { makeStorageClient } from "../../Helper/uploadHelper";
import { detectURLs } from "../../Helper/uploadHelperWeb3Storage";
import GiftModal from "./Modals/GiftModal";

import {
  ArrowBackUp,
  ChevronDown,
  CloudDownload,
  File,
  Video,
} from "tabler-icons-react";
import useUserActions from "../../Hooks/useUserActions";

// https://mintflickchats.herokuapp.com
const socket = io(`${process.env.REACT_APP_CHAT_URL}`, {
  autoConnect: false,
});

function LiveRoom({ username }) {
  // to get loggedin user from   localstorage
  const user = useContext(UserContext);
  const chatRef = useRef(null);
  const loadingRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: "",
    replyto: null,
  });

  const [loadFeed, loadUser] = useUserActions();

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

  const [showGiftModal, setShowGiftModal] = useState(false);

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

      socket.emit("live_joinroom", {
        user_id: user.database.userData.data.user._id,
        room_id: username,
      });

      socket.on("live_init", (msgs) => {
        if (loadingRef.current) {
          loadingRef.current.complete();
        }
        console.log(msgs);
        if (msgs.chats) setMessages(msgs.chats);
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
      socket.on("live_message", async (msg) => {
        if (
          msg.username == user.database.userData.data?.user?.username &&
          msg.value
        ) {
          await loadUser();
        }
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
      socket.off("live_message");
      socket.off("live_init");
    };
    // eslint-disable-next-line
  }, [username]);

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
              username: user.database.userData.data.user.username,
              profile_image: user.database.userData.data.user.profile_image,
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
          socket.emit("live_chatMessage", room);
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
      socket.emit("live_chatMessage", room);
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
    <div className="h-full relative w-full dark:bg-slate-800 bg-slate-100">
      <LoadingBar ref={loadingRef} color="#00d3ff" shadow={true} />
      <main className=" h-full ">
        <div
          className="  p-4  overflow-y-scroll	overflow-x-hidden mb-4"
          style={{ height: "80vh" }}
        >
          <div ref={scrollTop}></div>
          {messages
            ? messages.map((message, index) => {
                const dateNum = new Date(message.createdAt);
                let size = 0;
                let urls = detectURLs(message.message);
                let urlstext = renderText(message.message);
                return (
                  <div className="">
                    {dates.has(dateNum.toDateString()) ? null : (
                      <p className="text-sm text-brand4 font-semibold py-1 px-3 w-fit mx-auto my-1 rounded-full bg-slate-200 dark:bg-slate-700">
                        {renderDate(message, dateNum.toDateString())}
                      </p>
                    )}

                    <div
                      className={`${
                        message.username
                          ? message.username ===
                            user.database.userData.data.user.username
                            ? "ml-auto mr-0"
                            : ""
                          : " "
                      } w-max my-2 `}
                      key={message._id}
                      ref={(el) => (messageRef.current[message._id] = el)}
                    >
                      <div
                        className={
                          message.username &&
                          message.username ==
                            user.database.userData.data.user.username
                            ? "flex items-end flex-row-reverse  gap-1 group"
                            : "flex items-end gap-1 group"
                        }
                      >
                        <div className="w-fit h-full space-y-1">
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
                          className={`${
                            message.reply_to
                              ? message.reply_to.username ===
                                  user.database.userData.data.user.username ||
                                message.username ===
                                  user.database.userData.data.user.username
                                ? "ml-auto mr-0"
                                : " "
                              : " "
                          } p-2 bg-slate-200 dark:bg-slate-700 rounded-md`}
                        >
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
                                <p className="text-sm text-brand3">
                                  {message.reply_to.message}
                                </p>
                              </div>
                              <div className="p-2">
                                {message.reply_to.type == "image" && (
                                  <i className="fas fa-image text-2xl text-dbeats-light"></i>
                                )}
                                {message.reply_to.type == "sound" && (
                                  <i className="fas fa-music text-2xl text-dbeats-light"></i>
                                )}
                                {message.reply_to.type == "video" && (
                                  <i className="fas fa-video text-2xl text-dbeats-light"></i>
                                )}
                                {message.reply_to.type == "file" && (
                                  <i className="fas fa-file text-2xl text-dbeats-light"></i>
                                )}
                              </div>
                            </div>
                          ) : null}
                          {message.type == "sticker" ? (
                            <div className="relative after:w-250 h-fit group rounded-md overflow-clip">
                              <img
                                width={100}
                                src={`${process.env.REACT_APP_CLIENT_URL}${message.url}`}
                              ></img>
                              {/* <p className="text-brand4 text-xs">
                                  {message.url.split("/").pop()}
                                </p> */}
                              {/* <p className="text-brand4 text-xs ">
                                  Size: {"1024 kb"}
                                </p> */}
                              {/* <a
                                className=" gap-1 items-center py-1 px-2 rounded-full text-slate-500 text-sm font-semibold bg-slate-50/50  bottom-2 right-2 absolute hidden  group-hover:flex"
                                href={message.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CloudDownload size={20} />
                                Download
                              </a> */}
                            </div>
                          ) : null}
                          {message.type == "magicchat" ? (
                            <div className="relative after:w-250 h-fit group rounded-md overflow-clip">
                              <img
                                width={200}
                                height={60}
                                src={`${process.env.REACT_APP_CLIENT_URL}${message.url}`}
                              ></img>
                              {/* <p className="text-brand4 text-xs">
                                  {message.url.split("/").pop()}
                                </p> */}
                              {/* <p className="text-brand4 text-xs ">
                                  Size: {"1024 kb"}
                                </p> */}
                              {/* <a
                                className=" gap-1 items-center py-1 px-2 rounded-full text-slate-500 text-sm font-semibold bg-slate-50/50  bottom-2 right-2 absolute hidden  group-hover:flex"
                                href={message.url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <CloudDownload size={20} />
                                Download
                              </a> */}
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
                          <div className=" w-full group">
                            <div className="w-full mt-1 ">
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
                                {message.type == "sticker" && (
                                  <span className="bg-rose-500 rounded-md px-2 mx-1 text-xs">
                                    GIFT <i class="fa-solid fa-gift"></i>
                                  </span>
                                )}
                                <span className="text-xs text-brand4 font-light">
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
                              <p className="text-brand4  whitespace-pre-line">
                                {message.type != "sticker" && urlstext}
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : "No messages"}
          <div
            onClick={() => {
              chatRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }}
            className="btn btn-circle btn-sm fixed right-4 bottom-24 z-100"
          >
            <ChevronDown />
          </div>
          <div ref={chatRef} />
        </div>

        <div className="   absolute  bottom-0 w-full bg-slate-900">
          <div className="  py-4 md:px-4   bg-dbeats-dark-secondary  ">
            {formState.replyto ? (
              <div className="px-3 p-2 flex items-center	justify-between rounded-xl mb-4">
                <div className="flex">
                  <div className="chat_message_profile pr-2">
                    <img
                      height="50px"
                      width="50px"
                      className="rounded-full"
                      alt="profile"
                      src={
                        formState.replyto.profile_image
                          ? formState.replyto.profile_image
                          : person
                      }
                    />
                  </div>
                  <div className="p-1">
                    <p
                      className={
                        formState.replyto.username === user.username
                          ? "text-base font-bold mb-1  text-dbeats-light"
                          : "text-base font-bold mb-1 text-white	"
                      }
                    >
                      {formState.replyto.username}{" "}
                      <span className="text-xs text-gray-300 font-light">
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
                    <p className="text">{formState.replyto.message}</p>
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded-full nm-convex-dbeats-dark-secondary hover:nm-concave-dbeats-dark-secondary-sm   cursor-pointer"
                  onClick={() => {
                    setForm({ ...formState, replyto: null });
                  }}
                >
                  <i className="fa-solid fa-xmark text-lg  "></i>
                </button>
              </div>
            ) : null}
            {selectedFile ? (
              <div className="flex justify-between">
                {selectedFile.type == "image" && (
                  <img src={selectedFile.localurl} className="w-24 h-24"></img>
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
                  <div className="ml-3 p-2 border border-dbeats-light rounded-md">
                    <i className="fas fa-video text-3xl text-dbeats-light"></i>
                    <p className="text-gray-400 text-xs">
                      {selectedFile.file[0].name}
                    </p>
                  </div>
                )}
                {selectedFile.type == "file" && (
                  <div className="ml-3 p-2 border border-dbeats-light rounded-md">
                    <i className="fas fa-file text-3xl text-dbeats-light"></i>
                    <p className="text-gray-400 text-xs">
                      {selectedFile.file[0].name}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : null}
            <div className="flex justify-start items-center ">
              {/* Emoji */}
              {/* <div>
                <div className="dropdown dropdown-top">
                  <label tabIndex={0} className="m-1 cursor-pointer">
                    <i className="far fa-laugh text-base md:text-2xl px-2 py-1"></i>
                  </label>
                  <div
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                </div>
              </div> */}

              <div
                className="btn btn-circle"
                onClick={() => setShowGiftModal(true)}
              >
                <i class="fa-solid fa-gift"></i>
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
                className="flex flex-grow"
                id="chat-form"
                onSubmit={saveMessage}
              >
                <div className="flex-grow rounded-md group w-fit  p-1  mx-1  cursor-pointer            font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                  {" "}
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
                    className="w-full rounded-md border-0 ring-0 focus:ring-0 focus:border-0  md:px-4 p-2  nm-flat-dbeats-dark-primary-sm  hover:nm-inset-dbeats-dark-secondary focus:nm-inset-dbeats-dark-primary text-slate-100 bg-slate-700"
                  ></textarea>
                </div>

                <div className="">
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
                  <button
                    disabled={uploadingFile}
                    type="submit"
                    className={`${
                      uploadingFile || formState.message.length < 1
                        ? "dark:bg-dbeats-dark-primary hidden"
                        : "nm-convex-dbeats-dark-secondary  hover:nm-inset-dbeats-dark-primary"
                    }  px-4 py-2  rounded-3xl group flex items-center justify-center  `}
                  >
                    <i className="fas fa-paper-plane mr-2" />
                    <p className="hidden md:inline">Send</p>
                  </button>
                </div>
                <div
                  className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                  hidden={!uploadingFile}
                ></div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <div
        className={`${
          showGiftModal && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <GiftModal
          setShowGiftModal={setShowGiftModal}
          socket={socket}
          username={username}
        />
      </div>{" "}
    </div>
  );
}

export default LiveRoom;
