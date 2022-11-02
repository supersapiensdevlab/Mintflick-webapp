import React, { useState } from "react";
import { X, AlertTriangle, Link, AlertCircle } from "tabler-icons-react";

const LinkNewWalletModal = ({ open, setOpen }) => {
  const [accepted, setaccepted] = useState(false);
  return (
    <div
      className={`${open && "modal-open"} modal modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Link />
              Link new wallet
            </h3>
            <X
              onClick={() => setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="space-y-2 w-full h-fit p-4  bg-slate-100 dark:bg-slate-800">
          <input
            type="text"
            className="input  w-full"
            placeholder="Enter wallet address to link"
            //   onChange={(e) =>
            //   value={}
          />
          <div className="flex items-center gap-2 border border-rose-600 text-rose-500 rounded-md p-2">
            <AlertCircle size={16} />
            <span className="text-brand2 text-sm">Warning</span>
          </div>
          <div className="flex gap-2 border border-rose-600 text-rose-500 rounded-md p-2">
            <AlertCircle size={16} />
            <span className="text-brand2 text-sm">Warning 2</span>
          </div>

          <div className="form-control w-fit ">
            <label className="cursor-pointer label gap-2">
              <input
                onChange={() => setaccepted(!accepted)}
                checked={accepted}
                type="checkbox"
                className="checkbox checkbox-success"
              />
              <span className="label-text text-brand1">I accept</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 w-full ">
            <button
              //   onClick={() => setOpen(false)}
              className={`btn gap-1 flex-grow ${
                accepted ? "btn-brand" : " btn-disabled "
              }`}
            >
              <Link />
              Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkNewWalletModal;
