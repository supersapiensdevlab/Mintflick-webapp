import React from "react";

type Props = {
  message: String;
  onCancel: Function;
  kind?:
    | "default"
    | "mint"
    | "info"
    | "error"
    | "luxury"
    | "warning"
    | "success";
};

export default function Toast(props: Props) {
  return (
    <div className="w-full p-1 select-none">
      <div
        className={`flex flex-col gap-0 overflow-hidden  rounded-lg ${
          props.kind === "default"
            ? "bg-vapormintWhite-100"
            : props.kind === "mint"
            ? "bg-vapormintMint-300"
            : props.kind === "info"
            ? "bg-vapormintBlue-300"
            : props.kind === "error"
            ? "bg-vapormintError-500"
            : props.kind === "luxury"
            ? "bg-vapormintLuxury-300"
            : props.kind === "warning"
            ? "bg-vapormintWarning-500"
            : props.kind === "success" && "bg-vapormintSuccess-500"
        }`}
      >
        <div className="flex items-center px-4 py-3 ">
          <span
            className={`flex-grow text-lg font-semibold tracking-wide  ${
              props.kind === "default"
                ? "text-vapormintBlack-300"
                : "text-vapormintWhite-100"
            }`}
          >
            {props.message}
          </span>
          <svg
            onClick={() => props.onCancel()}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`w-6 h-6 cursor-pointer ${
              props.kind === "default"
                ? "text-vapormintBlack-300"
                : "text-vapormintWhite-100"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>{" "}
        <span
          style={{ height: `1px` }}
          className={`  w-full  bg-gradient-to-r  from-vapormintWhite-100 to-vapormintBlack-300`}
        />
      </div>
    </div>
  );
}
