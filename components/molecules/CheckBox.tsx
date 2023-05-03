import React from "react";

type Props = {
  checked: Boolean;
  onChange: Function;
  text?: String;
};

export default function CheckBox(props: Props) {
  return (
    <div
      onClick={() => props.onChange()}
      className="flex items-center gap-2 p-1 cursor-pointer select-none"
    >
      <div
        className={`w-6 h-6  ${
          props.checked
            ? "bg-vapormintSuccess-500"
            : "border-white border-[2px]"
        }  rounded-lg flex items-center justify-center`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="4"
          stroke="currentColor"
          className={`w-4 h-4 ${
            props.checked ? "scale-100" : "scale-0"
          } transition-all ease-in-out  origin-center`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      {props.text && (
        <span className="text-sm font-semibold tracking-wide">
          {props.text}
        </span>
      )}
    </div>
  );
}
