import React, { useState } from "react";
import { X, AlertTriangle, Link, AlertCircle } from "tabler-icons-react";

const LinkNewWalletModal = ({ open, setOpen }) => {
  const [accepted1, setaccepted1] = useState(false);
  const [accepted2, setaccepted2] = useState(false);

  return (
    <div
      className={`modal ${open && "modal-open"}  modal-bottom sm:modal-middle`}
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
            <input
              onChange={() => setaccepted1(!accepted1)}
              checked={accepted1}
              type="checkbox"
              className="checkbox checkbox-sm checkbox-error"
            />
            <span className="label-text text-brand1">I accept warning 1</span>
          </div>
          <div className="flex items-center gap-2 border border-rose-600 text-rose-500 rounded-md p-2">
            <input
              onChange={() => setaccepted2(!accepted2)}
              checked={accepted2}
              type="checkbox"
              className="checkbox checkbox-sm checkbox-error"
            />
            <span className="label-text text-brand1">I accept warning 2</span>
          </div>

          <div className="flex justify-end gap-2 w-full ">
            <button
              //   onClick={() => setOpen(false)}
              className={`btn gap-1 flex-grow ${
                accepted1 && accepted2 ? "btn-brand" : " btn-disabled "
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
