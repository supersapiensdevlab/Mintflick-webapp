import React, { useState } from "react";
import { X, AlertTriangle } from "tabler-icons-react";

const ConfirmationModal = ({
  open,
  setOpen,
  onConfirm,
  icon,
  title,
  content,
  buttonLable,
  color,
}) => {
  return (
    <div
      className={`${open && "modal-open"} modal modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              {icon}
              {title}
            </h3>
            <X
              onClick={() => setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>

        <div className="w-full h-fit p-2  bg-slate-100 dark:bg-slate-800">
          <p className="mx-auto w-fit max-w-full text-brand2 font-semibold p-2">
            {content}
          </p>
          <div className="flex justify-end gap-2 w-full p-2">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-ghost flex-grow "
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`btn ${
                color === "green" ? "btn-success" : "btn-error"
              } text-white flex-grow`}
            >
              {buttonLable ? buttonLable : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
