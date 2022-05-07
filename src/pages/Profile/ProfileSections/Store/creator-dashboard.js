import { ethers, Signer } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
//import { useRouter } from 'next/router';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import axios from 'axios';
import useWeb3Modal from '../../../../hooks/useWeb3Modal';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export default function CreateItem() {
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);

  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' });
  // const router = useRouter();
  const darkMode = useSelector((state) => state.toggleDarkMode);
  const myData = useSelector((state) => state.User.user);
  let history = useHistory();

  const handleNFTnotification = () => {
    if (myData) {
      const data = {
        username: myData.username,
        nft_image: myData.profile_image,
      };
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/nft-notification`,
        data: data,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      loadWeb3Modal();
      return;
    }
  };

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
    // const connection = await web3Modal.connect();
    console.log('provider', provider);

    const web3 = new Web3(provider);
    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);
    console.log('address', address);
    console.log('value', balance);

    /* next, create the item */
    let contract = new web3.eth.Contract(Market.abi, nftmarketaddress);
    const price = ethers.utils.parseUnits(formInput.price, 'ether');

    contract.methods
      .createToken(url, price)
      .send({ from: address })
      .on('receipt', function (receipt) {
        console.log('Transaction complete', receipt);
      });

    //let event = tx.events[0];
    //let value = event.args[2];
    //let tokenId = value.toNumber();
    // {
    //   value: listingPrice,
    // }
    //transaction = await contract.createMarketItem(tokenId, price);
    //await transaction.wait();
    handleNFTnotification();
    history.push('/');
  }

  // async function createSale(url) {
  //   const web3Modal = new Web3Modal({
  //     cacheProvider: true,
  //   });
  //   const connection = await web3Modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connection);
  //   const signer = provider.getSigner();

  //   /* next, create the item */
  //   let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
  //   const price = ethers.utils.parseUnits(formInput.price, 'ether');

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
  //   history.push('/');
  // }

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
        {fileUrl && <img alt="file" className="rounded mt-4 max-h-32 w-max" src={fileUrl} />}
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
