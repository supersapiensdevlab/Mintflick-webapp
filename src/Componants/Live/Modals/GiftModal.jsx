import React from "react";
import { useState } from "react";
import {
  X,
  Wand,
  Sticker,
  Messages,
  Diamond,
  ChevronLeft,
  BuildingStore,
} from "tabler-icons-react";
import sticker1 from "../../../Assets/characters/IMG_3560.PNG";
import sticker2 from "../../../Assets/characters/IMG_3561.PNG";
import sticker3 from "../../../Assets/characters/IMG_3562.PNG";
import sticker4 from "../../../Assets/characters/IMG_3563.PNG";
import sticker5 from "../../../Assets/characters/IMG_3564.PNG";
import sticker6 from "../../../Assets/characters/IMG_3565.PNG";
import sticker7 from "../../../Assets/characters/IMG_3566.PNG";
import sticker8 from "../../../Assets/characters/IMG_3565_low.png";

import preview from "../../../Assets/Preview/previewgif.gif";
import { useContext } from "react";
import { UserContext } from "../../../Store";
import useRazorpay from "react-razorpay";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";

const GiftModal = ({ setShowGiftModal, socket, username }) => {
  const user = useContext(UserContext);
  const [loadFeed, loadUser] = useUserActions();
  const [step, setStep] = useState(0);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [selectedGemsPlan, setSelectedGemsPlan] = useState(null);
  const [selectedMagicChat, setSelectedMagicChat] = useState({
    value: null,
    i: null,
    text: "",
  });
  const Razorpay = useRazorpay();
  const [insufficientGemsForSticker, setInsufficientGemsForSticker] =
    useState(null);
  const [insufficientGemsForChat, setInsufficientGemsForChat] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const stickers = [
    {
      sticker: sticker1,
      value: 2,
    },
    {
      sticker: sticker2,
      value: 2,
    },
    {
      sticker: sticker3,
      value: 2,
    },
    {
      sticker: sticker4,
      value: 2,
    },
    {
      sticker: sticker5,
      value: 2,
    },
    {
      sticker: sticker6,
      value: 2,
    },
    {
      sticker: sticker7,
      value: 2,
    },
    {
      sticker: sticker8,
      value: 2,
    },
  ];

  const gemPlans = [
    {
      gems: 100,
      value: 10,
    },
    {
      gems: 200,
      value: 20,
    },
    {
      gems: 300,
      value: 30,
    },
    {
      gems: 500,
      value: 50,
    },
  ];

  const clearData = () => {
    setShowGiftModal(false);
    setStep(0);
    setSelectedSticker(null);
    setSelectedMagicChat({
      value: null,
      i: null,
      text: null,
    });
    setInsufficientGemsForSticker(null);
    setInsufficientGemsForChat(null);
  };

  const handlePayment = async (amount) => {
    const orderUrl = `${process.env.REACT_APP_SERVER_URL}/order`;
    const response = await axios.post(orderUrl, { amount: amount });
    const { data } = response;
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      name: "Mintflick",
      description: "Decentralised platform for creators",
      order_id: data.id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const url = `${process.env.REACT_APP_SERVER_URL}/capture/${paymentId}`;
          await axios
            .post(url, {
              amount: amount,
              username: user.database.userData.data?.user?.username,
            })
            .then(async (response) => {
              console.log(response.data);
              await loadUser();
              setStep(0);
              //
            });
        } catch (err) {
          console.log(err);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
  };

  const sendSticker = async () => {
    if (
      user.database.userData.data?.user?.username == username ||
      selectedSticker.value.value <=
        user.database.userData.data?.user?.gems?.balance
    ) {
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
        clearData();
        socket.emit("live_chatMessage", room);
      }
    } else {
      setInsufficientGemsForSticker("Insufficient Gems, Buy from the store");
    }
  };

  const sendMagicChat = async () => {
    if (
      user.database.userData.data?.user?.username == username ||
      selectedMagicChat.value.value <=
        user.database.userData.data?.user?.gems?.balance
    ) {
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
        clearData();
        socket.emit("live_chatMessage", room);
      }
    } else {
      setInsufficientGemsForChat("Insufficient Gems, Buy from the store");
    }
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          {step !== 0 && (
            <ChevronLeft
              onClick={() => {
                setStep(0);
              }}
              className="text-white"
            />
          )}
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Wand />
            Show you support
          </h3>
          {step === 0 ? (
            <X
              onClick={() => {
                clearData();
              }}
              className="text-brand2 cursor-pointer"
            ></X>
          ) : (
            <div className="flex space-x-3 items-center">
              <div className="flex space-x-1 text-white">
                <Diamond size={20} className="text-blue-500" />
                <p>{user.database.userData?.data?.user?.gems?.balance}</p>
              </div>
              <div
                className="btn btn-brand btn-sm p-2"
                onClick={() => {
                  setStep(3);
                }}
              >
                <BuildingStore size={20} />
              </div>
            </div>
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
          <div className="grid grid-cols-4 align- w-full">
            {stickers.map((value, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    i === selectedSticker?.i ? "border border-white" : ""
                  }  flex flex-col justify-center items-center py-3 space-y-1 rounded-lg cursor-pointer`}
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
          {insufficientGemsForSticker && (
            <div className="text-red-500 text-center w-full mt-3">
              {insufficientGemsForSticker}
            </div>
          )}
          <div className="w-full">
            <button
              className={`flex space-x-2 items-center justify-center  btn ${
                selectedSticker ? "btn-brand" : "btn-disabled"
              } w-full mt-2 `}
              onClick={sendSticker}
            >
              <Wand size={20} />
              <p>Gift</p>
            </button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="flex flex-col  px-4 py-4 w-full text-white">
          {selectedMagicChat.value && (
            <div className="w-full space-y-1 mb-1">
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
          <div className="flex w-full mt-3">
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
          {insufficientGemsForChat && (
            <div className="text-red-500 text-center w-full mt-3">
              {insufficientGemsForChat}
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
      ) : step === 3 ? (
        <div className="flex flex-col p-4 w-full text-white">
          <div className="flex w-full mt-3">
            {gemPlans.map((value, i) => {
              return (
                <div
                  key={i}
                  className={`${
                    i === selectedGemsPlan?.i ? "border border-white" : ""
                  } w-1/4 flex flex-col justify-center items-center py-3 space-y-1 rounded-lg cursor-pointer`}
                  onClick={() => {
                    setSelectedGemsPlan({
                      value: { gems: value.gems, value: value.value },
                      i: i,
                    });
                  }}
                >
                  <div className="flex space-x-1 items-center justify-center ">
                    <p>{value.gems}</p>
                    <Diamond size={20} className="text-blue-400" />
                  </div>
                  <div className="mt-3">{value.value} INR</div>
                </div>
              );
            })}
          </div>
          <div className="w-full">
            <button
              className={`flex space-x-2 items-center justify-center  btn ${
                selectedGemsPlan ? "btn-brand" : "btn-disabled"
              } w-full mt-6 `}
              onClick={() => {
                handlePayment(selectedGemsPlan.value.value);
              }}
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
