"use client";
import { useViewportSize } from "@mantine/hooks";
import React from "react";

type Props = {
  children: React.ReactNode;
  className: string;
};

export default function FullscreenContainer({ children, className }: Props) {
  const { height, width } = useViewportSize();

  return (
    <div className={className} style={{ height: height, width: width }}>
      {children}
    </div>
  );
}
