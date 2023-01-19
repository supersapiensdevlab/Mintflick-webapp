import axios from "axios";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Keypair, Transaction } from "@solana/web3.js";
import { decode } from "bs58";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const mintNFTOnSolana = async (
  creator_wallet,
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
    })
    .catch((err) => {
      console.log(err);
    });
  return response;
};

export async function signTransaction(transaction, key) {
  console.log(transaction, "KEY:", key);
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const feePayer = Keypair.fromSecretKey(decode(key));
    const recoveredTransaction = Transaction.from(
      Buffer.from(transaction, "base64")
    );
    recoveredTransaction.partialSign(feePayer); //partially signing transaction with privatekey of the fee_payer
    return recoveredTransaction;
  } catch (error) {
    console.log(error);
  }
}

export async function partialSignWithWallet(encodedTransaction, provider) {
  console.log("PROVIDER:", provider);
  //we have to pass the recoveredTransaction received in the previous step in the encodedTransaction parameter
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const solanaWallet = new SolanaWallet(provider); // web3auth.provider
  console.log(solanaWallet);
  const signedTx = await solanaWallet.signTransaction(encodedTransaction);
  console.log(signedTx);

  //signing transaction with the creator_wallet
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  );
  return confirmTransaction;
}

export const listNFTOnSolana = async (nft_address, price, seller_wallet) => {
  let response;
  var raw = JSON.stringify({
    network: "devnet",
    marketplace_address: process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS,
    nft_address: nft_address,
    price: parseInt(price),
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
