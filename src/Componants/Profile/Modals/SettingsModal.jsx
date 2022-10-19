import React, { useState } from "react";
import {
  DeviceFloppy,
  Edit,
  Link,
  Pencil,
  Settings,
  Unlink,
  X,
} from "tabler-icons-react";
import coverImage from "../../../Assets/backgrounds/cover.png";
import SolanaToken from "../../../Assets/logos/SolanaToken";

function SettingsModal(props) {
  const [activeTab, setactiveTab] = useState("editProfile");
  const plans = [
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU",
      name: "Silver",
      description: ` asdasd asdasd asdasd asdasd ff fe efefe dasdas asdasasd asd`,
      price: `12`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU",
      name: "Gold",
      description: `asdasdasd  dsfsfd dasd dasdas asdasd asdasd asdasd asdasd ff fe efefe dasdas asdasasd asd`,
      price: `12`,
    },
    {
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU",
      name: "Platinum",
      description: `asdasdasd asdasd sdasdasdas asdasd asdasd asdasd asdasd ff fe efefe dasdas asdasasd asd`,
      price: `12`,
    },
  ];
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
              <Settings />
              Settings{" "}
            </h3>
            <X
              onClick={() => props.setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
          <div className="flex px-2 -mb-2">
            <span
              onClick={() => setactiveTab("editProfile")}
              className={`cursor-pointer text-brand2 px-2 pt-1 ${
                activeTab === "editProfile" &&
                "bg-slate-100 dark:bg-slate-800 rounded-t-lg"
              }`}
            >
              Edit Profile
            </span>
            <span
              onClick={() => setactiveTab("manageSuperfans")}
              className={`cursor-pointer text-brand2 px-2 pt-1 ${
                activeTab === "manageSuperfans" &&
                "bg-slate-100 dark:bg-slate-800 rounded-t-lg"
              }`}
            >
              Manage Superfans
            </span>
          </div>
        </div>
        {activeTab === "editProfile" && (
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
        )}
        {activeTab === "manageSuperfans" && (
          <div className="flex flex-col gap-2 p-4 w-full  justify-center">
            <div className="flex flex-col items-start gap-1">
              <span className="text-brand4 text-sm">Your Wallet address</span>
              <input
                type="text"
                className="input w-full"
                value={localStorage.getItem("walletAddress")}
                readOnly
              />
            </div>
            <span className="divider my-2 text-brand4 font-semibold ">
              Choose plan to edit
            </span>
            {plans.map((plan) => (
              <div className="group p-1 hover:ring-2 ring-primary dark:ring-brand rounded-lg">
                <div className="flex w-full bg-slate-200 dark:bg-slate-700 h-fit rounded-lg overflow-hidden ">
                  <img
                    src={plan.img}
                    className=" w-32 bg-red-600 object-cover"
                  />
                  <span className="p-2 h-full flex-grow ">
                    <h3 className="text-xl font-semibold text-primary dark:text-brand">
                      {plan.name}
                    </h3>
                    <h5 className="w-full text-sm font-medium text-brand4">
                      {plan.description}
                    </h5>
                  </span>
                  <button onClick={() => {}}>
                    <span className="flex items-center justify-center w-28 gap-2 p-4 h-full  bg-slate-300 dark:bg-slate-600">
                      <SolanaToken size={24}></SolanaToken>

                      <h3 className="text-xl font-semibold text-brand2">
                        {plan.price}
                      </h3>
                    </span>
                  </button>
                </div>
                <div className=" w-full gap-2 hidden group-hover:flex flex-col">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm mt-2">Price </span>
                    <label className="input-group w-full">
                      <input type="number" className="input w-full" />
                      <span className="bg-slate-300 dark:bg-slate-600">
                        <SolanaToken size={16}></SolanaToken>
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm">Perks </span>
                    <textarea className="textarea w-full" />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-brand gap-2 capitalize ">
              <DeviceFloppy /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsModal;
