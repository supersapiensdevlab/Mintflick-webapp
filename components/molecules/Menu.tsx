"use client";
import { useIdle } from "@mantine/hooks";
import { ReactNode, useEffect, useState } from "react";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

export default function Menu({ title, children }: Props) {
  const [open, setOpen] = useState(false);
  const idle = useIdle(4000, {
    initialState: false,
    events: ["click", "touchstart"],
  });

  useEffect(() => {
    idle && setOpen(false);
  }, [idle]);

  return (
    <div className="relative">
      <div onClick={() => setOpen((prev) => !prev)}>{title}</div>
      <div
        className={`absolute -bottom-1 right-1  translate-y-full   ${
          open ? "scale-100" : "scale-0"
        } origin-top-right transition-transform ease-in-out duration-100`}
      >
        {children}
      </div>
    </div>
  );
}
