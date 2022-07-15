import { Fragment } from 'react';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import Noty from 'noty';

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
        <div className="mb-4 border border-gray-100 dark:text-gray-50 dark:border-dbeats-light dark:border-opacity-10 bg-white nm-flat-dbeats-dark-primary-sm  rounded-xl shadow-sm dark:shadow-md    text-dbeats-dark-primary p-4    dialog ">
          <div>
            <div className="justify-between flex">
              <p className=" text-dbeats-light text-lg font-bold">Get Started 🚀</p>
            </div>
            <p className="">
              This is our open Beta!
              <br></br>Many things are still in the making. Please be patient if it isn’t 100% how
              you would like, we are working on it. <br></br> So, enjoy, the house is yours and
              please let us know how we can do better, fix any bugs and improve the app over time.
            </p>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default HowToUse;
