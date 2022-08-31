import React, { useContext } from "react";
import { Flag, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";

function ReportModal() {
  const State = useContext(UserContext);
  return (
    <div
      className={`${
        State.database.reportModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Flag />
              Report
            </h3>
            <X
              onClick={() => State.updateDatabase({ reportModalOpen: false })}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="p-4 space-y-3 w-full">
          <h3 className=" font-semibold text-base text-brand2">
            Why are you reporting this post?
          </h3>
          <div className="space-y-2 w-full">
            <div
              tabindex="0"
              className="collapse collapse-arrow border-2 cursor-pointer  dark:border-slate-600 text-brand3 rounded-lg"
            >
              <div className="collapse-title text-xl font-medium">option </div>
              <div className="collapse-content flex flex-col space-y-1">
                <span>inside option</span>
                <span>inside option</span>
                <span>inside option</span>
                <span>inside option</span>
              </div>
            </div>
            <div
              tabindex="0"
              className="collapse collapse-arrow border-2 cursor-pointer dark:border-slate-600 text-brand3 rounded-lg"
            >
              <div className="collapse-title text-xl font-medium">option </div>
              <div className="collapse-content flex flex-col space-y-1">
                <span>inside option</span>
                <span>inside option</span>
                <span>inside option</span>
                <span>inside option</span>
              </div>
            </div>
          </div>
          <textarea
            className="textarea w-full"
            placeholder="Issue (optional)"
          ></textarea>
          <button
            className={`btn  w-full 
             btn-primary
            }`}
          >
            submit report
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
