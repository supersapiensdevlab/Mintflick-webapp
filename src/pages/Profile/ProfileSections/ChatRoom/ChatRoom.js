
import React, { useEffect, useReducer, useRef, useState } from 'react';
import './chatroom.css';
import io from 'socket.io-client';
function ChatRoom(props) {
  // to get loggedin user from   localstorage
  const user = JSON.parse(window.localStorage.getItem('user'));


  const chatRef = useRef(null);
  // the form state manages the form input for creating a new message
  const [formState, setForm] = useState({
    message: '',
  });
  const [messages,setMessages] = useState([])
  const [currentSocket, setCurrentSocket] = useState(null)

  useEffect(() => {
    // initialize gun locally
    if (user) {
      const socket = io(process.env.REACT_APP_SERVER_URL);
      setCurrentSocket(socket)
      socket.emit('joinroom',{user_id:user._id,room_id:props.userp._id})
      socket.on('init',(msgs)=>{
        setMessages(msgs);
        chatRef.current.scrollIntoView({ behavior: 'smooth' });
      })
      socket.on('message2',(msg)=>{
        setMessages(prevArray => [...prevArray, msg])
        chatRef.current.scrollIntoView({ behavior: 'smooth' });
      })
    } else {
      window.history.replaceState({}, 'Home', '/');
    }
    // eslint-disable-next-line
    return () => { socket.disconnect() }
  }, []);

  // set a new message in gun, update the local state to reset the form field
  function saveMessage(e) {
    e.preventDefault();
    let chat = {
      room_id:props.userp._id,
      user_id:user._id,
      username:user.username,
      profile_image:user.profile_image,
      type:'text',
      message:formState.message
    }
    currentSocket.emit('chatMessage',chat)
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
        <main className="chat-container-height">
          <div className="p-2 chat-height overflow-y-scroll	">
            {messages.map((message) => (
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
