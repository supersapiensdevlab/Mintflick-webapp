import React from "react";
import { useState } from "react";
import {
  X,
  Wand,
  Sticker,
  Messages,
  Diamond,
  ChevronLeft,
} from "tabler-icons-react";
import sticker from "../../../Assets/characters/Untitled_Artwork.png";
import preview from "../../../Assets/Preview/previewgif.gif";
import { useContext } from "react";
import { UserContext } from "../../../Store";

const GiftModal = ({ setShowGiftModal, socket, username }) => {
  const user = useContext(UserContext);
  const [step, setStep] = useState(0);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedMagicChat, setSelectedMagicChat] = useState({
    value: null,
    i: null,
    text: "",
  });

  const stickers = [
    {
      sticker: sticker,
      value: 20,
    },
    {
      sticker: sticker,
      value: 20,
    },
    {
      sticker: sticker,
      value: 20,
    },
    {
      sticker: sticker,
      value: 20,
    },
  ];

  console.log(selectedMagicChat);
  console.log(selectedSticker);

  const sendSticker = () => {
    if (socket && selectedSticker) {
      let room = {
        room_admin: username,
        chat: {
          user_id: user.database.userData.data.user._id,
          type: "sticker",
          username: user.database.userData.data.user.username,
          profile_image: user.database.userData.data.user.profile_image,
          message: "Sticker",
          createdAt: Date.now(),
          url: selectedSticker.value.sticker,
          value: selectedSticker.value.value,
        },
      };
      setShowGiftModal(false);
      socket.emit("live_chatMessage", room);
    }
  };

  const sendMagicChat = () => {
    if (socket && selectedMagicChat.text && selectedMagicChat.value) {
      let room = {
        room_admin: username,
        chat: {
          user_id: user.database.userData.data.user._id,
          type: "magicchat",
          username: user.database.userData.data.user.username,
          profile_image: user.database.userData.data.user.profile_image,
          message: selectedMagicChat.text,
          createdAt: Date.now(),
          url: selectedMagicChat.value.sticker,
          value: selectedMagicChat.value.value,
        },
      };
      setShowGiftModal(false);
      socket.emit("live_chatMessage", room);
    }
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Wand />
            Show you support
          </h3>
          {step === 0 ? (
            <X
              onClick={() => {
                setShowGiftModal(false);
                setStep(0);
                setSelectedSticker(null);
                setSelectedMagicChat({
                  value: null,
                  i: null,
                  text: null,
                });
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          ) : (
            <ChevronLeft
              onClick={() => {
                setStep(0);
              }}
              className="text-white"
            />
          )}
        </div>
      </div>
      {step === 0 ? (
        <div className="flex flex-col space-y-5 p-4 text-white my-2">
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={() => {
              setStep(1);
            }}
          >
            <Sticker size={26} />
            <p>Gift sticker</p>
          </div>
          <hr className="text-white" />
          <div
            className="flex space-x-2 items-center cursor-pointer"
            onClick={() => {
              setStep(2);
            }}
          >
            <Messages size={26} />
            <p>Gift magic chat</p>
            <div className="bg-purple-500 text-sm py-0.5 px-2 rounded-md animate-pulse">
              new
            </div>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="flex flex-col  px-4 py-4 w-full text-white">
          <div className="flex w-full">
            {stickers.map((value, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    i === selectedSticker?.i ? "border border-white" : ""
                  } w-1/4 flex flex-col justify-center items-center py-3 space-y-1 rounded-lg cursor-pointer`}
                  onClick={() => {
                    setSelectedSticker({ value: value, i: i });
                  }}
                >
                  <img src={value.sticker} className="h-10 w-10 object-fill" />
                  <div className="flex space-x-1 items-center justify-center ">
                    <p>{value.value}</p>
                    <Diamond size={20} className="text-blue-400" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full">
            <button
              className={`flex space-x-2 items-center justify-center  btn ${
                selectedSticker ? "btn-brand" : "btn-disabled"
              } w-full mt-4 `}
              onClick={sendSticker}
            >
              <Wand size={20} />
              <p>Gift</p>
            </button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="flex flex-col  px-4 py-4 w-full text-white">
          <div className="flex w-full">
            {stickers.map((value, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    i === selectedMagicChat?.i ? "border border-white" : ""
                  } w-1/4 flex flex-col justify-center items-center py-3 space-y-1 rounded-lg cursor-pointer`}
                  onClick={() => {
                    setSelectedMagicChat({
                      value: { sticker: preview, value: value.value },
                      i: i,
                    });
                  }}
                >
                  <img src={value.sticker} className="h-10 w-10 object-fill" />
                  <div className="flex space-x-1 items-center justify-center ">
                    <p>{value.value}</p>
                    <Diamond size={20} className="text-blue-400" />
                  </div>
                </div>
              );
            })}
          </div>
          {selectedMagicChat.value && (
            <div className="w-full my-3 space-y-1">
              <p className="pl-1">Preview in chat</p>
              <div className="w-full ">
                <img src={preview} className="h-20 w-full rounded-t-lg" />
                <input
                  type="text"
                  className="textarea w-full text-sm "
                  placeholder="Say something ... "
                  onChange={(e) => {
                    setSelectedMagicChat((prev) => {
                      return {
                        ...prev,
                        text: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            </div>
          )}
          <div className="w-full">
            <button
              className={`flex space-x-2 items-center justify-center  btn ${
                selectedMagicChat.value ? "btn-brand" : "btn-disabled"
              } w-full mt-4 `}
              onClick={sendMagicChat}
            >
              <Wand size={20} />
              <p>Gift</p>
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GiftModal;
