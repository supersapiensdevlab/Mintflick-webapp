import React, { useEffect, useRef, useState } from 'react';
import '../../../Profile/ProfileSections/ChatRoom/chatroom.css';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import person from '../../../../assets/images/profile.svg';
import LoadingBar from 'react-top-loading-bar';

function LiveChat({ userp }) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));
  const chatRef = useRef(null);
  const loadingRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
    replyto: null,
  });

  // For reply click ref
  const scrollTop = useRef(null);
  const messageRef = useRef([]);

  const [messages, setMessages] = useState([]);

  const [currentSocket, setCurrentSocket] = useState(null);

  const [showEmojis, setShowEmojis] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setForm({ ...formState, message: formState.message + emojiObject.emoji });
  };
  useEffect(() => {
    if (user) {
      loadingRef.current.continuousStart();
      // https://dbeats-chat.herokuapp.com
      const socket = io(process.env.REACT_APP_CHAT_URL);
      setCurrentSocket(socket);
      socket.emit('live_joinroom', { user_id: user._id, room_id: userp._id });
      socket.on('live_init', (msgs) => {
        loadingRef.current.complete();
        setMessages(msgs);
        setTimeout(() => {
          chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }, 1000);
      });

      socket.on('live_message', (msg) => {
        console.log(msg);
        setMessages((prevArray) => [...prevArray, msg]);
        if (chatRef.current) {
          chatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      //   window.history.replaceState({}, 'Home', '/');
    }
    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
    // eslint-disable-next-line
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage(e) {
    e.preventDefault();
    if (user) {
      let room = {
        room_admin: userp._id,
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
      console.log(room);
      currentSocket.emit('live_chatMessage', room);
      setForm({
        message: '',
        replyto: null,
      });
      setShowEmojis(false);
    } else {
      window.location.href = '/signup';
    }
  }
  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }
  function scrollTo(id) {
    messageRef.current[id].scrollIntoView();
  }
  const onreply = (message) => {
    setForm({ ...formState, replyto: message });
  };

  // FOr Links
  // use whatever you want here
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/;
  const renderText = (txt) =>
    txt.split(' ').map((part) => (URL_REGEX.test(part) ? <a href={part}>{part} </a> : part + ' '));

  return (
    <div className="text-gray-400 	 box-border px-2 h-max lg:col-span-5 col-span-6 w-full dark:bg-dbeats-dark-primary">
      <LoadingBar ref={loadingRef} color="#00d3ff" shadow={true} />
      <div className="relative" style={{ height: '100vh' }}>
        <main className="pt-16 chat-container-height-live sticky bottom-0">
          <div className="  p-2 chat-height overflow-y-scroll	overflow-x-hidden">
            <div ref={scrollTop}></div>
            {messages
              ? messages.map((message) => {
                  //const dateNum = new Date(message.createdAt);
                  //let size = 0;
                  let urlstext = renderText(message.message);
                  return (
                    <div key={message._id} ref={(el) => (messageRef.current[message._id] = el)}>
                      <div className=" px-3 p-2 rounded	 dark: bg-dbeats-dark-secondary	my-1 inline-block shadow">
                        {message.reply_to ? (
                          <div
                            onClick={() => scrollTo(message.reply_to._id)}
                            className="cursor-pointer flex justify-between items-center group  px-3 py-2 border-l-2 border-dbeats-light  dark: nm-inset-dbeats-dark-primary"
                          >
                            <div className="">
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
                          </div>
                        ) : null}
                        <div className="inline-flex items-start group">
                          <div className="chat_message_profile pr-2 pt-2 h-12 w-12">
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
                            <p className="text whitespace-pre-line">{urlstext}</p>
                          </div>
                          <i
                            onClick={() => onreply(message)}
                            className="pt-8  opacity-0 group-hover:opacity-100 fas fa-reply ml-2 w-4 h-4 cursor-pointer text-dbeats-white text-opacity-40 hover:text-opacity-100"
                          ></i>
                        </div>
                      </div>
                    </div>
                  );
                })
              : '<></>'}
            <i
              onClick={() => {
                chatRef.current.scrollIntoView({ behavior: 'smooth' });
              }}
              className="fas fa-angle-double-down text-xl text-dbeats-light absolute right-4 bottom-10 px-4 py-2 rounded-full bg-dbeats-dark-secondary xl:text-2xl xl:right-8 cursor-pointer"
            ></i>
            <div ref={chatRef} />
          </div>
        </main>
        {showEmojis && (
          <div className="absolute  bottom-40  shadow-none">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 py-4 md:px-4 rounded-lg bg-dbeats-dark-secondary shadow-md">
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
          <div className="flex justify-start ">
            <div
              onClick={() => {
                setShowEmojis(!showEmojis);
              }}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center md:mx-2">
                  {' '}
                  <i className="far fa-laugh text-base md:text-2xl"></i>
                </p>
              </span>
            </div>
            <form className="flex flex-grow" id="chat-form" onSubmit={saveMessage}>
              <div className="flex-grow rounded-md group w-fit  p-1  mx-1  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary           font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                {' '}
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
                  className="w-full rounded-md border-0 ring-0 focus:ring-0 focus:border-0 text-black dark:text-white md:px-4 p-2  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary group-hover:nm-inset-dbeats-dark-secondary focus:nm-inset-dbeats-dark-primary placeholder-white placeholder-opacity-25"
                ></textarea>
              </div>

              <div
                className={`${
                  formState.message.length < 1
                    ? 'text-opacity-25 text-white cursor-default'
                    : 'hover:nm-inset-dbeats-dark-primary hover:text-dbeats-light'
                }
                  p-1 rounded-3xl nm-flat-dbeats-dark-secondary cursor-pointer  `}
              >
                <button
                  type="submit"
                  className={`${
                    formState.message.length < 1
                      ? 'dark:bg-dbeats-dark-primary'
                      : 'bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:dark:nm-inset-dbeats-dark-primary'
                  }  px-4 py-2  rounded-3xl group flex items-center justify-center  `}
                >
                  <i className="fas fa-paper-plane mr-2" />
                  <p className="hidden md:inline">Send</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveChat;
