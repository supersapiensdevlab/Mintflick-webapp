import React from 'react';
import { useSelector } from 'react-redux';

function Allcomments({ setShowAllComments }) {
  const user = useSelector((state) => state.User.user);
  return (
    <div className="mx-4 my-1">
      <div
        onClick={() => setShowAllComments(false)}
        className="cursor-pointer text-white  ml-5 m-3 "
      >
        Latest comments <i className="fa-solid fa-sort-down self-center  "></i>
      </div>

      <div className="flex">
        <img src={user.profile_image} className="h-8 w-8 mr-2 rounded-full"></img>
        <div>
          <div className="text-gray-300 border border-dbeats-dark-secondary  rounded-lg px-3  py-2 nm-inset-dbeats-dark-primary">
            <div className="font-semibold">{user.name}</div>
            <p>
              ent of a page when looking at its layout. The point of using Lorem Ipsum is that it
              has
            </p>
          </div>
          <div className="text-xs my-1 ml-2 cursor-pointer group">
            <i className="fa-solid fa-heart group-hover:text-red-600"></i> Like
          </div>
        </div>
      </div>

      <div className="text-sm ml-2 my-3 cursor-pointer">Load more comments...</div>
    </div>
  );
}

export default Allcomments;
