import React from "react";
import { Comet, DeviceFloppy, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import SolanaToken from "../../../Assets/logos/SolanaToken";

function ManageSuperfanModal(props) {
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
              <Comet className="-rotate-90" />
              Manage Supefans
            </h3>
            <X
              onClick={() => props.setOpen(false)}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
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
                <img src={plan.img} className=" w-32 bg-red-600 object-cover" />
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
      </div>
    </div>
  );
}

export default ManageSuperfanModal;
