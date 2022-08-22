import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Heart } from 'tabler-icons-react';
import { UserContext } from '../../../Store';

function ShowComment({ comment, user_id, contentData }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const State = useContext(UserContext);

    useEffect(() => {
        if (comment.likes && State.database.userData.data.user) {
            setLikeCount(comment.likes.length);
            comment.likes.map((like) => {
                console.log(like.user_id);
                console.log(State.database.userData.data.user._id);
                if (like == State.database.userData.data.user._id) {
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
                'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
            },
        });
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
        <div className="w-full flex items-start space-x-1">
            <img
                src={comment.profile_image ? comment.profile_image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                alt="profile pic"
                className="h-8 w-8 object-cover rounded-full mt-1"
            />
            <div className="flex flex-col">
                <p className=" text-brand5 text-sm font-medium">
                    <span className="text-brand4 font-semibold mr-1">
                        {comment.name}
                    </span>
                    {comment.comment}
                </p>
                <div className="cursor-pointer flex  items-center text-brand5  text-xs">
                    <Heart onClick={() => {
                        handleCommentLike();
                    }} size={14} className={`${isLiked
                        ? 'text-red-600 group-hover:text-white'
                        : 'text-white group-hover:text-red-600'
                        } `}></Heart>
                    {likeCount > 0 ? likeCount : 'like'}
                </div>
            </div>
        </div>
    )
}

export default ShowComment