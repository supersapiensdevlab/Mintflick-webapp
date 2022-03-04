import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';

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
      console.log('added', added);
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
      console.log('added', added);
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
    let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    let transaction = await contract.createToken(url, price);
    await transaction.wait();
    //let event = tx.events[0];
    //let value = event.args[2];
    //let tokenId = value.toNumber();
    // {
    //   value: listingPrice,
    // }
    //transaction = await contract.createMarketItem(tokenId, price);
    //await transaction.wait();
    history.push('/');
  }

  return (
    <div className={`${darkMode && 'dark'}  flex justify-center  `}>
      <div className="w-full flex flex-col px-5 pb-5">
        <div className="p-0.5 nm-flat-dbeats-dark-secondary rounded-md mt-8">
          {' '}
          <input
            required={true}
            placeholder="Asset Name"
            className=" border-0 rounded-md p-4 bg-dbeats-dark-primary dark:text-white w-full ring-0"
            onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
          />
        </div>
        <div className="p-0.5 mt-2 nm-flat-dbeats-dark-secondary rounded-md">
          <textarea
            required={true}
            placeholder="Asset Description"
            className=" border-0 rounded-md p-4 bg-dbeats-dark-primary dark:text-white w-full h-full ring-0"
            onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
          />
        </div>
        <div className="p-0.5 mt-2 nm-flat-dbeats-dark-secondary rounded-md">
          {' '}
          <input
            required={true}
            placeholder="Asset Price in MATIC"
            className="  border-0 rounded-md p-4 bg-dbeats-dark-primary dark:text-white w-full ring-0"
            onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
          />
        </div>
        <input
          required={true}
          type="file"
          name="Asset"
          className="my-4 dark:text-white text-gray-900"
          onChange={onChange}
        />
        {fileUrl && <img alt="file" className="rounded mt-4" width="350" src={fileUrl} />}
        <div className="justify-end items-end content-end">
          <div
            type="submit"
            onClick={createMarket}
            className="  transform-gpu  transition-all duration-300 ease-in-out mt-3 
                      cursor-pointer relative inline-flex items-center justify-center p-1 mb-2 
                      mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl  
                      bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  
                      nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-secondary   hover:text-white dark:text-white  "
          >
            <span
              className="relative px-5 py-2.5   
                      bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
            >
              Mint NFT
            </span>
          </div>
        </div>
        {/* <div className="rounded-full p-1 nm-flat-dbeats-dark-alt  mt-4 w-max">
          <button
            onClick={createMarket}
            className="rounded-full  font-bold  bg-dbeats-dark-secondary hover:nm-inset-dbeats-secondary-light text-white   p-4 shadow-lg w-full h-full"
          >
            Mint NFT
          </button>
        </div> */}
      </div>
    </div>
  );
}
