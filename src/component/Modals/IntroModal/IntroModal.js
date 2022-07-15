import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

export const IntroModal = ({ show, handleClose }) => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [index, setIndex] = useState(0);

  const data = [
    {
      image:
        'https://ipfs.io/ipfs/bafybeidw3lu7gjqbme7gfl2p4xvqmyfbrqbiqpfgtbscdsavq4rf44ew3y/10A9F038-BD10-4945-8927-5DEC6969F99C.jpeg',
      subHeader: 'head1',
      text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam veritatis dolorem repudiandae corporis vitae omnis, repellat esse quod deserunt, doloribus ullam quam officia, voluptas itaque dolore ut beatae maiores maxime!',
    },
    {
      image:
        'https://ipfs.io/ipfs/bafybeidw3lu7gjqbme7gfl2p4xvqmyfbrqbiqpfgtbscdsavq4rf44ew3y/10A9F038-BD10-4945-8927-5DEC6969F99C.jpeg',
      subHeader: 'head2',
      text: '2 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam veritatis dolorem repudiandae corporis vitae omnis, repellat esse quod deserunt, doloribus ullam quam officia, voluptas itaque dolore ut beatae maiores maxime!',
    },
    {
      image:
        'https://ipfs.io/ipfs/bafybeidw3lu7gjqbme7gfl2p4xvqmyfbrqbiqpfgtbscdsavq4rf44ew3y/10A9F038-BD10-4945-8927-5DEC6969F99C.jpeg',
      subHeader: 'head3',
      text: '3 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam veritatis dolorem repudiandae corporis vitae omnis, repellat esse quod deserunt, doloribus ullam quam officia, voluptas itaque dolore ut beatae maiores maxime!',
    },
    {
      image:
        'https://ipfs.io/ipfs/bafybeidw3lu7gjqbme7gfl2p4xvqmyfbrqbiqpfgtbscdsavq4rf44ew3y/10A9F038-BD10-4945-8927-5DEC6969F99C.jpeg',
      subHeader: 'head4',
      text: '4 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam veritatis dolorem repudiandae corporis vitae omnis, repellat esse quod deserunt, doloribus ullam quam officia, voluptas itaque dolore ut beatae maiores maxime!',
    },
  ];

  return (
    <div className=" ">
      <Modal
        isOpen={show}
        className={`${
          darkMode && 'dark'
        } h-max md:w-1/3 w-11/12 rounded-2xl bg-dbeats-dark-alt mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 lg:-translate-y-1/2 shadow z-500`}
      >
        <div
          className={`border-2 border-white border-opacity-50 rounded-2xl shadow-lg shadow-black`}
        >
          <h2 className="grid grid-cols-5 justify-between items-center ml-24 2xl:text-2xl lg:text-lg py-4 2xl:py-4  lg:py-2 dark:bg-dbeats-dark-alt dark:text-white">
            <div className="col-span-4 md:ml-2 -ml-4 text-center text-white justify-center align-middle mt-1.5">
              What&apos;s MintFlick ?
            </div>
            {index == data.length - 1 ? (
              <div
                onClick={handleClose}
                className=" rounded-3xl group w-max   p-1  mx-1 md:mr-3 lg:mr-3 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
              >
                <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                  <p className="self-center mx-2">
                    {' '}
                    <i className="fas fa-times"></i>{' '}
                  </p>
                </span>
              </div>
            ) : (
              <></>
            )}
          </h2>
          <hr className="pt-4 dark:bg-dbeats-dark-alt" />
          <div className="w-full h-max">
            <div className="h-full w-full p-3">
              <div className="w-full flex justify-between  px-3">
                {index > 0 ? (
                  <button
                    className="text-white w-max h-max px-3 py-1"
                    onClick={() => setIndex(index - 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="dark:bg-dbeats-dark-alt text-dbeats-dark-alt w-max h-max px-3 py-1"
                    onClick={() => setIndex(index - 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                  </button>
                )}
                <p className="text-white text-lg">{data[index].subHeader}</p>
                {index < 3 ? (
                  <button
                    className="text-white w-max h-max px-3 py-1"
                    onClick={() => setIndex(index + 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="dark:bg-dbeats-dark-alt text-dbeats-dark-alt w-max h-max px-3 py-1"
                    onClick={() => setIndex(index + 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="w-full flex justify-center items-center">
                <img
                  src="https://ipfs.io/ipfs/bafybeidw3lu7gjqbme7gfl2p4xvqmyfbrqbiqpfgtbscdsavq4rf44ew3y/10A9F038-BD10-4945-8927-5DEC6969F99C.jpeg"
                  alt="Intro Image"
                  className="h-72 w-auto"
                />
              </div>
              <div className="w-full py-5">
                <p className="text-white text-center">{data[index].text}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
