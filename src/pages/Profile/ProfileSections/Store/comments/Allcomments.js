import React from 'react';
import { useSelector } from 'react-redux';

function Allcomments({setShowAllComments}) {
  const user = useSelector((state) => state.User.user);
  return (
    <div className="mx-4 my-1">
      <div onClick={()=>setShowAllComments(false)} className="cursor-pointer text-white font-bold ml-5 m-3">
        Latest comments <i className="fa-solid fa-sort-down"></i>
      </div>

      <div className="flex">
        <img src={user.profile_image} className="h-8 w-8 mr-2 rounded-full"></img>
        <div>
          <div className="text-gray-300 border-2 border-gray-500 rounded-xl px-2  p-1 ">
            <div className="font-semibold">{user.username}</div>
            <p>
              ent of a page when looking at its layout. The point of using Lorem Ipsum is that it
              has
            </p>
          </div>
          <div className="text-xs my-1 ml-9">
            <i className="fa-solid fa-heart"></i> Like
          </div>
        </div>
      </div>

      <div className="text-sm ml-2 my-3">Load more comments...</div>
    </div>
  );
}

export default Allcomments;
