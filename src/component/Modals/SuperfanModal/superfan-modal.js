import { Web3Provider } from '@ethersproject/providers';
import SuperfluidSDK from '@superfluid-finance/js-sdk';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

import dbeatsLogoBnW from '../../../assets/images/Logo/logo-blacknwhite.png';

import maticLogo from '../../../assets/graphics/polygon-matic-logo.svg';

import { Image } from 'react-img-placeholder';

import validateTransaction from './validate';
import transakSDK from '@transak/transak-sdk';

const SuperfanModal = ({ show, handleClose, userDataDetails }) => {
  const provider = useSelector((state) => state.web3Reducer.provider);
  var Web3HttpProvider = require('web3-providers-http');
  let transak = new transakSDK({
    apiKey: '792b8161-1aeb-4341-a553-894611bfc51f', // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    hostURL: window.location.origin,
    widgetHeight: '625px',
    widgetWidth: '500px',
    // Examples of some of the customization parameters you can pass
    defaultCryptoCurrency: 'MATIC', // Example 'ETH'
    walletAddress: provider ? provider.selectedAddress : '', // Your customer's wallet address
    themeColor: '#1c1c1c', // App theme color
    fiatCurrency: '', // If you want to limit fiat selection eg 'USD'
    email: '', // Your customer's email address
    redirectURL: '',
  });

  // To get all the events
  transak.on(transak.ALL_EVENTS, (data) => {
    console.log(data);
  });

  // This will trigger when the user marks payment is made.
  transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    console.log(orderData);
    transak.close();
  });
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [showBuyCrypto, setShowBuyCrypto] = useState(false);
  const buyCrypto = () => {
    //setShowBuyCrypto(!showBuyCrypto);
    transak.init();
  };

  const [showRecurring, setShowRecurring] = useState(false);
  const toggleRecurring = () => setShowRecurring(!showRecurring);

  const [txInitiated, settxInitiated] = useState(false);
  const [txSuccess, settxSuccess] = useState(false);
  const [currentBlockNumber, setcurrentBlockNumber] = useState(null);
  const [minimumBlockConfirmations] = useState(25);

  const testFlow = async (amount) => {
    const walletAddress = await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    const sf = new SuperfluidSDK.Framework({
      ethers: new Web3Provider(window.ethereum),
    });
    await sf.initialize();

    const carol2 = sf.user({
      address: walletAddress[0],

      // fDAIx token, which is a test Super Token on Goerli network  0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00
      //MATICx Tokens 0x96B82B65ACF7072eFEb00502F45757F254c2a0D4
      token: '0x96B82B65ACF7072eFEb00502F45757F254c2a0D4',
    });
    let finalAmount = 385802469135 * amount;
    await carol2.flow({
      recipient: '0x7095b5921592D02C446C2C7bEF145D441Ab270ff',
      // This flow rate is equivalent to 1 tokens per month, for a token with 18 decimals.
      flowRate: finalAmount.toString(),
    });

    //const details = await carol2.details();
    //console.log(details.cfa.flows.outFlows[0]);
  };
  const Web3 = require('web3');

  const ethEnabled = async () => {
    if (provider) {
      return true;
    }
    console.log('web3 not enabled');

    return false;
  };

  var initialHash = [];
  const handleDonation = async (amount) => {
    settxInitiated(false);
    settxSuccess(false);
    setcurrentBlockNumber(null);

    const donationAmountInWei = amount * 1e18;

    if (ethEnabled) {
      var web3 = new Web3(provider);
      var accounts = await web3.eth.getAccounts();
      window.web3 = web3;
      const transactionParameters = {
        nonce: '0x00', // ignored by MetaMask
        // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
        // gas: '0x2710', // customizable by user during MetaMask confirmation.
        to: userDataDetails.wallet_id, // Required except during contract publications.
        from: accounts[0], // must match user's active address.
        //value: Number(donationAmountInWei).toString(16), // Only required to send ether to the recipient from the initiating external account.
        value: donationAmountInWei,
        //data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
        // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };
      console.log(accounts[0]);

      console.log('Amount in wei', donationAmountInWei);
      console.log('Amount in HexaDecimal', Number(donationAmountInWei).toString(16));

      // txHash is a hex string
      // As with any RPC call, it may throw an error
      // const txHash = await window.ethereum.request({
      //   method: 'eth_sendTransaction',
      //   params: [transactionParameters],
      // });

      await window.web3.eth.sendTransaction(transactionParameters, (error, txnHash) => {
        if (error) throw error;
        console.log(txnHash);
        initialHash = txnHash;
      });
      ////////////////////////////////////////////////////////////////////////////////

      // Instantiate subscription object
      const subscription = window.web3.eth.subscribe('newBlockHeaders');
      // Subscribe to pending transactions
      subscription
        .subscribe((error, result) => {
          if (error) console.log(error, result);
        })
        .on('data', async (data) => {
          try {
            console.log('Transaction hash is: ' + data['hash'] + '\n');
            settxInitiated(true);
            // Initiate transaction confirmation
            confirmEtherTransaction(data['hash']);

            // Unsubscribe from pending transactions.
            subscription.unsubscribe();
          } catch (error) {
            console.log(error);
          }
        });

      ////////////////////////////////////////////////////////////////////////////////
    }

    async function getConfirmations(txHash) {
      try {
        // Instantiate web3 with HttpProvider
        const web3 = new Web3(window.ethereum);

        console.log('Getting transaction details with Hash', initialHash);
        // Get transaction details
        const trx = await window.web3.eth.getTransactionReceipt(initialHash);
        console.log('User Transaction has a blockNumber', trx['blockNumber']);

        console.log('Getting current block number');

        // Get current block number
        const currentBlock = await window.web3.eth.getBlockNumber().then((blockNumber) => {
          console.log('Current block number is: ' + blockNumber);
          return blockNumber;
        });

        // When transaction is unconfirmed, its block number is null.
        // In this case we return 0 as number of confirmations
        return trx['blockNumber'] === null ? 0 : currentBlock - trx['blockNumber'];
      } catch (error) {
        console.log(error);
      }
    }

    function confirmEtherTransaction(txHash, confirmations = minimumBlockConfirmations) {
      setTimeout(async () => {
        console.log('Initiating transaction confirmation');
        // Get current number of confirmations and compare it with sought-for value
        const trxConfirmations = await getConfirmations(txHash);

        console.log(
          'Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)',
        );
        setcurrentBlockNumber(trxConfirmations);
        if (trxConfirmations >= confirmations) {
          // Handle confirmation event according to your business logic

          console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');
          settxSuccess(true);
          return;
        }
        // Recursive call
        return confirmEtherTransaction(txHash, confirmations);
      }, 5 * 1000);
    }
  };

  return (
    <Modal
      isOpen={show}
      className={`${darkMode && 'dark'}   mx-auto    mt-32 shadow w-max`}
      ariaHideApp={false}
    >
      {userDataDetails && (
        <div className={`   mx-auto  bg-white dark:bg-dbeats-dark-primary w-max px-12`}>
          <h2
            className="grid grid-cols-5 justify-items-center 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2   text-center relative 
bg-white dark:bg-dbeats-dark-primary    "
          >
            <div className="col-span-5    text-gray-900 dark:text-gray-100 font-bold">SUPERFAN</div>
            <div
              className="ml-5 cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-primary absolute right-10 top-5"
              onClick={handleClose}
            >
              <i className="fas fa-times"></i>
            </div>
          </h2>

          <div>
            <Container className="  px-4 pb-4    dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary">
              <div className="flex items-center justify-center w-full mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="mr-3 text-gray-700 dark:text-dbeats-white  font-medium ">
                    One Time
                  </div>

                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggleB"
                      className="sr-only"
                      onClick={toggleRecurring}
                    />

                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>

                  <div className="ml-3 text-gray-700 dark:text-dbeats-white  font-medium">
                    Recurring
                  </div>
                </label>
              </div>{' '}
              {/* 
    <button
      onClick={handleCloseSubscriptionModal}
      className=" block text-center col-span-1 px-5 w-full  mx-auto p-2 mt-4 mb-2  text-dbeats-light font-semibold rounded-lg border  border-dbeats-light hover:border-white hover:text-white hover:bg-dbeats-dark-secondary transition-all transform hover:scale-95"
    >
      Cancel
    </button> */}
              {!showBuyCrypto ? (
                userDataDetails.superfan_data && showRecurring ? (
                  <p className="font-bold text-dbeats-light text-lg text-center self-center">
                    COMING SOON!
                  </p>
                ) : (
                  //Enable this when you want to stream payment using Superfluid
                  /*   {<div className="grid grid-cols-3 2xl:gap-4 lg:gap-2 w-full   self-center">
          <button
            onClick={() => testFlow(footerData.superfan_data.price)}
            className="block shadow text-center col-span-1  bg-white   dark:bg-dbeats-dark-alt text-black dark:text-white  
             2xl:w-max w-max px-5 lg:w-60  mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-white dark:hover:border-dbeats-light rounded hover:border-dbeats-light hover:shadow-none 
             transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
          >
            <span className="font-bold 2xl:text-2xl lg:text-sm">
              {footerData.superfan_data.price} MATICx
            </span>

            <span className="  lg:text-sm">/per second</span>
            <br></br>

            <p className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
              {footerData.superfan_data.perks}
            </p>
          </button>
          <button
            onClick={() => testFlow(footerData.superfan_data.price2)}
            className="  shadow text-center col-span-1     bg-white dark:bg-dbeats-dark-alt text-black dark:text-white  
           2xl:w-max w-max px-5 lg:w-60  mx-auto py-2        font-semibold   border border-dbeats-light dark:border-dbeats-white dark:hover:border-dbeats-light rounded hover:border-dbeats-light hover:shadow-none 
           transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
          >
            <span className="font-bold 2xl:text-2xl lg:text-sm">
              {footerData.superfan_data.price2} MATICx
            </span>

            <span className="  lg:text-sm">/per second</span>
            <br></br>
            <span className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
              {footerData.superfan_data.perks2}
            </span>
          </button>
          <button
            onClick={() => testFlow(footerData.superfan_data.price3)}
            className="block shadow text-center col-span-1 bg-white dark:bg-dbeats-dark-alt text-black dark:text-white  
             2xl:w-max w-max px-5 lg:w-60  mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-white dark:hover:border-dbeats-light rounded hover:border-dbeats-light hover:shadow-none 
             transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
          >
            <span className="font-bold 2xl:text-2xl lg:text-sm">
              {footerData.superfan_data.price3} MATICx
            </span>

            <span className="  lg:text-sm">/per second</span>
            <br></br>

            <span className="2xl:text-sm lg:text-xs font-thin text-gray-800 dark:text-gray-300">
              {footerData.superfan_data.perks3}
            </span>
          </button>
        </div> }*/
                  <div className="grid grid-cols-3 gap-4    self-center mx-5">
                    <div
                      className="w-52 h-max dark:border-dbeats-light border dark:border-opacity-40 
          dark:bg-dbeats-dark-secondary rounded-lg p-4 mt-5"
                    >
                      <p className="font-bold text-lg text-center text-dbeats-light">
                        {userDataDetails.superfan_data && userDataDetails.superfan_data.plan
                          ? userDataDetails.superfan_data.plan
                          : 'Lite'}
                      </p>

                      <Image
                        src={
                          userDataDetails.superfan_data && userDataDetails.superfan_data.planImage
                            ? userDataDetails.superfan_data.planImage
                            : dbeatsLogoBnW
                        }
                        height={80}
                        width={80}
                        className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1"
                        alt=""
                        placeholderSrc={dbeatsLogoBnW}
                      />
                      <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                        <>
                          <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                          <p className=" text-3xl font-bold   text-center dark:text-dbeats-white">
                            {userDataDetails.superfan_data && userDataDetails.superfan_data.price}
                          </p>
                        </>
                      </div>
                      <button
                        onClick={() =>
                          handleDonation(
                            userDataDetails.superfan_data && userDataDetails.superfan_data.price,
                          )
                        }
                        className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
             2xl:w-max w-max px-5 mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
             transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                      >
                        <span className="font-semibold text-md px-4 ">Join</span>
                      </button>
                      <p className="  text-gray-800 dark:text-gray-300 mt-4">
                        {userDataDetails.superfan_data && userDataDetails.superfan_data.perks}
                      </p>
                    </div>
                    <div className="bg-dbeats-light  rounded-lg">
                      <p className="dark:text-white p-2 text-center mx-auto font-semibold">
                        Most Popular
                      </p>
                      <div
                        className="w-52 h-max  dark:border-dbeats-light border dark:border-opacity-40 
          dark:bg-dbeats-dark-secondary rounded-lg p-4"
                      >
                        <p className="font-bold text-lg text-center text-dbeats-light">
                          {userDataDetails.superfan_data && userDataDetails.superfan_data.plan2
                            ? userDataDetails.superfan_data.plan2
                            : 'Lite'}
                        </p>

                        <Image
                          src={
                            userDataDetails.superfan_data && userDataDetails.superfan_data.planImage
                              ? userDataDetails.superfan_data.planImage
                              : dbeatsLogoBnW
                          }
                          height={80}
                          width={80}
                          className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1"
                          alt=""
                          placeholderSrc={dbeatsLogoBnW}
                        />
                        <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                          <>
                            <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                            <p className=" text-3xl font-bold   text-center dark:text-dbeats-white">
                              {userDataDetails.superfan_data &&
                                userDataDetails.superfan_data.price2}
                            </p>
                          </>
                        </div>
                        <button
                          onClick={() =>
                            handleDonation(
                              userDataDetails.superfan_data && userDataDetails.superfan_data.price2,
                            )
                          }
                          className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
             2xl:w-max w-max px-5   mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
             transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                        >
                          <span className="font-semibold text-md px-4 ">Join</span>
                        </button>
                        <p className="  text-gray-800 dark:text-gray-300 mt-4">
                          {userDataDetails.superfan_data && userDataDetails.superfan_data.perks2}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-52 h-max self-center dark:border-dbeats-light border dark:border-opacity-40 
          dark:bg-dbeats-dark-secondary rounded-lg p-4"
                    >
                      <p className="font-bold text-lg text-center text-dbeats-light">
                        {userDataDetails.superfan_data && userDataDetails.superfan_data.plan3
                          ? userDataDetails.superfan_data.plan3
                          : 'Lite'}
                      </p>

                      <Image
                        src={
                          userDataDetails.superfan_data && userDataDetails.superfan_data.planImage
                            ? userDataDetails.superfan_data.planImage
                            : dbeatsLogoBnW
                        }
                        height={80}
                        width={80}
                        className="object-cover  h-24 w-24 mx-auto rounded-full  mt-1"
                        alt=""
                        placeholderSrc={dbeatsLogoBnW}
                      />
                      <div className=" flex text-2xl font-bold mx-auto justify-center  text-center mt-3 mb-2">
                        <>
                          <img className="h-6 w-6 self-center mr-1" src={maticLogo}></img>
                          <p className=" text-3xl font-bold   text-center dark:text-dbeats-white">
                            {userDataDetails.superfan_data && userDataDetails.superfan_data.price3}
                          </p>
                        </>
                      </div>
                      <button
                        onClick={() =>
                          handleDonation(
                            userDataDetails.superfan_data && userDataDetails.superfan_data.price3,
                          )
                        }
                        className="rounded-full block shadow text-center col-span-1  bg-white dark:bg-dbeats-dark-primary text-black dark:text-white  
             2xl:w-max w-max px-5   mx-auto py-2      font-semibold   border border-dbeats-light dark:border-dbeats-light dark:hover:border-dbeats-light  hover:border-dbeats-light hover:shadow-none 
             transition-all transform hover:scale-99 hover:bg-dbeats-light dark:hover:bg-dbeats-light hover:text-white "
                      >
                        <span className="font-semibold text-md px-4 ">Join</span>
                      </button>
                      <p className="  text-gray-800 dark:text-gray-300 mt-4">
                        {userDataDetails.superfan_data && userDataDetails.superfan_data.perks3}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                ''
              )}
              <button
                className="group text-center flex shadow hover:shadow-none   hover:border-purple-700 hover:border border border-transparent hover:scale-99  
      transition-all duration-200 transform  bg-white px-4 py-2 mb-2 self-center align-middle text-purple-700  rounded font-semibold mt-4 mx-auto"
                onClick={buyCrypto}
              >
                {!showBuyCrypto ? (
                  <>
                    Buy MATIC
                    <img
                      className="h-5 w-h-5 ml-1 mr-1 self-center align-middle items-center group-hover:bg-white  group-hover:text-white"
                      src={maticLogo}
                      alt="logo"
                    ></img>
                  </>
                ) : (
                  'Back'
                )}
              </button>
              {showBuyCrypto ? (
                <iframe
                  src="https://buy.moonpay.com/?apiKey=[your_api_key]"
                  allow="accelerometer; autoplay; camera; gyroscope; payment"
                  width="100%"
                  height="400px"
                  frameBorder="0"
                ></iframe>
              ) : (
                ''
              )}
              {txInitiated && !txSuccess && currentBlockNumber === null ? (
                <p className="dark:text-dbeats-light text-center">Transaction Initiated...</p>
              ) : txInitiated && currentBlockNumber < minimumBlockConfirmations && !txSuccess ? (
                <p className="dark:text-dbeats-light text-center">
                  Waiting for {minimumBlockConfirmations - currentBlockNumber} of{' '}
                  {minimumBlockConfirmations} Block confirmations
                </p>
              ) : txSuccess ? (
                <p className="dark:text-dbeats-light text-center">Transaction Successfull</p>
              ) : (
                ''
              )}
            </Container>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SuperfanModal;
