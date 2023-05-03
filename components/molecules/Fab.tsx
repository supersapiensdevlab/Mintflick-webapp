import React from "react";

type Props = {
  text: String;
  size: "xsmall" | "small" | "base";
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  showText: Boolean;
  kind:
    | "default"
    | "mint"
    | "info"
    | "danger"
    | "luxury"
    | "warning"
    | "success";
};

function Fab(props: Props) {
  return (
    <div
      onClick={props.onClick}
      className={`flex items-center w-fit gap-2  cursor-pointer select-none  rounded-l-full ${
        props.size === "xsmall" ? "p-2" : props.size === "small" ? "p-3" : "p-5"
      }  ${
        props.kind === "default"
          ? "bg-vapormintWhite-100 text-vapormintBlack-300"
          : props.kind === "mint"
          ? "bg-vapormintMint-300 text-vapormintBlack-300"
          : props.kind === "info"
          ? "bg-vapormintBlue-300 text-vapormintWhite-100"
          : props.kind === "danger"
          ? "bg-vapormintError-500 text-vapormintWhite-100"
          : props.kind === "luxury"
          ? "bg-vapormintLuxury-300 text-vapormintWhite-100"
          : props.kind === "warning"
          ? "bg-vapormintWarning-500 text-vapormintWhite-100"
          : props.kind === "success" &&
            "bg-vapormintSuccess-500 text-vapormintWhite-100"
      }   transition-all ease-in-out  `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      {props.showText && (
        <span className={`mr-1 text-lg font-semibold`}>{props.text}</span>
      )}
    </div>
  );
}

export default Fab;
