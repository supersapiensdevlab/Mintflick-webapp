import axios from 'axios';
import Noty from 'noty';
import React, { useEffect, useState } from 'react';
import Chips from 'react-chips';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Dropdown from '../../../dropdown.component';
import { makeStorageClient } from '../../../uploadHelperFunction';
import { chipTheme, theme } from '../Theme';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';
import { Transition } from '@headlessui/react';
import Web3 from 'web3';
import useWeb3Modal from '../../../../hooks/useWeb3Modal';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, CustomChainConfig } from '@web3auth/base';
import detectEthereumProvider from '@metamask/detect-provider';
import { useDispatch } from 'react-redux';
import { loadUser } from '../../../../actions/userActions';
import { Biconomy } from '@biconomy/mexa';

const UploadVideoModal = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.User.user);
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const attribution = ['No Attribution', 'Allow Attribution'];

  const commercialUse = ['Non Commercial', 'Commercial Use'];

  const derivativeWorks = ['No-Selection', 'No Derivative Works', 'Share-Alike'];

  const category = [
    'Autos & Vehicles',
    ' Music',
    'Pets & Animals',
    'Sports',
    'Travel & Events',
    'Gaming',
    'People & Blogs',
    'Comedy',
    'Entertainment',
    'News & Politics',
    ' Howto & Style',
    'Education',
    'Science & Technology',
    'Nonprofits & Activism',
  ];

  const suggestions = ['Games', 'Edu', 'Sci-Fi', 'Counter-Strike'];

  const [isNFT, setIsNFT] = useState(true);
  const [NFTprice, setPrice] = useState(0);

  const [selectedAttribution, setSelectedAttribution] = useState(attribution[0]);
  const [selectedCommercialUse, setSelectedCommercialUse] = useState(commercialUse[0]);
  const [selectedDerivativeWorks, setSelectedDerivativeWorks] = useState(derivativeWorks[0]);
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [uploading, setUploading] = useState(0);
  const [tags, setTags] = useState([]);

  const [videoUpload, setVideoUpload] = useState(false);
  const [videoImageUpload, setVideoImageUpload] = useState(false);
  const [warning, setWarning] = useState(null);

  const [video, setVideo] = useState({
    videoName: '',
    videoImage: '',
    videoFile: '',
    category: '',
    ratings: '',
    tags: [],
    description: '',
    allowAttribution: '',
    commercialUse: '',
    derivativeWorks: '',
  });

  const handleVideoTags = (e) => {
    setTags(e);
  };

  let name, value;

  const handleVideoInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setVideo({ ...video, [name]: value });
  };

  const handleNFT = () => {
    setIsNFT(!isNFT);
  };

  const fetchSuggestions = (value) => {
    return new Promise((resolve) => {
      if (value.length >= 1) {
        setTimeout(() => {
          let filtered = suggestions.filter(
            (opt) => opt.toLowerCase().indexOf(value.toLowerCase()) !== -1,
          );
          if (filtered.length === 0) {
            if (filtered[0] !== value) {
              let data = [value];
              resolve(data);
            }
          } else {
            resolve(filtered);
          }
        }, 1000);
      } else {
        resolve([]);
      }
    });
  };

  async function storeWithProgress() {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      //console.log('uploading files with cid:', cid);
      video.cid = cid;
    };

    const files = [video.videoFile, video.videoImage];
    const totalSize = video.videoFile.size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      setUploading(10 - pct);
      console.log(`Uploading... ${Math.min(pct * 100, 100).toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
  }

  const onVideoFileChange = (e) => {
    if (e.target.name === 'videoFile') {
      video.videoFile = e.target.files[0];

      let videoName = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('videoName').value = videoName;

      setVideo({ ...video, videoName: videoName });
      document.getElementById('video-label').textContent = videoName;
      setVideoUpload(true);
    } else if (e.target.name === 'videoImage') {
      setVideo({ ...video, videoImage: e.target.files[0] });
      let videoImage = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('video-thumbnail-label').textContent = videoImage;
      setVideoImageUpload(true);
    }
  };

  useEffect(async () => {
    setVideo({
      ...video,
      category: selectedCategory,
      allowAttribution: selectedAttribution,
      commercialUse: selectedCommercialUse,
      derivativeWorks: selectedDerivativeWorks,
      tags: tags,
    });

    // eslint-disable-next-line
  }, [selectedCategory, selectedCommercialUse, selectedDerivativeWorks, selectedAttribution, tags]);

  const PostData = async (e) => {
    e.preventDefault();
    if (!videoUpload) {
      setWarning('Please select a video');
      return;
    } else if (!videoImageUpload) {
      setWarning('Please select video thumbnail');
      return;
    } else if (video.videoName == '') {
      setWarning('Please enter a video name');
      return;
    } else {
      setWarning(null);
    }
    props.setLoader(false);
    const {
      videoName,
      videoImage,
      videoFile,
      category,
      ratings,
      tags,
      description,
      allowAttribution,
      commercialUse,
      derivativeWorks,
    } = video;
    storeWithProgress(e.target.value).then(async () => {
      var ts = Math.round(new Date().getTime() / 1000);

      //Standard Metadata supported by OpenSea
      let metadata = {
        image: 'https://ipfs.io/ipfs/' + video.cid + '/' + video.videoImage.name,

        external_url: 'https://ipfs.io/ipfs/' + video.cid + '/' + video.videoFile.name,

        description: video.description,

        name: video.videoName,

        attributes: [
          {
            display_type: 'date',
            trait_type: 'birthday',
            value: ts,
          },
          {
            trait_type: 'Category',
            value: video.category,
          },
        ],

        animation_url: 'https://ipfs.io/ipfs/' + video.cid + '/' + video.videoFile.name,
      };

      const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

      const files = [new File([blob], 'meta.json')];
      const client = makeStorageClient();
      const cid = await client.put(files);
      console.log('stored files with cid:', cid);

      console.log('meta', cid);
      let formData = new FormData(); // Currently empty
      formData.append('userName', user.username);
      formData.append('userImage', user.profile_image);

      formData.append('videoName', videoName);

      tags.forEach((tag) => formData.append('tags', tag));

      formData.append('description', description);

      formData.append('category', category);
      formData.append('ratings', ratings);
      formData.append('allowAttribution', allowAttribution);
      formData.append('commercialUse', commercialUse);
      formData.append('derivativeWorks', derivativeWorks);

      formData.append('videoFile', videoFile, videoFile.name);
      formData.append('videoImage', videoImage, videoImage.name);
      formData.append('videoHash', video.cid);

      formData.append('meta_url', cid); // meta_url is the IPFS hash of the meta.json file

      if (
        video.videoFile.length !== 0 &&
        video.videoImage.length !== 0 &&
        video.videoName.length !== 0
      ) {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/upload_video`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
              'auth-token': localStorage.getItem('authtoken'),
            },
          })
          .then(() => {
            let url = 'https://ipfs.infura.io/ipfs/' + cid + '/meta.json';
            console.log(url);
            createSale(url); //uncomment for minting NFT after video's meta.json is Uploaded to IPFS
            dispatch(loadUser());
            setVideo({
              videoName: '',
              videoImage: '',
              videoFile: '',
              category: '',
              ratings: '',
              tags: [],
              description: '',
              allowAttribution: '',
              commercialUse: '',
              derivativeWorks: '',
            });
            setUploading(0);
            props.setLoader(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        Noty.closeAll();
        new Noty({
          type: 'error',
          text: 'Choose Video File & Fill other Details',
          theme: 'metroui',
          layout: 'bottomRight',
        }).show();
      }
    });
  };

  async function createSale(url) {
    var biconomy = new Biconomy(provider, {
      apiKey: 'Ooz6qQnPL.10a08ea0-3611-432d-a7de-34cf9c44b49b',
    });
    console.log(provider);
    console.log(biconomy);

    const web3 = new Web3(biconomy);
    window.web3 = web3;
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();

    biconomy
      .onEvent(biconomy.READY, async () => {
        console.log('Biconomy is ready', user.wallet_id);
        let contract = new web3.eth.Contract(Market, nftmarketaddress);
        let transaction = await contract.methods
          .createToken(url, ethers.utils.parseUnits(NFTprice, 'ether'))
          .send({ from: user.wallet_id });
        if (transaction) {
          console.log(transaction);

          await transaction.wait();
        }
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(error);
        console.log(message);
      });

    /* next, create the item */
    //let contract = new web3.eth.Contract(Market.abi, nftmarketaddress);
    console.log('NFT PRICE:', ethers.utils.parseUnits(NFTprice, 'ether'));

    //let event = tx.events[0];
    //let value = event.args[2];
    //let tokenId = value.toNumber();
    // {
    //   value: listingPrice,
    // }
    //transaction = await contract.createMarketItem(tokenId, price);
    //await transaction.wait();
    props.handleCloseVideoUpload();
  }

  // async function createSale(url) {
  //   // const web3Modal = new Web3Modal({
  //   //   cacheProvider: true,
  //   // });

  //   const connection = await useWeb3Modal.loadWeb3Modal();

  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();

  //   /* next, create the item */
  //   let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  //   const price = ethers.utils.parseUnits(NFTprice, 'ether');

  //   let transaction = await contract.createToken(url, price);
  //   await transaction.wait();
  //   //let event = tx.events[0];
  //   //let value = event.args[2];
  //   //let tokenId = value.toNumber();
  //   // {
  //   //   value: listingPrice,
  //   // }
  //   //transaction = await contract.createMarketItem(tokenId, price);
  //   //await transaction.wait();
  //   props.handleCloseVideoUpload();

  //   //history.push('/');
  // }
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      height: '80vh',

      transform: 'translate(-50%, -50%)',
      background: '#181818',
    },
  };
  return (
    <Modal
      isOpen={props.showVideoUpload}
      style={customStyles}

      // className={
      //   darkMode
      //     ? 'h-max lg:w-max w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-secondary rounded-xl'
      //     : 'h-max lg:w-max w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
      // }
    >
      <div
        className={`${
          darkMode && 'dark'
        } px-5 py-5 lg:px-3 lg:py-3 2xl:px-5 2xl:py-5 h-max max-w-5xl mx-auto`}
      >
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg   dark:bg-dbeats-dark-secondary bg-white dark:text-white">
          <div className="col-span-4 pl-14 ">Upload Video</div>
          <div
            onClick={props.handleCloseVideoUpload}
            className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
          >
            <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
              <p className="self-center mx-2">
                {' '}
                <i className="fas fa-times"></i>{' '}
              </p>
            </span>
          </div>
        </h2>

        <form method="POST" encType="multipart/formdata">
          <div className=" bg-white text-gray-500  dark:bg-dbeats-dark-secondary dark:text-gray-100   shadow-sm rounded-lg  2xl:px-5    lg:px-2   px-2 py-2 mb-5 lg:mb-2 2xl:mb-5  max-h-full   overflow-y-auto overflow-hidden">
            <div className="md:grid md:grid-cols-3 md:gap-6  ">
              <div className="md:col-span-1  ">
                <div className="lg:mt-5 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className="flex justify-center px-6 2xl:py-6 lg:py-4 py-6 border-0 nm-inset-dbeats-dark-primary rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex justify-center text-sm text-gray-600 ">
                        <label
                          htmlFor="file-upload3"
                          className="px-2 text-center relative cursor-pointer bg-dbeats-alt rounded  font-medium text-dbeats-light hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span id="video-thumbnail-label" className="truncate w-32">
                            Choose Video Thumbnail <span className="text-red-600 text-xl">*</span>
                          </span>
                          <input
                            id="file-upload3"
                            type="file"
                            name="videoImage"
                            accept=".jpg,.png,.jpeg,.gif,.webp"
                            onChange={onVideoFileChange}
                            className="sr-only "
                            required={true}
                          />
                        </label>
                        <p className="pl-1"> </p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF</p>
                    </div>
                  </div>
                </div>
                <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className=" mt-1 flex justify-center px-6 pt-5 pb-6 border-0 nm-inset-dbeats-dark-primary rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload4"
                          className="relative cursor-pointer bg-dbeats-alt rounded px-5 font-medium text-dbeats-light hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <p className="truncate w-32 " id="video-label">
                            Choose Video file <span className="text-red-600 text-xl">*</span>
                          </p>
                          <input
                            id="file-upload4"
                            type="file"
                            accept=".mp4, .mkv, .mov, .avi"
                            name="videoFile"
                            onChange={onVideoFileChange}
                            className="sr-only "
                            required={true}
                          />
                        </label>
                        <p className="pl-1"></p>
                      </div>
                      <p className="text-xs text-gray-400">Mp4, MKV, MOV, AVI</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2">
                <div className=" sm:rounded-md  ">
                  <div className="2xl:p-5 lg:p-3 p-5  space-y-6">
                    <div className="grid grid-col-2 gap-6 ">
                      <div className="grid lg:grid-cols-3 grid-col-1 gap-6">
                        <div className="col-span-2  sm:col-span-1">
                          <div className="flex   content-center items-center align-middle">
                            <div className="flex items-center h-5">
                              <input
                                id="nftCheckbox"
                                aria-describedby="nftCheckbox"
                                type="checkbox"
                                className="cursor-pointer w-4 h-4 text-dbeats-secondary-light rounded  "
                                required
                                checked={isNFT}
                                onChange={handleNFT}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor="nftCheckbox"
                                className="font-medium text-gray-900 dark:text-gray-300"
                              >
                                Mint NFT
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                      {isNFT ? (
                        <>
                          <div className="grid lg:grid-cols-3 grid-col-6 gap-6 ">
                            <div className="col-span-2  sm:col-span-1 ">
                              <label
                                htmlFor="company-website"
                                className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                              >
                                Price in MATIC
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm nm-flat-dbeats-dark-secondary  p-0.5">
                                <input
                                  min={0.001}
                                  type="number"
                                  name="NFTPrice"
                                  id="NFTPrice"
                                  value={NFTprice}
                                  onChange={(e) => setPrice(e.target.value)}
                                  className="focus:nm-inset-dbeats-dark-primary  border-0 bg-dbeats-dark-primary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </div>
                          <div className=" col-span-6  align-middle md:flex">
                            <p className="text-xs   text-dbeats-white opacity-40 ">
                              Royalty of 10% on secondary sales will be sent to &nbsp;{' '}
                            </p>
                            <span className="text-xs  font-medium   text-dbeats-white opacity-100 justify-center align-middle">
                              {' '}
                              {user.wallet_id}
                            </span>
                          </div>
                        </>
                      ) : null}
                      <div className="col-span-1 sm:col-span-1">
                        <label
                          htmlFor="videoName"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700 "
                        >
                          Video Title <span className="text-red-600 text-xl">*</span>
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm nm-flat-dbeats-dark-secondary  p-0.5">
                          <input
                            type="text"
                            name="videoName"
                            id="videoName"
                            value={video.videoName}
                            onChange={handleVideoInputs}
                            className="focus:nm-inset-dbeats-dark-primary  border-0 bg-dbeats-dark-primary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                            placeholder=""
                            required={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                      <div className="lg:col-span-4 col-span-8 sm:col-span-4">
                        {' '}
                        <label
                          htmlFor="videoTags"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Tags
                        </label>
                        <div className="mt-1 flex border dark:border-dbeats-alt border-gray-300 rounded-md max-w-sm shadow-sm text-black">
                          <Chips
                            theme={theme({ darkMode })[0]}
                            chipTheme={chipTheme({ darkMode })[0]}
                            value={tags}
                            onChange={handleVideoTags}
                            suggestions={suggestions}
                            fromSuggestionsOnly={false}
                            fetchSuggestions={fetchSuggestions}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                        <label
                          htmlFor="company-website"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Category
                        </label>
                        <div className="  flex rounded-md shadow-sm">
                          <Dropdown
                            data={category}
                            setSelected={setSelectedCategory}
                            getSelected={selectedCategory}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label
                        htmlFor="description"
                        className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700 rounded-md"
                      >
                        Description
                      </label>
                      <div className="mt-1 nm-flat-dbeats-dark-secondary  p-0.5 rounded-md">
                        <textarea
                          id="videoDescription"
                          name="description"
                          rows={3}
                          value={video.description}
                          onChange={handleVideoInputs}
                          className="dark:placeholder-gray-600 focus:nm-inset-dbeats-dark-primary border-0  bg-dbeats-dark-primary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                          placeholder="short & sweet description of the video"
                        />
                      </div>
                    </div>

                    <div className="grid grid-col-2 gap-6  ">
                      <div className="grid lg:grid-cols-3 grid-col-1 gap-6">
                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Allow Attribution?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={attribution}
                              setSelected={setSelectedAttribution}
                              getSelected={selectedAttribution}
                            />
                          </div>
                        </div>

                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Commercial Use?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={commercialUse}
                              setSelected={setSelectedCommercialUse}
                              getSelected={selectedCommercialUse}
                            />
                          </div>
                        </div>

                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Derivative Works?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={derivativeWorks}
                              setSelected={setSelectedDerivativeWorks}
                              getSelected={selectedDerivativeWorks}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:px-4 2xl:py-3 lg:py-1 lg:text-right text-center sm:px-6 flex justify-end items-center">
            {warning && (
              <span className="mr-16 text-red-500">
                <i className="fa-solid fa-triangle-exclamation"></i> {warning}
              </span>
            )}
            <div className=" mx-5 flex items-center w-64">
              <input
                type="range"
                defaultValue={uploading}
                min="0"
                max="10"
                hidden={props.loader}
                className="appearance-none cursor-pointer w-full h-3 bg-green-400 
                font-white rounded-full slider-thumb  backdrop-blur-md"
              />
              <p className="mx-2 text-base font-medium text-white" hidden={props.loader}>
                {Math.round(uploading * 10)}%
              </p>
            </div>

            <input
              type="submit"
              onClick={PostData}
              defaultValue="Upload Video"
              className={`${
                videoUpload && videoImageUpload ? 'cursor-pointer hover:bg-dbeats-light' : ''
              } 
               flex justify-center 2xl:py-2 py-1 lg:px-5 
                px-3 2xl:text-lg rounded  border-dbeats-light border
                lg:text-md text-md my-auto font-semibold  bg-transparent
                dark:text-white `}
            ></input>
            <div
              className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
              hidden={props.loader}
            ></div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UploadVideoModal;
