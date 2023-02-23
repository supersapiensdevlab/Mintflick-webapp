import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import Market from "../artifacts/contracts/Market.sol/NFTMarket.json";
import { nftmarketaddress } from "../functions/config";
import { ethers } from "ethers";
import axios from "axios";
import { tokenConfig } from "./tokenConfig";
import { makeStorageClient } from "./uploadHelperWeb3Storage";

export let storeWithProgress = (files) => {
  console.log(files);
  // show the root cid as soon as it's ready
  const onRootCidReady = (cid) => {
    console.log("uploading files with cid:", cid);
  };

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  let uploaded = 0;

  const onStoredChunk = (size) => {
    uploaded += size;
    const pct = uploaded / totalSize;
    //console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    console.log(
      `Uploading... ${Math.min(pct * 100, 100).toFixed(2)}% complete`
    );
    let progress = Math.min(pct * 100, 100).toFixed(2);
    //setUploading(progress);
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
  provider,
  setMinting,
  setMintingProgress
) => {
  var tokenId = null;
  var biconomy = new Biconomy(provider, {
    apiKey: `${process.env.REACT_APP_BICONOMY_API}`,
  });
  console.log(provider);
  console.log(biconomy);

  const web3 = new Web3(biconomy);
  // await biconomy.init();

  // biconomy.on("txMined", (data) => {
  //   // Event emitter to monitor when a transaction is mined
  //   console.log("transaction data", data);
  // });
  // biconomy.on("txHashGenerated", (data) => {
  //   // Event emitter to monitor when a transaction hash is generated
  //   console.log("transaction data", data);
  // });
  // biconomy.on("txHashChanged", (data) => {
  //   // Event emitter to monitor when a transaction hash is changed in case of gas price bump
  //   console.log("transaction data", data);
  // });
  // biconomy.on("error", (data) => {
  //   // Event emitter to monitor when an error occurs
  //   console.log("transaction data", data);
  // });

  biconomy
    .onEvent(biconomy.READY, async () => {
      console.log("Biconomy is ready", provider, web3);
      let contract = new web3.eth.Contract(Market, nftmarketaddress);
      await contract.methods
        .createToken(url)
        .send({ from: provider.selectedAddress })
        .then(async (res) => {
          console.log("#transaction : ", res);
          tokenId = res.events.Transfer.returnValues.tokenId;
          setMinting("token created");
          setMintingProgress(33);
          console.log("#token created : ", tokenId); // token created
          await contract.methods
            .createMarketItem(
              tokenId,
              ethers.utils.parseUnits(NFTPrice.toString(), "ether")
            )
            .send({ from: provider.selectedAddress })
            .then(async (res) => {
              //   formData.append("tokenId", tokenId);
              setMinting(res.transactionHash);
              setMintingProgress(100);

              /////
              axios
                .get(
                  `${process.env.REACT_APP_SERVER_URL}/user/getLoggedInUser`,
                  tokenConfig()
                )
                .then((res) => {});
            });
        });
    })
    .onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error);
      console.log(message);
    });

  return tokenId;
};
