import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
} from "@solana/web3.js";
const endpoint = {
  http: {
    devnet: process.env.REACT_APP_SOLANA_RPC ?? "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
    "mainnet-beta":
      process.env.REACT_APP_SOLANA_RPC ?? process.env.REACT_APP_SOLANA_RPC,
  },
  https: {
    devnet: process.env.REACT_APP_SOLANA_RPC ?? "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
    "mainnet-beta":
      process.env.REACT_APP_SOLANA_RPC ?? process.env.REACT_APP_SOLANA_RPC,
  },
};

export function clusterUrl(network) {
  try {
    console.log("ENDPOINTS:", endpoint);

    switch (network) {
      case WalletAdapterNetwork.Devnet:
        return endpoint.https.devnet;
      case WalletAdapterNetwork.Mainnet:
        return endpoint.https["mainnet-beta"];
      default:
        return clusterApiUrl(network);
    }
  } catch (error) {
    throw error;
  }
}

export async function confirmTransactionFromFrontend(
  connection,
  encodedTransaction,
  wallet
) {
  console.log(encodedTransaction);
  const recoveredTransaction = Transaction.from(
    Buffer.from(encodedTransaction, "base64")
  );
  console.log(wallet);
  const signedTx = await wallet.signTransaction(recoveredTransaction);
  const confirmTransaction = await connection.sendRawTransaction(
    signedTx.serialize()
  );
  return confirmTransaction;
}
