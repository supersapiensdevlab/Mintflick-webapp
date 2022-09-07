import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { ArrowNarrowRight, Heart } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import Picker from "emoji-picker-react";
import placeholderImage from "../../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";

function ShowComment({
  comment,
  user_id,
  contentData,
  setCommentCount,
  replyTo,
  original,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const State = useContext(UserContext);

  // for reply
  const [isReply, setIsReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [myReplyComments, setMyReplyComments] = useState([]);
  const onEmojiClick = (event, emojiObject) => {
    setReplyText(replyText + emojiObject.emoji);
  };

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState(null);
  useEffect(() => {
    if (replyTo) {
      axios
        .get(
          `${process.env.REACT_APP_SERVER_URL}/user/shortData/${comment.user_id}`
        )
        .then((res) => {
          setProfile(
            res.data
              ? res.data.profile_image
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          );
          setName(res.data ? res.data.name : "deleted user");
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleOnEnter = () => {
    if (State.database.userData.data.user && replyText !== "") {
      let data = {
        user_data_id: user_id,
        content: contentData,
        comment: replyText,
        replyTo: comment._id,
      };
      axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/user/addcomment`,
        data: data,
        headers: {
          "content-type": "application/json",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
        .then((res) => {
          setMyReplyComments((m) => [
            ...m,
            {
              comment: replyText,
              _id: res.data.id,
              user_id: State.database.userData.data.user._id,
              likes: [],
              reply: [],
              profile_image: State.database.userData.data.user.profile_image,
              username: State.database.userData.data.user.username,
              name: State.database.userData.data.user.name,
            },
          ]);
          setReplyText("");
          setIsReply(false);
          setCommentCount((commentsNumber) => commentsNumber + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    if (comment.likes && State.database.userData.data.user) {
      setLikeCount(comment.likes.length);
      comment.likes.map((like) => {
        console.log(like.user_id);
        console.log(State.database.userData.data.user._id);
        if (like == State.database.userData.data.user._id) {
          console.log("setting trueeeeee");
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
      replyTo: replyTo,
    };
    const res = await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/likecomment`,
      data: data,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
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
    <div
      className="w-full flex items-start space-x-1"
      style={{ whiteSpace: "pre-line" }}
    >
      {/* <img
        src={replyTo ? profile : (
          comment.profile_image
            ? comment.profile_image
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png")
        }
        alt="profile pic"
        className="h-10 w-10 object-cover rounded-full "
      /> */}
      <Image
        className="h-10 w-10 object-cover rounded-full "
        width={50}
        height={50}
        src={
          replyTo
            ? profile
            : comment.profile_image
            ? comment.profile_image
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="profile pic"
        placeholderColor={placeholderImage}
      />
      <div className="flex flex-col flex-grow">
        <p className=" text-brand4 text-base font-medium">
          <span className="text-brand3 font-semibold mr-1">
            {replyTo ? name : comment.name}
          </span>
          {comment.comment}
        </p>
        <div className="group cursor-pointer flex  items-center text-brand4  text-sm gap-1">
          <Heart
            onClick={() => {
              handleCommentLike();
            }}
            size={16}
            className={`${
              isLiked
                ? "text-red-600 hover:text-white fill-rose-600"
                : "text-brand1 hover:text-red-600"
            } `}
          ></Heart>
          {likeCount > 0 ? likeCount : "like"}
          {original && (
            <>
              <span>|</span>
              <span onClick={() => setIsReply(true)}>Reply</span>
            </>
          )}
        </div>

        {/* For replies of comments */}

        {comment.reply && comment.reply.length > 0 ? (
          comment.reply.map((c, index) => (
            <ShowComment
              key={index}
              comment={c}
              user_id={user_id}
              contentData={contentData}
              setCommentCount={setCommentCount}
              replyTo={comment._id}
            />
          ))
        ) : (
          // <div className="text-white">No comments</div>
          <></>
        )}
        {myReplyComments && myReplyComments.length > 0 ? (
          myReplyComments.map((c, index) => (
            <ShowComment
              key={index}
              comment={c}
              user_id={user_id}
              contentData={contentData}
              setCommentCount={setCommentCount}
              replyTo={comment._id}
            />
          ))
        ) : (
          <></>
        )}

        {isReply && (
          <div className="flex gap-2 items-center">
            <textarea
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type here..."
              className="input w-full pt-2"
              value={replyText}
            ></textarea>
            <div className="dropdown dropdown-top dropdown-end">
              <label tabindex={0} className="btn m-1 btn-primary btn-outline">
                😃
              </label>
              <ul
                tabindex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <Picker onEmojiClick={onEmojiClick} />
              </ul>
            </div>
            <button
              onClick={() => replyText && handleOnEnter()}
              className={`btn    ${
                replyText !== "" ? "btn-primary btn-outline" : "btn-disabled"
              }`}
            >
              <ArrowNarrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowComment;
