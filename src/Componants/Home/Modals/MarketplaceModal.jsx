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

function PhotoPostModal({ setMarketPlaceModalOpen }) {
  const State = useContext(UserContext);
  const [creatingMarketplace, setcreatingMarketplace] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [tokenName, settokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimal, setTokenDecimal] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const [nftPrice, setNFTPrice] = useState(1);
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

  // console.log(window?.ethereum);
  // console.log(State.database?.provider);

  // const mintNft = async (itemUri, price) => {
  //   const web3 = new Web3(State.database.provider.provider);
  //   //get current account address
  //   const accounts = await web3.eth.getAccounts();
  //   console.log("web3", web3);
  //   console.log(accounts[0]);
  //   //Get ChainID of current account
  //   const chainId = await web3.eth.net.getId();
  //   //Mint NFT using SDK erc721 nft mint
  //   await ExpressSDK.erc1155.nft.mint(
  //     web3,
  //     chainId,
  //     // "0x3f1437E3ce1143464734C26C2EA7519F3a393Aa0",
  //     accounts[0],
  //     price,
  //     itemUri,
  //     [[accounts[0], 10]]
  //   );
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!creatingMarketplace) {
      if (!State.database.userData?.data?.user?.marketAddress) {
        var ts = Math.round(new Date().getTime() / 1000);

        console.log(State.database);
        let formdata = new FormData();
        formdata.append("network", "devnet");
        formdata.append("wallet", State.database.walletAddress);
        formdata.append("name", tokenName);
        formdata.append("symbol", tokenSymbol);
        // formdata.append("description", tokenSymbol);
        // formdata.append("decimals", tokenSymbol);

        formdata.append(
          "file",
          selectedToken.file[0],
          selectedToken.file[0].name,
        );

        axios
          .post(`https://api.shyft.to/sol/v1/token/create_detach`, formdata, {
            headers: {
              "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
              "content-type": "multipart/form-data",
            },
          })
          .then(async (data) => {
            console.log("MintID", data.data.result.mint);
            console.log("MintID", data.data.result);
            setTokenAddress(data.data.result.mint);
            await signTransaction(
              "devnet",
              data.data.result.encoded_transaction,
              createMarketplace,
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

  const createMarketplace = async () => {
    let formdata = new FormData();
    formdata.append("network", "devnet");
    formdata.append("creator_wallet", State.database.walletAddress);
    // formdata.append("transaction_fee", 5); //MintFlick Treasury Wallet Address
    // formdata.append("currency_address", tokenAddress);
    // formdata.append("fee_recipient", process.env.REACT_APP_TREASURY_WALLET);

    let raw = JSON.stringify({
      network: "devnet",
      transaction_fee: 10,
      currency_address: tokenAddress,
      fee_payer: process.env.REACT_APP_TREASURY_WALLET,
      fee_recipient: process.env.REACT_APP_TREASURY_WALLET,
      creator_wallet: State.database.walletAddress,
    });

    console.log(raw);
    axios
      .post(`https://api.shyft.to/sol/v1/marketplace/create`, raw, {
        headers: {
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      })
      .then(async (data) => {
        console.log("Result:", data.data);
        await signTransaction(
          "devnet",
          data.data.result.encoded_transaction,
          clearData,
        );
      })
      .catch((err) => {
        console.log(err);
        clearData();
      });
  };

  const uploadToServer = (formData, mintId) => {
    formData.append("tokenId", mintId);
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(async (res) => {
        State.toast("success", "Your Photo uploded successfully!");
        await loadFeed();
        clearData();
      })
      .catch((err) => {
        State.toast("error", "Oops!somthing went wrong uplaoding photo!");
        console.log(err);
        clearData();
      });
  };

  const clearData = () => {
    setcreatingMarketplace(false);
    setSelectedToken(null);
    settokenName("");
    setTokenSymbol([]);
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
            Upload Photo
          </h3>
          <X
            onClick={() => clearData()}
            className='text-brand2 cursor-pointer'></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='w-full p-4 space-y-3'>
          <label
            htmlFor='post_announcement_image'
            className=' cursor-pointer flex justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4'>
            {selectedToken ? (
              selectedToken.file ? (
                <div className='flex items-center'>
                  <FileCheck className='text-emerald-700' />
                  {selectedToken.file[0].name.substring(0, 16)}
                </div>
              ) : (
                "No file choosen!"
              )
            ) : (
              <div className='flex items-center gap-1'>
                <File />
                Choose file *
              </div>
            )}
            <input
              id='post_announcement_image'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='sr-only'
              required={true}
              onClick={(event) => {
                event.target.value = null;
                setSelectedToken(null);
              }}
            />
            {selectedToken ? (
              selectedToken.file ? (
                <div className='flex-grow rounded-lg overflow-clip'>
                  <img src={selectedToken.localurl}></img>
                </div>
              ) : null
            ) : (
              <></>
            )}
          </label>

          <input
            type='text'
            className='textarea  w-full'
            placeholder='Token Name eg:Lucky Token'
            onChange={(e) => settokenName(e.target.value)}
            value={tokenName}
          />

          <input
            type='text'
            className='textarea  w-full'
            placeholder='Token Symbol eg:ETH, BTC '
            onChange={(e) => setTokenSymbol(e.target.value)}
            value={tokenSymbol}
          />

          <div className='form-control w-full  '>
            <label className='label  '>
              <span className='label-text text-slate-400'>
                Ex: 9 decimals, 1000000000 = 1 token
              </span>
            </label>
            <input
              max={10}
              min={1}
              type='number'
              className='textarea  w-full input '
              placeholder='Decimals '
              onChange={(e) => setTokenDecimal(e.target.value)}
              value={tokenDecimal}
            />
          </div>

          <input
            type='text'
            className='textarea  w-full'
            placeholder='Token Description'
            onChange={(e) => setTokenDescription(e.target.value)}
            value={tokenDescription}
          />

          <div className='w-fit flex space-x-2'></div>
          <progress
            class='progress progress-success w-56 hidden'
            value='50'
            max='100'></progress>
          <button
            type={"submit"}
            className={`btn  ${
              !selectedToken?.file[0] ? "btn-disabled" : "btn-brand"
            } w-full ${creatingMarketplace ? "loading " : ""}`}>
            Create Token
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoPostModal;
