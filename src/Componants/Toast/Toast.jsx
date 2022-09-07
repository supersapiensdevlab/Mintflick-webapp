import React, { useContext, useEffect, useState } from "react";
import { AlertTriangle, CircleCheck, InfoCircle } from "tabler-icons-react";
import { UserContext } from "../../Store";

function Toast(props) {
  const State = useContext(UserContext);

  const [animation, setanimation] = useState(false);
  useEffect(() => {
    setanimation(true);

    return () => setanimation(false);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      State.deleteToast();
    }, 4000);
  }, []);
  return (
    <div
      onClick={() => State.deleteToast()}
      className={`flex items-center gap-2 p-4 w-full max-w-xl  rounded-lg mx-auto transform-gpu shadow-md transition ease-in-out delay-100 ${
        animation ? "translate-y-0" : "translate-y-24"
      } ${props.type === "success" && "bg-success text-success-content"}
      ${props.type === "info" && "bg-info text-info-content"} ${
        props.type === "error" && "bg-error text-error-content"
      }`}
    >
      {props.type === "success" && <CircleCheck />}
      {props.type === "error" && <AlertTriangle />}
      {props.type === "info" && <InfoCircle />}
      <p className="text-lg font-semibold">{props.msg}</p>
    </div>
  );
}

export default Toast;
