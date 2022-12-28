import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import useUserActions from "../../Hooks/useUserActions";
import { UserContext } from "../../Store";
import Post from "./Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading/Loading";
import { Link, useNavigate } from "react-router-dom";
import image from "../../Assets/Gaming Posters/treasureHunt.webp";

function TimeLine() {
  // for Playing only one at time
  const [currentPlay, setCurrentPlay] = useState(null);
  const State = useContext(UserContext);
  const [loadFeed] = useUserActions();

  const navigateTo = useNavigate();

  // For NFT DATA
  const [nfts, setNfts] = useState([]);
  const [gettingNFTData, setGettingNFTData] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  // Infinite Pagination
  const [hasMore, setHasMore] = useState(true);
  const loadMoreData = async (skip) => {
    if (State.database.feedData.length > 0) {
      console.log("loading more ", skip);
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_SERVER_URL}/feed`,
        params: { skip: skip },
      })
        .then((response) => {
          let data = response.data;
          console.log(data);
          State.updateDatabase({
            feedData: [...State.database.feedData, ...data],
          });
          if (data.length <= 0) {
            setHasMore(false);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(
      `https://api.shyft.to/sol/v1/marketplace/active_listings?network=devnet&marketplace_address=${process.env.REACT_APP_SOLANA_MARKETPLACE_ADDRESS}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        let data = result.result;
        State.updateDatabase({
          nftData: data,
        });
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <InfiniteScroll
      className=" z-10 space-y-6 mb-4 max-w-2xl"
      dataLength={State.database.feedData.length} //This is important field to render the next data
      next={() => loadMoreData(State.database.feedData.length)}
      hasMore={hasMore}
      loader={<Loading />}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b className="text-brand1">Yay! You have seen it all</b>
        </p>
      }
      scrollableTarget={"scrollableDiv"}
    >
      <div
        onClick={() => navigateTo("../quests")}
        className="w-full bg-white lg:rounded-lg overflow-hidden cursor-pointer"
      >
        <img
          className="aspect-[16/5] w-full object-cover  "
          src={image}
          alt="quest-banner"
        />
      </div>
      {State.database.feedData.map((post, i) => (
        <Post
          contentType={post.content_type}
          key={post._id}
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
          videoName={post.content.videoName}
          videoUrl={post.content.link}
          videoId={post.content.videoId}
          videoViews={post.content.views}
          pollId={post.content.pollId}
          postId={post.content.postId}
          votes={post.content.votes}
          content={post.content}
          reports={post.reports}
          superfan_data={post.superfan_data}
          gettingNFTData={gettingNFTData}
          nfts={State.database.nftData}
          walletId={post.wallet_id}
        ></Post>
      ))}
    </InfiniteScroll>
  );
}

export default TimeLine;
