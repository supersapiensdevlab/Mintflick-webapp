import React from "react";
import {
  DeviceFloppy,
  Edit,
  Link,
  Pencil,
  Unlink,
  X,
} from "tabler-icons-react";
import coverImage from "../../../Assets/backgrounds/cover.png";

function EditProfileModal(props) {
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
              <Edit />
              Edit Profile
            </h3>
            <X
              onClick={() => props.setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 w-full  justify-center">
          <div className="w-full relative">
            <img
              src={coverImage}
              alt="cover image"
              className="w-full aspect-{4/2} rounded-lg object-cover"
            />
            <button className="p-1 rounded-full bg-slate-400/40 dark:bg-slate-600/40  text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm absolute top-1 right-1">
              <Pencil className="text-primary " size={16} />
            </button>
          </div>
          <div className="mx-auto relative">
            <img
              src={coverImage}
              alt="Profile image"
              className="w-24 h-24 -mt-14 object-cover  rounded-full"
            />
            <button className="p-1 rounded-full bg-slate-400/40 dark:bg-slate-600/40  text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm absolute bottom-0 right-0">
              <Pencil className="text-primary " size={16} />
            </button>
          </div>

          <div className="flex gap-2 w-full">
            <input
              type="text"
              className="input  w-full"
              placeholder="Username"
              //   onChange={(e) =>
              //   value={}
            />
            <input
              type="text"
              className="input  w-full"
              placeholder="Name"
              //   onChange={(e) =>
              //   value={}
            />
          </div>

          <input
            type="text"
            className="input  w-full"
            placeholder="Email"
            //   onChange={(e) =>
            //   value={}
          />
          <div className="flex flex-col gap-1 w-full p-4 bg-white dark:bg-slate-700 rounded-lg">
            <span className="text-md font-semibold text-brand4">
              Connected Wallets
            </span>
            <div className="flex justify-between items-center text-sm text-brand2 p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
              <span className="flex-grow truncate">
                {localStorage.getItem("walletAddress")}
              </span>
              <div className="tooltip" data-tip="Unlink wallet">
                <button className="p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm">
                  <Unlink className="text-primary " size={16} />
                </button>
              </div>
            </div>
            <button className="btn btn-outline btn-primary btn-xs gap-1 mx-auto w-fit rounded-full capitalize">
              <Link size={16} />
              link other wallet
            </button>
          </div>
          <button className="btn btn-brand gap-2 capitalize ">
            <DeviceFloppy /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
