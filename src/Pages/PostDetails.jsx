import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../Componants/Home/Post";
import { UserContext } from "../Store";

function PostDetails() {
  const State = useContext(UserContext);
  useEffect(() => {
    State.updateDatabase({ showHeader: true });
  }, []);
  const { userName, type, id } = useParams();
  const [post, setpost] = useState(null);

  const [currentPlay, setCurrentPlay] = useState(null);

  // For NFT DATA
  const [nfts, setNfts] = useState([]);
  const [gettingNFTData, setGettingNFTData] = useState(true);
  // const post = State.database.feedData[4];

  useEffect(() => {
    console.log("fetching data");
    axios({
      method: "get",
      url: ` ${process.env.REACT_APP_SERVER_URL}/user/${userName}/${type}/${id}`,
    })
      .then((response) => {
        {
          console.log(response);
          setpost(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);
  return (
    <div className=" flex h-screen bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 mr-4 pt-24 space-y-6 overflow-y-auto"></div>
      <div className="w-full lg:w-2/4 flex flex-col items-center  h-full pt-14 lg:pt-24 overflow-y-auto">
        {post && (
          <Post
            contentType={post?.content_type}
            key={post?._id}
            //   myKey={i}

            profilePic={post?.profile_image}
            profileName={post?.username}
            profileuser_id={post?.user_id}
            timestamp={post?.content.time}
            text={post?.content.announcement}
            image={post?.content.post_image}
            price={post?.price}
            likes={post?.content.likes}
            comments={post?.content.comments}
            ownerId={post?.ownerId}
            tokenId={post?.content.tokenId}
            trackImage={post?.content.trackImage}
            trackName={post?.content.trackName}
            trackDisc={post?.content.description}
            trackUrl={post?.content.link}
            currentPlay={currentPlay}
            setCurrentPlay={setCurrentPlay}
            profileUsername={post?.username}
            trackId={post?.content.trackId}
            trackPlays={post?.content.plays}
            videoImage={post?.content.videoImage}
            videoName={post?.content.videoName}
            videoUrl={post?.content.link}
            videoId={post?.content.videoId}
            videoViews={post?.content.views}
            pollId={post?.content.pollId}
            postId={post?.content.postId}
            votes={post?.content.votes}
            content={post?.content}
            reports={post?.reports}
            superfan_data={post?.superfan_data}
            gettingNFTData={gettingNFTData}
            nfts={State.database.nftData}
            walletId={post?.wallet_id}
          ></Post>
        )}
      </div>
      <div className="hidden lg:flex flex-col items-end h-full w-1/4 pt-24 mr-12 ml-4"></div>
    </div>
  );
}

export default PostDetails;
