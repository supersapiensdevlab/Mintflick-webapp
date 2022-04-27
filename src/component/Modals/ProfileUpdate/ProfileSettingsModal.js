import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { Image } from 'react-img-placeholder';
import dbeatsLogoBnW from '../../../assets/images/Logo/logo-blacknwhite.png';
import maticLogo from '../../../assets/graphics/polygon-matic-logo.svg';
import { useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';

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

  //console.log('userData', userData.superfan_data);
  const [currentPlan, setPlan] = useState('silver');
  const [hideGold, setHideGold] = useState(true);
  const [hidePlatinum, setHidePlatinum] = useState(true);
  const [hidePlus, setHidePlus] = useState(false);

  const [showSavedChanges, setShowSavedChanges] = useState(false);
  const handleShowSavedChanged = () => setShowSavedChanges(true);
  const handleCloseSavedChanges = () => setShowSavedChanges(false);

  const handleNewPlan = (e) => {
    let name = e.target.name;
    console.log(name);
    setPlan(name);
  };

  const handleUserInputs = (e) => {
    if (currentPlan === 'silver') {
      let name = e.target.name;
      let value = e.target.value;
      setNewData({ ...newData, [name]: value });
    } else if (currentPlan === 'gold') {
      let name = e.target.name + '2';
      let value = e.target.value;
      setNewData({ ...newData, [name]: value });
    } else if (currentPlan === 'platinum') {
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
    console.log(data);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/update-superfan`,
      data: data,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    })
      .then((res) => {
        setLoader(false);
        handleClose();
        handleShowSavedChanged();
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (userData.superfan_data) {
      setNewData({
        plan: userData.superfan_data.plan,
        perks: userData.superfan_data.perks,
        price: userData.superfan_data.price,
        plan2: userData.superfan_data.plan2,
        perks2: userData.superfan_data.perks2,
        price2: userData.superfan_data.price2,
        plan3: userData.superfan_data.plan3,
        perks3: userData.superfan_data.perks3,
        price3: userData.superfan_data.price3,
      });
    }
  }, [userData.superfan_data]);

  const showPlans = () => {
    if (hideGold) {
      setHideGold(false);
      setPlan('gold');
    } else {
      setHidePlatinum(false);
      setPlan('platinum');
      setHidePlus(true);
    }
  };

  return (
    <div className="relative">
      <Modal
        isOpen={show}
        className={
          darkMode
            ? 'h-max max-h-screen 2xl:w-1/3 xl:w-7/12 lg:w-7/12 md:w-5/6 w-11/12 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   bg-dbeats-dark-primary rounded-xl '
            : 'h-max max-h-screen 2xl:w-1/3  xl:w-7/12 lg:w-7/12 md:w-5/6 w-11/12 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2    bg-gray-50 rounded-xl shadow-2xl'
        }
      >
        <div className={`${darkMode && 'dark'} p-2 h-max`}>
          <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg 2xl:pt-4  pb-5 2xl:pb-0 pt-3 2xl:pt-0 lg:pb-1.5 dark:bg-dbeats-dark-alt bg-white dark:text-white">
            <div className="col-span-4 pl-14 uppercase font-semibold text-dbeats-light">
              Settings
            </div>
            <div
              onClick={handleClose}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center mx-2">
                  {' '}
                  <i className="fas fa-times"></i>{' '}
                </p>
              </span>
            </div>
          </h2>

          <div className=" bg-white text-gray-500 dark:text-dbeats-white  dark:bg-dbeats-dark-alt      rounded   2xl:p-5 md:p-5 p-3  lg:px-5 lg:py-3    max-h-96  sm:h-max sm:max-h-full  overflow-y-auto overflow-hidden">
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
                    <div className="bg-gray-50 dark:bg-dbeats-dark-alt 2xl:px-4 md:px-4  2xl:py-5 md:py-4 lg:py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
                    <div className="bg-gray-50 dark:bg-dbeats-dark-alt 2xl:px-4 md:px-4 2xl:pb-5 md:pb-5 lg:pb-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white  self-center align-middle ">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="plan"
                            id="plan"
                            readOnly="true"
                            className="dark:text-gray-400  border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-dark-secondary dark:border-opacity-0 border-gray-300 dark:bg-dbeats-dark-secondary     flex-1 block w-full rounded-md sm:text-sm  "
                            placeholder="Plan Name"
                            onChange={handleUserInputs}
                            value={currentPlan}
                          />
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-dbeats-dark-alt 2xl:px-4 md:px-4  2xl:pb-5 md:pb-5 lg:pb-2.5  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
                              currentPlan === 'silver'
                                ? newData.perks
                                : currentPlan === 'gold'
                                ? newData.perks2
                                : currentPlan === 'platinum'
                                ? newData.perks3
                                : ''
                            }
                            onChange={handleUserInputs}
                            className="focus:border-opacity-60 border dark:border-dbeats-dark-primary dark:focus:ring-dbeats-light border-opacity-20 border-gray-300 dark:bg-dbeats-dark-primary     flex-1 block w-full rounded-md sm:text-sm  "
                          />
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 dark:bg-dbeats-dark-alt 2xl:px-4 md:px-4 2xl:pb-5 md:pb-5 lg:pb-2.5  sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-dbeats-white   self-center align-middle ">
                        Pricing<br></br>
                        <span className="font-mono"> (MATIC)</span>
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
                              currentPlan === 'silver'
                                ? newData.price
                                : currentPlan === 'gold'
                                ? newData.price2
                                : currentPlan === 'platinum'
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
                    <p className="text-center bg-dbeats-dark-alt self-center dark:text-gray-500">
                      Choose a card to edit
                    </p>

                    <div
                      className={`${
                        hidePlus ? '  items-center justify-between' : 'items-center justify-start'
                      } flex md:flex-row flex-col bg-gray-50 dark:bg-dbeats-dark-alt`}
                    >
                      <form
                        name="silver"
                        id="silver"
                        onClick={handleNewPlan}
                        className={` ${
                          currentPlan === 'silver'
                            ? 'dark:border-dbeats-light  shadow-md '
                            : 'dark:border-dbeats-dark-primary border-dashed'
                        }   border   border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     2xl:h-56 2xl:w-48 2xl:mx-2 md:h-56 md:w-48 md:mx-2 w-2/3 mt-3 md:mt-0  rounded-md align-middle text-center cursor-pointer `}
                      >
                        {' '}
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border
                         border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 
                         focus:outline-none  transition m-2 duration-200   align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          checked={currentPlan === 'silver'}
                          name="silver"
                          onClick={handleNewPlan}
                          id="flexRadioDefault1"
                        ></input>{' '}
                        <p
                          className={`${
                            !newData.plan
                              ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }  align-middle font-bold  dark:text-dbeats-light text-lg mt-5 mx-2 rounded`}
                        >
                          Silver&nbsp;
                        </p>
                        <Image
                          src={dbeatsLogoBnW}
                          height={80}
                          width={80}
                          className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1 hidden"
                          alt=""
                          placeholderSrc={dbeatsLogoBnW}
                        />
                        <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                          <>
                            <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                            <p
                              className={`${
                                !newData.price
                                  ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                                  : ''
                              }  align-middle   text-2xl  mx-2 rounded`}
                            >
                              {' '}
                              {newData.price}&nbsp;
                            </p>
                          </>
                        </div>
                        <button
                          className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
                           2xl:w-max w-max px-5 lg:w-max  mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
                           transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                        >
                          <span className="font-semibold text-md px-4 ">Join</span>
                        </button>
                        <p
                          className={`${
                            !newData.perks
                              ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }      text-lg  m-2 rounded  text-gray-800 dark:text-gray-300 mt-4`}
                        >
                          {' '}
                          {newData.perks}&nbsp;
                        </p>
                      </form>

                      <form
                        name="second"
                        id="second"
                        onClick={handleNewPlan}
                        hidden={hideGold}
                        className={` ${
                          currentPlan === 'gold'
                            ? 'dark:border-dbeats-light  shadow-md '
                            : 'dark:border-dbeats-dark-primary border-dashed'
                        }   border   border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     2xl:h-56 2xl:w-48 2xl:mx-2 md:h-56 md:w-48 md:mx-2 w-2/3 mt-3 md:mt-0  rounded-md align-middle text-center cursor-pointer `}
                      >
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border
                         border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 
                         focus:outline-none transition m-2 duration-200   align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          checked={currentPlan === 'gold'}
                          id="flexRadioDefault2"
                          name="gold"
                          onClick={handleNewPlan}
                        ></input>

                        <p
                          className={`${
                            !newData.plan2
                              ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }  align-middle font-bold  dark:text-dbeats-light text-lg mt-5 mx-2 rounded`}
                        >
                          Gold&nbsp;
                        </p>
                        <Image
                          src={dbeatsLogoBnW}
                          height={80}
                          width={80}
                          className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1 hidden"
                          alt=""
                          placeholderSrc={dbeatsLogoBnW}
                        />
                        <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                          <>
                            <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                            <p
                              className={`${
                                !newData.price2
                                  ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                                  : ''
                              }  align-middle   text-2xl  mx-2 rounded`}
                            >
                              {' '}
                              {newData.price2}&nbsp;
                            </p>
                          </>
                        </div>
                        <button
                          className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
                           2xl:w-max w-max px-5 lg:w-max  mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
                           transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                        >
                          <span className="font-semibold text-md px-4 ">Join</span>
                        </button>
                        <p
                          className={`${
                            !newData.perks2
                              ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }      text-lg  m-2 rounded  text-gray-800 dark:text-gray-300 mt-4`}
                        >
                          {' '}
                          {newData.perks2}&nbsp;
                        </p>
                      </form>

                      <form
                        name="platinum"
                        id="platinum"
                        hidden={hidePlatinum}
                        onClick={handleNewPlan}
                        className={` ${
                          currentPlan === 'platinum'
                            ? 'dark:border-dbeats-light  shadow-md '
                            : 'dark:border-dbeats-dark-primary border-dashed'
                        }   border   border-gray-500 self-center dark:bg-dbeats-dark-secondary bg-white 
                     2xl:h-56 2xl:w-48 2xl:mx-2 md:h-56 md:w-48 md:mx-2 w-2/3 mt-3 md:mt-0  rounded-md align-middle text-center cursor-pointer `}
                      >
                        {' '}
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border
                         border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 
                         focus:outline-none transition m-2 duration-200   align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          name="platinum"
                          onClick={handleNewPlan}
                          checked={currentPlan === 'platinum'}
                          id="flexRadioDefault3"
                        ></input>{' '}
                        <p
                          className={`${
                            !newData.plan3
                              ? 'animate-pulse dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }  align-middle font-bold  dark:text-dbeats-light text-lg mt-5 mx-2 rounded`}
                        >
                          Platinum&nbsp;
                        </p>
                        <Image
                          src={dbeatsLogoBnW}
                          height={80}
                          width={80}
                          className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1 hidden"
                          alt=""
                          placeholderSrc={dbeatsLogoBnW}
                        />
                        <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                          <>
                            <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                            <p
                              className={`${
                                !newData.price3
                                  ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                                  : ''
                              }  align-middle   text-2xl  mx-2 rounded`}
                            >
                              {' '}
                              {newData.price3}&nbsp;
                            </p>
                          </>
                        </div>
                        <button
                          className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
                           2xl:w-max w-max px-5 lg:w-max  mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
                           transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                        >
                          <span className="font-semibold text-md px-4 ">Join</span>
                        </button>
                        <p
                          className={`${
                            !newData.perks3
                              ? 'animate-pulse mt-5 dark:bg-dbeats-dark-primary bg-gray-200'
                              : ''
                          }      text-lg  m-2 rounded  text-gray-800 dark:text-gray-300 mt-4`}
                        >
                          {' '}
                          {newData.perks3}&nbsp;
                        </p>
                      </form>
                      <div
                        hidden={hidePlus}
                        className="2xl:h-56 md:h-56 2xl:w-48 md:w-48 w-2/3 h-48 mt-3 md:mt-0"
                      >
                        <form className=" h-full w-full md:mx-2 border border-dbeats-light flex justify-center items-center rounded-md ">
                          <div onClick={showPlans} className="h-14 w-14 cursor-pointer">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-14 w-14"
                              viewBox="0 0 20 20"
                              fill="gray"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </form>
                      </div>
                      {/* <div
                    hidden={hideSecPlus}
                      className='h-56 w-52 border-2 border-dbeats-light flex justify-center items-center rounded-md '
                    >
                      <div onClick={()=>{setHidePlatinum(false); setHideSecPlus(true)}} className="h-14 w-14 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" viewBox="0 0 20 20" fill="gray">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
</svg>
</div>
                    </div> */}
                    </div>
                  </dl>

                  <div className=" 2xl:pt-5 lg:pt-3 lg:pb-0 md:pt-5 pt-5 md:px-1 lg:text-right text-center px-12 flex justify-end items-center dark:bg-dbeats-dark-alt">
                    <input
                      type="button"
                      value={'Save changes'}
                      onClick={UpdateData}
                      className={`
               flex justify-center 2xl:py-2 py-1 lg:px-5 
                px-3 text-dbeats-light  rounded border-dbeats-light border
                lg:text-md text-md my-auto font-semibold  bg-transparent
                dark:text-white bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                hover:nm-inset-dbeats-secondary-light  transition-all duration-300
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
      <Modal
        isOpen={showSavedChanges}
        className="h-max lg:w-1/3  w-5/6 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"
      >
        <div className={`${darkMode && 'dark'}`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg border">
            <Row>
              <h2 className="flex justify-between items-center  w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold pl-48 ">
                  Changes Saved SuccessFully
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1  justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleCloseSavedChanges}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full flex justify-center items-center pt-5 pb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-28 w-28"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileUpdateModal;
