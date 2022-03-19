import React from 'react';

import { NFTStorage, File } from 'nft.storage';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';
import { ethers, Signer } from 'ethers';

const apiKey =
  process.env.NFT_STORAGE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQzZWU1Nzc4OTI0MjJCOWZGNzNENDk5ODk1REE1MGU5Y2M4MWFGRUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MzgzMDM2NzEyMCwibmFtZSI6ImRiZWF0cy10ZXN0In0.ZtXseweUR_nIpa5jvM0gwPl67t1Wb5s0RjOwJuye9J8';
const client = new NFTStorage({ token: apiKey });

export const PictureModal = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  async function createSale() {
    const torus = new Torus({
      buttonPosition: 'bottom-left', // customize position of torus icon in dapp
    });
    window.torus = torus;

    //const user = await window.torus.getUserInfo(); // user profile info (email address etc)
    if (!torus.isInitialized)
      if (!torus.isLoggedIn)
        // await torus.init({
        //   enableLogging: true,
        //   network: {
        //     host: 'matic', // mandatory https://rpc-mumbai.maticvigil.com
        //     networkName: 'Matic Mainnet', // optional
        //     chainId: '137',
        //     blockExplorer: 'https://polygonscan.com/',
        //     ticker: 'MATIC',
        //     tickerName: 'MATIC',
        //   },

        //   whiteLabel: {
        //     theme: {
        //       isDark: true,
        //       colors: {
        //         torusBrand1: '#282c34',
        //       },
        //     },
        //     logoDark: 'https://tkey.surge.sh/images/Device.svg', // Dark logo for light background
        //     logoLight: 'https://tkey.surge.sh/images/Device.svg', // Light logo for dark background
        //     topupHide: false,
        //     featuredBillboardHide: true,
        //     disclaimerHide: true,
        //     defaultLanguage: 'en',
        //   },
        // });
        await torus.login();

    const user = await window.torus.getUserInfo(); // user profile info (email address etc)

    const web3 = new Web3(window.torus.provider);

    const address = (await web3.eth.getAccounts())[0];
    const balance = await web3.eth.getBalance(address);

    await web3.eth.getAccounts((error, accounts) => {
      console.log(error, accounts);
      if (error) throw error;

      web3.eth.sendTransaction(
        {
          to: '0x2ab2Ce5e3830d1d212009e57ec74BB0B1A51Ab3e',
          from: accounts[0],
          value: 10000000000000000,
          gas: 21000,
          maxFeePerGas: 250,
          maxPriorityFeePerGas: 2,
        },
        (error, txnHash) => {
          console.log(error, txnHash);
          if (error) throw error;
          console.log(txnHash);
        },
      );
      // web3.eth.sendTransaction(txnParams, (error, txnHash) => {
      //   console.log(error, txnHash);
      //   if (error) throw error;
      //   console.log(txnHash);
      // });
    });

    // const address = (await web3.eth.getAccounts())[0];
    // const balance = await web3.eth.getBalance(address);
  }

  return (
    <>
      <div className={`${darkMode && 'dark'}`}>
        <Modal
          isOpen={props.showPictureModal}
          className={
            darkMode
              ? 'h-max lg:w-max w-96 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-primary dark:bg-dbeats-dark-secondary rounded-xl'
              : 'h-max lg:w-max   mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
          }
        >
          <div className="modal-overlay">
            <label className="bg-dbeats-light flex items-center text-white font-bold px-5 py-2 rounded-lg cursor-pointer">
              <input type="button" style={{ display: 'none' }} onClick={createSale} />
              Select File to Upload
            </label>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PictureModal;

// ipfs://bafyreib4pff766vhpbxbhjbqqnsh5emeznvujayjj4z2iu533cprgbz23m/metadata.json
