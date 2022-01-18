import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';
import axios from 'axios';

const ResetWallet = () => {
  const [form_wallet, setWallet] = useState('1');
  const [confirm_form_wallet, setConfirmWallet] = useState('2');

  const [confirmWalletCheck, setconfirmWalletCheck] = useState(false);

  const history = useHistory();
  const { token } = useParams();

  const handleWalletChange = (e) => {
    setWallet(e.target.value);
  };

  const handleConfirmWalletChange = (e) => {
    if (form_wallet !== e.target.value) {
      setconfirmWalletCheck(true);
    } else {
      setconfirmWalletCheck(false);
    }
    setConfirmWallet(e.target.value);
  };

  const handleResetWallet = () => {
    const data = { wallet: form_wallet, token: token };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/new_wallet`,
      data: data,
    })
      .then((response) => {
        if (response.data) {
          alert('Wallet Updated Successfully');
          history.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  return (
    <div className={`${darkMode && 'dark'} `}>
      <div className="bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary 2xl:pt-18 lg:pt-5 pt-5">
        <main className={` lg:w-1/2 w-11/12 self-center mx-auto mt-24 `}>
          <div
            className={`2xl:py-10 2xl:px-8 lg:px-3 lg:py-3 bg-white dark:bg-dbeats-dark-alt lg:w-1/2  w-11/12 mx-auto     self-center 2xl:py-5 lg:py-3`}
          >
            <div className="  w-full transition-all">
              <div className="flex flex-col justify-center   text-lg px-5 pt-2 lg:pt-0">
                <div className="self-center  2xl:text-2xl lg:text-lg text-xl font-bold text-gray-900 dark:text-white">
                  Reset Wallet
                </div>

                <input type="text" hidden={true} />

                <input
                  className="self-center my-2 rounded w-full mx-5  lg:h-8 2xl:h-10   border-0   dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 lg:text-xs 2xl:text-lg dark:text-white focus:ring-dbeats-light"
                  type="text"
                  placeholder="New Wallet Address"
                  onChange={(e) => handleWalletChange(e)}
                  required
                />
                <>
                  <input
                    className={`self-center mt-2 mb-1 rounded w-full mx-5 lg:h-8 2xl:h-10 lg:text-xs 2xl:text-lg
                          border-0  dark:bg-dbeats-dark-primary focus:outline-none
                          ${confirmWalletCheck ? 'focus:ring-red-800' : 'focus:ring-dbeats-light'} 
                          bg-gray-100 text-gray-900 
                          dark:text-white 
                          
                          `}
                    type="text"
                    placeholder="Confirm Wallet Address"
                    onChange={(e) => handleConfirmWalletChange(e)}
                    required
                  />
                  <p
                    className={`${
                      confirmWalletCheck ? '2xl:text-sm lg:text-xs  text-red-500 mb-1' : 'hidden'
                    }`}
                  >
                    Confirm Wallet doesn&apos;t match
                  </p>
                </>
                <div className="flex justify-center">
                  <button
                    onClick={handleResetWallet}
                    className={`flex justify-center w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                        dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                        ${
                          form_wallet !== confirm_form_wallet
                            ? ' '
                            : 'hover:text-white hover:bg-dbeats-light hover:scale-99 transform border-dbeats-light'
                        }
                         border transition-all   rounded relative`}
                    disabled={form_wallet !== confirm_form_wallet}
                  >
                    Reset Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResetWallet;
