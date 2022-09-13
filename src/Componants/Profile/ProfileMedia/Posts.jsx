import { data } from "autoprefixer";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Store";

function Posts() {
  const State = useContext(UserContext);
  const [data, setdata] = useState([]);

  useEffect(() => {
    setdata(
      State.database.userProfileData
        ? State.database.userProfileData.data.posts
        : []
    );
  }, []);

  return (
    <div className="grid grid-cols-3 lg:grid-cols-4 pt-2 gap-1 ">
      {data.reverse().map((post) => (
        <div className="col-span-1  aspect-square bg-slate-600 ">
          <img
            className="h-full w-full object-cover hover:scale-105 transition-all	ease-in-out duration-300"
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
