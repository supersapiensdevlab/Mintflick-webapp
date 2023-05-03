import React from "react";

type Props = {
  children: React.ReactNode;
  kind:
    | "default"
    | "mint"
    | "info"
    | "error"
    | "luxury"
    | "warning"
    | "success";
  type: "outlined" | "filled";
};

export default function Pill(props: Props) {
  return (
    <div className="p-1 select-none">
      <div
        className={`flex items-center justify-start h-8 gap-1 p-1 ${
          props.type === "outlined"
            ? `border-[0.5px] ${
                props.kind === "default"
                  ? "border-vapormintWhite-100"
                  : props.kind === "mint"
                  ? "border-vapormintMint-300"
                  : props.kind === "info"
                  ? "border-vapormintBlue-300"
                  : props.kind === "error"
                  ? "border-vapormintError-500"
                  : props.kind === "luxury"
                  ? "border-vapormintLuxury-300"
                  : props.kind === "warning"
                  ? "border-vapormintWarning-500"
                  : props.kind === "success" && "border-vapormintSuccess-500"
              }`
            : props.kind === "default"
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
        } rounded-full w-fit ${
          props.type === "filled"
            ? `${
                props.kind === "default"
                  ? "text-vapormintBlack-300"
                  : "text-vapormintWhite-100"
              }`
            : props.kind === "default"
            ? "text-vapormintWhite-100"
            : props.kind === "mint"
            ? "text-vapormintMint-300"
            : props.kind === "info"
            ? "text-vapormintBlue-300"
            : props.kind === "error"
            ? "text-vapormintError-500"
            : props.kind === "luxury"
            ? "text-vapormintLuxury-300"
            : props.kind === "warning"
            ? "text-vapormintWarning-500"
            : props.kind === "success" && "text-vapormintSuccess-500"
        } `}
      >
        {props.children}
      </div>
    </div>
  );
}
