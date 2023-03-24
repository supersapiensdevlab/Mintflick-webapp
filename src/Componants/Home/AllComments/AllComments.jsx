import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ArrowNarrowRight,
  ChevronLeft,
  Rss,
  Send,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../../Store";
import CustomInput from "../../CustomInputs/CustomInput";
import ShowComment from "./ShowComment";
import Picker from "emoji-picker-react";

function AllComments({
  contentData,
  user_id,
  myComments,
  setCommentCount,
  setMyComments,
  ShowComments,
  setshowComments,
}) {
  const State = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [counter, setCounter] = useState(0);

  const [text, setText] = useState("");
  const [tagged, settagged] = useState([]);

  const onEmojiClick = (event, emojiObject) => {
    setText(text + emojiObject.emoji);
  };
  async function handleOnEnter() {
    if (State.database.userData.data.user && text !== "") {
      let data = {
        user_data_id: user_id,
        content: contentData,
        comment: text,
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
          setText("");
          setMyComments((m) => [
            {
              comment: text,
              _id: res.data.id,
              user_id: State.database.userData.data.user._id,
              likes: [],
              profile_image: State.database.userData.data.user.profile_image,
              username: State.database.userData.data.user.username,
              name: State.database.userData.data.user.name,
            },
            ...m,
          ]);
          setCommentCount((commentsNumber) => commentsNumber + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    async function eff() {
      if (contentData.comments) {
        setTotalComments(contentData.comments.length);
        setComments([]);
        for (var i = 0; i < 2; i++) {
          if (contentData.comments[i]) {
            let x = counter + 1;
            setCounter((counter) => counter + 1);
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/user/shortData/${contentData.comments[i].user_id}`
              );
              let temp = {
                ...contentData.comments[i],
                profile_image: res.data
                  ? res.data.profile_image
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                username: res.data ? res.data.username : "deleted user",
                name: res.data ? res.data.name : "deleted user",
              };
              setComments((c) => [...c, temp]);
            } catch (e) {
              console.log(e);
            }
          }
        }
      } else {
        setComments(null);
      }
    }
    eff();
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
            `${process.env.REACT_APP_SERVER_URL}/user/shortData/${contentData.comments[i].user_id}`
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
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/likecomment`,
      data: data,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    });
  };

  const removeComment = (com) => {
    setComments((cmts) => cmts.filter((c) => c._id !== com._id));
  };
  const removeComment2 = (com) => {
    let allcomments = comments;
    for (var i = 0; i < allcomments.length; i++) {
      if (allcomments[i]._id == com._id) {
        allcomments.splice(i, 1);
        return true;
      } else {
        if (allcomments[i].reply) {
          for (var j = 0; j < allcomments[i].reply.length; j++) {
            if (allcomments[i].reply[j]._id == com._id) {
              allcomments[i].reply.splice(j, 1);
              return true;
            }
          }
        }
      }
    }
  };
  const editComment = (com, editText) => {
    let allcomments = comments;
    for (var i = 0; i < allcomments.length; i++) {
      if (allcomments[i]._id == com._id) {
        allcomments[i].comment = editText;
        return true;
      } else {
        if (allcomments[i].reply) {
          for (var j = 0; j < allcomments[i].reply.length; j++) {
            if (allcomments[i].reply[j]._id == com._id) {
              allcomments[i].reply[j].comment = editText;
              return true;
            }
          }
        }
      }
    }
  };
  const editMyComment = (com, editText) => {
    let allcomments = myComments;
    for (var i = 0; i < allcomments.length; i++) {
      if (allcomments[i]._id == com._id) {
        allcomments[i].comment = editText;
        return true;
      } else {
        if (allcomments[i].reply) {
          for (var j = 0; j < allcomments[i].reply.length; j++) {
            if (allcomments[i].reply[j]._id == com._id) {
              allcomments[i].reply[j].comment = editText;
              return true;
            }
          }
        }
      }
    }
  };
  const removeMyComment = (com) => {
    setMyComments((cmts) => cmts.filter((c) => c._id !== com._id));
  };
  return (
    <div
      className={`  fixed bottom-0 left-0  z-[999] bg-slate-100/20 backdrop-blur-lg w-full h-screen flex flex-col justify-end md:justify-center items-start p-2`}
    >
      <span className="flex gap-1 items-center justify-between text-xl font-bold text-brand1  w-full max-w-xl mx-auto p-3">
        Comments{" "}
        <X onClick={() => setshowComments(false)} className="cursor-pointer" />
      </span>
      <div className=" w-full max-w-xl mx-auto space-y-2 bg-slate-300 dark:bg-slate-700 p-3 h-1/2  overflow-auto rounded-md">
        {myComments && myComments.length > 0 ? (
          myComments.map((comment, index) => (
            <ShowComment
              original={true}
              id={comment._id}
              key={index}
              comment={comment}
              user_id={user_id}
              contentData={contentData}
              setCommentCount={setCommentCount}
              removeComment={removeMyComment}
              editComment={editMyComment}
            />
          ))
        ) : (
          <></>
        )}
        {comments ? (
          comments.length > 0 ? (
            comments.map((comment, index) => (
              <ShowComment
                original={true}
                id={comment._id}
                key={index}
                comment={comment}
                user_id={user_id}
                contentData={contentData}
                setCommentCount={setCommentCount}
                removeComment={removeComment2}
                editComment={editComment}
              />
            ))
          ) : (
            <div className="text-brand5 text-center text-lg font-semibold w-full">
              Loading...
            </div>
          )
        ) : (
          <div className="text-brand5 text-center text-lg font-bold w-full">
            No comments yet!
          </div>
        )}
        {comments &&
        comments.length > 0 &&
        comments.length < contentData.comments.length ? (
          <div
            className="text-sm ml-2 my-3 cursor-pointer text-brand5"
            onClick={handleLoadComments}
          >
            Load more comments...
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex gap-1 items-center     w-full max-w-xl mx-auto p-1">
        {/* <textarea
              onChange={(e) => setText(e.target.value)}
              placeholder="Type here..."
              className="input w-full pt-2"
              value={text}
            ></textarea> */}
        <div className="flex-grow">
          <CustomInput
            rows={1}
            placeholder={"Type here..."}
            className=" textarea w-full"
            value={text}
            setValue={setText}
            mentions={tagged}
            setMentions={settagged}
          />
        </div>

        {/* <MentionsInput
              value={text}  
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="input w-full"
              style={defaultStyle}
              placeholder={"Type here..."}
              a11ySuggestionsListLabel={"Suggested mentions"}
            >
              <Mention
                trigger="@"
                data={renderData}
                markup="@__display__"
                appendSpaceOnAdd
              />
            </MentionsInput> */}
        <div className="dropdown dropdown-top dropdown-end">
          <label tabindex={0} className="btn m-1 btn-primary btn-outline">
            😃
          </label>
          <ul
            tabindex={0}
            className="dropdown-content menu  bg-base-100 rounded-md w-fit"
          >
            <Picker onEmojiClick={onEmojiClick} />
          </ul>
        </div>
        <button
          onClick={() => text && handleOnEnter()}
          className={`btn    ${text !== "" ? "btn-primary " : "btn-disabled"}`}
        >
          <Send />
        </button>
      </div>
    </div>
  );
}

export default AllComments;
