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
        setPosts(response.data);
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
      {posts.map((post) => (
        <PhotoPost
          key={post.id}
          profilePic={post.profile_image}
          profileName={post.name}
          timestamp={post.timestamp}
          text={post.content.announcement}
          image={post.content.post_image}
          price={post.price}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          ownerId={post.ownerId}
        ></PhotoPost>
      ))}
    </div>
  );
}

export default TimeLine;
