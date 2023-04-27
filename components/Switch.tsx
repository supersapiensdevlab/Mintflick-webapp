import React from "react";

type Props = {
  on: Boolean;
  onChange: Function;
  disabled?: Boolean;
  kind?: "default" | "info" | "danger" | "luxury" | "warning" | "success";
};
Switch.defaultProps = {
  kind: "default",
};

export default function Switch(props: Props) {
  return (
    <div
      onClick={() => (props.disabled ? "" : props.onChange())}
      className="p-1 cursor-pointer ">
      <div
        className={`h-fit  w-11 ${
          props.disabled ? "border-slate-700" : "border-white"
        } border-[1px] p-[3px] rounded-lg flex items-center  justify-start `}>
        <div
          className={`h-4 w-4  rounded-[4px] transition-all ease-in-out ${
            props.on ? "translate-x-5 bg-white" : "bg-slate-700"
          }`}></div>
      </div>
    </div>
  );
}
