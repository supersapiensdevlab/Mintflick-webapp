import axios from "axios";
import React from "react";
import { useState, useContext } from "react";
import { Camera, File, FileCheck, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";
import { UserContext } from "../../../Store";
import { SolanaWallet } from "@web3auth/solana-provider";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  clusterUrl,
  confirmTransactionFromFrontend,
} from "../Utility/utilityFunc";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import SolanaToken from "../../../Assets/logos/SolanaToken";

function SetupMarketplaceModal({ setMarketPlaceModalOpen }) {
  const State = useContext(UserContext);
  const [creatingMarketplace, setcreatingMarketplace] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  const [tokenAddress, setTokenAddress] = useState("");
  const [network, setNetwork] = useState("devnet");
  const [feePayer, setFeePayer] = useState(null);
  const [txFees, setTxFees] = useState(5);
  const [feeRecipient, setFeeRecipient] = useState(
    process.env.REACT_APP_TREASURY_WALLET,
  );

  const [loadFeed] = useUserActions();

  //Instance of pandora
  // const ExpressSDK = createPandoraExpressSDK();

  // Minting
  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const handleImageChange = (event) => {
    // Update the state
    setSelectedToken({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const networkArray = ["mainnet-beta", "testnet", "devnet"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!creatingMarketplace) {
      if (!State.database.userData?.data?.user?.marketAddress) {
        var ts = Math.round(new Date().getTime() / 1000);

        console.log(State.database);
        // let formdata = new FormData();
        // formdata.append("network", "devnet");
        // formdata.append(
        //   "creator_wallet",
        //   State.database.walletAddress.toString(),
        // );

        let raw = JSON.stringify({
          network: "devnet",
          transaction_fee: 5,

          creator_wallet: State.database.walletAddress,
        });

        axios
          .post(`https://api.shyft.to/sol/v1/marketplace/create`, raw, {
            headers: {
              "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
              "content-type": "application/json",
            },
          })
          .then(async (data) => {
            console.log("MintID", data.data.result.address);
            console.log("Result", data.data.result);

            await signTransaction(
              network,
              data.data.result.encoded_transaction,
              Log,
            );
          })
          .catch((err) => {
            console.log(err);
            clearData();
          });
      } else {
        alert("Please add your market address");
        clearData();
      }
    }
  };

  const clearData = () => {
    setcreatingMarketplace(false);
    setTokenAddress(null);
    setFeePayer(null);
    setFeeRecipient(null);
    setTxFees(null);

    setMarketPlaceModalOpen(false);
  };

  const Log = async (data) => {
    console.log(data);
  };

  async function signTransaction(network, transaction, callback) {
    //const phantom = new PhantomWalletAdapter();
    //await phantom.connect();
    const solanaWallet = new SolanaWallet(State.database.provider); // web3auth.provider
    const rpcUrl = clusterUrl(network);
    console.log(rpcUrl);
    const connection = new Connection(rpcUrl, "confirmed");
    //console.log(connection.rpcEndpoint);
    const ret = await confirmTransactionFromFrontend(
      connection,
      transaction,
      solanaWallet,
    );
    // const checks = await connection.confirmTransaction({signature:ret},'finalised');

    // console.log(checks);
    // await connection.confirmTransaction({
    //     blockhash: transaction.blockhash,
    //     signature: ret,
    //   });
    connection.onSignature(ret, callback, "finalized");
    return ret;
  }

  return (
    <div className='modal-box p-0 bg-slate-100 dark:bg-slate-800 '>
      <div className='w-full h-fit p-2 bg-slate-300 dark:bg-slate-700'>
        <div className='flex justify-between items-center p-2'>
          <h3 className='flex items-center gap-2 font-bold text-lg text-brand2'>
            <Camera />
            Create new Marketplace
          </h3>
          <X
            onClick={() => clearData()}
            className='text-brand2 cursor-pointer'></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='w-full p-4   grid  gap-4'>
          <div className='form-control w-full  '>
            <label className='label  '>
              <span className='label-text text-slate-400'>Network</span>
            </label>
            <select
              className='select block w-full'
              onChange={(e) => setNetwork(e.target.value)}
              value={network}>
              <option disabled selected>
                Network
              </option>
              {networkArray.map((c) => (
                <option>{c}</option>
              ))}
            </select>
          </div>

          <div className='form-control w-full hidden '>
            <label className='label  '>
              <span className='label-text text-slate-400'>Creator Address</span>
            </label>
            <input
              type='text'
              className='textarea  w-full'
              placeholder='Creator Address'
              readOnly={true}
              //onChange={(e) => setCreatorAddress(e.target.value)}
              value={State.database.walletAddress}
            />
          </div>

          <div className='form-control w-full  '>
            <label className='label  '>
              <span className='label-text text-slate-400'>Market Currency</span>
            </label>
            <input
              type='text'
              className='textarea  w-full'
              placeholder='Token Address'
              onChange={(e) => setTokenAddress(e.target.value)}
              value={tokenAddress}
            />
          </div>

          <div className='form-control w-full hidden '>
            <label className='label  '>
              <span className='label-text text-slate-400'>Fee Payer</span>
            </label>
            <input
              type='text'
              className='textarea  w-full'
              placeholder='Fee Payer Address'
              onChange={(e) => setFeePayer(e.target.value)}
              value={feePayer}
            />
          </div>

          <div className='form-control w-full  hidden'>
            <label className='label  '>
              <span className='label-text text-slate-400'>
                Fee Recipient Address
              </span>
            </label>
            <input
              type='text'
              className='textarea  w-full'
              placeholder='Fee Recipient Address'
              onChange={(e) => setFeeRecipient(e.target.value)}
              value={feeRecipient}
            />
          </div>

          <div className='form-control w-full  '>
            <label className='label  '>
              <span className='label-text text-slate-400'>
                Tx Fees (in lamports)
              </span>
            </label>
            <input
              type='text'
              className='textarea  w-full'
              placeholder='Tx Fees (in lamports)'
              onChange={(e) => setTxFees(e.target.value)}
              value={txFees}
            />
          </div>

          <div className='w-fit flex space-x-2'></div>
          <progress
            class='progress progress-success w-56 hidden'
            value='50'
            max='100'></progress>
          <button
            type={"submit"}
            className={`btn  ${
              !tokenAddress ? "btn-disabled" : "btn-brand"
            } w-full ${creatingMarketplace ? "loading " : ""}`}>
            Create MarketPlace
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetupMarketplaceModal;
