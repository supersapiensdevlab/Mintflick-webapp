import { makeStorageClient } from '../component/uploadHelperFunction';
import { Biconomy } from '@biconomy/mexa';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../functions/config';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { loadUser } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import { tokenConfig } from '../helper/tokenConfig';

export let storeWithProgress = async (files) => {
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log('uploading files with cid:', cid);
  };

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = totalSize / uploaded;
    //console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    console.log(`Uploading... ${Math.min(pct * 100, 100).toFixed(2)}% complete`);
  };

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient();

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk });
};

export let createToken = async (
  url,
  NFTPrice,
  formData,
  provider,
  setMinting,
  setMintingProgress,
  setShow,
  setTokenId,
) => {
  var tokenId = null;
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
      console.log('Biconomy is ready', provider, web3);
      let contract = new web3.eth.Contract(Market, nftmarketaddress);
      await contract.methods
        .createToken(url)
        .send({ from: provider.selectedAddress })
        .then(async (res) => {
          console.log('#transaction : ', res);
          tokenId = res.events.Transfer.returnValues.tokenId;
          setMinting('token created');
          setMintingProgress(50);
          console.log('#token created : ', tokenId);
          setTokenId(tokenId);
          await contract.methods
            .createMarketItem(tokenId, ethers.utils.parseUnits(NFTPrice, 'ether'))
            .send({ from: provider.selectedAddress })
            .then(async (res) => {
              formData.append('tokenId', tokenId);
              setMinting(res.transactionHash);
              setMintingProgress(100);
              setShow(true);
            });
        });
      // transaction
      //   .on('transactionHash', function (hash) {
      //     console.log(`Transaction hash is ${hash}`);
      //     console.log(`Transaction sent. Waiting for confirmation ..`);
      //   })
      //   .once('confirmation', function (confirmationNumber, receipt) {
      //     console.log(receipt);
      //     console.log(receipt.transactionHash);
      //     setShow(true);
      //     setMinting(false);
      //     //do something with transaction hash
      //   });
    })
    .onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error);
      console.log(message);
    });

  /* next, create the item */
  //let contract = new web3.eth.Contract(Market.abi, nftmarketaddress);
  //console.log('NFT PRICE:', ethers.utils.parseUnits(NFTprice, 'ether'));

  //let event = tx.events[0];
  //let value = event.args[2];
  //let tokenId = value.toNumber();
  // {
  //   value: listingPrice,
  // }
  //transaction = await contract.createMarketItem(tokenId, price);
  //await transaction.wait();
  // props.handleCloseVideoUpload();
};
