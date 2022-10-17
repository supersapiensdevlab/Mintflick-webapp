import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import ChatModal from "./ChatModal";

function ChatsListMobile(props) {
  const State = useContext(UserContext);
  const [mobilechatModalOpen, setmobilechatModalOpen] = useState(false);
  const [chatUserName, setchatUserName] = useState(State.database.userData.data.user.username);



  return (
    <div className="flex flex-col items-start bg-slate-100 dark:bg-slate-800 w-full h-fit ">

      {State.database.userData.data &&
        State.database.userData.data.user.conversations && (
          <>
            {State.database.userData.data.user.conversations.map((conv) => {
              return (
                <div
                  onClick={() =>{setchatUserName(conv.username); setmobilechatModalOpen(true)}}
                  //   to={`/homescreen/chat/${conv.username}`}
                  state={{
                    isDM: true,
                    user2: { id: conv.user_id },
                  }}
                  className={`
                  group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60`}
                >
                  <Image
                    width={46}
                    height={46}
                    className="h-full rounded-full border-2"
                    src={placeholderImage}
                    alt="profileImage"
                    placeholderSrc={placeholderImage}
                  />
                  <div className="flex flex-col">
                    <p className="cursor-pointer text-base font-semibold text-brand3">
                      {conv.username}
                    </p>
                    <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                      this is recent message sent by user
                    </p>
                  </div>
                  
                </div>
              );
            })}
          </>
          
        )}
        <ChatModal
                open={mobilechatModalOpen}
                setOpen={setmobilechatModalOpen}
                userName={chatUserName}
                state={{
                  isDM: false,
                  user2: {},
                }}
              />
    </div>
  );
}

export default ChatsListMobile;
