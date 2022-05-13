import { Fragment } from 'react';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import Noty from 'noty';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const HowToUse = () => {
  const [showRefer, setShowRefer] = useState(false);
  const handleShowRefer = () => setShowRefer(true);
  const [copied, setCopied] = useState(null);

  const [showWelcome, setShowWelcome] = useState(true);
  const handleShowWelcome = () => setShowWelcome(false);
  const user = useSelector((state) => state.User.user);
  const userRefer = {
    feedback: '',
    email: '',
  };

  const [values, setValues] = useState(userRefer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const myReferralLink = `${process.env.REACT_APP_CLIENT_URL}/user/referred-by/${user.username}`;

  return (
    <>
      <Transition
        show={showWelcome}
        as={Fragment}
        enter="transition ease-in-out duration-500"
        enterFrom="transform opacity-0    "
        enterTo="transform opacity-500    "
        leave="transition ease-in-out duration-500"
        leaveFrom="transform opacity-500   "
        leaveTo="transform   opacity-0  "
      >
        <div className="mb-5 border border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white nm-flat-dbeats-dark-primary  rounded-xl shadow-sm dark:shadow-md    text-dbeats-dark-primary p-4    dialog ">
          <div>
            <div className="justify-between flex">
              <p className=" text-dbeats-light text-lg font-bold">Refer a Friend 🔮</p>
            </div>

            <div className="flex align-middle justify-center items-center">
              <input
                type="text"
                className="bg-dbeats-dark-secondary text-white font-bold border border-dbeats-light dark:border-opacity-10 p-2 rounded w-full mt-2 focus:ring-0 focus:border-2  "
                value={myReferralLink}
              ></input>
              <i
                align-middle
                onClick={() => {
                  navigator.clipboard.writeText(myReferralLink);
                  setCopied(myReferralLink);
                }}
                className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1 align-middle"
              ></i>
            </div>
            <Link
              to="/spingame"
              href="/spingame"
              className=" hidden transform-gpu  transition-all duration-300 ease-in-out mt-3 cursor-pointer relative inline-flex items-center justify-center p-1 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl  bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary   hover:text-white dark:text-white  "
            >
              <span className="relative px-5 py-2.5 whitespace-nowrap text-xs sm:text-sm bg-gradient-to-br from-dbeats-light to-dbeats-secondary-light hover:nm-inset-dbeats-secondary-light  rounded-3xl">
                Share Referal Link
              </span>
            </Link>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default HowToUse;
