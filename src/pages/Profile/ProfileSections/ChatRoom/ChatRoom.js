import React, { useEffect, useReducer, useRef, useState } from 'react';
import './chatroom.css';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import emoji from '../../../../assets/images/emoji.png';
import reply from '../../../../assets/images/reply.svg';
import person from '../../../../assets/images/profile.svg';
import { makeStorageClient } from '../../../../component/uploadHelperFunction';

function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));

  const chatRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
    replyto: null,
  });

  const imageInput = useRef();
  const soundInput = useRef();
  const videoInput = useRef();
  const fileInput = useRef();

  const [messages, setMessages] = useState([]);
  const [currentSocket, setCurrentSocket] = useState(null);
  const dates = new Set();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttachmentDropdown, setShowAttachmentDropdown] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setForm({ ...formState, message: formState.message + emojiObject.emoji });
  };
  useEffect(() => {
    // initialize gun locally
    if (user) {
      // https://dbeats-chat.herokuapp.com
      const socket = io('https://dbeats-chat.herokuapp.com');
      setCurrentSocket(socket);
      socket.emit('joinroom', { user_id: user._id, room_id: props.userp._id });
      socket.on('init', (msgs) => {
        setMessages(msgs);
        chatRef.current.scrollIntoView({ behavior: 'smooth' });
      });
      socket.on('message', (msg) => {
        setMessages((prevArray) => [...prevArray, msg]);
        chatRef.current.scrollIntoView({ behavior: 'smooth' });
      });
    } else {
      window.history.replaceState({}, 'Home', '/');
    }
    // eslint-disable-next-line
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage(e) {
    e.preventDefault();
    console.log(selectedFile.file);
    if (selectedFile) {
      setUploadingFile(true);
      storeWithProgress(selectedFile.file)
        .then((cid) => {
          setUploadingFile(false);
          console.log('https://ipfs.io/ipfs/' + cid + '/' + selectedFile.file[0].name);
          let room = {
            room_admin: props.userp._id,
            chat: {
              user_id: user._id,
              username: user.username,
              profile_image: user.profile_image,
              type: 'image',
              message: formState.message,
              createdAt: Date.now(),
              url: 'https://ipfs.io/ipfs/' + cid + '/' + selectedFile.file[0].name,
            },
          };
          if (formState.replyto) {
            room.chat.reply_to = formState.replyto;
          }
          currentSocket.emit('chatMessage', room);
          setForm({
            message: '',
            replyto: null,
          });
          setShowEmojis(false);
          setShowAttachmentDropdown(false);
          setSelectedFile(null);
         
        })
        .catch((err) => {
          console.log(err);
          setForm({
            message: '',
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
      room_admin: props.userp._id,
      chat: {
        user_id: user._id,
        username: user.username,
        profile_image: user.profile_image,
        type: 'text',
        message: formState.message,
        createdAt: Date.now(),
      },
    };
    if (formState.replyto) {
      room.chat.reply_to = formState.replyto;
    }
    currentSocket.emit('chatMessage', room);
    setForm({
      message: '',
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
    return <p className="text-center text-sm">{timestampDate.toDateString()}</p>;
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
      type: 'image',
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

  return (
    <div className="text-gray-400	 box-border px-2 h-max lg:col-span-5 col-span-6 w-full mt-16 dark:bg-dbeats-dark-primary">
      <div className="overflow-hidden">
        <main className="chat-container-height">
          <div className="p-2 chat-height overflow-y-scroll	">
            {messages
              ? messages.map((message) => {
                  const dateNum = new Date(message.createdAt);

                  return (
                    <div key={message._id}>
                      {dates.has(dateNum.toDateString()) ? null : (
                        <p className="my-1 rounded-3xl bg-dbeats-dark-secondary px-3 py-1 block w-max mx-auto">
                          {renderDate(message, dateNum.toDateString())}
                        </p>
                      )}
                      <div className=" px-3 p-2 rounded	 dark: bg-dbeats-dark-secondary	my-1 inline-block shadow">
                        {message.reply_to ? (
                          <div className="group  px-3 py-2 border-l-2 border-dbeats-light  dark: nm-inset-dbeats-dark-primary">
                            <p
                              className={
                                message.reply_to.username === user.username
                                  ? 'text-sm  mb-1  text-dbeats-light'
                                  : 'text-sm  mb-1 text-white	'
                              }
                            >
                              {' '}
                              {message.reply_to.username}
                            </p>
                            <p className="text-xs">{message.reply_to.message}</p>
                          </div>
                        ) : null}
                        {message.type=='image'?(
                          <div className='w-250'>
                          <img src={message.url}></img>
                          <a href={message.url} download target="_blank">Download</a>
                          </div>
                        ):null}
                        <div className="inline-flex items-center group">
                          <div className="chat_message_profile pr-2 h-12 w-12">
                            <img
                              height="50px"
                              width="50px"
                              className="rounded-full"
                              style={{ width: 'auto', maxWidth: '50px' }}
                              alt="profile"
                              src={message.profile_image ? message.profile_image : person}
                            />
                          </div>
                          <div className="p-1 mt-1">
                            <p
                              className={
                                message.username === user.username
                                  ? 'text-base font-bold   text-dbeats-light'
                                  : 'text-base font-bold  text-white	'
                              }
                            >
                              {message.username}{' '}
                              <span className="text-xs text-gray-300 font-light">
                                {new Date(message.createdAt).toLocaleString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                                })}
                              </span>
                            </p>
                            <p className="text">{message.message}</p>
                          </div>
                          <i
                            onClick={() => onreply(message)}
                            className=" opacity-0 group-hover:opacity-100 fas fa-reply ml-2 w-4 h-4 cursor-pointer text-dbeats-white text-opacity-40 hover:text-opacity-100"
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })
              : '<></>'}
            <div ref={chatRef} />
          </div>
        </main>
        {showEmojis && (
          <div className="absolute bottom-16 xl:bottom-24 shadow-none">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        {showAttachmentDropdown && (
          <div className=" ml-5 absolute bottom-16 xl:bottom-24 shadow-none w-60  bg-dbeats-dark-alt">
            <ul>
              <input
                id="image"
                type="file"
                accept=".jpg,.png,.jpeg,.gif,.webp"
                onChange={onFileChange}
                className="hidden"
                ref={imageInput}
              />
              <li
                onClick={() => {
                  imageInput.current.click();
                }}
                className="hover:bg-dbeats-dark-primary cursor-pointer"
              >
                Image
              </li>
              <li className="hover:bg-dbeats-dark-primary cursor-pointer">Sound</li>
              <li className="hover:bg-dbeats-dark-primary cursor-pointer">File</li>
            </ul>
          </div>
        )}

        <div className="p-4 rounded-lg dark: bg-dbeats-dark-secondary">
          {formState.replyto ? (
            <div className="px-3 p-2 flex items-center	justify-between rounded-xl dark: bg-dbeats-dark-secondary	mb-2">
              <div className="flex">
                <div className="chat_message_profile pr-2">
                  <img
                    height="50px"
                    width="50px"
                    className="rounded-full"
                    alt="profile"
                    src={formState.replyto.profile_image}
                  />
                </div>
                <div className="p-1">
                  <p
                    className={
                      formState.replyto.username === user.username
                        ? 'text-base font-bold mb-1  text-dbeats-light'
                        : 'text-base font-bold mb-1 text-white	'
                    }
                  >
                    {formState.replyto.username}{' '}
                    <span className="text-xs text-gray-300 font-light">
                      {new Date(formState.replyto.createdAt).toLocaleString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </p>
                  <p className="text">{formState.replyto.message}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setForm({ ...formState, replyto: null });
                }}
              >
                X
              </button>
            </div>
          ) : null}
          {selectedFile ? (
            <div className="flex justify-between">
              <img src={selectedFile.localurl} className="w-24 h-24"></img>
              <button
                onClick={() => {
                  setSelectedFile(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : null}
          <div className="flex">
            <button onClick={() => setShowEmojis(!showEmojis)}>
              <i className="far fa-laugh text-2xl"></i>
            </button>
            <button onClick={() => setShowAttachmentDropdown(!showAttachmentDropdown)}>
              <i className="pl-2 text-2xl fas fa-paperclip"></i>
            </button>

            <form className="flex" id="chat-form" onSubmit={saveMessage}>
              <div className="p-1 nm-flat-dbeats-dark-secondary mx-3 focus:nm-inset-dbeats-dark-secondary">
                <input
                  className="flex-grow dark: bg-dbeats-dark-primary border-0  focus:border-dbeats-dark-alt focus:ring-0 focus:nm-inset-dbeats-dark-primary"
                  onChange={onChange}
                  name="message"
                  value={formState.message}
                  id="msg"
                  type="text"
                  placeholder="Enter Message"
                  required
                  autoComplete="false"
                />
              </div>
              <div className="p-1 rounded-3xl nm-flat-dbeats-dark-secondary">
                <button
                  disabled={uploadingFile}
                  type="submit"
                  className="cursor-pointer px-4 py-2 dark: bg-dbeats-dark-primary rounded-3xl"
                >
                  <i className="fas fa-paper-plane mr-1" /> Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
