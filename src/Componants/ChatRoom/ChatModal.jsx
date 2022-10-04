import React from "react";

function ChatModal() {
  return (
    <div
      className={`${
        State.database.chatModalOpen && "modal-open"
      } modal  modal-bottom `}
    >
      <div className="modal-box h-screen p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Share />
              Chat
            </h3>
            <X
              onClick={() => State.updateDatabase({ shareModalOpen: false })}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
