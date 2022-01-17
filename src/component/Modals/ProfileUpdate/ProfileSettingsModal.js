import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';

const ProfileUpdateModal = ({ show, handleClose, userData, darkMode, setDisplayName }) => {
  // const [buttonText, setButtonText] = useState('Click Here');
  const [loader, setLoader] = useState(false);

  const [newData, setNewData] = useState({
    plan: '',
    perks: '',
    price: '',
    plan2: '',
    perks2: '',
    price2: '',
    plan3: '',
    perks3: '',
    price3: '',
  });

  const [currentPlan, setPlan] = useState('first');

  const handleNewPlan = (e) => {
    let name = e.target.name;
    console.log(name);
    setPlan(name);
  };

  const handleUserInputs = (e) => {
    if (currentPlan === 'first') {
      let name = e.target.name;
      let value = e.target.value;
      setNewData({ ...newData, [name]: value });
    } else if (currentPlan === 'second') {
      let name = e.target.name + '2';
      let value = e.target.value;
      setNewData({ ...newData, [name]: value });
    } else if (currentPlan === 'third') {
      let name = e.target.name + '3';
      let value = e.target.value;
      setNewData({ ...newData, [name]: value });
    }
  };

  const UpdateData = () => {
    setLoader(true);
    let data = {
      username: userData.username,
      planData: newData,
    };
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/update-superfan`,
      data: data,
    })
      .then((res) => {
        setLoader(false);
        //handleClose();
        console.log(res);
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
          ? 'h-max max-h-screen lg:w-1/3 w-5/6 mx-auto 2xl:mt-28 lg:mt-16   bg-dbeats-dark-primary rounded-xl '
          : 'h-max max-h-screen lg:w-1/3 w-5/6 mx-auto 2xl:mt-28 lg:mt-16    bg-gray-50 rounded-xl shadow-2xl'
      }
    >
      <div className={`${darkMode && 'dark'} p-2 h-max`}>
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg 2xl:py-4 py-4 lg:py-3 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 uppercase font-semibold text-dbeats-light">Settings</div>
          <div className="mr-7 flex justify-end w-full" onClick={handleClose}>
            <i className="fas fa-times cursor-pointer"></i>
          </div>
        </h2>

        <div className=" bg-white text-gray-500 dark:text-dbeats-white  dark:bg-dbeats-dark-alt      rounded   p-5       max-h-96  sm:h-max sm:max-h-full  overflow-y-auto overflow-hidden">
          <div className="md:grid md:grid-cols-2 md:gap-6  ">
            <div className="bg-white dark:bg-dbeats-dark-secondary dark:text-dbeats-white  overflow-hidden sm:rounded  col-span-2">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-dbeats-dark-secondary">
                <h3 className="text-lg leading-6 font-medium text-gray-900   dark:text-dbeats-white ">
                  Superfan
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-dbeats-white">
                  Personal details and application.
                </p>
              </div>
              <div className="border-t border-dbeats-dark-primary">
                <dl>
                  <div className="bg-gray-50 dark:bg-dbeats-dark-alt px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white   self-center align-middle ">
                      Your Wallet Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 flex rounded-md shadow-sm"></div>
                      <input
                        type="text"
                        className="dark:text-gray-400  border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-dark-secondary dark:border-opacity-0 border-gray-300 dark:bg-dbeats-dark-secondary     flex-1 block w-full rounded-md sm:text-sm  "
                        placeholder="Plan Name"
                        value={userData.wallet_id}
                        readOnly={true}
                      />
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-dbeats-dark-alt px-4 pb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white  self-center align-middle ">
                      Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="plan"
                          id="plan"
                          className="focus:border-opacity-60 border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-light border-opacity-20 border-gray-300 dark:bg-dbeats-dark-primary     flex-1 block w-full rounded-md sm:text-sm  "
                          placeholder="Plan Name"
                          onChange={handleUserInputs}
                          value={
                            currentPlan === 'first'
                              ? newData.plan
                              : currentPlan === 'second'
                              ? newData.plan2
                              : currentPlan === 'third'
                              ? newData.plan3
                              : ''
                          }
                        />
                      </div>
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-dbeats-dark-alt px-4  pb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white align-middle self-center">
                      Perks
                    </dt>
                    <dd className="  text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      <div className="  flex rounded-md shadow-sm">
                        <textarea
                          type="text"
                          name="perks"
                          id="perks"
                          placeholder="Perks"
                          value={
                            currentPlan === 'first'
                              ? newData.perks
                              : currentPlan === 'second'
                              ? newData.perks2
                              : currentPlan === 'third'
                              ? newData.perks3
                              : ''
                          }
                          onChange={handleUserInputs}
                          className="focus:border-opacity-60 border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-light border-opacity-20 border-gray-300 dark:bg-dbeats-dark-primary     flex-1 block w-full rounded-md sm:text-sm  "
                        />
                      </div>
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-dbeats-dark-alt px-4 pb-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white   self-center align-middle ">
                      Pricing<br></br>
                      <span className="font-mono"> (DBEATx/second)</span>
                    </dt>
                    <dd className="  text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      <div className="  flex rounded-md shadow-sm">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          min="0"
                          max="1000"
                          onChange={handleUserInputs}
                          value={
                            currentPlan === 'first'
                              ? newData.price
                              : currentPlan === 'second'
                              ? newData.price2
                              : currentPlan === 'third'
                              ? newData.price3
                              : ''
                          }
                          className="focus:border-opacity-60 border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-light border-opacity-20 border-gray-300 dark:bg-dbeats-dark-primary     flex-1 block w-full rounded-md sm:text-sm  "
                          placeholder="0.00 DBEATx"
                        />
                      </div>
                    </dd>
                  </div>
                  <div className="text-center   font-bold bg-gray-50 dark:bg-dbeats-dark-alt  ">
                    <span className="uppercase text-lg">Preview</span>
                    <i
                      className="fas fa-info-circle mx-2 text-sm cursor-pointer text-gray-500"
                      data-tooltip-target="tooltip-default"
                      data-tooltip-placement="bottom"
                    ></i>
                    <div
                      id="tooltip-default"
                      role="tooltip"
                      className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-dbeats-dark-secondary rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-dbeats-dark-primary dark:bg-opacity-70 bg-opacity-70"
                    >
                      Fill in the plan name and price to see a preview
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 bg-gray-50 dark:bg-dbeats-dark-alt  align-middle justify-center row-auto p-3">
                    <form
                      name="first"
                      id="first"
                      onClick={handleNewPlan}
                      className={` ${
                        currentPlan === 'first'
                          ? 'dark:border-dbeats-white'
                          : 'dark:border-dbeats-dark-primary'
                      }  border-dashed border-2  border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     h-48 rounded align-middle text-center cursor-pointer`}
                    >
                      {' '}
                      <p
                        className={`${
                          !newData.plan
                            ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle font-bold uppercase text-lg mt-5 mx-2 rounded`}
                      >
                        {newData.plan}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.price
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.price}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.perks
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.perks}&nbsp;
                      </p>
                    </form>

                    <form
                      name="second"
                      id="second"
                      onClick={handleNewPlan}
                      className={` ${
                        currentPlan === 'second'
                          ? 'dark:border-dbeats-white'
                          : 'dark:border-dbeats-dark-primary'
                      }  border-dashed border-2  border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     h-48 rounded align-middle text-center cursor-pointer`}
                    >
                      {' '}
                      <p
                        className={`${
                          !newData.plan2
                            ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle font-bold uppercase text-lg mt-5 mx-2 rounded`}
                      >
                        {newData.plan2}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.price2
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.price2}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.perks2
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.perks2}&nbsp;
                      </p>
                    </form>

                    <form
                      name="third"
                      id="third"
                      onClick={handleNewPlan}
                      className={` ${
                        currentPlan === 'third'
                          ? 'dark:border-dbeats-white'
                          : 'dark:border-dbeats-dark-primary'
                      }  border-dashed border-2  border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     h-48 rounded align-middle text-center cursor-pointer`}
                    >
                      {' '}
                      <p
                        className={`${
                          !newData.plan3
                            ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle font-bold uppercase text-lg mt-5 mx-2 rounded`}
                      >
                        {newData.plan3}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.price3
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.price3}&nbsp;
                      </p>
                      <p
                        className={`${
                          !newData.perks3
                            ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                            : ''
                        }  align-middle   text-lg  mx-2 rounded`}
                      >
                        {' '}
                        {newData.perks3}&nbsp;
                      </p>
                    </form>
                  </div>
                </dl>

                <div className="lg:px-4 2xl:py-3 lg:py-1 lg:text-right text-center sm:px-6 flex justify-end items-center dark:bg-dbeats-dark-alt">
                  <input
                    type="button"
                    value={'Save changes'}
                    onClick={UpdateData}
                    className={`
               flex justify-center 2xl:py-2 py-1 lg:px-5 
                px-3 text-dbeats-light  rounded border-dbeats-light border
                lg:text-md text-md my-auto font-semibold  bg-transparent
                dark:text-white
                ${
                  newData.name === userData.name && newData.email === userData.email
                    ? ''
                    : 'cursor-pointer hover:bg-dbeats-light hover:text-white'
                }
                `}
                    disabled={newData.name === userData.name && newData.email === userData.email}
                  />
                  <div
                    className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                    hidden={!loader}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileUpdateModal;
