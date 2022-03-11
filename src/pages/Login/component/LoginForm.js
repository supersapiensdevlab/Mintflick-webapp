import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const LoginForm = ({
  loader,
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setLoader,
  setForgotPassword,
  LoginWalletButton,
}) => {
  //data
  const [form_username, setUsername] = useState('');
  const [form_password, setPassword] = useState('');
  //checks
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setInvalidUsername(false);
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setInvalidPassword(false);
    setPassword(e.target.value);
  };
  //This function handles User Login
  const handleLogin = () => {
    setLoader(false);
    const userData = {
      username: form_username,
      password: form_password,
    };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/login`,
      data: userData,
    })
      .then((response) => {
        if (response.data == 'invalidpassword') {
          setInvalidPassword(true);
        } else if (response.data) {
          console.log('RESPONSE DATA:', response.data);
          Cookies.set('jwtToken', response.data.jwtToken, { expires: 7 });
          window.localStorage.setItem('user', JSON.stringify(response.data.user));
          window.localStorage.setItem('authtoken', JSON.stringify(response.data.jwtToken));
          //window.location.reload();
          window.location.href = '/';
        } else {
          setInvalidUsername(true);
        }
      })
      .catch(function () {
        setInvalidUsername(true);
      });
    setLoader(true);
  };

  return (
    <div className="  w-full  ">
      <div className="flex flex-col justify-center   2xl:text-lg lg:texr-md  pt-2 lg:pt-0 p-5  ">
        <h1 className="self-center  2xl:text-2xl lg:text-md text-xl font-bold text-gray-900 dark:text-white">
          SIGN IN
        </h1>
        <>
          <div className="flex justify-center 2xl:mt-6 lg:mt-5  cursor-pointer  transform transition-all mb-3 lg:mb-0">
            <div className="">
              <LoginWalletButton
                provider={provider}
                loadWeb3Modal={loadWeb3Modal}
                logoutOfWeb3Modal={logoutOfWeb3Modal}
              />
            </div>
          </div>
          <hr className="2xl:my-3 lg:my-2 w-2/3 self-center mb-4 lg:mb-0 hidden" />
          <h3 className="self-center cursor-pointer 2xl:py-2 lg:py-0 mb-2 lg:mb-0 2xl:text-lg lg:text-xs text-gray-900 dark:text-white">
            OR
          </h3>
          <input
            className={`self-center mt-2 mb-1 rounded w-full mx-5 lg:h-8 2xl:h-10 lg:text-xs 2xl:text-lg
                        border-0  dark:bg-dbeats-dark-primary
                        ${invalidUsername ? 'border-2 border-red-500 focus:ring-red-800' : ''} 
                        bg-gray-100 text-gray-900 
                        dark:text-white 
                        focus:ring-dbeats-light
                        `}
            type="text"
            placeholder="Username"
            onChange={(e) => handleUsernameChange(e)}
          />
          <p
            className={`${
              invalidUsername ? '2xl:text-sm lg:text-xs  text-red-500 mb-1' : 'hidden'
            }`}
          >
            Please Enter Valid Username
          </p>
        </>
        <>
          <input
            className={`self-center mt-2 mb-1 rounded w-full mx-5 lg:h-8 2xl:h-10 lg:text-xs 2xl:text-lg
                      border-0 dark:bg-dbeats-dark-primary 
                      ${invalidPassword ? 'border-2 border-red-500 focus:ring-red-800' : ''} 
                      bg-gray-100 text-gray-900 
                      dark:text-white 
                      focus:ring-dbeats-light`}
            type="password"
            placeholder="Password"
            onChange={(e) => handlePasswordChange(e)}
          />
          <p
            className={`${invalidPassword ? '2xl:text-sm lg:text-xs text-red-500 mb-1' : 'hidden'}`}
          >
            Please Enter Valid Password
          </p>
        </>

        <div className="flex justify-center ">
          <button
            onClick={handleLogin}
            className={`flex justify-center w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                        dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                        ${
                          form_username === '' || form_password === ''
                            ? ''
                            : 'hover:text-white hover:bg-dbeats-light border border-dbeats-light hover:scale-99 transform'
                        }              
                         
                        transition-all  rounded relative`}
            disabled={form_username === '' || form_password === ''}
          >
            SIGN IN
            <div
              hidden={loader}
              className="w-6 h-6 absolute right-10 align-center border-t-4 border-b-4 border-white rounded-full animate-spin"
            ></div>
          </button>
        </div>
        <div
          className="self-center cursor-pointer 2xl:py-2 lg:py-0 mb-2 lg:mb-0 2xl:text-lg lg:text-xs text-gray-900 dark:text-white"
          onClick={() => {
            setForgotPassword(true);
          }}
        >
          Forgot your password ?
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
