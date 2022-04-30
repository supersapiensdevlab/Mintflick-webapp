import { Fragment } from 'react';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import Noty from 'noty';
import { Link } from 'react-router-dom';

const HowToUse = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const handleShowFeedback = () => setShowFeedback(true);

  const [showWelcome, setShowWelcome] = useState(true);
  const handleShowWelcome = () => setShowWelcome(false);

  const userFeedback = {
    feedback: '',
    email: '',
  };

  const [values, setValues] = useState(userFeedback);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleFeedbackSubmit = (e) => {
    let feedbackData = values;
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/send_feedback`,
      data: feedbackData,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then((response) => {
        console.log('success');
        Noty.closeAll();
        new Noty({
          type: 'success',
          text: 'We appreciate your valuable feedback',
          theme: 'metroui',
          layout: 'bottomRight',
        }).show();
        window.location.href = '/';
      })
      .catch((err) => {
        console.log(err);
        Noty.closeAll();
        new Noty({
          type: 'error',
          text: 'Feedback not submitted, kindly re-submit',
          theme: 'metroui',
          layout: 'bottomRight',
        }).show();
      });
  };

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
        <div className="mb-4 border border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white nm-flat-dbeats-dark-primary  rounded-xl shadow-sm dark:shadow-md    text-dbeats-dark-primary p-4    dialog ">
          <div>
            <div className="justify-between flex">
              <p className=" text-dbeats-light text-lg font-bold">Game of Luck 🔮</p>
            </div>
            <p className="">
              Welcome to the Spin Game, here you can play the game of chance and win big. You can
              play the game by clicking on the button below.
            </p>
            <Link
              to="/spingame"
              href="/spingame"
              className="  transform-gpu  transition-all duration-300 ease-in-out mt-3 cursor-pointer relative inline-flex items-center justify-center p-1 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl  bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary   hover:text-white dark:text-white  "
            >
              <span className="relative px-5 py-2.5 whitespace-nowrap text-xs sm:text-sm bg-gradient-to-br from-dbeats-light to-dbeats-secondary-light hover:nm-inset-dbeats-secondary-light  rounded-3xl">
                Let&apos;s Go!
              </span>
            </Link>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default HowToUse;
