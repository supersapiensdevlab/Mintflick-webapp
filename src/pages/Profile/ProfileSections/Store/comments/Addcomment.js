import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';

function Addcomment() {
  const user = useSelector((state) => state.User.user);
  const [comment, setComment] = useState('');
  const [showEmoji,setShowEmoji] = useState(false);
  const onEmojiClick = (event, emojiObject) => {
    setComment(comment + emojiObject.emoji);
    setShowEmoji(false);
  };
  return (
    user && (
      <div className="relative flex items-center mx-4 my-1">
        <img className="h-8 w-8 rounded-full mr-2" src={user.profile_image}></img>
        <div className='flex items-center flex-grow border-2 border-gray-700 rounded-2xl'>
          <input value={comment} onChange={(e)=>{setComment(e.target.value)}} placeholder='Add a comment' type="text" className='w-full focus:border-opacity-0 placeholder-dbeats-light text-dbeats-light text-sm h-8 border-none bg-transparent'></input>
          <i onClick={()=>setShowEmoji(true)} className="far fa-laugh mx-1"></i>
          {showEmoji &&  <div className="absolute bottom-10 shadow-none">
            <Picker onEmojiClick={onEmojiClick} />
          </div>}
        </div>
      </div>
    )
  );    
}

export default Addcomment;
