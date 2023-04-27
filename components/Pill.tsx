import React from "react";

type Props = {
  children: React.ReactNode;
  kind?: "default" | "info" | "danger" | "luxury" | "warning" | "success";
  type?: "outlined" | "filled";
};

Pill.defaultProps = {
  kind: "default",
  type: "outlined",
};

export default function Pill({ children }: Props) {
  return (
    <div className="p-1 select-none">
      <div className="flex items-center justify-start h-8 gap-1 p-1 bg-orange-500 rounded-full w-fit">
        {children}
      </div>
    </div>
  );
}
