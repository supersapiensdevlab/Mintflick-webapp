import React, { useState } from "react";
import PhotoPost from "./PhotoPost";

function TimeLine() {
  const [posts, setPosts] = useState([
    {
      profilePic:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Ze5_jCRZOp9UU0S7X8-4vgHaDt%26pid%3DApi&f=1",
      profileName: "Loren Ipsum",
      timestamp: "1 hour ago",
      text: "I am the hope of the Universe…I am the answer to all living things that cry out for peace…I am the protector of the innocent…I am the light in the darkness…I am the truth. Ally to good…Nightmare to you!",
      image:
        "https://pixabay.com/get/g0ca9e7cce5133e5666f5af66a38b40721f3bfdf950b1359496a2446e3c1ae95e318e7abd5e9298ecbcd5f4514a55c59beb43ccce7747d7a1291bcb8bac10877485603e1c1e1d59795dbd393fb6ba0b2b_1920.jpg",
      timestamp: "1 hour ago",
      price: 53,
      likeCount: 323,
      commentCount: 23,
      ownerId: "bhulaaa_123",
    },
    {
      profilePic:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Ze5_jCRZOp9UU0S7X8-4vgHaDt%26pid%3DApi&f=1",
      profileName: "Loren Ipsum",
      timestamp: "1 hour ago",
      text: "I am the hope of the Universe…I am the answer to all living things that cry out for peace…I am the protector of the innocent…I am the light in the darkness…I am the truth. Ally to good…Nightmare to you!",
      image:
        "https://pixabay.com/get/g0ca9e7cce5133e5666f5af66a38b40721f3bfdf950b1359496a2446e3c1ae95e318e7abd5e9298ecbcd5f4514a55c59beb43ccce7747d7a1291bcb8bac10877485603e1c1e1d59795dbd393fb6ba0b2b_1920.jpg",
      timestamp: "1 hour ago",
      price: 53,
      likeCount: 323,
      commentCount: 23,
      ownerId: "bhulaaa_123",
    },
    {
      profilePic:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Ze5_jCRZOp9UU0S7X8-4vgHaDt%26pid%3DApi&f=1",
      profileName: "Loren Ipsum",
      timestamp: "1 hour ago",
      text: "I am the hope of the Universe…I am the answer to all living things that cry out for peace…I am the protector of the innocent…I am the light in the darkness…I am the truth. Ally to good…Nightmare to you!",
      image:
        "https://pixabay.com/get/g0ca9e7cce5133e5666f5af66a38b40721f3bfdf950b1359496a2446e3c1ae95e318e7abd5e9298ecbcd5f4514a55c59beb43ccce7747d7a1291bcb8bac10877485603e1c1e1d59795dbd393fb6ba0b2b_1920.jpg",
      timestamp: "1 hour ago",
      price: 53,
      likeCount: 323,
      commentCount: 23,
      ownerId: "bhulaaa_123",
    },
    {
      profilePic:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Ze5_jCRZOp9UU0S7X8-4vgHaDt%26pid%3DApi&f=1",
      profileName: "Loren Ipsum",
      timestamp: "1 hour ago",
      text: "I am the hope of the Universe…I am the answer to all living things that cry out for peace…I am the protector of the innocent…I am the light in the darkness…I am the truth. Ally to good…Nightmare to you!",
      image:
        "https://pixabay.com/get/g0ca9e7cce5133e5666f5af66a38b40721f3bfdf950b1359496a2446e3c1ae95e318e7abd5e9298ecbcd5f4514a55c59beb43ccce7747d7a1291bcb8bac10877485603e1c1e1d59795dbd393fb6ba0b2b_1920.jpg",
      timestamp: "1 hour ago",
      price: 53,
      likeCount: 323,
      commentCount: 23,
      ownerId: "bhulaaa_123",
    },
    {
      profilePic:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.Ze5_jCRZOp9UU0S7X8-4vgHaDt%26pid%3DApi&f=1",
      profileName: "Loren Ipsum",
      timestamp: "1 hour ago",
      text: "I am the hope of the Universe…I am the answer to all living things that cry out for peace…I am the protector of the innocent…I am the light in the darkness…I am the truth. Ally to good…Nightmare to you!",
      image:
        "https://pixabay.com/get/g0ca9e7cce5133e5666f5af66a38b40721f3bfdf950b1359496a2446e3c1ae95e318e7abd5e9298ecbcd5f4514a55c59beb43ccce7747d7a1291bcb8bac10877485603e1c1e1d59795dbd393fb6ba0b2b_1920.jpg",
      timestamp: "1 hour ago",
      price: 53,
      likeCount: 323,
      commentCount: 23,
      ownerId: "bhulaaa_123",
    },
  ]);
  return (
    <div className="w-full max-w-2xl space-y-6">
      {posts.map((post) => (
        <PhotoPost
          key={post.id}
          profilePic={post.profilePic}
          profileName={post.profileName}
          timestamp={post.timestamp}
          text={post.text}
          image={post.image}
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
