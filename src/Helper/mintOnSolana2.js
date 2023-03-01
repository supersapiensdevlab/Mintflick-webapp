import axios from "axios";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import { decode } from "bs58";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useState } from "react";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const signTransactionKeyWallet = async (
  encodedTransaction,
  fromPrivateKey,
  provider
) => {
  try {
    console.log(fromPrivateKey);

    const feePayer = Keypair.fromSecretKey(decode(fromPrivateKey));
    console.log(feePayer);
    const solanaWallet = new SolanaWallet(provider); // web3auth.provider
    console.log(solanaWallet);

    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
    console.log(recoveredTransaction);
    recoveredTransaction.partialSign(feePayer);
    // const serializedTransaction = recoveredTransaction.serialize({
    //   requireAllSignatures: false,
    // });
    // const transactionBase64 = serializedTransaction.toString("base64");
    // console.log(transactionBase64);
    //partially signing using private key of fee_payer wallet

    const signedTx = await provider.signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
    console.log(signedTx);
    const confirmTransaction = await connection.sendRawTransaction(
      signedTx.serialize()
    );
    return confirmTransaction;
  } catch (error) {
    console.log(error);
  }
};

export const signTransactionWithWallet = async (
  encodedTransaction,
  provider
) => {
  let confirmTransaction;
  // try {
  // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  // const solanaWallet = new SolanaWallet(provider); // web3auth.provider
  // console.log(solanaWallet);

  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, "base64")
  );
  console.log(recoveredTransaction);
  // const signedTx = provider.isPhantom
  //   ? await provider.signTransaction(recoveredTransaction)
  //   : await provider.signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
  const signedTx = await provider.signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
  console.log(signedTx);

  // const confirmTransaction = await connection.sendRawTransaction(
  //   signedTx.serialize()
  // );

  confirmTransaction = signedTx
    .serialize({ requireAllSignatures: false })
    .toString("base64");

  console.log(confirmTransaction);
  // } catch (error) {
  //   console.log(error);
  // }
  return confirmTransaction;
};

export const signWithRelayer = async (signedTx) => {
  var myHeaders = new Headers();
  myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);
  myHeaders.append("Content-Type", "application/json");
  let response;
  var raw = JSON.stringify({
    network: "devnet",
    encoded_transaction: signedTx,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  await fetch("https://api.shyft.to/sol/v1/txn_relayer/sign", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      response = result;
    });

  return JSON.parse(response);
};

export const mintNFTOnSolana2 = async (
  creator_wallet,
  name,
  description,
  external_url,
  image
) => {
  let nftSolanaData = {
    network: "devnet",
    creator_wallet: creator_wallet,
    name: name,
    symbol: "FLICK",
    attributes: JSON.stringify([{ trait_type: "Power", value: "100" }]),
    description: description,
    external_url: external_url,
    max_supply: 1,
    fee_payer: process.env.REACT_APP_FEEPAYER_WALLET,
    royalty: 5,
    image: image,
  };
  console.log(nftSolanaData);

  const res = await axios
    .post(`https://api.shyft.to/sol/v2/nft/create`, nftSolanaData, {
      headers: {
        "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
        "content-type": "multipart/form-data",
      },
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(res);
  return res;
};

export const listNFTOnSolana2 = async (nft_address, price, seller_wallet) => {
  let response;
  var raw = JSON.stringify({
    network: "devnet",
    marketplace_address: process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS,
    nft_address: nft_address,
    price: parseInt(price),
    // fee_payer: `B6rhE5Zpu2gfe8YnJSa4jVoyWqDTqBcEJbDa5JawyYdG`,
    seller_wallet: seller_wallet,
  });

  console.log(raw);
  await axios
    .post(`https://api.shyft.to/sol/v1/marketplace/list_gasless`, raw, {
      headers: {
        "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
        "content-type": "application/json",
      },
    })
    .then((res) => {
      response = res;
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
};

export const buyNFTOnSolana2 = (buyNftData, provider) => {
  axios
    .post(`https://api.shyft.to/sol/v1/marketplace/buy`, buyNftData, {
      headers: {
        "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
        "content-type": "application/json",
      },
    })
    .then(async (data) => {
      console.log(data);
      // await signTransaction(
      //   // "devnet",
      //   data.data.result.encoded_transaction,
      //   "vXJQfc7wgeY7gwyBrfkjQz5VKQd2Dy2E5Psoj5LusaJwxukC5tuLQgUxxZTnoN2fSjG1zHyF45XCA8nz8VK94Tg"
      // );
      const signedTrasaction = await signTransactionWithWallet(
        data.data.result.encoded_transaction,
        provider
      );
      console.log(signedTrasaction);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      await connection.sendRawTransaction(signedTrasaction.serialize());
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
