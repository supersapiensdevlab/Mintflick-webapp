import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";

function CustomInput({
  type,
  placeholder,
  className,
  value,
  setValue,
  mentions,
  setMentions,
}) {
  const State = useContext(UserContext);

  const [showMentions, setshowMentions] = useState(false);
  const [following, setfollowing] = useState(
    State.database.userData?.data.user?.followee_count
  );
  const [showSlashTriggers, setshowSlashTriggers] = useState(false);
  const [slashTriggers, setslashTriggers] = useState([
    {
      label: "Email",
      value: State.database.userData?.data.user?.email,
    },
    {
      label: "Name",
      value: State.database.userData?.data.user?.name,
    },
    {
      label: "Username",
      value: State.database.userData?.data.user?.username,
    },
    {
      label: "Wallet",
      value: State.database.userData?.data.user?.wallet_id,
    },
  ]);
  function handleChange(e) {
    setValue(e.target.value);
    e.target.value.charAt(e.target.value.length - 1) === "@"
      ? setshowMentions(true)
      : setshowMentions(false);
    e.target.value.charAt(e.target.value.length - 1) === "/"
      ? setshowSlashTriggers(true)
      : setshowSlashTriggers(false);
  }

  return (
    <div className="relative ">
      <textarea
        type="text"
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
        required={true}
      />
      {showMentions && (
        <div
          className={`  w-full rounded-md  shadow-lg bg-slate-100/20 backdrop-blur-md text-brand1 text-base font-medium z-[9999] flex flex-col h-40 overflow-auto`}
        >
          <span className="text-lg font-bold py-2 px-4">Following</span>
          {following.map((x, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setValue(`${value}${x}`);
                  setMentions([...mentions, x]);
                  setshowMentions(false);
                }}
                className="w-full text-brand1 py-2 px-4 hover:bg-slate-100/20 hover:backdrop-blur-md cursor-pointer"
              >
                {x}
              </div>
            );
          })}
        </div>
      )}
      {showSlashTriggers && (
        <div
          className={`  w-full rounded-md  shadow-lg bg-slate-100/20 backdrop-blur-md text-brand1 text-base font-medium z-[9999] flex flex-col h-40 overflow-auto`}
        >
          {slashTriggers.map((x, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setValue(`${value.slice(0, -1)}${x.value}`);

                  setshowSlashTriggers(false);
                }}
                className="w-full text-brand1 py-2 px-4 hover:bg-slate-100/20 hover:backdrop-blur-md cursor-pointer"
              >
                {x.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CustomInput;
