import React from "react";

type Props = {
  kind: "center" | "left-right" | "right-left" | "solid";
  size: Number;
};

export default function Divider(props: Props) {
  return (
    <span
      style={{ height: `${props.size}px` }}
      className={`my-1  w-full ${
        props.kind === "center" &&
        "bg-gradient-to-r from-vapormintBlack-300 via-vapormintWhite-100 to-vapofrom-vapormintBlack-300"
      }
      ${
        props.kind === "left-right" &&
        "bg-gradient-to-r from-vapormintWhite-100 to-vapormintBlack-300"
      }
     ${
       props.kind === "right-left" &&
       "bg-gradient-to-l from-vapormintWhite-100 to-vapormintBlack-300"
     } ${props.kind === "solid" && "bg-vapormintBlack-200"}`}
    />
  );
}
