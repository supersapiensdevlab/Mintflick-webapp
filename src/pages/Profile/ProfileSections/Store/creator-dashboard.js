import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import NFT from '../../../../artifacts/contracts/NFT.sol/NFT.json';
import { nftaddress, nftmarketaddress } from '../config';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  // const router = useRouter();
  const darkMode = useSelector((state) => state.toggleDarkMode);
  let history = useHistory();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal({
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    history.push('/');
  }

  return (
    <div className={`${darkMode && 'dark'}  flex justify-center  `}>
      <div className="w-full flex flex-col px-5 pb-5">
        <input
          required={true}
          placeholder="Asset Name"
          className="mt-8 border rounded p-4 dark:bg-dbeats-dark-secondary dark:text-white"
          onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          required={true}
          placeholder="Asset Description"
          className="mt-2 border rounded p-4 dark:bg-dbeats-dark-secondary dark:text-white"
          onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          required={true}
          placeholder="Asset Price in MATIC"
          className="mt-2 border rounded p-4 dark:bg-dbeats-dark-secondary dark:text-white"
          onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          required={true}
          type="file"
          name="Asset"
          className="my-4 dark:text-white text-gray-900"
          onChange={onChange}
        />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-dbeats-light text-white rounded p-4 shadow-lg"
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
