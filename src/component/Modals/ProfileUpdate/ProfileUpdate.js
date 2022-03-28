import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import {loadUser} from '../../../actions/userActions';
const ProfileUpdateModal = ({ show, handleClose, userData, darkMode, setDisplayName }) => {
  const [buttonText, setButtonText] = useState('Click Here');
  const [loader, setLoader] = useState(false);
  const [existingValue, setExistingValue] = useState(null);
  const dispatch = useDispatch();
  const [newData, setNewData] = useState({
    name: userData.name,
    email: userData.email,
  });

  const handleUserInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'email') {
      setExistingValue(null);
    }
    setNewData({ ...newData, [name]: value });
  };

  const handleWalletReset = () => {
    setButtonText('Reset Mail send');
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/send_wallet_reset`,
      data: { email: userData.email },
    })
      .then((response) => {
        if (response.data) {
          alert('Wallet Reset Mail Send !!! ');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const UpdateData = () => {
    setLoader(true);
    let data = {
      username: userData.username,
      name: newData.name,
      email: newData.email,
    };
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/update`,
      data: data,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then((res) => {
        if (res.data === 'Invalid') {
          setExistingValue(res.data);
        } else {
          dispatch(loadUser());
          if (userData.name !== newData.name) {
            setDisplayName(newData.name);
          }
          handleClose();
        }
        setLoader(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Modal
      isOpen={show}
      className={
        darkMode
          ? 'h-max lg:w-1/3 w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-alt rounded-xl'
          : 'h-max lg:w-1/3 w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
      }
    >
      <div className={`${darkMode && 'dark'} p-2 h-max`}>
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg 2xl:py-4 py-4 lg:py-3 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 ">Update Profile</div>
          <div
            onClick={handleClose}
            className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
          >
            <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
              <p className="self-center mx-2">
                {' '}
                <i className="fas fa-times"></i>{' '}
              </p>
            </span>
          </div>
        </h2>
        <hr />
        <div className=" bg-white text-gray-500  dark:bg-dbeats-dark-alt dark:text-gray-100   shadow-sm rounded-lg  2xl:px-5 2xl:py-5  lg:px-2 lg:py-1 px-2 py-1 mb-5 lg:mb-2 2xl:mb-5 lg:max-h-full  max-h-96  overflow-y-auto overflow-hidden">
          <div className="md:grid md:grid-cols-2 md:gap-6  ">
            <div className="col-span-1 sm:col-span-1 cursor-not-allowed">
              <label
                htmlFor="username"
                className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 flex cursor-not-allowed  shadow-sm  nm-flat-dbeats-dark-secondary p-0.5">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={userData.username}
                  className=" cursor-not-allowed text-white text-opacity-30  dark:bg-dbeats-dark-primary border-dbeats-dark-secondary focus:ring-0 focus:border-dbeats-dark-secondary flex-1 block w-full  sm:text-sm "
                  placeholder=""
                  disabled
                />
              </div>
            </div>
            <div className="col-span-1 sm:col-span-1">
              <label
                htmlFor="Name"
                className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
              >
                Name
              </label>
              <div className="mt-1 flex  shadow-sm  nm-flat-dbeats-dark-secondary p-0.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newData.name}
                  onChange={handleUserInputs}
                  className="  dark:bg-dbeats-dark-primary border-dbeats-dark-secondary focus:ring-0 focus:border-dbeats-dark-secondary flex-1 block w-full  sm:text-sm  "
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-6 pt-2">
            <div className="col-span-1 sm:col-span-2">
              <label
                htmlFor="email"
                className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 flex  shadow-sm  nm-flat-dbeats-dark-secondary p-0.5">
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={newData.email}
                  onChange={handleUserInputs}
                  className="  dark:bg-dbeats-dark-primary border-dbeats-dark-secondary focus:ring-0 focus:border-dbeats-dark-secondary flex-1 block w-full  sm:text-sm  "
                  placeholder=""
                />
                {existingValue === 'Invalid' ? (
                  <p
                    className={`${
                      existingValue ? '2xl:text-sm lg:text-xs  text-red-500 ml-1 mt-1' : 'hidden'
                    }`}
                  >
                    Email already exists
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-6 py-4">
            <div className="flex items-center col-span-1 sm:col-span-2">
              <label
                htmlFor="email"
                className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
              >
                To Change your Wallet ID
              </label>
              <div className="mt-1 flex rounded-md shadow-sm ml-2">
                <div
                  onClick={handleWalletReset}
                  className={`flex justify-center py-1 rounded  border-dbeats-light border
                    text-sm my-auto font-semibold px-3 bg-transparent dark:text-white
                    hover:bg-dbeats-light cursor-pointer`}
                >
                  {buttonText}
                </div>
              </div>
            </div>
          </div>
          <div
            className="   text-center 
          sm:px-6 flex justify-end items-center "
          >
            <div className="nm-flat-dbeats-dark-secondary  p-1 rounded-3xl hover:nm-inset-dbeats-dark-primary group cursor-pointer">
              <input
                type="button"
                value={'Update Details'}
                onClick={UpdateData}
                className={`
                cursor-pointer
               flex justify-center   
                 rounded-3xl  border-0
                lg:text-md text-md my-auto font-semibold px-5 py-2.5  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary transform  transition-all duration-200
                dark:text-white
                ${
                  newData.name === userData.name && newData.email === userData.email
                    ? 'hidden'
                    : 'cursor-pointer  hover:nm-inset-dbeats-secondary-light  '
                }
                `}
                disabled={newData.name === userData.name && newData.email === userData.email}
              />
            </div>
            <div
              className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
              hidden={!loader}
            ></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileUpdateModal;
