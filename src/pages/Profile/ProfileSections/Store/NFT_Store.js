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
import { random } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';


export default function NFTStore(props) {
  let tempusercache = [];
  const [nfts, setNfts] = useState([]);
  const [fullnfts, setFullNfts] = useState([]);
  // const [seeMore, setSeeMore] = useState(false);
  // const [nameSeeMore, setNameSeeMore] = useState(false);
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const provider = useSelector((state) => state.web3Reducer.provider);
  const user = useSelector((state) => state.User.user);

  const [loadingState, setLoadingState] = useState('not-loaded');

  // for pagination onscroll
  const [loading, setLoading] = useState(true);
  const [totalSize, setTotalSize] = useState(0);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

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
    // const res = await axios.get(
    //   `https://api.covalenthq.com/v1/137/tokens/${nftmarketaddress}/nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_b5245f3db18d4a2d999fef65fc0`,
    // );

    //const NFTIds = res.data.data.items;
    //console.log('Covalent Data', NFTIds);

    //console.log('TOTAL MINTED NFTs:', res.data.data.items.length);
    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    let myNFTLength = 0;
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await marketContract.methods.tokenURI(i.tokenId).call();
        // const meta = await axios.get(
        //   `https://api.covalenthq.com/v1/137/tokens/${nftmarketaddress}/nft_metadata/${i}/?quote-currency=USD&format=JSON&key=ckey_b5245f3db18d4a2d999fef65fc0`,
        // );

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
        if (i.creator == props.address) {
          myNFTLength++;
          console.log('MY NFT LENGTH:', myNFTLength);
        }
        return item;
      }),
    );
    setNfts(items.reverse());
    setTotalSize(items.length);

    setLoadingState('loaded');
  }
  useEffect(() => {
    setTotalPages(Math.ceil(totalSize / pageSize));
  }, [totalSize]);

  useEffect(async () => {
    setLoading(true);
    for (var i = 0; i < (nfts.length > 5 ? 5 : nfts.length); i++) {
      console.log('only five times')
      let creator_data = tempusercache.find((obj) => {
        if (obj.user) {
          if (obj.user.wallet_id == nfts[i].creator) {
            return obj;
          }
        }
      });

      const userData = {
        walletId: nfts[i].creator,
      };
      if (!creator_data) {
        try {
          const res1 = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
            userData,
            { timeout: 5000 },
          );
          creator_data = res1.data;
          tempusercache.push(creator_data);
        } catch (err) {
          console.log(err);
        }
      }
      const OwnerData = {
        walletId: nfts[i].owner,
      };
      let owner_data = tempusercache.find((obj) => {
        if (obj.user) {
          if (obj.user.wallet_id == nfts[i].owner) {
            return obj;
          }
        }
      });
      if (!owner_data) {
        try {
          if (nfts[i].owner !== nftmarketaddress) {
            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
              OwnerData,
              { timeout: 5000 },
            );
            owner_data = res.data;
            tempusercache.push(owner_data);
          }
        } catch (err) {
          console.log(err);
        }
      }

      setFullNfts((prevState) => {
        return [
          ...prevState,
          {
            ...nfts[i],
            creator_data: creator_data,
            owner_data: owner_data,
          },
        ];
      });
   
    }
    setCurrentPage((prevState) => prevState + 1);
    setLoading(false);
  }, [nfts]);
  const loadMoreNFTData = async () => {
    if (loading) {
      return;
    }
    console.log('loadingmore nfts')
    setLoading(true);
    for (var i = currentPage * 5; i < currentPage * 5 + 5; i++) {
      if (nfts[i]) {
        let creator_data = tempusercache.find((obj) => {
          if (obj.user) {
            if (obj.user.wallet_id == nfts[i].creator) {
              return obj;
            }
          }
        });

        const userData = {
          walletId: nfts[i].creator,
        };
        if (!creator_data) {
          try {
            const res1 = await axios.post(
              `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
              userData,
              { timeout: 5000 },
            );
            creator_data = res1.data;
            tempusercache.push(creator_data);
          } catch (err) {
            console.log(err);
          }
        }
        const OwnerData = {
          walletId: nfts[i].owner,
        };
        let owner_data = tempusercache.find((obj) => {
          if (obj.user) {
            if (obj.user.wallet_id == nfts[i].owner) {
              return obj;
            }
          }
        });
        if (!owner_data) {
          try {
            if (nfts[i].owner !== nftmarketaddress) {
              const res = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
                OwnerData,
                { timeout: 5000 },
              );
              owner_data = res.data;
              tempusercache.push(owner_data);
            }
          } catch (err) {
            console.log(err);
          }
        }

        setFullNfts((prevState) => {
          return [
            ...prevState,
            {
              ...nfts[i],
              creator_data: creator_data,
              owner_data: owner_data,
            },
          ];
        });

      }
    }
    setCurrentPage((prevState) => prevState + 1);
    setLoading(false);
  };

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
      {nfts ? (
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
              props.address
                ? 'grid sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 grid-cols-1'
                : ' grid grid-flow-row  grid-cols-1 '
            }  w-full   sm:px-3  h-screen`}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={()=>{
                if(currentPage < totalPages && !loading){
                setLoading(true);
                loadMoreNFTData();
                }
              }}
              hasMore={currentPage < totalPages}
              loader={
                <div className="mt-2 flex justify-center">
                  <div className="text-center animate-spin rounded-full h-7 w-7 ml-3 border-2 bg-gradient-to-r from-green-400 to-blue-500 "></div>
                </div>
              }
              useWindow={true}
            >
              {fullnfts.map((nft, i) => {
                // for covalent we have to set the contract address

                if (!props.address && nft && nft.name) {
                  return (
                    <div
                      key={nft.tokenId}
                      className={`  self-center  col-span-1   rounded-lg sm:mx-2  transition-all duration-300 `}
                    >
                      <NFTCard nft={nft} buyNft={buyNft} />
                      {/* <NFTMarket nft={nft}></NFTMarket> */}
                    </div>
                  );
                } else if (props.address == nft.creator) {
                  return (
                    <div
                      key={nft.tokenId}
                      className={`  self-center  col-span-1   rounded-lg sm:mx-2  transition-all duration-300 `}
                    >
                      <NFTCard nft={nft} buyNft={buyNft} address={props.address} />
                      {console.log('MY NFT LENGTH:')}
                      {/* <NFTMarket nft={nft}></NFTMarket> */}
                    </div>
                  );
                }
              })}
            </InfiniteScroll>
          </div>
        </div>
      ) : null}
    </>
  );
}
