import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

export const IntroModal = ({ show, handleClose }) => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [index, setIndex] = useState(0);

  const data = [
    {
      image: 'https://ipfs.infura.io/ipfs/QmVRkaDbu2g1awSQLegYY9ppdSNPUTNSnJDGnvSJewk5Kc',
      subHeader: 'NFTfied Social Media',
      text: `Blogs, Pictures, Videos, Music, Tweets, everything else you can think of but NFTs.

      Always wanted to sell that Photograph you captured on your trip to Himalayas? Post your favorite Digital Painting & make it a NFT. You can set royalties for every sale`,
    },
    {
      image: 'https://ipfs.infura.io/ipfs/QmVHnqx1s77gpoC4pytK68rQKcWnjJR3LNJvRA4Qv6j8Au',
      subHeader: 'Livestreaming',
      text: `Gamestreamers can livestream their favorite games live while they play.  ${'\n'}  Host Live Concerts and Live Events. ${'\n'}Build a community & chat with your audience live.`,
    },
    {
      image:
        'https://bafybeid2simaplpbzur2d6etd4nxnzd52vbok6biumkjbpi5aepqu6c2cm.ipfs.infura-ipfs.io/',
      subHeader: 'Superfans',
      text: ' Let your most passionate fans support your creative work via monthly memberships paid to you in cryptos. You can let your fans become active participants in the work they love by offering them a monthly membership.',
    },
    {
      image:
        'https://bafybeig53vlqdpomgvtim7o2vjra6c5dsqv5frj43hzaz3kn7tca5ya57m.ipfs.infura-ipfs.io/',
      subHeader: 'Community Chatrooms',
      text: 'Text Channels with community chatrooms. Host live podcasts or schedule events. You are in control. Run your community in the same place as you sell digital NFTs, Music, Art, host Events, post Articles much more. Get the conversation going.',
    },
    {
      image:
        'https://bafybeici6pfqja4dcpkvvq7pox6kxprnvgvgrhigowkjcv5xikc7ft4itm.ipfs.infura-ipfs.io/',
      subHeader: 'NFT Marketplace',
      text: 'Import your NFTs from Opensea or Publish MintFlick exclusive collections. Built on top of Polygon chain means all your experience will be gasless, swift & super-easy. Buying & Selling NFTs will be much smoother with our experience focused Marketplace.',
    },
  ];

  return (
    <div className=" ">
      <Modal
        isOpen={show}
        className={`${
          darkMode && 'dark'
        } h-max lg:w-1/3 md:w-2/3 w-11/12 rounded-2xl bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 shadow z-500 `}
      >
        <div
          className={`border-2 border-white border-opacity-50 rounded-2xl shadow-lg shadow-black  `}
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
            <div className="h-full w-full p-3 ">
              <div className="w-full flex justify-between  px-3 mx-auto">
                {index > 0 ? (
                  <button
                    className="text-white w-max h-max px-3 py-1 cursor-pointer hover:text-dbeats-light"
                    onClick={() => setIndex(index - 1)}
                  >
                    <i className="fa-solid fa-circle-chevron-left text-2xl"></i>
                  </button>
                ) : (
                  <button className="dark:bg-dbeats-dark-alt text-dbeats-dark-alt w-max h-max px-3 py-1 ">
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
                <p className="text-white text-lg font-semibold tracking-widest">
                  {data[index].subHeader}
                </p>
                {index < 4 ? (
                  <button
                    className="text-white w-max h-max px-3 py-1 cursor-pointer hover:text-dbeats-light"
                    onClick={() => setIndex(index + 1)}
                  >
                    <i className="fa-solid fa-circle-chevron-right text-2xl"></i>
                  </button>
                ) : (
                  <button className="dark:bg-dbeats-dark-alt text-dbeats-dark-alt w-max h-max px-3 py-1 ">
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
                <img src={data[index].image} alt="Intro Image" className="h-72 w-auto p-4" />
              </div>
              <div className="w-full py-5">
                <div className="text-white text-left xl:px-8 px-4">{data[index].text}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
