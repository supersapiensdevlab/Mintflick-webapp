import React, { useState, useRef } from 'react';
import axios from 'axios';
import Web3 from 'web3';

const SignupForm = ({
  loader,
  provider,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setLoader,
  WalletButton,
}) => {
  //data
  const [form_name, setName] = useState('');
  const [form_username, setUsername] = useState('');
  const [form_password, setPassword] = useState('');
  const [form_email, setEmail] = useState('');

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [existingValue, setExistingValue] = useState(null);

  const [showPassword, setShowPassword] = useState(true);
  const seePass = useRef();
  const bcrypt = require('bcryptjs');
  const [account, setAccount] = useState();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setExistingValue(null);
    if (EmailValidation(e.target.value)) {
      setInvalidEmail(false);
      setEmail(e.target.value);
    } else {
      setInvalidEmail(true);
    }
  };

  function EmailValidation(enteredEmail) {
    return enteredEmail.match(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|co|in|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/,
    );
  }

  const handleSeePassword = () => {
    if (showPassword) {
      seePass.current.type = 'text';
    } else {
      seePass.current.type = 'password';
    }
    setShowPassword(!showPassword);
  };

  // Create a Stream Profile
  const createStream = async () => {
    setLoader(false);

    let walletId = '';
    if (provider) {
      let variable = await loadWeb3Modal();

      const web3 = new Web3(variable);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      walletId = account;
    }

    let password = await bcrypt.hash(form_password, 10);

    const userData = {
      name: form_name,
      username: form_username,
      email: form_email,
      password: password,
      wallet_id: walletId,
    };

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/add`,
      data: userData,
    })
      .then(function (response) {
        if (response.data === 'Email' || response.data === 'Username') {
          setExistingValue(response.data);
        } else {
          window.localStorage.setItem('user', JSON.stringify(response.data.user));
          window.localStorage.setItem('authtoken', JSON.stringify(response.data.jwtToken));
          window.location.href = '/';
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    setLoader(true);
  };

  return (
    <div className="  w-full transition-all">
      <div className="flex flex-col justify-center   text-lg px-5 pt-2 lg:pt-0">
        <div className="self-center  2xl:text-2xl lg:text-lg text-xl font-bold text-gray-900 dark:text-white">
          SIGN UP
        </div>

        <input
          className="self-center my-2 rounded w-full mx-5  lg:h-8 2xl:h-10   border-0   dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 lg:text-xs 2xl:text-lg  dark:text-white focus:ring-dbeats-light"
          type="text"
          placeholder="Name"
          onChange={(e) => handleNameChange(e)}
          required
        />
        <>
          <input
            className={`self-center my-2 rounded w-full mx-5  lg:h-8 2xl:h-10   border-0   
          dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 
          lg:text-xs 2xl:text-lg dark:text-white focus:ring-dbeats-light
          ${invalidEmail ? 'border-2 border-red-500 focus:ring-red-800' : ''} `}
            type="email"
            placeholder="Email"
            onChange={(e) => handleEmailChange(e)}
            required
          />
          <p className={`${invalidEmail ? '2xl:text-sm lg:text-xs  text-red-500 mb-1' : 'hidden'}`}>
            Please Enter Valid Email
          </p>
          {existingValue === 'Email' ? (
            <p
              className={`${
                existingValue ? '2xl:text-sm lg:text-xs  text-red-500 ml-1 -mt-1' : 'hidden'
              }`}
            >
              Email already exists
            </p>
          ) : null}
        </>
        <>
          <input
            className="self-center my-2 rounded w-full mx-5  lg:h-8 2xl:h-10   border-0   dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 lg:text-xs 2xl:text-lg dark:text-white focus:ring-dbeats-light"
            type="text"
            placeholder="Username"
            onChange={(e) => handleUsernameChange(e)}
            required
          />
          {existingValue === 'Username' ? (
            <p
              className={`${
                existingValue ? '2xl:text-sm lg:text-xs  text-red-500 ml-1 -mt-1' : 'hidden'
              }`}
            >
              Username already exists
            </p>
          ) : null}
        </>
        <div className="flex items-center w-full">
          <div className="w-full">
            <input
              className="self-center my-2 rounded w-full   lg:h-8 2xl:h-10   border-0   dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 lg:text-xs 2xl:text-lg dark:text-white focus:ring-dbeats-light"
              type="password"
              ref={seePass}
              placeholder="Password"
              onChange={(e) => handlePasswordChange(e)}
              required
            />
          </div>

          <div onClick={handleSeePassword} className="flex items-center">
            <div className="cursor-pointer absolute -ml-8 self-center dark:text-white">
              {showPassword ? <i className="far fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </div>
          </div>
        </div>

        <div
          className={`flex justify-center 2xl:mt-6 lg:mt-3 mt-3 mb-2   
            ${
              !provider
                ? `transform transition-all 
                      `
                : ''
            }  
            mx-3 py-1 2xl:text-lg lg:text-sm`}
        >
          <div className=" ">
            <WalletButton
              provider={provider}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className={`${
              (!provider && account) ||
              form_name === '' ||
              form_username === '' ||
              form_password === '' ||
              invalidEmail
                ? 'flex justify-center  w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-center text-dbeats-light dark:text-white font-bold bg-dbeats-light bg-opacity-5 rounded relative cursor-default'
                : 'flex justify-center  w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-center text-dbeats-light dark:text-white font-bold bg-dbeats-light bg-opacity-5 hover:text-white hover:bg-dbeats-light border transition-all border-dbeats-light hover:scale-99 transform rounded relative'
            }`}
            onClick={createStream}
            disabled={
              (!provider && account) ||
              form_name === '' ||
              form_username === '' ||
              form_password === '' ||
              invalidEmail
            }
          >
            SIGN UP
            <div
              hidden={loader}
              className="w-6 h-6 ml-3 mt-0.5 align-center border-t-4 border-b-4 border-white rounded-full animate-spin"
            ></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
