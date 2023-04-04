import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const SOLANA_CONNECTION = new Connection(
  clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK),
  "confirmed"
);

export async function loadBalance(wallet) {
  let balance = await SOLANA_CONNECTION.getBalance(new PublicKey(wallet));
  console.log(`wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  const x = balance / LAMPORTS_PER_SOL;
  return x;
}
