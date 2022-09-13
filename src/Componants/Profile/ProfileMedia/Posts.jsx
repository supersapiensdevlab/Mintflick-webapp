import { data } from "autoprefixer";
import React, { useContext } from "react";
import { UserContext } from "../../../Store";

function Posts() {
  const State = useContext(UserContext);

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 pt-2 gap-1 ">
      {State.database.userProfileData &&
        State.database.userProfileData.data.posts.reverse().map((post) => (
          <div className="col-span-1  aspect-square bg-red-600 ">
            <img
              className="h-full w-full object-cover hover:scale-105"
              src={
                post.post_image
                  ? post.post_image
                  : "https://picsum.photos/seed/picsum/200/300"
              }
              alt="post"
            />
          </div>
        ))}
    </div>
  );
}

export default Posts;
