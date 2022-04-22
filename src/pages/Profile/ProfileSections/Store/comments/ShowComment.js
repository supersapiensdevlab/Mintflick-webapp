import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function ShowComment({ comment, user_id, contentData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const user = useSelector((state) => state.User.user);

  useEffect(() => {
    if (comment.likes) {
      setLikeCount(comment.likes.length);
      comment.likes.map((like) => {
        console.log(like.user_id);
        console.log(user._id);
        if (like == user._id) {
          console.log('setting trueeeeee');
          setIsLiked(true);
        }
      });
    }
  }, []);

  const handleCommentLike = async () => {
    let data = {
      user_data_id: user_id,
      content: contentData,
      comment: comment,
    };
    const res = await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/likecomment`,
      data: data,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    });
    console.log(data);
    console.log(res);
    if (res.status == 200) {
      if (isLiked) {
        setLikeCount(likeCount - 1);
        setIsLiked(false);
      } else {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
      }
    }
  };
  return (
    <div className="flex">
      <img src={comment.profile_image} className="h-8 w-8 mr-2 rounded-full"></img>
      <div>
        <div className="text-gray-300 border border-dbeats-dark-secondary  rounded-lg px-3  py-2 nm-inset-dbeats-dark-primary">
          <div className="font-semibold">{comment.name}</div>
          <p>{comment.comment}</p>
        </div>
        <div className="text-xs my-1 ml-2 cursor-pointer group">
          <i
            onClick={() => {
              handleCommentLike();
            }}
            className={`fa-solid fa-heart ${
              isLiked
                ? 'text-red-600 group-hover:text-white'
                : 'text-white group-hover:text-red-600'
            } `}
          ></i>{' '}
          {likeCount > 0 ? likeCount : 'like'}
        </div>
      </div>
    </div>
  );
}

export default ShowComment;
