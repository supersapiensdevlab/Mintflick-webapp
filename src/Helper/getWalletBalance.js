import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { clusterUrl } from "../Componants/Home/Utility/utilityFunc";

// const SOLANA_CONNECTION = new Connection(
//   clusterUrl(process.env.REACT_APP_SOLANA_NETWORK),
//   "confirmed"
// );

const rpcUrl = clusterUrl(process.env.REACT_APP_SOLANA_NETWORK);

console.log("RPPPPC:", rpcUrl);
const connection = new Connection(rpcUrl, "confirmed");

export async function loadBalance(wallet) {
  let balance = await connection.getBalance(new PublicKey(wallet));
  console.log(`wallet Balance: ${balance / LAMPORTS_PER_SOL}`);
  const x = balance / LAMPORTS_PER_SOL;
  return x;
}
