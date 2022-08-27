import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import useUserActions from "../../Hooks/useUserActions";
import { UserContext } from "../../Store";
import Post from "./Post";
import Web3 from "web3";
import Market from "../../artifacts/contracts/Market.sol/NFTMarket.json";
import { nftmarketaddress } from "../../functions/config";
import { ethers } from "ethers";

function TimeLine() {
  // for Playing only one at time
  const [currentPlay, setCurrentPlay] = useState(null);
  const State = useContext(UserContext);
  const [loadFeed] = useUserActions();

  // For NFT DATA
  const [nfts, setNfts] = useState([]);
  const [gettingNFTData, setGettingNFTData] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  // useEffect(() => {
  //   console.log('loading nfts')
  //   if (State.database.provider) {
  //     console.log(State.database.provider)
  //     loadNFTs();
  //   }
  // }, [State.database.provider]);

  // useEffect(() => {
  //   console.log(nfts);
  // }, [nfts]);

  // async function loadNFTs() {
  //   /* create a generic provider and query for unsold market items */
  //   const web3 = new Web3(State.database.provider);
  //   // var accounts = await web3.eth.getAccounts();
  //   window.web3 = web3;
  //   //const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
  //   const marketContract = new web3.eth.Contract(Market, nftmarketaddress);
  //   console.log(web3)
  //   const data = await marketContract.methods.fetchTotalMintedTokens().call();
  //   console.log(data)
  //   // const res = await axios.get(
  //   //   `https://api.covalenthq.com/v1/137/tokens/${nftmarketaddress}/nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_b5245f3db18d4a2d999fef65fc0`,
  //   // );

  //   //const NFTIds = res.data.data.items;
  //   //console.log('Covalent Data', NFTIds);

  //   //console.log('TOTAL MINTED NFTs:', res.data.data.items.length);
  //   /*
  //    *  map over items returned from smart contract and format
  //    *  them as well as fetch their token metadata
  //    */
  //   let myNFTLength = 0;
  //   const items = await Promise.all(
  //     data.map(async (i) => {
  //       let tokenUri = await marketContract.methods.tokenURI(i.tokenId).call();
  //       // const meta = await axios.get(
  //       //   `https://api.covalenthq.com/v1/137/tokens/${nftmarketaddress}/nft_metadata/${i}/?quote-currency=USD&format=JSON&key=ckey_b5245f3db18d4a2d999fef65fc0`,
  //       // );

  //       if (tokenUri.includes('ipfs.infura.io')) {
  //         tokenUri = tokenUri.replace('ipfs.infura.io', 'ipfs.io');
  //       }
  //       const meta = await axios.get(tokenUri);

  //       let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

  //       let item = {
  //         price,
  //         tokenId: i.tokenId,
  //         creator: i.creator,
  //         seller: i.seller,
  //         owner: i.owner,
  //         image: meta.data.image,
  //         name: meta.data.name,
  //         description: meta.data.description,
  //         external_url: meta.data.external_url,
  //       };
  //       return item;
  //     }),
  //   );
  //   console.log(items)
  //   setNfts(items.reverse());
  //   setGettingNFTData(false);
  // }

  return (
    <div className='w-full max-w-2xl space-y-6  '>
      {State.database.feedData.map((post, i) => (
        <>
          <Post
            contentType={post.content_type}
            key={i}
            myKey={i}
            profilePic={post.profile_image}
            profileName={post.username}
            profileuser_id={post.user_id}
            timestamp={post.content.time}
            text={post.content.announcement}
            image={post.content.post_image}
            price={post.price}
            likes={post.content.likes}
            comments={post.content.comments}
            ownerId={post.ownerId}
            tokenId={post.content.tokenId}
            trackImage={post.content.trackImage}
            trackName={post.content.trackName}
            trackDisc={post.content.description}
            trackUrl={post.content.link}
            currentPlay={currentPlay}
            setCurrentPlay={setCurrentPlay}
            profileUsername={post.username}
            trackId={post.content.trackId}
            trackPlays={post.content.plays}
            videoImage={post.content.videoImage}
            videoUrl={post.content.link}
            videoId={post.content.videoId}
            videoViews={post.content.views}
            pollId={post.content.pollId}
            postId={post.content.postId}
            content={post.content}
            gettingNFTData={gettingNFTData}></Post>
        </>
      ))}
    </div>
  );
}

export default TimeLine;
