import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as Verified } from '../../assets/icons/verified-mark.svg';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const history = useHistory();
  const { token } = useParams();

  useEffect(() => {
    const data = { token: token };

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/verify_email`,
      data: data,
    })
      .then((response) => {
        console.log(response.data);
        if (response.data === 'success') {
          history.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className={`${darkMode && 'dark'} `}>
      <div className="bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary 2xl:pt-18 lg:pt-5 pt-5">
        <main className={` lg:w-1/2 w-11/12  mx-auto mt-24 `}>
          <div className="w-full transition-all">
            <div className="flex justify-center items-center 2xl:text-3xl lg:text-2xl text-xl font-bold text-gray-900 dark:text-white">
              Your Email is Now Verified
              <div className="mx-4">
                <Verified height={40} width={40} style={{ fill: '#01A601' }} />
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  history.push('/');
                }}
                className="text-center mx-3  my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                hover:text-white hover:bg-dbeats-light border  
                transition-all border-dbeats-light hover:scale-99 transform rounded relative"
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyEmail;
