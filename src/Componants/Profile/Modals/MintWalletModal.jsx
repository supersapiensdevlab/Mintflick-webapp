import React from "react";
import { Wallet, X } from "tabler-icons-react";
import MintWallet from "../MintWallet";

function MintWalletModal(props) {
  return (
    <div
      className={`${
        props.open && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Wallet /> Wallet
            </h3>
            <X
              onClick={() => props.setOpen()}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <MintWallet />
      </div>
    </div>
  );
}

export default MintWalletModal;
