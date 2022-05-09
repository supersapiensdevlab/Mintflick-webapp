import axios from 'axios';
//import Ticket from '../Profile/ProfileSections/Ticket/Ticket';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useWeb3Modal from '../../hooks/useWeb3Modal';
import ForgotPasswordForm from './component/ForgotPasswordForm';
import LoginForm from './component/LoginForm';
import SignupForm from './component/SignupForm';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';
import Torus from '@toruslabs/torus-embed';
import { useDispatch } from 'react-redux';

import Web3 from 'web3';
import { Web3Auth } from '@web3auth/web3auth';
import { clearProvider } from '../../actions/web3Actions';
const Moralis = require('moralis');

const Login = () => {
  // Web3
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  Moralis.initialize('RrKpMiHThO0v1tXiKcxJuBacU35i7UidwNwQq0as');
  Moralis.serverURL = 'https://58zywcsvxppw.usemoralis.com:2053/server';
  const provider = useSelector((state) => state.web3Reducer.provider);

  // Form varibles
  const [login, setLogin] = useState(true);
  const [loader, setLoader] = useState(true);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [account, setAccount] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const web3 = new Web3(provider);
      const address = (await web3.eth.getAccounts())[0];
      const balance = await web3.eth.getBalance(address);
      return address;
    }
    if (provider && !account) {
      fetchData().then((address) => {
        setAccount(address);
      });
    }
  }, [provider, account]);

  useEffect(() => {
    setAccount(null);

    console.log('logged out');
  }, [logoutOfWeb3Modal]);
  // Metamask Auth
  function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
      <div className="nm-flat-dbeats-dark-secondary p-1 rounded-3xl hover:nm-inset-dbeats-dark-secondary   transform-gpu  transition-all duration-300 ease-in-out ">
        <button
          className={` relative px-5 py-2.5 whitespace-nowrap text-xs sm:text-sm text-white  bg-gradient-to-br from-yellow-500 to-yellow-600  hover:nm-inset-yellow-500 rounded-3xl  `}
          onClick={async () => {
            if (!provider && !account) {
              await loadWeb3Modal();
            } else if (provider && !account) {
              const web3 = new Web3(provider);
              const address = (await web3.eth.getAccounts())[0];
              const balance = await web3.eth.getBalance(address);

              setAccount(address);
            } else {
              await logoutOfWeb3Modal();
              dispatch(clearProvider());
              console.log('logged out WORKS!!!');
              setAccount(null);
            }
          }}
        >
          <p className=" ">
            {' '}
            {!account
              ? 'Sign up using Wallet '
              : `Connected  (${
                  account ? account.slice(0, 8) : '' + '...' + account ? account.slice(-4) : ''
                })`}
          </p>
        </button>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  function LoginWalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
      <div>
        <div
          className="    transform-gpu  transition-all duration-300 ease-in-out mt-3 cursor-pointer
         relative inline-flex items-center justify-center p-1 mb-2 mr-2 overflow-hidden text-sm font-medium 
         text-gray-900 rounded-3xl  bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-secondary   hover:text-white dark:text-white  "
        >
          <Button
            className="relative px-5 py-2.5 whitespace-nowrap text-xs sm:text-sm  bg-gradient-to-br from-yellow-500 to-yellow-600 hover:nm-inset-yellow-500 rounded-3xl"
            type="button"
            onClick={async () => {
              if (!provider) {
                await loadWeb3Modal();
              }
              if (provider && account !== '') {
                console.log('ADDRESS', account);
                await axios
                  .get(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet/${account}`)
                  .then((value) => {
                    console.log('VALUE', value.data);
                    window.localStorage.setItem('user', JSON.stringify(value.data.user));
                    window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
                    window.location.href = '/';
                  });
              }
            }}
          >
            <p className=" ">
              {!account
                ? 'Sign in using Wallet'
                : `(${
                    account ? account.slice(0, 8) : '' + '...' + account ? account.slice(-4) : ''
                  })  Connected (Click Again)`}
            </p>
          </Button>
        </div>
      </div>
    );
  }

  const handleResetPasswordEmail = (e) => {
    setResetPasswordEmail(e.target.value);
  };

  const handleSignIn = () => {
    setLogin(false);
    setForgotPassword(false);
  };

  const handleSignUp = () => {
    setLogin(true);
    setForgotPassword(false);
  };

  const handleResetPassword = () => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/reset_password`,
      data: { email: resetPasswordEmail },
    })
      .then((response) => {
        if (response.data) {
          alert('Password Reset Mail Send !!! ');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  return (
    <>
      <div className={`${darkMode && 'dark'} `}>
        <div className="bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary 2xl:pt-18 lg:pt-5 pt-5">
          <main className={` lg:w-1/2 w-11/12 self-center mx-auto mt-24 `}>
            <div
              className={`  2xl:px-8 lg:px-3 lg:py-3 bg-white dark:bg-dbeats-dark-alt lg:w-1/2  w-11/12 mx-auto     self-center 2xl:py-5  `}
            >
              {login && !forgotPassword ? (
                <SignupForm
                  loader={loader}
                  provider={provider}
                  loadWeb3Modal={loadWeb3Modal}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  setLoader={setLoader}
                  WalletButton={WalletButton}
                />
              ) : null}
              {!login && !forgotPassword ? (
                <LoginForm
                  loader={loader}
                  provider={provider}
                  loadWeb3Modal={loadWeb3Modal}
                  logoutOfWeb3Modal={logoutOfWeb3Modal}
                  setLoader={setLoader}
                  setForgotPassword={setForgotPassword}
                  LoginWalletButton={LoginWalletButton}
                />
              ) : null}
              {forgotPassword ? (
                <ForgotPasswordForm
                  loader={loader}
                  handleResetPasswordEmail={handleResetPasswordEmail}
                  handleResetPassword={handleResetPassword}
                  handleSignIn={handleSignIn}
                />
              ) : null}
            </div>
            <div className="text-center 2xl:p-5 lg:p-2 text-gray-900 dark:text-white">
              {login ? (
                <div>
                  <button
                    className="rounded text-dbeats-light mt-2 lg:mt-0 lg:text-xs 2xl:text-lg dark:text-gray-100 font-semibold"
                    id="signIn"
                    onClick={handleSignIn}
                  >
                    Already have an Account?
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="rounded text-dbeats-light mt-2 lg:mt-0 lg:text-xs 2xl:text-lg dark:text-gray-100  font-semibold"
                    id="signUp"
                    onClick={handleSignUp}
                  >
                    Create New Account
                  </button>
                </div>
              )}
            </div>
            {/* <div className="self-center text-center 2xl:mt-0 lg:mt-0 2xl:text-lg lg:text-sm dark:text-gray-500 font-semibold opacity-50">
              powered by{' '}
              <img
                src={moralisLogo}
                alt="moralisLogo"
                className="2xl:h-10 lg:h-8 h-9 rounded w-max  self-center mx-auto bg-blue-50 dark:bg-white p-2 dark:bg-opacity-75"
              ></img>
            </div> */}
          </main>
        </div>
      </div>
    </>
  );
};

export default Login;
