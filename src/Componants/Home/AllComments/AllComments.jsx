import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Rss } from 'tabler-icons-react';
import { UserContext } from '../../../Store';
import ShowComment from './ShowComment';

function AllComments({ contentData, user_id, myComments, setCommentCount,setMyComments }) {
    const State = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        async function eff() {
            if (contentData.comments) {
                setTotalComments(contentData.comments.length);
                for (var i = 0; i < 2; i++) {
                    if (contentData.comments[i]) {
                        let x = counter + 1;
                        setCounter((counter) => counter + 1);
                        try {
                            const res = await axios.get(
                                `${process.env.REACT_APP_SERVER_URL}/user/shortData/${contentData.comments[i].user_id}`,
                            );
                            let temp = {
                                ...contentData.comments[i],
                                profile_image: res.data ? res.data.profile_image : 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                                username: res.data ? res.data.username : 'deleted user',
                                name: res.data ? res.data.name : 'deleted user',
                            };
                            setComments((c) => [...c, temp]);
                        }catch(e){
                            console.log(e)
                        }
                }
                }
            } else {
                setComments(null);
            }
        }
        eff()
    }, []);
    const handleLoadComments = async () => {
        console.log(counter);
        console.log(totalComments);
        if (counter < totalComments) {
            for (var i = counter; i < counter + 5; i++) {
                if (contentData.comments[i]) {
                    let x = counter + 1;
                    setCounter((counter) => counter + 1);
                    const res = await axios.get(
                        `${process.env.REACT_APP_SERVER_URL}/user/shortData/${contentData.comments[i].user_id}`,
                    );
                    let temp = {
                        ...contentData.comments[i],
                        profile_image: res.data.profile_image,
                        username: res.data.username,
                        name: res.data.name,
                    };
                    setComments((comments) => [...comments, temp]);
                }
            }
        }
    };
    const handleCommentLike = async (comment) => {
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
    };

    const removeComment = (com) =>{
        setComments((cmts) =>
        cmts.filter((c) => c._id !== com._id)
      );
    }
    const removeComment2 = (com) =>{
      let allcomments = comments;
      for(var i=0;i<allcomments.length;i++){
        if(allcomments[i]._id == com._id){
            allcomments.splice(i,1);
            return true;
        }else{
            if(allcomments[i].reply){
                for(var j=0;j<allcomments[i].reply.length;j++){
                    if(allcomments[i].reply[j]._id == com._id){
                        allcomments[i].reply.splice(j,1);
                        return true;
                    }
                }
            }
        }
      }
    }
    const removeMyComment = (com) =>{
        setMyComments((cmts) =>
        cmts.filter((c) => c._id !== com._id)
      );
    }
    return (
        <div className=" justify-between w-full space-y-2">
            {myComments && myComments.length > 0 ? (
                myComments.map((comment, index) => (
                    <ShowComment original={true} id={comment._id} key={index} comment={comment} user_id={user_id} contentData={contentData} setCommentCount={setCommentCount} removeComment={removeMyComment} />
                ))
            ) : (
                <></>
            )}
            {comments && comments.length > 0 ? (
                comments.map((comment, index) => (
                    <ShowComment original={true} id={comment._id} key={index} comment={comment} user_id={user_id} contentData={contentData} setCommentCount={setCommentCount} removeComment={removeComment2} />
                ))
            ) : (
                // <div className="text-white">No comments</div>
                <></>
            )}

            {comments && comments.length > 0 && comments.length < contentData.comments.length ? (
                <div className="text-sm ml-2 my-3 cursor-pointer text-brand5" onClick={handleLoadComments}>
                    Load more comments...
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default AllComments;