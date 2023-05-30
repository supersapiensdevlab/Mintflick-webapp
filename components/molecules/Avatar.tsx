"use client";
import React from "react";

export interface AvatarProps {
  src?: string;
  size: "xs" | "sm" | "md" | "lg";
  kind:
    | "default"
    | "mint"
    | "info"
    | "danger"
    | "luxury"
    | "warning"
    | "success";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function Avatar(props: AvatarProps) {
  return (
    <div onClick={props.onClick} className="p-1 cursor-pointer">
      {props.src ? (
        <img
          className={`border-[2px] ${
            props.kind === "default"
              ? "border-vapormintWhite-100"
              : props.kind === "mint"
              ? "border-vapormintMint-300"
              : props.kind === "info"
              ? "border-vapormintBlue-300"
              : props.kind === "danger"
              ? "border-vapormintError-500"
              : props.kind === "luxury"
              ? "border-vapormintLuxury-300"
              : props.kind === "warning"
              ? "border-vapormintWarning-500"
              : props.kind === "success" && "border-vapormintSuccess-500"
          } rounded-full`}
          src={
            props.src
              ? props.src
              : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
          }
          alt="userImage"
          width={
            props.size === "xs"
              ? 28
              : props.size === "sm"
              ? 36
              : props.size === "md"
              ? 44
              : props.size === "lg"
              ? 52
              : 28
          }
          height={
            props.size === "xs"
              ? 28
              : props.size === "sm"
              ? 36
              : props.size === "md"
              ? 44
              : props.size === "lg"
              ? 52
              : 28
          }
        />
      ) : (
        <div
          className={` rounded-full bg-vapormintBlack-200 animate-pulse  `}
          style={{
            width:
              props.size === "xs"
                ? "28px"
                : props.size === "sm"
                ? "36px"
                : props.size === "md"
                ? "44px"
                : props.size === "lg"
                ? "52px"
                : "28px",
            height:
              props.size === "xs"
                ? "28px"
                : props.size === "sm"
                ? "36px"
                : props.size === "md"
                ? "44px"
                : props.size === "lg"
                ? "52px"
                : "28px",
          }}
        />
      )}
    </div>
  );
}
