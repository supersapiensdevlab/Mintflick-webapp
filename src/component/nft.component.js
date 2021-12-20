// import React, { useState } from 'react';
// //import Dropdown from "./dropdown.component";
// import axios from 'axios';
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import Noty from "noty";
// // import Multiselect from "multiselect-react-dropdown";
// // import logo from "../assets/graphics/DBeatsHori.png";
// // import { Menu, Transition } from "@headlessui/react";
// import { useEffect } from 'react';
// //import Switch from "./switch.component";
// import { Zora } from '@zoralabs/zdk';
// import {
//   //Wallet,
//   //BigNumber,
//   ethers,
// } from 'ethers';
// //import useWeb3Modal from "../hooks/useWeb3Modal";
// import ReactAudioPlayer from 'react-audio-player';
// import ReactJkMusicPlayer from 'react-jinke-music-player';
// import 'react-jinke-music-player/assets/index.css';

// const Form = () => {
//   // const state = {
//   //   error: null,
//   //   isLoaded: false,
//   //   items: [],
//   // };

//   const [nft, setNFT] = useState({
//     nfts: null,
//     nft_id: null,
//     nft_title: null,
//     nft_description: null,
//     nft_uri: null,
//     play: false,
//     owner: null,
//   });

//   //const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

//   // eslint-disable-next-line no-unused-vars
//   const fetchNFTList = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');

//     // Prompt user for account connections
//     await provider.send('eth_requestAccounts', []);

//     //console.log('This ran Fetch NFT');

//     const signer = provider.getSigner();
//     const connectedWallet = await signer.getAddress();
//     //console.log('Account:', await signer.getAddress());
//     const zora = new Zora(
//       signer,
//       50,
//       '0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7', //mediaAddress
//       '0xE5BFAB544ecA83849c53464F85B7164375Bdaac1', //marketAddress
//     );
//     let res = await zora.fetchTotalMedia();
//     //console.log('Total NFT Items on the BC: ' + res.toNumber());
//     //let contentURI = null;
//     let nft = [];
//     let ownedToken = [];

//     //console.log('Running Now Search Operation:--');
//     for (let i = 0; i < res; i++) {
//       //console.log('Iterator : ' + i);
//       try {
//         let data = await zora.fetchMediaOfOwnerByIndex(connectedWallet, i);
//         //console.log(data.toNumber());

//         ownedToken.push(data.toNumber());
//         //console.log(ownedToken);
//       } catch (error) {
//         break;
//       }
//     }
//     let obj = {};
//     for (let i = 0; i < ownedToken.length; i++) {
//       let contentURI = await zora.fetchContentURI(ownedToken[i]);

//       //console.log('CONTENTURI', i, ':', contentURI);

//       obj['contentURI'] = contentURI;

//       try {
//         let metadata = await zora.fetchMetadataURI(ownedToken[i]);
//         let res = await axios.get(metadata);
//         ////console.log("METADATA:", ownedToken[i], ":", metadata);
//         obj['title'] = res.data.name;
//         obj['description'] = res.data.description;
//         obj['mimeType'] = res.data.mimeType;
//         obj['owner'] = connectedWallet;
//         nft.push(obj);
//         ////console.log(obj);
//       } catch (error) {
//         // obj["title"] = `NFT-${ownedToken[i]}`;
//         // obj["description"] = "Description";
//         // obj["mimeType"] = null;
//         // nft.push(obj);
//       }

//       setNFT({ nfts: nft });
//     }
//   };

//   useEffect(() => {
//     // Anything in here is fired on component mount.
//     //fetchNFTList();
//     // eslint-disable-next-line
//   }, []);

//   function getMediaType(contentURI, mimeType) {
//     const mime = mimeType;
//     const uri = contentURI;
//     if (mime.split('/')[0] === 'image') {
//       return <img src={uri} alt="" className="w-50 h-50"></img>;
//     } else if (mime.split('/')[0] === 'audio') {
//       return (
//         <>
//           <ReactJkMusicPlayer glassBg audioLists={[{ src: toString(uri) }]} />
//           <ReactAudioPlayer
//             src={uri}
//             type={mimeType}
//             controls
//             className="w-full rounded bg-white"
//           />
//         </>
//       );
//     } else if (mime.split('/')[0] === 'video') {
//       return (
//         <video width="320" height="240" autoPlay muted loop>
//           <source src={uri} type={mimeType}></source>
//           Your browser does not support the video tag.
//         </video>
//       );
//     }
//   }

//   return (
//     <>
//       <div className="flex " id="tracks-section">
//         <div className="  m-5 grid grid-cols-4 w-2/3 mx-auto pt-20">
//           {nft.nfts &&
//             nft.nfts.map((nft) => {
//               return (
//                 <>
//                   <div
//                     className="bg-white shadow max-w-50 h-70 m-5 p-3 rounded-md shadow-md col-span-1 hover:scale-101 transform transition-all"
//                     key={nft.title}
//                   >
//                     {getMediaType(nft.contentURI, nft.mimeType)}
//                     <h2 className="text-black font-bold text-xl truncate">{nft.title}</h2>
//                     <p className="text-black font-bold truncate">{nft.description}</p>

//                     <p className="text-black font-semibold ">
//                       Price : {Math.floor(Math.random() * 10) + 1} ETH
//                     </p>
//                     <p className="text-black font-semibold truncate">Owned By : {nft.owner}</p>
//                   </div>
//                 </>
//               );
//             })}
//         </div>
//       </div>
//     </>
//   );
// };
// export default Form;
