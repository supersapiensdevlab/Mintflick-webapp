import React, { useEffect, useReducer, useRef, useState } from 'react';
import './chatroom.css';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import emoji from '../../../../assets/images/emoji.png';
import reply from '../../../../assets/images/reply.svg';
function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));

  const chatRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
    replyto: null,
  });
  const [messages, setMessages] = useState([]);
  const [currentSocket, setCurrentSocket] = useState(null);
  const dates = new Set();

  const [showEmojis, setShowEmojis] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setForm({ ...formState, message: formState.message + emojiObject.emoji });
  };
  useEffect(() => {
    // initialize gun locally
    if (user) {
      // https://dbeats-chat.herokuapp.com/
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

  return (
    <div className="text-gray-400	 box-border px-5 h-max lg:col-span-5 col-span-6 w-full mt-16 dark:bg-dbeats-dark-primary">
      <div className="overflow-hidden">
        <main className="chat-container-height">
          <div className="p-2 chat-height overflow-y-scroll	">
            {messages
              ? messages.map((message) => {
                  const dateNum = new Date(message.createdAt);

                  return (
                    <div key={message._id}>
                      {dates.has(dateNum.toDateString())
                        ? null
                        : renderDate(message, dateNum.toDateString())}
                      <div className=" px-3 p-2 	rounded-xl dark: bg-dbeats-dark-secondary	mb-2 inline-block">
                        {message.reply_to?(
                          <div className='ml-14 pl-2 py-1 border-l-2 border-dbeats-light rounded-xl dark: bg-dbeats-dark-primary'>
                             <p
                            className={
                              message.reply_to.username === user.username
                                ? 'text-sm  mb-1  text-blue-400'
                                : 'text-sm  mb-1 text-white	'
                            }
                          > {message.reply_to.username}</p>
                          <p className="text-xs">{message.reply_to.message}</p>
                          </div>
                        ):null}
                        <div className='inline-flex items-center'>
                        <div className="chat_message_profile pr-2">
                          <img
                            height="50px"
                            width="50px"
                            className="rounded-full"
                            alt="profile"
                            src={message.profile_image}
                          />
                        </div>
                        <div className="p-1">
                          <p
                            className={
                              message.username === user.username
                                ? 'text-base font-bold mb-1  text-blue-400'
                                : 'text-base font-bold mb-1 text-white	'
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
                        <img
                          onClick={() => onreply(message)}
                          src={reply}
                          className="ml-2 w-4 h-4"
                        ></img>
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
          <div className="absolute bottom-16 xl:bottom-24">
            <Picker onEmojiClick={onEmojiClick} />
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
                        ? 'text-base font-bold mb-1  text-blue-400'
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
          <div className="flex">
            <button onClick={() => setShowEmojis(!showEmojis)}>
              <img className="w-8 h-8" src={emoji}></img>
            </button>
            <form className="flex" id="chat-form" onSubmit={saveMessage}>
              <input
                className="flex-grow dark: bg-dbeats-dark-secondary border-0"
                onChange={onChange}
                name="message"
                value={formState.message}
                id="msg"
                type="text"
                placeholder="Enter Message"
                required
                autoComplete="false"
              />
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 dark: bg-dbeats-dark-primary"
              >
                <i className="fas fa-paper-plane" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
