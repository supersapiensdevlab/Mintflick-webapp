import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

const NewPassword = () => {
  // Form varibles
  const [form_password, setPassword] = useState('');
  const [form_confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordCheck, setconfirmPasswordCheck] = useState(false);

  const history = useHistory();
  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    if (form_password !== e.target.value) {
      setconfirmPasswordCheck(true);
    } else {
      setconfirmPasswordCheck(false);
    }
    setConfirmPassword(e.target.value);
  };

  const handleResetPassword = () => {
    const data = { password: form_password, token: token };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/new_password`,
      data: data,
    })
      .then((response) => {
        if (response.data) {
          alert('Password Updated Successfully');
          history.push('/signup');
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
                  Reset Password
                </div>

                <input type="text" hidden={true} />

                <input
                  className="self-center my-2 rounded w-full mx-5  lg:h-8 2xl:h-10   border-0   dark:bg-dbeats-dark-primary bg-gray-100 text-gray-900 lg:text-xs 2xl:text-lg dark:text-white focus:ring-dbeats-light"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => handlePasswordChange(e)}
                  required
                />
                <>
                  <input
                    className={`self-center mt-2 mb-1 rounded w-full mx-5 lg:h-8 2xl:h-10 lg:text-xs 2xl:text-lg
                        border-0  dark:bg-dbeats-dark-primary focus:outline-none
                        ${confirmPasswordCheck ? 'focus:ring-red-800' : 'focus:ring-dbeats-light'} 
                        bg-gray-100 text-gray-900 
                        dark:text-white 
                        
                        `}
                    type="password"
                    placeholder="Confirm Password"
                    onChange={(e) => handleConfirmPasswordChange(e)}
                    required
                  />
                  <p
                    className={`${
                      confirmPasswordCheck ? '2xl:text-sm lg:text-xs  text-red-500 mb-1' : 'hidden'
                    }`}
                  >
                    Confirm Password doesn&apos;t match Password
                  </p>
                </>
                <div className="flex justify-center">
                  <button
                    onClick={handleResetPassword}
                    className="flex justify-center w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                      dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                      hover:text-white hover:bg-dbeats-light border  
                      transition-all border-dbeats-light hover:scale-99 transform rounded relative"
                  >
                    Reset Password
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

export default NewPassword;
