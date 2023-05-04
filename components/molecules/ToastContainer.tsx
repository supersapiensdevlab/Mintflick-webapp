import React, { useContext } from "react";
import Toast from "./Toast";
import { toastContext } from "@/contexts/toastContext";

function ToastContainer() {
  const state = useContext(toastContext);
  return state.toasts.length !== 0 ? (
    <div className="fixed top-16 w-full h-fit z-[800] space-y-2 ">
      {state.toasts?.map((item, index) => (
        <Toast
          key={index}
          message={item?.message}
          kind={item?.kind}
          onCancel={() => state.showToast([])}
        />
      ))}
    </div>
  ) : (
    <></>
  );
}

export default ToastContainer;
