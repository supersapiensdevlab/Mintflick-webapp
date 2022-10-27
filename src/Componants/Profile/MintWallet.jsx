import React from "react";
import { useState, useContext } from "react";
import {
  Diamond,
  DotsVertical,
  Gift,
  Send,
  Wallet,
  Coin,
  ArrowsDown,
} from "tabler-icons-react";
import EachTransaction from "./EachTransaction";
import CollectCoinsModal from "./Modals/CollectCoinsModal";
import { UserContext } from "../../Store";
import axios from "axios";
import GiftModal from "../Live/Modals/GiftModal";
import TreasuryConvertModal from "./Modals/TreasuryConvertModal";

function MintWallet() {
  const [collectCoinsModalVisible, setCollectCoinsModalVisible] =
    useState(false);
  const [showConversionModal, setShowConversionModal] = useState(false);

  const State = useContext(UserContext);

  return (
    <div className="flex flex-col items-start bg-slate-100 dark:bg-slate-800 w-full h-fit rounded-lg overflow-clip">
      <div className="hidden lg:flex justify-between items-center w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <h3 className="flex items-center gap-2 font-semibold text-base text-brand2">
          <Wallet />
          Wallet
        </h3>
        {/* <DotsVertical
          size={20}
          className="text-brand2 cursor-pointer"
        ></DotsVertical> */}
      </div>
      <div className="p-2 w-full flex flex-col gap-2 items-center">
        <span className="flex justify-between items-center w-full p-2 px-4  rounded-md bg-slate-200 dark:bg-slate-700">
          <h3 className="flex items-center font-semibold text-3xl text-white">
            {State.database.userData.data?.user?.coins?.balance}
            <Coin className="text-white mx-1" size={32} />
          </h3>{" "}
          <button
            onClick={() => {
              setCollectCoinsModalVisible(true);
            }}
            className="ml-auto btn btn-sm btn-primary btn-outline capitalize"
          >
            collect
          </button>
        </span>
        <div
          className="btn btn-square -my-7 z-10"
          onClick={() => {
            setShowConversionModal(true);
          }}
        >
          <ArrowsDown size={24} className=" text-white" />
        </div>
        <span className="flex justify-between items-center w-full p-2 px-4  rounded-md bg-slate-200 dark:bg-slate-700">
          <h3 className="flex items-center font-semibold text-3xl text-white">
            {State.database.userData.data?.user?.gems?.balance}
            <Diamond className="text-white mx-1" size={32} />
          </h3>{" "}
          <button className="ml-auto btn btn-sm btn-primary btn-outline capitalize">
            redeem
          </button>
        </span>
        <div className="flex flex-col w-full h-72 overflow-auto gap-1">
          <span className="text-xs text-brand4">Jaunary 03 2022</span>
          <EachTransaction />
          <EachTransaction />
          <EachTransaction />
          <EachTransaction />
          <span className="text-xs text-brand4">Jaunary 03 2022</span>
          <EachTransaction />
          <EachTransaction />
          <EachTransaction />
          <EachTransaction />
        </div>{" "}
        <button className="btn gap-2 px-8 w-full max-w-lg rounded-full btn-brand btn-primary capitalize">
          <Send size={20} /> send
        </button>
      </div>
      <div
        className={`${
          collectCoinsModalVisible && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <CollectCoinsModal
          setCollectCoinsModalVisible={setCollectCoinsModalVisible}
        />
      </div>
      <div
        className={`${
          showConversionModal && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <TreasuryConvertModal setShowConversionModal={setShowConversionModal} />
      </div>
    </div>
  );
}

export default MintWallet;
