import React from "react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../Store";
import placeholderImage from "../../Assets/profile-pic.png";
import { Image } from "react-img-placeholder";

function ChatsList() {
  const State = useContext(UserContext);
  return (
    <div className="flex flex-col items-start p-4  bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg ">
      <p className="text-lg text-brand5 font-bold">Chats</p>

      {State.database.userProfileData &&
        State.database.userData.data &&
        State.database.userData.data.user.conversations && (
          <>
            {State.database.userData.data.user.conversations.map((conv) => {
              return (
                <Link
                  to={`/homescreen/chat/${conv.username}`}
                  state={{
                    isDM: true,
                    user2: { id: conv.user_id },
                  }}
                  className="group w-full flex cursor-pointer items-center gap-2  rounded-md p-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Image
                    width={33}
                    height={33}
                    className="h-full rounded-full border-2"
                    src={placeholderImage}
                    alt="profileImage"
                    placeholderSrc={placeholderImage}
                  />
                  <p className="cursor-pointer text-base font-medium text-brand3">
                    {conv.username}
                  </p>
                </Link>
              );
            })}
          </>
        )}
    </div>
  );
}

export default ChatsList;
