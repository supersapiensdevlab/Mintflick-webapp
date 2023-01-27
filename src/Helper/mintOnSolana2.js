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

let mintResponse = "";

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

const signTransactionWithWallet = async (encodedTransaction, provider) => {
  try {
    const solanaWallet = new SolanaWallet(provider); // web3auth.provider
    console.log(solanaWallet);

    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
    console.log(recoveredTransaction);
    const signedTx = await (provider.isPhantom
      ? provider
      : solanaWallet
    ).signTransaction(recoveredTransaction); // signing the recovered transaction using the creator_wall
    console.log(signedTx);

    const confirmTransaction = signedTx
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    // console.log(confirmTransaction);
    return confirmTransaction;
  } catch (error) {
    console.log(error);
  }
};

export const mintNFTOnSolana2 = async (
  creator_wallet,
  provider,
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
    fee_payer: `B6rhE5Zpu2gfe8YnJSa4jVoyWqDTqBcEJbDa5JawyYdG`,
    royalty: 5,
    image: image,
  };
  console.log(nftSolanaData);

  await axios
    .post(`https://api.shyft.to/sol/v2/nft/create`, nftSolanaData, {
      headers: {
        "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
        "content-type": "multipart/form-data",
      },
    })
    .then(async (res) => {
      mintResponse = res.data.result.mint;
      console.log(res.data.result.mint);
      // const mintId = res.data.result.mint;
      console.log("NFT mint request generated successfully");
      // const confirmTransaction = signTransactionKeyWallet(
      //   res.data.result.encoded_transaction,
      //   `${process.env.REACT_APP_SIGNER_PRIVATE_KEY}`,
      //   provider
      // );
      await signTransactionWithWallet(
        res.data.result.encoded_transaction,
        provider
      ).then(async (signedTx) => {
        console.log(signedTx);

        var myHeaders = new Headers();
        myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);
        myHeaders.append("Content-Type", "application/json");

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
        await fetch(
          "https://api.shyft.to/sol/v1/txn_relayer/sign",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.log("error", error));
        return mintResponse;
      });

      //   const encodedTransaction = signTransaction(
      //     res.data.result.encoded_transaction,
      //     `${process.env.REACT_APP_SIGNER_PRIVATE_KEY}`
      //   );
      //   partialSignWithWallet(encodedTransaction, provider);
    })
    .catch((err) => {
      console.log(err);
    });
};
