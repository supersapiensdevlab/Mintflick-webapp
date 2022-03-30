import React from 'react';
import { useSelector } from 'react-redux';

function Addcomment() {
  const user = useSelector((state) => state.User.user);

  return (
    user && (
      <div className="flex">
        <img className="h-8 w-8 rounded-full" src={user.profile_image}></img>
        <div>
          <input type="text"></input>
          <i className="far fa-laugh"></i>
        </div>
      </div>
    )
  );
}

export default Addcomment;
