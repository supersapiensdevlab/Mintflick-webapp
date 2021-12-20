// import React, { useState } from 'react';
// // import Dropdown from "./dropdown.component";
// // import axios from "axios";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import Noty from "noty";
// // import Multiselect from "multiselect-react-dropdown";
// // import logo from "../assets/graphics/DBeatsHori.png";
// // import { Menu, Transition } from "@headlessui/react";
// // import { Fragment, useEffect, useRef } from "react";
// // import Switch from "./switch.component";
// // import { Zora } from "@zoralabs/zdk";
// // import { Wallet, BigNumber, ethers } from "ethers";
// //import useWeb3Modal from "../hooks/useWeb3Modal";
// // import ReactAudioPlayer from "react-audio-player";
// // import ReactJkMusicPlayer from "react-jinke-music-player";
// import 'react-jinke-music-player/assets/index.css';
// import Logo from '../assets/graphics/light-logo.svg';
// import Logo_light from '../assets/graphics/dark-logo.svg';
// import { useSelector } from 'react-redux';

// const Form = (props) => {
//   const state = {
//     error: null,
//     isLoaded: false,
//     items: [],
//   };

//   const [nft, setNFT] = useState({
//     nfts: null,
//     nft_id: null,
//     nft_title: null,
//     nft_description: null,
//     nft_uri: null,
//     play: false,
//   });

//   //const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

//   const darkMode = useSelector((state) => state.toggleDarkMode);
//   return (
//     <>
//       <div className="flex self-center pt-52 mx-auto  ">
//         <div className=" self-center   mx-auto   ">
//           <img
//             className={`${darkMode && 'hidden'} h-32 w-max    self-center  mx-auto `}
//             src={Logo_light}
//             alt=""
//           />
//           <img
//             className={`${!darkMode && 'hidden'} h-32 w-max    self-center  mx-auto`}
//             src={Logo}
//             alt=""
//           />
//           <br></br>
//           <h2 className="drop-shadow text-3xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 self-center text-center">
//             The only streaming platform you'll ever need.
//           </h2>
//           <h3 className="drop-shadow text-xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 self-center text-center">
//             Restream with DBeats & stay connected with your fans on more than 30+ Platforms.
//           </h3>

//           <h3 className="drop-shadow text-lg  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 self-center text-center">
//             Music.Videos.NFTs
//           </h3>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Form;
