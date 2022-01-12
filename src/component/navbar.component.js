// /* This example requires Tailwind CSS v2.0+ */
// import { useState } from 'react';

// import { Fragment } from 'react';
// import React, { useEffect } from 'react';

// import themeSwitchAnim from '../assets/graphics/sunmoon.json';
// import Toggle from './toggle.component';

// import { Popover, Transition } from '@headlessui/react';
// import { MenuIcon, XIcon } from '@heroicons/react/outline';
// import Logo from '../assets/graphics/Dbeats-dark.svg';
// import Logo_light from '../assets/graphics/Dbeats-light.svg';
// import Web3 from 'web3';
// import Web3Modal from 'web3modal';

// import { useSelector, useDispatch } from 'react-redux';
// import { toggleAudius, toggleDarkMode } from '../actions/index';
// const { ethers } = require('ethers');
// const jdenticon = require('jdenticon');
// const fs = require('fs');

// export default function Navbar() {
//   const dispatch = useDispatch();
//   const audius = useSelector((state) => state.toggleAudius);

//   const darkMode = useSelector((state) => state.toggleDarkMode);
//   const [open, setOpen] = useState(false);

//   const [connectedWallet, setWalletConnected] = useState('');
//   const [icon, setWalletIcon] = useState('');

//   const [toggled, setToggled] = React.useState(true);
//   const handleClick = () => {
//     setToggled((s) => !s);
//     dispatch(toggleDarkMode());
//   };
//   const providerOptions = {
//     /* See Provider Options Section */
//     theme: 'dark',
//   };

//   const web3Modal = new Web3Modal({
//     providerOptions, // required
//   });

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: themeSwitchAnim,
//   };
//   useEffect(() => {
//     // You need to restrict it at some point
//     // This is just dummy code and should be replaced by actual
//     if (!connectedWallet) {
//       getToken();
//     }
//   });

//   const getToken = async () => {
//     // //console.log(provider.getSigner());

//     const provider = await web3Modal.connect();
//     const web3 = new Web3(provider);
//     const accounts = await web3.eth.getAccounts();

//     // Subscribe to accounts change
//     provider.on('accountsChanged', (accounts) => {
//       //console.log(accounts);
//       setWalletConnected(accounts[0]);
//     });

//     // Subscribe to chainId change
//     provider.on('chainChanged', (chainId) => {
//       //console.log(chainId);
//     });

//     // Subscribe to provider connection
//     provider.on('connect', (info) => {
//       //console.log(info);
//       setWalletConnected(accounts[0]);
//       setWalletIcon(jdenticon.toSvg(accounts[0], 200));
//       fs.writeFileSync('./profile-icon.svg', icon);
//     });

//     // Subscribe to provider disconnection
//     provider.on('disconnect', (error) => {
//       console.log(error);
//       setWalletConnected(false);
//     });

