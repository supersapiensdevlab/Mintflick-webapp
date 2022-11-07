import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";
import ChatModal from "./ChatModal";
import { ArrowNarrowLeft, ChevronLeft, User, Users } from "tabler-icons-react";

function ChatsListMobile(props) {
  const State = useContext(UserContext);
  const [mobilechatModalOpen, setmobilechatModalOpen] = useState(false);
  const [chatUserName, setchatUserName] = useState(
    State.database.userData.data?.user?.username
  );
  const [chatState, setchatState] = useState({});
  const [showChats, setshowChats] = useState(true);

  return (
    <div className="flex flex-col items-start bg-slate-100 dark:bg-slate-800 w-full h-full ">
      <div className="w-full h-fit py-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-start items-center  text-lg font-semibold text-brand2">
          <Link
            to={`/homescreen/home`}
            className=" btn btn-square btn-sm btn-ghost my-2"
          >
            <ArrowNarrowLeft size={24}></ArrowNarrowLeft>
          </Link>
          Messages
        </div>
      </div>
      <div className="flex w-full   bg-slate-200 dark:bg-slate-600 rounded-none ">
        <div
          className={`flex items-center p-2  gap-1 w-1/2 justify-center  ${
            showChats &&
            "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
          } text-brand2 font-semibold`}
          onClick={() => setshowChats(true)}
        >
          <User size={16} /> Chats
        </div>
        <div
          className={`flex items-center p-2  gap-1 w-1/2 justify-center ${
            !showChats &&
            "bg-slate-100 border-t-2 border-success  dark:bg-slate-800"
          } text-brand2 font-semibold`}
          onClick={() => setshowChats(false)}
        >
          <Users size={16} /> Channels
        </div>
      </div>
      <div className="flex-grow w-full overflow-auto">
        {State.database.userData.data &&
          State.database.userData.data.user.conversations && (
            <>
              {State.database.userData.data.user.conversations
                .filter((user) => showChats ^ user.isGroup)
                .map((conv) => {
                  return (
                    <div
                      onClick={() => {
                        setchatState({
                          isDM: conv.isGroup ? false : true,
                          user2: { id: conv.user_id },
                        });
                        setchatUserName(conv.username);
                        setmobilechatModalOpen(true);
                      }}
                      // to={`/homescreen/chat/${conv.username}`}
                      // state={{
                      //   isDM: conv.isGroup ? false : true,
                      //   user2: { id: conv.user_id },
                      // }}
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
                          {conv.username}{" "}
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
                    </div>
                  );
                })}
            </>
          )}
      </div>
      <ChatModal
        open={mobilechatModalOpen}
        setOpen={setmobilechatModalOpen}
        userName={chatUserName}
        state={{ ...chatState }}
      />
    </div>
  );
}

export default ChatsListMobile;
