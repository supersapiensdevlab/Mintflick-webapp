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
        <div className="p-2">
          <h3 className="flex items-center gap-2 font-semibold text-base text-brand2">
            Why are you reporting this post?
          </h3>
        </div>
      </div>
    </div>
  );
}

export default ReportModal;
