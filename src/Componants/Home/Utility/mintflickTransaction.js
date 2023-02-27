import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { signTransactionWithWallet } from "../../../Helper/mintOnSolana2";

export async function transactionWithFee(
  sender,
  receiver,
  ammount,
  fee,
  provider,
) {
  let tx;
  console.log(sender, receiver, ammount);
  console.log(provider);
  const connection = new Connection("https://api.devnet.solana.com");
  const blockhash = (await connection.getRecentBlockhash("finalized"))
    .blockhash;

  let transaction = new Transaction({
    recentBlockhash: blockhash,
    feePayer: new PublicKey(sender),
  }).add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(sender),
      toPubkey: new PublicKey(receiver),
      lamports: ammount * (1 - fee) * LAMPORTS_PER_SOL,
    }),
  );
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(sender),
      toPubkey: new PublicKey("8TvHtNUsieHsr1xDwDCVLFBxPPeSWQ3zm6aigXfMEBEE"),
      lamports: ammount * fee * LAMPORTS_PER_SOL,
    }),
  );
  await provider
    .signTransaction(transaction)
    .then(async (signedTrasaction) => {
      await connection
        .sendRawTransaction(signedTrasaction.serialize())
        .then((response) => {
          console.log(response);
          tx = response;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
  return tx;
}
