import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';
import axios from 'axios';

function Addcomment({ user_id, contentData, myComments, setMyComments }) {
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
        ...myComments,
        {
          comment: comment,
          _id: res.data.id,
          user_id: user._id,
          likes: [],
          profile_image: user.profile_image,
          username: user.username,
          name: user.name,
        },
      ]);
      setComment('');
    }
  };
  return (
    user && (
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
            className="w-full focus:border-opacity-0 placeholder-dbeats-light text-dbeats-light text-sm h-8 border-none bg-transparent"
          ></input>
          <i onClick={() => setShowEmoji(true)} className="far fa-laugh mx-1"></i>
          {showEmoji && (
            <div className="absolute bottom-10 shadow-none">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default Addcomment;
