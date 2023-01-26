import axios from "axios";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
} from "@solana/web3.js";
import { decode } from "bs58";
import { SolanaWallet } from "@web3auth/solana-provider";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const signTransaction = async (encodedTransaction, fromPrivateKey) => {
  try {
    console.log(fromPrivateKey);
    // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const feePayer = Keypair.fromSecretKey(decode(fromPrivateKey));
    console.log(feePayer);
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
    console.log(recoveredTransaction);
    recoveredTransaction.partialSign(feePayer);

    const serializedTransaction = recoveredTransaction.serialize({
      requireAllSignatures: false,
    });
    // console.log(serializedTransaction);
    const transactionBase64 = serializedTransaction.toString("base64");
    console.log(transactionBase64);
    return recoveredTransaction;
  } catch (error) {
    console.log(error);
  }
};

async function partialSignWithWallet(recoveredTransaction, provider) {
  console.log("PROVIDER:", provider);
  //we have to pass the recoveredTransaction received in the previous step in the encodedTransaction parameter
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const solanaWallet = new SolanaWallet(provider); // web3auth.provider
  console.log(solanaWallet);

  const signedTx = await solanaWallet.signTransaction(recoveredTransaction);

  console.log(signedTx);
  //signing transaction with the creator_wallet
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize({ requireAllSignatures: false })
  );
  console.log(confirmTransaction);
  return confirmTransaction;
}

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
    const serializedTransaction = recoveredTransaction.serialize({
      requireAllSignatures: false,
    });
    const transactionBase64 = serializedTransaction.toString("base64");
    console.log(transactionBase64); //partially signing using private key of fee_payer wallet

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

export const mintNFTOnSolana2 = async (
  creator_wallet,
  provider,
  name,
  description,
  external_url,
  image
) => {
  let response;

  let nftSolanaData = {
    network: "devnet",
    creator_wallet: creator_wallet,
    name: name,
    symbol: "FLICK",
    attributes: JSON.stringify([{ trait_type: "Power", value: "100" }]),
    description: description,
    external_url: external_url,
    max_supply: 1,
    fee_payer: `3NtakJUHcwJPCxx4qpJRnPK1sfhYk5oeDALp4T6QKD8Y`,
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
    .then((res) => {
      response = res;
      console.log(response);
      console.log("NFT mint request generated successfully");
      signTransactionKeyWallet(
        res.data.result.encoded_transaction,
        `${process.env.REACT_APP_SIGNER_PRIVATE_KEY}`,
        provider
      );
      //   const encodedTransaction = signTransaction(
      //     res.data.result.encoded_transaction,
      //     `${process.env.REACT_APP_SIGNER_PRIVATE_KEY}`
      //   );
      //   partialSignWithWallet(encodedTransaction, provider);
    })
    .catch((err) => {
      console.log(err);
    });
  //   return response;
};
