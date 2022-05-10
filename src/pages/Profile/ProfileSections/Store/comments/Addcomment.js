import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import axios from 'axios';

function Addcomment({ user_id, contentData, myComments, setMyComments , setCommentsNumber }) {
  const user = useSelector((state) => state.User.user);
  const [comment, setComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setComment(comment + emojiObject.emoji);
    setShowEmoji(false);
  };
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter' && user && comment !== '') {
      let data = {
        user_data_id: user_id,
        content: contentData,
        comment: comment,
      };
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_URL}/user/addcomment`,
        data: data,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
      });
      console.log(res.data)
      setMyComments((myComments) => [
       
        {
          comment: comment,
          _id: res.data.id,
          user_id: user._id,
          likes: [],
          profile_image: user.profile_image,
          username: user.username,
          name: user.name,
        }, 
        ...myComments,
      ]);
      setComment('');
      setCommentsNumber((commentsNumber) => commentsNumber + 1);
    }
  };
  const handleButtonSubmit = async ()=>{
    if (user && comment !== '') {
      let data = {
        user_data_id: user_id,
        content: contentData,
        comment: comment,
      };
      const res = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_URL}/user/addcomment`,
        data: data,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
      });
      setMyComments((myComments) => [
       
        {
          comment: comment,
          _id: res.data.id,
          user_id: user._id,
          likes: [],
          profile_image: user.profile_image,
          username: user.username,
          name: user.name,
        }, 
        ...myComments,
      ]);
      setComment('');
      setCommentsNumber((commentsNumber) => commentsNumber + 1);
    }
  }

  return (
    user && (
      <div>
      <div className="relative flex items-center mx-4 my-1">
        <img className="h-8 w-8 rounded-full mr-2" src={user.profile_image}></img>
        <div className="flex items-center flex-grow border-2 border-gray-700 rounded-2xl">
          <input
            value={comment}
            onKeyPress={handleKeyPress}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder="Add a comment"
            type="text"
            className="border-transparent focus:border-transparent focus:ring-0 w-full placeholder-opacity-40  border-opacity-0 placeholder-dbeats-light text-dbeats-light text-sm h-8 border-none bg-transparent"
          ></input>
          <i onClick={() => setShowEmoji(true)} className="far fa-laugh mx-1"></i>
          {showEmoji && (
            <div className="absolute bottom-10 shadow-none">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
      {comment !='' && <button onClick={handleButtonSubmit} type="button" className="ml-14 py-1 px-3 mr-2 mb-3 mt-1 text-sm font-medium text-dbeats-light focus:outline-none bg-dbeats-dark-secondary rounded-full border border-dbeats-light hover:bg-dbeats-light hover:text-dbeats-dark-secondary focus:z-10 focus:ring-4 focus:ring-gray-200 ">Post</button>}

      </div>
    )
  );
}

export default Addcomment;