//     setWalletConnected(accounts[0]);
//   };
//   return (
//     <>
//       <div
//         className={`${
//           darkMode && 'dark'
//         }  font-proxima-reg fixed z-100 w-max transition duration-1000 ease-in-out`}
//       >
//         <Transition
//           show={open}
//           as={Fragment}
//           enter="transition ease-in-out duration-800"
//           enterFrom="transform opacity-0  -translate-x-full "
//           enterTo="transform opacity-100   translate-x-0 "
//           leave="transition ease-in-out duration-800"
//           leaveFrom="transform opacity-100   translate-x-0"
//           leaveTo="transform   opacity-0 -translate-x-full"
//         >
//           <div
//             className={` bg-white mt-8 text-gray-500 shadow-sm h-screen w-250    dark:bg-dbeats-dark  dark:text-gray-100
//           `}
//           >
//             <div className="    px-5    pt-5  pb-3">
//               <a
//                 href="/"
//                 className="flex p-2 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100    cursor-pointer rounded-md mt-5 "
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5    self-center "
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                 </svg>
//                 <p className="ml-5 self-center ">Home</p>
//               </a>
//               <a
//                 href="/"
//                 className="flex py-2 px-2 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100 cursor-pointer rounded-md mt-2"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg  "
//                   className="h-5 w-5   self-center"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
//                 </svg>
//                 <p className="ml-5 self-center "> Videos</p>
//               </a>
//               <a
//                 href="/music"
//                 className="flex py-2 px-2 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100 cursor-pointer rounded-md mt-2"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5   self-center"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
//                 </svg>
//                 <p className="ml-5 self-center "> Music</p>
//               </a>
//               <a
//                 href="/nft"
//                 className="flex py-2 px-2 dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100 cursor-pointer rounded-md mt-2"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5   self-center"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <p className="ml-5 self-center "> NFTs</p>
//               </a>
//               <div className="h-max w-max flex items-center justify-center  fixed bottom-28 ">
//                 <div className="relative flex ml-2 ">
//                   <Toggle toggled={toggled} onClick={handleClick} />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Transition>
//         <div className="  top-0 bg-white shadow-sm z-50  absolute w-screen dark:bg-dbeats-dark dark:text-gray-100  bg-opacity-60  backdrop-filter  backdrop-blur-md">
//           <>
//             <div className="  mx-auto   sm:px-6">
//               <div className="flex justify-between   py-2 md:justify-start md:space-x-10">
//                 <div className="   ">
//                   <div className="flex  justify-start">
//                     <div
//                       onClick={() => setOpen(!open)}
//                       className=" p-2 my-2 cursor-pointer mx-auto dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100  rounded-md   inline-flex items-center justify-center text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dbeats-light"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6 mx-auto   "
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 6h16M4 12h16M4 18h16"
//                         />
//                       </svg>
//                     </div>

//                     <a href="/" className="h-14   w-28   self-center   ">
//                       <img
//                         className={`${darkMode && 'hidden'} h-14 w-max    self-center  mx-auto `}
//                         src={Logo}
//                         alt=""
//                       />
//                       <img
//                         className={`${!darkMode && 'hidden'} h-14 w-max    self-center  mx-auto`}
//                         src={Logo_light}
//                         alt=""
//                       />
//                     </a>
//                   </div>
//                 </div>
//                 <div className="flex items-center self-center justify-center w-full ">
//                   <label className="flex items-center cursor-pointer mx-3">
//                     <div className="relative">
//                       <input
//                         type="checkbox"
//                         id="audius"
//                         defaultChecked={audius}
//                         onClick={() => dispatch(toggleAudius())}
//                         className="sr-only"
//                       ></input>

//                       <div className="block bg-transparent dark:bg-gray-800 w-14 h-8 rounded-full shadow-inner"></div>
//                       <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition shadow"></div>
//                     </div>

//                     <div className="ml-3 text-gray-500 font-medium">
//                       <img
//                         src="https://audius.org/img/audius@2x.png"
//                         className={`${!audius ? 'filter grayscale-75 ' : ''}w-10 h-10 filter`}
//                         alt="audius"
//                       ></img>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
//                   <div className="px-4 mx-2 py-2 rounded text-gray-500 dark:bg-dbeats-dark  dark:text-gray-100  dark:hover:bg-gray-800 dark:hover:text-white hover:bg-gray-100">
//                     <a href="/upload" className="  ">
//                       Upload
//                     </a>
//                   </div>
//                   <div
//                     className={`${
//                       connectedWallet ? 'bg-gray-100' : ''
//                     } px-4 mx-2 py-2 rounded  dark:bg-gray-800   dark:text-white dark:hover:bg-dbeats-light   dark:hover:text-white hover:bg-gray-200`}
//                   >
//                     <button
//                       onClick={() => (!connectedWallet ? getToken() : false)}
//                       className="whitespace-nowrap text-base font-medium flex"
//                     >
//                       <svg
//                         className="mr-1"
//                         width="24"
//                         height="24"
//                         data-jdenticon-value={connectedWallet}
//                       ></svg>

//                       {connectedWallet
//                         ? connectedWallet.slice(0, 4) +
//                           '....' +
//                           connectedWallet.slice(connectedWallet.length - 4, connectedWallet.length)
//                         : 'Connect Wallet'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         </div>
//       </div>
//     </>
//   );
// }
