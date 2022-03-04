import axios from 'axios';
//import Ticket from '../Profile/ProfileSections/Ticket/Ticket';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import useWeb3Modal from '../../hooks/useWeb3Modal';
import ForgotPasswordForm from './component/ForgotPasswordForm';
import LoginForm from './component/LoginForm';
import SignupForm from './component/SignupForm';

const Moralis = require('moralis');

const Login = () => {
  // Web3
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  Moralis.initialize('RrKpMiHThO0v1tXiKcxJuBacU35i7UidwNwQq0as');
  Moralis.serverURL = 'https://58zywcsvxppw.usemoralis.com:2053/server';

  // Form varibles
  const [login, setLogin] = useState(true);
  const [loader, setLoader] = useState(true);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);

  // Metamask Auth
  function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
      <div>
        <button
          className={`font-bold flex self-center text-center
          ${!provider ? 'cursor-pointer' : 'cursor-default'} `}
          onClick={async () => {
            if (!provider) {
              loadWeb3Modal();
            } else {
              logoutOfWeb3Modal();
            }
          }}
          disabled={provider ? true : false}
        >
          <p className="mt-2">
            {' '}
            {!provider
              ? 'Connect MetaMask '
              : `Connected (${
                  provider.provider.selectedAddress.slice(0, 4) +
                  '...' +
                  provider.provider.selectedAddress.slice(-4)
                })`}
          </p>
          <img
            className="2xl:w-12 2xl:h-12 lg:w-9 lg:h-9 h-9 w-9 rounded-full self-center"
            alt="metamask button"
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
          ></img>
        </button>
      </div>
    );
  }

  // eslint-disable-next-line no-unused-vars
  function LoginWalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
      <div>
        <Button
          className="font-bold flex lg:text-sm 2xl:text-lg self-center text-center"
          type="button"
          onClick={async () => {
            let variable = await loadWeb3Modal();
            if (provider && variable) {
              await axios
                .get(
                  `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet/${provider.provider.selectedAddress}`,
                )
                .then((value) => {
                  window.localStorage.setItem('user', JSON.stringify(value.data.user));
                  window.localStorage.setItem('authtoken', value.data.jwtToken);
                  window.location.href = '/';
                });
            }
          }}
        >
          <p className="mt-2">{!provider ? 'Login using ' : `MetaMask Connected (Click Again)`}</p>
          <img
            className="2xl:w-12 2xl:h-12 lg:w-9 lg:h-9 h-9 w-9 rounded-full self-center"
            alt="metamask login"
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
          ></img>
        </Button>
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
              className={`2xl:py-10 2xl:px-8 lg:px-3 lg:py-3 bg-white dark:bg-dbeats-dark-alt lg:w-1/2  w-11/12 mx-auto     self-center 2xl:py-5 lg:py-3`}
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
