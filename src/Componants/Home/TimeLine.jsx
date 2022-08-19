import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";

function TimeLine() {
  const [posts, setPosts] = useState([]);
  // for Playing only one at time
  const [currentPlay, setCurrentPlay] = useState(null);

  async function loadFeed() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/feed`,
    })
      .then((response) => {
        console.log(response);
        setPosts(response.data.reverse());
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    loadFeed();
  }, []);


  return (
    <div className="w-full max-w-2xl space-y-6">
      {posts.map((post,i) => (
        <>
          <Post
            contentType={post.content_type}
            key={i}
            myKey={i}
            profilePic={post.profile_image}
            profileName={post.name}
            timestamp={post.timestamp}
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
            profileUsername = {post.username}
            trackId = {post.content.trackId}
            trackPlays = {post.content.plays}
            videoImage = {post.content.videoImage}
            videoUrl={post.content.link}
            videoId = {post.content.videoId}
            videoViews = {post.content.views}
          ></Post>
          {/* {post.content_type === 'video' && <>
            Add component here of video
            Video
          </>}
          {post.content_type === 'track' && <>
            Add component here of track
            Track</>} */}
        </>
      ))}
    </div>
  );
}

export default TimeLine;
