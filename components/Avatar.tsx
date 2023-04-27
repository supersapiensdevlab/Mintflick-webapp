import Image from "next/image";
import React from "react";

type Props = {
  src?: String;
  size?: "xs" | "sm" | "md" | "lg";
  kind?: "default" | "info" | "danger" | "luxury" | "warning" | "success";
};
Avatar.defaultProps = {
  size: "sm",
  kind: "default",
};

export default function Avatar(props: Props) {
  return (
    <div className="p-1">
      <Image
        className="border-[2px] border-slate-800 rounded-full"
        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
        alt="userImage"
        width={
          props.size === "xs"
            ? 24
            : props.size === "sm"
            ? 32
            : props.size === "md"
            ? 40
            : props.size === "lg"
            ? 48
            : 24
        }
        height={
          props.size === "xs"
            ? 24
            : props.size === "sm"
            ? 32
            : props.size === "md"
            ? 40
            : props.size === "lg"
            ? 48
            : 24
        }
      />
    </div>
  );
}
