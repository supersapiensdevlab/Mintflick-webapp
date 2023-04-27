import React from "react";

type Props = {
  message: String;
  kind?: "default" | "info" | "error" | "luxury" | "warning" | "success";
  icon?: React.ReactNode;
};

Notification.defaultProps = {
  kind: "default",
};

export default function Notification(props: Props) {
  return (
    <div className="w-full p-1">
      <div className="flex flex-col gap-0 overflow-hidden bg-red-600 rounded-lg">
        <div className="flex items-start gap-3 px-4 py-3 ">
          {props.icon}
          <div className="flex flex-col flex-grow gap-1">
            <span className="w-full text-lg font-bold tracking-wide text-white">
              {props.message}
            </span>
            <span className="w-full text-sm font-medium tracking-wide text-slate-400">
              {props.message}
            </span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-black">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>{" "}
        <span
          style={{ height: `1px` }}
          className={`  w-full  bg-gradient-to-r  from-white to-black`}
        />
      </div>
    </div>
  );
}
