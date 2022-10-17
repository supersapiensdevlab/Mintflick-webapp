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
  Send,
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
    <div className="h-full w-full relative flex flex-col dark:bg-slate-800 bg-slate-100">
      <LoadingBar ref={loadingRef} color="#00d3ff" shadow={true} />
      <div className="p-2 flex-grow  overflow-y-scroll	overflow-x-hidden ">
        <div ref={scrollTop}></div>
        {messages
          ? messages.map((message, index) => {
              const dateNum = new Date(message.createdAt);
              let size = 0;
              let urls = detectURLs(message.message);
              let urlstext = renderText(message.message);
              return (
                <div
                  className={`
                      w-full my-2`}
                  key={message._id}
                  ref={(el) => (messageRef.current[message._id] = el)}
                >
                  <p className="w-full text-brand1 text-sm  whitespace-pre-line">
                    <span class="inline-flex items-baseline">
                      <img
                        className="self-center w-4 h-4 rounded-full object-cover mr-1"
                        alt="profile"
                        src={
                          message.profile_image ? message.profile_image : person
                        }
                      />

                      <span className="text-sm font-semibold text-brand4 mr-1">
                        {message.username ===
                        user.database.userData.data.user.username
                          ? "You"
                          : message.username}
                        {message.type == "sticker" && (
                          <span className="bg-rose-500 text-white  rounded-sm p-1 mx-1 text-[10px]">
                            GIFT <i class="fa-solid fa-gift"></i>
                          </span>
                        )}
                        {message.type == "magicchat" && (
                          <span className="bg-cyan-500 text-white  rounded-sm p-1 mx-1 text-[10px]">
                            MAGIC <i class="fa-solid fa-star"></i>
                          </span>
                        )}
                        :
                      </span>
                    </span>
                    {message.type != "sticker" && urlstext}
                  </p>

                  {message.type == "sticker" ? (
                    <div className=" w-fit h-fit my-2">
                      <img
                        width={100}
                        src={`${process.env.REACT_APP_CLIENT_URL}${message.url}`}
                      ></img>
                    </div>
                  ) : null}
                  {message.type == "magicchat" ? (
                    <div className="w-full my-2">
                      <img
                        src={`${process.env.REACT_APP_CLIENT_URL}${message.url}`}
                      ></img>
                    </div>
                  ) : null}
                  {/* <div className="w-full mt-1 ">
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
                  </div> */}
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
          className="btn btn-circle glass btn-xs absolute right-4 bottom-20 z-100"
        >
          <ChevronDown size={16} />
        </div>
        <div ref={chatRef} />
      </div>
      <div className="  dark:bg-slate-800  bg-slate-200 border-t-2 border-slate-300 dark:border-slate-700">
        <div className="p-1 ">
          <div className="flex justify-between items-center ">
            <div
              className="cursor-pointer bg-slate-400 dark:bg-slate-900 text-brand2 p-2 rounded-full  flex justify-center "
              onClick={() => setShowGiftModal(true)}
            >
              <i class=" fa-solid fa-gift"></i>
            </div>

            <form
              className="flex flex-grow"
              id="chat-form"
              onSubmit={saveMessage}
            >
              <div className="flex-grow rounded-md group   mx-1  cursor-pointer font-medium">
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
                  className="w-full textarea"
                ></textarea>
              </div>

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
