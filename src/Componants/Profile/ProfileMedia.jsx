import axios from "axios";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Store";
import Loading from "../Loading/Loading";
import Post from "../Home/Post";

function ProfileMedia(props) {
  //for user timeline
  const [userTimeline, setUserTimeline] = useState({});

  // for Playing only one at time
  const [currentPlay, setCurrentPlay] = useState(null);
  const State = useContext(UserContext);

  // For NFT DATA
  const [nfts, setNfts] = useState([]);
  const [gettingNFTData, setGettingNFTData] = useState(true);

  const [loader, setloader] = useState(true);

  async function getUserTimeline(userName) {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/feed/${userName}`,
    })
      .then((response) => {
        console.log(response);
        setUserTimeline(response.data);
        setloader(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    getUserTimeline(props.userName);
  }, []);

  return (
    <div className="w-full max-w-2xl  space-y-6 mb-4">
      {!loader ? (
        userTimeline.map((post, i) => (
          <>
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
              nfts={nfts}
              walletId={post.wallet_id}
            ></Post>
          </>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default ProfileMedia;
