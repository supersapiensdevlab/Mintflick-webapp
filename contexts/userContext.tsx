'use client';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type StateProps = {
  userData: any;
  updateUserData: Function;
};
export const UserContext = createContext<StateProps>({
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

  async function isUserAvaliable(email: string) {
    console.log('Checking for User with email:', email);
    await axios({
      method: 'post',
      url: `/api/user/getuser_by_email`,
      data: {
        email: email,
      },
    })
      .then((response) => {
        console.log('user data', response);
        updateUserData(response.data.data.user);
        console.log('user data saved in state');
        localStorage.setItem('authtoken', response.data.data.jwtToken);
        console.log('auth token saved in storage');
        localStorage.setItem('email', email);
        console.log('email address saved in storage');
      })
      .catch(async function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    const email = localStorage.getItem('email');
    console.log(email);
    email && isUserAvaliable(email);
  }, []);

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}
