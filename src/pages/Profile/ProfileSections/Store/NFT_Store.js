import axios from 'axios';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';
import NFTCard from './NFTCard';
import UserOwnedAssets from './UserOwnedAssets';
import useWeb3Modal from '../../../../hooks/useWeb3Modal';
import Web3 from 'web3';
import { useSelector } from 'react-redux';
import NFTMarket from './NFTMarket';
import { Biconomy } from '@biconomy/mexa';

export default function NFTStore(props) {
  const [nfts, setNfts] = useState([]);
  // const [seeMore, setSeeMore] = useState(false);
  // const [nameSeeMore, setNameSeeMore] = useState(false);
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);
  const user = useSelector((state) => state.User.user);

  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    //if (!provider) loadWeb3Modal();
  }, [provider]);

  useEffect(() => {
    if (provider) loadNFTs();
  }, [provider]);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const web3 = new Web3(provider);
    var accounts = await web3.eth.getAccounts();
    window.web3 = web3;
    //const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new web3.eth.Contract(Market, nftmarketaddress);
    const data = await marketContract.methods.fetchTotalMintedTokens().call();
    // console.log('TOTAL MINTED NFTs:', data);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketContract.methods.tokenURI(i.tokenId).call();
        const meta = await axios.get(tokenUri);
        //console.log('TOKEN URI:', tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId,
          creator: i.creator,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          external_url: meta.data.external_url,
        };
        return item;
      }),
    );
    setNfts(items.reverse());

    setLoadingState('loaded');
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    var biconomy = new Biconomy(provider, {
      apiKey: 'Ooz6qQnPL.10a08ea0-3611-432d-a7de-34cf9c44b49b',
    });

    console.log('NFT buy Clicked', nft.tokenId);

    const web3 = new Web3(biconomy);
    window.web3 = web3;
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();

    biconomy
      .onEvent(biconomy.READY, async () => {
        window.web3 = web3;
        const contract = new web3.eth.Contract(Market, nftmarketaddress);

        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseEther(nft.price.toString());

        let marketFees = await contract.methods.getListingPrice().call();
        console.log('Market Fees', marketFees);
        console.log('Price', price.toString(10));

        const transaction = await contract.methods
          .createMarketSale(nft.tokenId)
          .send({
            from: user.wallet_id,

            value: price.toString(10),
          })
          .on('receipt', function () {
            if (transaction) {
              console.log('Transaction Receipt:', transaction);
            }
          });
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log('Biconomy txn error:', error);
        console.log('Biconomy txn msg:', message);
      });
    loadNFTs();
  }

  async function resellOwnedItem(nft, price) {
    const web3 = new Web3(provider);
    window.web3 = web3;

    const marketContract = new web3.eth.Contract(Market, nftmarketaddress);

    const listingPrice = await marketContract.methods.getListingPrice().call();
    const tx = await marketContract.methods
      .resellToken(nft.tokenId, ethers.utils.parseUnits(price, 'ether'))
      .send({ from: user.wallet_id, value: listingPrice.toString() });
    await tx.wait();
  }

  // if (loadingState === 'loaded' && !nfts.length) {
  //   return (
  //     <div className="h-max lg:col-span-5 col-span-6 w-full mt-20     ">
  //       <h1 className="   text-gray-300 w-full flex ">NFTs owned by you: </h1>
  //       <UserOwnedAssets resellOwnedItem={resellOwnedItem}></UserOwnedAssets>
  //       <h1 className=" text-gray-300 w-full flex mt-10">No items in marketplace</h1>
  //     </div>
  //   );
  // }
  return (
    <>
      <div className="h-full lg:col-span-1 col-span-6 w-full     ">
        {/* <h1 className="   dark:text-gray-300 w-full flex   text-dbeats-dark   px-3">
          NFTs owned by you :{' '}
        </h1>
        <UserOwnedAssets resellOwnedItem={resellOwnedItem}></UserOwnedAssets>
        <h1 className="   dark:text-gray-300 w-full flex   text-dbeats-dark   pt-5  px-3">
          Marketplace{' '}
        </h1> */}

        <div
          className={`${
            props.address ? 'grid grid-cols-3  ' : ' grid grid-flow-row  grid-cols-1 '
          }  w-full   sm:px-3  `}
        >
          {nfts ? (
            <>
              {nfts.map((nft, i) => {
                // for covalent we have to set the contract address

                if (nft && nft.name && !props.address) {
                  return (
                    <div
                      key={i}
                      className={`  self-center  col-span-1   rounded-lg sm:mx-2  transition-all duration-300 `}
                    >
                      <NFTCard nft={nft} buyNft={buyNft} />
                      {/* <NFTMarket nft={nft}></NFTMarket> */}
                    </div>
                  );
                } else if (props.address) {
                  return (
                    <div
                      key={i}
                      className={`  self-center  col-span-1   rounded-lg sm:mx-2  transition-all duration-300 `}
                    >
                      <NFTCard nft={nft} buyNft={buyNft} address={props.address} />
                      {console.log('WALLET ID:', props.address)}
                      {/* <NFTMarket nft={nft}></NFTMarket> */}
                    </div>
                  );
                }
                return 0;
              })}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
