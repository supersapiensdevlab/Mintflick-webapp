import React, { useEffect, useReducer, useRef, useState } from 'react';
import './chatroom.css';
import io from 'socket.io-client';
import Picker from 'emoji-picker-react';
import emoji from '../../../../assets/images/emoji.png';
function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));

  const chatRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
  });
  const [messages, setMessages] = useState([]);
  const [currentSocket, setCurrentSocket] = useState(null);
  const dates = new Set();

  const [showEmojis, setShowEmojis] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setForm({
      message: formState.message + emojiObject.emoji,
    });
  };
  useEffect(() => {
    // initialize gun locally
    if (user) {
      const socket = io("https://dbeats-chat.herokuapp.com/");
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
    currentSocket.emit('chatMessage', room);
    setForm({
      message: '',
    });
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
                      <div className="px-6 p-2 flex items-center	rounded-xl dark: bg-dbeats-dark-secondary	mb-2">
                        <div className="chat_message_profile">
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
          <form className="flex" id="chat-form" onSubmit={saveMessage}>
            <button onClick={() => setShowEmojis(!showEmojis)}>
              <img className="w-8 h-8" src={emoji}></img>
            </button>
            <input
              className="flex-1 dark: bg-dbeats-dark-secondary border-0"
              onChange={onChange}
              name="message"
              value={formState.message}
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autoComplete="false"
            />
            <button type="submit" className="cursor-pointer px-4 py-2 dark: bg-dbeats-dark-primary">
              <i className="fas fa-paper-plane" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
