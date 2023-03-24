import { itMatchesOne } from "daisyui/src/lib/postcss-prefixer/utils";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Store";
import Toast from "./Toast";

function ToastContainer() {
  const State = useContext(UserContext);

  return (
    <div className="fixed bottom-2 w-full h-fit z-[999] space-y-2 ">
      {State.database.toasts.map((item, index) => (
        <Toast key={index} msg={item.msg} type={item.type} />
      ))}
    </div>
  );
}

export default ToastContainer;
