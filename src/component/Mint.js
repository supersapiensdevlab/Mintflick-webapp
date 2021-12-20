/* eslint-disable no-unused-vars */
//import React from "react";
// import { Contract } from "@ethersproject/contracts";
// import { getDefaultProvider } from "@ethersproject/providers";
//import env from "react-dotenv";

import { Zora } from '@zoralabs/zdk';
//import { Wallet } from 'ethers'
//import { JsonRpcProvider } from '@ethersproject/providers'
import axios from 'axios';

import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
  //fetchMetadataHash,
  //isMediaDataVerified
} from '@zoralabs/zdk';
const path = require('path');

var mime = require('mime-types');

async function mintNFT(provider, formData, file, name, description) {
  //console.log('This ran mint');

  // const signer = provider.getSigner();
  // const zora = new Zora(
  //   signer,
  //   50,
  //   '0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7', //mediaAddress
  //   '0xE5BFAB544ecA83849c53464F85B7164375Bdaac1', //marketAddress
  // );
  // //console.log(mime.lookup(path.extname(file.name)));
  // const metadata = {
  //   version: 'zora-20210101',
  //   name: name,
  //   description: description,
  //   mimeType: mime.lookup(path.extname(file.name)),
  // };

  // const minified = generateMetadata(metadata.version, metadata);

  // const metadataHash = await sha256FromBuffer(Buffer.from(minified));

  // const blob = new Blob([file], { type: mime.lookup(path.extname(file.name)) });
  // var buffer = await blob.arrayBuffer();
  // const contentHash = await sha256FromBuffer(Buffer.from(buffer));

  // //console.log(metadataHash, contentHash, 'FILE:', file.length);
  // let fileRes;
  // if (file.length !== 0) {
  //   formData.append('metadata', minified);

  //   fileRes = await axios.post('/upload-nft', formData);
  //   //console.log('fileResponse: ', fileRes);
  // }

  // const mediaData = constructMediaData(fileRes.data[0], fileRes.data[1], contentHash, metadataHash);

  // const bidShares = constructBidShares(
  //   10, // creator share
  //   90, // owner share
  //   0, // prevOwner share
  // );

  // const tx = await zora.mint(mediaData, bidShares);
  // await tx.wait(8); // 8 confirmations to finalize
  // //console.log('done', tx);

  const fs = require('fs');
  const fetch = require('node-fetch');
  const FormData = require('form-data');

  const form = new FormData();
  const fileStream = fs.createReadStream(file);
  form.append('file', fileStream);

  const options = {
    method: 'POST',
    body: form,
    headers: {
      Authorization: 'ad092d8e-feb0-4430-92f7-1fa501b83bec',
    },
  };

  fetch(
    'https://api.nftport.xyz/v0/mints/easy/files?' +
      new URLSearchParams({
        chain: 'polygon',
        name: 'orion_dbeats',
        description: 'NFT_Description',
        mint_to_address: provider.getSigner(),
      }),
    options,
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (responseJson) {
      // Handle the response
      //console.log(responseJson);
    });
}

export default mintNFT;
