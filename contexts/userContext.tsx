"use client";
import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};
export const UserContext = createContext({
  userData: {},
  updateUserData: (data: any) => {},
});
export default function UserContextContainer({ children }: Props) {
  const [userData, setUserData] = useState({});
  const updateUserData = (data: any) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}
