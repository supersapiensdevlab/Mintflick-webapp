import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';
import NFTCard from './NFTCard';
import UserOwnedAssets from './UserOwnedAssets';
import useWeb3Modal from '../../../../hooks/useWeb3Modal';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import NFTMarket from './NFTMarket';
export default function NFTStore() {
  const [nfts, setNfts] = useState([]);
  // const [seeMore, setSeeMore] = useState(false);
  // const [nameSeeMore, setNameSeeMore] = useState(false);
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);

  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    if (!provider) loadWeb3Modal();
  }, [provider]);

  useEffect(() => {
    loadNFTs();
  }, [provider]);
  async function loadNFTs() {
    console.log(provider);

    /* create a generic provider and query for unsold market items */
    const web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    window.web3 = web3;
    //const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new window.web3.eth.Contract(Market.abi, nftmarketaddress);
    const data = await marketContract.methods.fetchMarketItems().call();
    console.log(data);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        console.log('TOKEN URI:', tokenUri);
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
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    console.log(price);

    let marketFees = await contract.getListingPrice();

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price.add(marketFees),
    });
    await transaction.wait();
    loadNFTs();
  }

  async function resellOwnedItem(nft, price) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const listingPrice = await marketContract.getListingPrice();
    const tx = await marketContract.resellToken(
      nft.tokenId,
      ethers.utils.parseUnits(price, 'ether'),
      { value: listingPrice.toString() },
    );
    await tx.wait();
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (
      <div className="h-max lg:col-span-5 col-span-6 w-full mt-20     ">
        <h1 className="   text-gray-300 w-full flex ">NFTs owned by you: </h1>
        {/* <UserOwnedAssets resellOwnedItem={resellOwnedItem}></UserOwnedAssets> */}
        <h1 className=" text-gray-300 w-full flex mt-10">No items in marketplace</h1>
      </div>
    );
  }
  return (
    <>
      <div className="h-full lg:col-span-5 col-span-6 w-full pt-20    ">
        <h1 className="   dark:text-gray-300 w-full flex   text-dbeats-dark   px-3">
          NFTs owned by you :{' '}
        </h1>
        {/* <UserOwnedAssets resellOwnedItem={resellOwnedItem}></UserOwnedAssets> */}
        <h1 className="   dark:text-gray-300 w-full flex   text-dbeats-dark   pt-5  px-3">
          Marketplace{' '}
        </h1>

        <div className="w-full   mx-auto col-span-6 lg:col-span-5 md:col-span-6 xs:col-span-6 grid grid-flow-row   xl:grid-cols-4 lg:grid-cols-3  md:grid-cols-3 grid-cols-1  gap-2 gap-x-0   sm:px-3 sm:py-5">
          {nfts ? (
            <>
              {nfts.map((nft, i) => {
                // for covalent we have to set the contract address

                if (nft && nft.name) {
                  return (
                    <div
                      key={i}
                      className=" self-center  col-span-1   rounded-lg sm:mx-2  transition-all duration-300 "
                    >
                      <NFTCard nft={nft} buyNft={buyNft} />
                      {/* <NFTMarket nft={nft}></NFTMarket> */}
                    </div>
                  );
                }
                return 0;
              })}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
