import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import { nftaddress, nftmarketaddress } from '../../../../functions/config';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';

export default function Home() {
  const [nfts, setNfts] = useState([]);

  const dispatch = useDispatch();

  const provider = useSelector((state) => state.web3Reducer.provider);

  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    window.web3 = web3;

    const tokenContract = new web3.eth.Contract(Market, nftmarketaddress);
    const marketContract = new web3.eth.Contract(Market, nftmarketaddress);
    const data = await marketContract.methods.fetchMarketItems().call();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.methods.tokenURI(i.tokenId).call();
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId,
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
    const web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    window.web3 = web3;
    const contract = new web3.eth.Contract(Market, nftmarketaddress);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
    const transaction = await contract.methods.createMarketSale(nftaddress, nft.tokenId).send({
      value: price,
    });
    if (transaction) {
      console.log(transaction);

      await transaction.wait();
    }
    loadNFTs();
  }
  if (loadingState === 'loaded' && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl flex">No items in marketplace</h1>;
  return (
    <div className="flex justify-center mx-5">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} />
              <div className="p-4">
                <p style={{ height: '64px' }} className="text-2xl font-semibold">
                  {nft.name}
                </p>
                <div style={{ height: '70px', overflow: 'hidden' }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                <button
                  className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
