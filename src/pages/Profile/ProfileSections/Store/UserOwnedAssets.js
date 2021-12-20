import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import maticLogo from '../../../../assets/graphics/polygon-matic-logo.svg';

import { nftmarketaddress, nftaddress } from '../config';

import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import dbeatsLogoBnW from '../../../../assets/images/Logo/logo-blacknwhite.png';
import { Image } from 'react-img-placeholder';

const MyAssets = ({ resellOwnedItem }) => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [seeMore, setSeeMore] = useState(false);
  const [nameSeeMore, setNameSeeMore] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      }),
    );
    setNfts(items);
    setLoadingState('loaded');
  }
  if (loadingState === 'loaded' && !nfts.length)
    return (
      <h1 className="py-10 px-10   sm:px-10 sm:mt-2 sm:mx-2    text-white opacity-25">
        No assets owned
      </h1>
    );
  return (
    <div className="flex   min-w-full  ">
      <div className="sm:mt-2 sm:mx-2">
        <div className="w-full    dark:bg-gradient-to-b dark:from-dbeats-dark-primary dark:to-dbeats-dark-primary mx-auto col-span-6 lg:col-span-5 md:col-span-6 xs:col-span-6 grid grid-flow-row   xl:grid-cols-4 lg:grid-cols-3  md:grid-cols-3 grid-cols-1 gap-2 sm:gap-4 sm:p-3">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="dark:bg-gradient-to-b min-h-full  shadow-md  hover:border-gray-500 dark:from-dbeats-dark-secondary dark:to-dbeats-dark-secondary  dark:hover:bg-gradient-to-b  dark:hover:from-green-400 dark:hover:via-dbeats-dark-secondary  dark:hover:to-dbeats-dark-alt sm:hover:scale-101 transform   bg-gradient-to-b from-white to-white dark:hover:bg-opacity-10 hover:bg-opacity-90 hover:bg-gradient-to-b hover:from-white hover:via-blue-50 hover:to-green-50   group  backdrop-blur-2xl  backdrop-filter dark:hover:backdrop-blur-2xl  dark:hover:backdrop-filter    hover:shadow-md cursor-pointer    sm:rounded-lg flex flex-col items-center justify-center transition-all duration-200 ease-in-out"
            >
              <div className="relative sm:mt-2 sm:mx-2 ">
                <div className=" h-full w-full max-h-100 lg:h-56    sm:rounded-md overflow-hidden">
                  <Image
                    src={nft.image}
                    height={200}
                    width={200}
                    className="object-cover  h-full w-full"
                    alt={nft.name}
                    placeholderSrc={dbeatsLogoBnW}
                  />
                </div>

                <div className="absolute bottom-0 left-0 -mb-4 ml-3 flex flex-row">
                  <div className="h-10 w-10 flex items-center justify-center text-xl bg-white dark:bg-dbeats-dark-secondary  bg-opacity-20 dark:bg-opacity-10 dark:hover:bg-opacity-80  dark:backdrop-blur-md  backdrop-filter hover:bg-opacity-25  backdrop-blur-md hover:text-red-500 text-white   rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="h-10 w-max ml-2 px-2 bg-white dark:bg-dbeats-dark-secondary bg-opacity-20  dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-80 dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md hover:bg-dbeats-light    grad flex items-center justify-center font-medium text-white hover:text-white rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                    </svg>
                    <span className="group-hover:text-white text-white ml-2"></span>
                  </div>
                  <div
                    onClick={() => resellOwnedItem(nft, '0.069')}
                    className="h-10 w-max ml-2 px-2 bg-white dark:bg-dbeats-dark-secondary bg-opacity-20  dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-80 dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md hover:bg-dbeats-light    grad flex items-center justify-center font-medium text-white hover:text-white rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out group"
                  >
                    <span className="group-hover:text-white text-white mx-1 flex group ">
                      {nft.price}{' '}
                      <img
                        className="h-5 w-5 ml-1 text-white self-center align-middle items-center"
                        src={maticLogo}
                      ></img>
                    </span>
                  </div>
                  {/* <!-- Component Start --> */}

                  {/* <!-- Component End  --> */}
                </div>
              </div>
              <div className="pt-10 pb-6 w-full px-4" style={{ minHeight: '145px' }}>
                <h1 className="font-medium leading-none text-base tracking-wider text-gray-900 dark:text-white">
                  <p
                    className={`${!nameSeeMore ? 'line-clamp-2' : ''} mr-2 mt-1 `}
                    style={{ wordBreak: 'break-words' }}
                  >
                    {nft.name.split('\n').map(function (item) {
                      return (
                        <>
                          {item}
                          <br />
                        </>
                      );
                    })}
                  </p>
                  {nft.name.split(/\r\n|\r|\n/).length > 2 ? (
                    <p
                      className="cursor-pointer text-md hover:underline text-gray-600  "
                      onClick={() => setNameSeeMore(!nameSeeMore)}
                    >
                      {nameSeeMore ? '...see less' : '...see more'}
                    </p>
                  ) : null}
                </h1>

                {/* {nft.description} */}
                {nft.description ? (
                  <div className=" leading-none text-base tracking-wider text-gray-900 dark:text-gray-200 mt-2">
                    <p
                      className={`${!seeMore ? 'line-clamp-2' : ''} mr-2`}
                      style={{ wordBreak: 'break-words' }}
                    >
                      {nft.description.split('\n').map(function (item) {
                        return (
                          <>
                            {item}
                            <br />
                          </>
                        );
                      })}
                    </p>
                    {nft.description.split(/\r\n|\r|\n/).length > 2 ? (
                      <p
                        className="cursor-pointer text-md hover:underline text-gray-600 mt-2"
                        onClick={() => setSeeMore(!seeMore)}
                      >
                        {seeMore ? '...see less' : '...see more'}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyAssets;
