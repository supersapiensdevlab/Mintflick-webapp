"use client";
import ToastContainer from "@/components/molecules/ToastContainer";
import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};
type ContextInt = {
  toasts: any[];
  showToast: (data: any) => void;
};
let contextObject: ContextInt = {
  toasts: [],
  showToast: (data: any) => {},
};
export const toastContext = createContext(contextObject);
export default function ToastContextContainer({ children }: Props) {
  const [toasts, settoasts] = useState<any[]>([]);
  const showToast = (data: any[]) => {
    // settoasts([...toasts, data]);
    settoasts(data);
  };

  return (
    <div>
      <toastContext.Provider value={{ toasts, showToast }}>
        {children}
        <ToastContainer />
      </toastContext.Provider>
    </div>
  );
}
