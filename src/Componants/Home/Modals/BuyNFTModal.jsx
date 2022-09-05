import React, { useContext } from "react";
import { At, Eye, InfoCircle, ShoppingCart, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { UserContext } from "../../../Store";

function BuyNFTModal() {
  const State = useContext(UserContext);
  return (
    <div
      className={`${
        State.database.buyNFTModalOpen && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <ShoppingCart />
              Buy NFT
            </h3>
            <X
              onClick={() => State.updateDatabase({ buyNFTModalOpen: false })}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="w-full h-32 flex bg-white dark:bg-slate-700 rounded-lg overflow-clip">
            <img
              src="https://lh3.googleusercontent.com/yCbypC0JI61YbUFf_5ULkHJonhKZpLt63wY4ZAP5DZLYuMfcwr28zdq5TDSyhtl0Ifg2mNrtrJ3tbBOW_XKEWNctFdx1LEaLTaDExg=w600"
              alt="NFT image"
              className="h-full"
            />
            <div className="p-3 flex-grow space-y-1 ">
              <div className="text-lg text-brand1 font-bold">Diamond Pass</div>
              <div className="flex items-center gap-1 text-brand3">
                <p className="font-medium text-sm ">Owned by</p>
                <At size={16}></At>
                <p className="cursor-pointer font-semibold text-sm text-primary">
                  Maverick
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                <Eye size={16} />
                12M
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-brand4">
                Creater fees <InfoCircle className="cursor-pointer" size={16} />
              </span>
              {/* <div className="h-[2px] rounded-full bg-slate-200 dark:bg-slate-600"></div> */}
            </div>
            <div className="flex flex-col p-4 items-end justify-center text-brand1">
              <p className="flex items-center gap-2 cursor-pointer font-semibold text-3xl text-primary dark:text-brand">
                <PolygonToken size={16}></PolygonToken> 12
              </p>
              <span className="text-sm font-normal text-brand4">($1234)</span>
            </div>
          </div>
          <input
            type="date"
            id="birthday"
            name="birthday"
            className="input"
          ></input>
        </div>
      </div>
    </div>
  );
}

export default BuyNFTModal;
