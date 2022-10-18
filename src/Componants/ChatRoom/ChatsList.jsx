import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import axios from "axios";
import { User, Users } from "tabler-icons-react";

function ChatsList(props) {
  const State = useContext(UserContext);
  const [showChats, setshowChats] = useState(false);

  return (
    <div className="flex flex-col items-start py-2 bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <div className="w-full px-2">
        <div className="tabs tabs-boxed w-full bg-slate-200 dark:bg-slate-700 ">
          <div
            className={`tab ${
              showChats && "tab-active"
            } text-brand2 font-semibold`}
            onClick={() => setshowChats(true)}
          >
            <User size={16} /> Chats
          </div>
          <div
            className={`tab ${
              !showChats && "tab-active"
            } text-brand2 font-semibold`}
            onClick={() => setshowChats(false)}
          >
            <Users size={16} /> Channels
          </div>
        </div>
      </div>

      {State.database.userData.data &&
        State.database.userData.data.user.conversations && (
          <>
            {State.database.userData.data.user.conversations
              .filter((user) => showChats ^ user.isGroup)
              .map((conv) => {
                return (
                  <Link
                    to={`/homescreen/chat/${conv.username}`}
                    state={{
                      isDM: conv.isGroup ? false : true,
                      user2: { id: conv.user_id },
                    }}
                    className={`${
                      props.userName === conv.username &&
                      "border-r-4 border-green-700 bg-slate-200 dark:bg-slate-900/60"
                    } group w-full flex cursor-pointer items-center gap-2 p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60`}
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
                        {conv.isGroup ? (
                          <span className=" text-xs font-normal rounded mx-2 px-1 py-0.5 bg-orange-500">
                            Group
                          </span>
                        ) : (
                          <span className=" text-xs font-normal rounded mx-2 px-1 py-0.5 bg-green-500">
                            DM
                          </span>
                        )}
                      </p>
                      <p className="cursor-pointer text-base w-2/3 truncate text-brand5">
                        this is recent message sent by user
                      </p>
                    </div>
                  </Link>
                );
              })}
          </>
        )}
    </div>
  );
}

export default ChatsList;
