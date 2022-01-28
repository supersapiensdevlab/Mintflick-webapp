/* This example requires Tailwind CSS v2.0+ */
import React from 'react';

import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
//  import { useDispatch, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { toggleUserType } from '../../../../src/actions/index';

export default function Example() {
  const [open, setOpen] = useState(true);

  // userType = useSelector((state) => state.toggleAudius);

  const dispatch = useDispatch();

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="dark fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="dark:bg-dbeats-dark-secondary flex items-end justify-center min-h-screen   text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 dark:bg-dbeats-dark-primary   transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0    "
            enterTo="opacity-300    "
            leave="ease-in duration-300"
            leaveFrom="opacity-300    "
            leaveTo="opacity-0    "
          >
            <div className="inline-block align-bottom     rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="   px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-center  ">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl leading-6 font-medium uppercase text-gray-900 dark:text-dbeats-light"
                    >
                      Choose your Pill
                    </Dialog.Title>
                    <div className="grid grid-cols-3 gap-4 my-5  ">
                      <div
                        onClick={() => {
                          dispatch(toggleUserType(0));
                          setOpen(false);
                        }}
                      >
                        <div>
                          <div className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                            <span className="px-2  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                              <span role="img" className="sm:text-3xl text-3xl">
                                🕹️
                              </span>
                              <p className="self-center mx-2">GAMER</p>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          dispatch(toggleUserType(1));
                          setOpen(false);
                        }}
                      >
                        <div>
                          <div className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                            <span className=" px-2 text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                              <span role="img" className="sm:text-3xl text-3xl ">
                                🤳🏽
                              </span>
                              <p className="self-center mx-2">CREATOR</p>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          dispatch(toggleUserType(2));
                          setOpen(false);
                        }}
                      >
                        <div className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                          <span className=" px-2 text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                            <span role="img" className="sm:text-3xl text-3xl">
                              📚
                            </span>
                            <p className="self-center mx-2">BLOGGER</p>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-dbeats-white">
                        We want to curate the best experience for you! Help us by choosing your
                        prefered style.
                      </p>
                    </div>
                    <div className="flex mx-auto text-center items-center align-middle justify-center my-2">
                      <input
                        type="checkbox"
                        className="appearance-none ring-0 focus:ring-0 text-dbeats-light default:ring-0 cursor-pointer  rounded"
                      />
                      <p className="text-sm text-dbeats-white mx-2 text-center">
                        Do not ask again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div
                 
                className=" bg-gray-50 dark:bg-dbeats-dark-primary px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse "
              >
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-dbeats-light text-base font-medium text-white hover:bg-dbeats-secondary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50   sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div> */}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
