import axios from "axios";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import { decode } from "bs58";
import { SolanaWallet } from "@web3auth/solana-provider";
import { clusterUrl } from "../Componants/Home/Utility/utilityFunc";

const rpcUrl = clusterUrl(process.env.REACT_APP_SOLANA_NETWORK);

const connection = new Connection(rpcUrl, "confirmed");

export const signTransactionWithKey = async (
  encodedTransaction,
  fromPrivateKey
) => {
  const feePayer = Keypair.fromSecretKey(decode(fromPrivateKey));
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

  console.log(recoveredTransaction.serialize().toString("base64"));
  const base64Txn = recoveredTransaction.serialize().toString("base64");

  const confirmTransaction = await connection.sendEncodedTransaction(base64Txn);
  // const confirmTransaction = await sendTransaction(
  //   signedTx.serialize().toString("base64")
  // );
  return confirmTransaction;
};

export const signTransactionKeyWallet = async (
  encodedTransaction,
  fromPrivateKey,
  provider
) => {
  const feePayer = Keypair.fromSecretKey(decode(fromPrivateKey));
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
  const encodedSignedTx = signedTx.serialize().toString("base64");
  console.log(signedTx.serialize().toString("base64"));
  const base64Txn = signedTx.serialize().toString("base64");
  const confirmTransaction = await connection.sendEncodedTransaction(base64Txn);
  // const confirmTransaction = await sendTransaction(
  //   signedTx.serialize().toString("base64")
  // );

  return confirmTransaction;
};

export const signTransactionWithWallet = async (
  encodedTransaction,
  provider
) => {
  let confirmTransaction;
  // try {
  // const connection = new Connection(clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK), "confirmed");
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

  confirmTransaction = await signedTx
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
    network: process.env.REACT_APP_SOLANA_NETWORK,
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
  image,
  attributes,
  collection_address,
  service_charge
) => {
  let nftSolanaData = collection_address
    ? {
        network: process.env.REACT_APP_SOLANA_NETWORK,
        creator_wallet: creator_wallet,
        max_supply: 0,
        name: name,
        symbol: "FLICK",
        attributes: JSON.stringify(attributes),
        description: description,
        external_url: external_url,
        fee_payer: process.env.REACT_APP_FEEPAYER_WALLET,
        royalty: 5,
        image: image,
        collection_address: collection_address,
        service_charge: service_charge,
      }
    : {
        network: process.env.REACT_APP_SOLANA_NETWORK,
        creator_wallet: creator_wallet,
        name: name,
        symbol: "FLICK",
        max_supply: 0,
        attributes: JSON.stringify(attributes),
        description: description,
        external_url: external_url,
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
    network: process.env.REACT_APP_SOLANA_NETWORK,
    marketplace_address: process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS,
    nft_address: nft_address,
    price: parseInt(price),
    // fee_payer: `B6rhE5Zpu2gfe8YnJSa4jVoyWqDTqBcEJbDa5JawyYdG`,
    seller_wallet: seller_wallet,
  });

  console.log(raw);
  await axios
    .post(`https://api.shyft.to/sol/v1/marketplace/list`, raw, {
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
      //   // process.env.REACT_APP_SOLANA_NETWORK,
      //   data.data.result.encoded_transaction,
      //   "vXJQfc7wgeY7gwyBrfkjQz5VKQd2Dy2E5Psoj5LusaJwxukC5tuLQgUxxZTnoN2fSjG1zHyF45XCA8nz8VK94Tg"
      // );
      const signedTrasaction = await signTransactionWithWallet(
        data.data.result.encoded_transaction,
        provider
      );
      console.log(signedTrasaction);

      await connection.sendRawTransaction(signedTrasaction.serialize());
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
export const buyTicket = async (address, creator_wallet, receiver, amount) => {
  let nftSolanaData = {
    network: process.env.REACT_APP_SOLANA_NETWORK,
    collection_address: address,
    creator_wallet: creator_wallet,
    fee_payer: process.env.REACT_APP_FEEPAYER_WALLET,
    royalty: 5,
    service_charge: {
      receiver: receiver,
      amount: amount,
    },
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

export const signTransactionWithWalletAndSend = async (
  encodedTransaction,
  provider
) => {
  try {
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
    console.log(recoveredTransaction);
    const signedTx = await provider.signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
    console.log(signedTx);
    const confirmTransaction = signedTx.serialize().toString("base64");

    console.log(confirmTransaction);

    // const connection = new Connection(
    //   clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK)
    // );
    // await connection.sendEncodedTransaction(confirmTransaction);

    return await sendTransaction(confirmTransaction);
  } catch (error) {
    console.log(error);
  }
};

export const sendTransaction = async (encodedTransaction) => {
  try {
    let data = {
      network: process.env.REACT_APP_SOLANA_NETWORK,
      encoded_transaction: encodedTransaction,
    };
    console.log(data);

    const res = await axios.post(
      `https://api.shyft.to/sol/v1/transaction/send_txn`,
      data,
      {
        headers: {
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      }
    );
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
