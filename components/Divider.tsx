import React from "react";

type Props = {
  kind: "center" | "left-right" | "right-left" | "solid";
  size: Number;
};
Divider.defaultProps = {
  kind: "left-right",
  size: 1,
};
export default function Divider(props: Props) {
  return (
    <span
      style={{ height: `${props.size}px` }}
      className={`my-1  w-full ${
        props.kind === "center" &&
        "bg-gradient-to-r from-black via-white to-black"
      }
      ${props.kind === "left-right" && "bg-gradient-to-r from-white to-black"}
     ${props.kind === "right-left" && "bg-gradient-to-l from-white to-black"} ${
        props.kind === "solid" && "bg-slate-800"
      }`}
    />
  );
}
