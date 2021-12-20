import Gun from 'gun';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import './chatroom.css';

//console.log('lslsls');
// create the initial state to hold the messages
const initialState = {
  messages: [],
};

// Create a reducer that will update the messages array
function reducer(state, message) {
  return {
    messages: [...state.messages, message],
  };
}

function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));
  const gun = Gun({
    peers: [`${process.env.REACT_APP_SERVER_URL}/gun`],
  });

  const chatRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
  });

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState);

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state

  useEffect(() => {
    // initialize gun locally
    if (user) {
      const messages = gun.get('messages').get(props.userp.username);
      messages.map().once((m) => {
        dispatch({
          username: m.username,
          message: m.message,
          createdAt: m.createdAt,
        });
        chatRef.current.scrollIntoView({ behavior: 'smooth' });
      }, true);
    } else {
      window.history.replaceState({}, 'Home', '/');
    }
    // eslint-disable-next-line
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage(e) {
    e.preventDefault();
    const messages = gun.get('messages').get(props.userp.username);
    messages.set({
      username: user.username,
      message: formState.message,
      createdAt: Date.now(),
    });
    setForm({
      message: '',
    });
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  return (
    <div className="text-gray-400	 box-border px-5 h-max lg:col-span-5 col-span-6 w-full mt-16 dark:bg-dbeats-dark-primary">
      <div className="overflow-hidden">
        {/* <header className="chat-header">
          <h1>
            <i className="fas fa-smile" /> ChatCord
          </h1>
          <a onClick={() => (window.location.href = '/')} className="btn">
            Leave Room
          </a>
        </header> */}
        <main className="chat-container-height">
          {/* <div className="chat-sidebar">
            <h3>
              <i className="fas fa-comments" /> Room Name:
            </h3>
            <h2 id="room-name">{props.userp.username}</h2>
          </div> */}
          <div className="p-2 chat-height overflow-y-scroll	">
            {state.messages.map((message) => (
              <div
                className="px-6 p-2 flex items-center	rounded-xl dark: bg-dbeats-dark-secondary	mb-2"
                key={message.createdAt}
              >
                <div className="chat_message_profile">
                  <img
                    height="50px"
                    width="50px"
                    className="rounded-full"
                    alt="profile"
                    src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
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
                    <span className="text-sm text-gray-300 font-light">
                      {new Date(message.createdAt).toDateString()}
                    </span>
                  </p>
                  <p className="text">{message.message}</p>
                </div>
              </div>
            ))}
            <div ref={chatRef} />
          </div>
        </main>
        <div className="p-4 rounded-lg dark: bg-dbeats-dark-secondary">
          <form className="flex" id="chat-form" onSubmit={saveMessage}>
            <input
              className="flex-1 dark: bg-dbeats-dark-secondary border-0"
              onChange={onChange}
              name="message"
              value={formState.message}
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autoComplete={false}
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
