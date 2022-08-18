import axios from "axios";
import React, { useEffect, useState } from "react";
import PhotoPost from "./PhotoPost";

function TimeLine() {
  const [posts, setPosts] = useState([]);
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
  console.log()

  return (
    <div className="w-full max-w-2xl space-y-6">
      {posts.map((post) => (
        <>
          {post.content_type === 'post' &&
            <PhotoPost
              key={post.content.id}
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
            ></PhotoPost>}
          {post.content_type === 'video' && <>
            {/* Add component here of video */}
            Video
          </>}
          {post.content_type === 'track' && <>
            {/* Add component here of track */}
            Track</>}
        </>
      ))}
    </div>
  );
}

export default TimeLine;
