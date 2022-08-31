import React, { useContext } from "react";
import { Share, X } from "tabler-icons-react";
import { UserContext } from "../../../Store";
import whatsapp from "../../../Assets/logos/icons/whatsapp.png";
import facebook from "../../../Assets/logos/icons/facebook.png";
import gmail from "../../../Assets/logos/icons/mail.jpeg";
import pinterest from "../../../Assets/logos/icons/pinterest.png";
import telegram from "../../../Assets/logos/icons/telegram.png";
import copy from "../../../Assets/logos/icons/copy.png";

function ShareModal() {
  const State = useContext(UserContext);
  return (
    <div
      className={`${
        State.database.shareModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Share />
              Share
            </h3>
            <X
              onClick={() => State.updateDatabase({ shareModalOpen: false })}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="flex flex-wrap p-4 w-full  justify-center">
          <div className="w-fit cursor-pointer space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img
              className="h-12 w-12 rounded-full object-center mx-auto"
              src={whatsapp}
            />
            <h3 className="text-brand3 mx-auto text-sm">Whatsapp</h3>
          </div>
          <div className="w-fit cursor-pointer space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img className="h-12 w-12  object-center mx-auto" src={facebook} />
            <h3 className="text-brand3 mx-auto text-sm">Facebook</h3>
          </div>
          <div className="w-fit cursor-pointer space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img
              className="h-12 w-12 rounded-full object-center mx-auto"
              src={gmail}
            />
            <h3 className="text-brand3 w-full text-center  text-sm">Mail</h3>
          </div>
          <div className="w-fit cursor-pointer space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img
              className="h-12 w-12 rounded-full object-center mx-auto"
              src={pinterest}
            />
            <h3 className="text-brand3 w-full text-center  text-sm">
              Pinterest
            </h3>
          </div>
          <div className="w-fit cursor-pointer space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img
              className="h-12 w-12 rounded-full object-center mx-auto"
              src={telegram}
            />
            <h3 className="text-brand3 w-full text-center  text-sm">
              Telegram
            </h3>
          </div>
          <div className="w-fit  cursor-pointer  space-y-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
            <img
              className="h-12 w-12 rounded-full object-center mx-auto"
              src={copy}
            />
            <h3 className="text-brand3 w-full text-center  text-sm">
              Copy Link
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
