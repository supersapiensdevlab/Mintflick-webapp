import React from "react";
import {
  At,
  DotsVertical,
  Heart,
  MessageCircle,
  Share,
} from "tabler-icons-react";

function PhotoPost(props) {
  return (
    <div className="w-full h-fit bg-gray-100 dark:bg-slate-800 rounded-xl p-2 lg:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={props.profilePic}
            alt="Tailwind-CSS-Avatar-component"
          />
          <div>
            <p className="font-semibold text-base text-gray-800 dark:text-gray-100">
              {props.profileName}
            </p>
            <p className="font-normal text-xs text-gray-600 dark:text-gray-400">
              {props.timestamp}
            </p>
          </div>
        </div>
        <DotsVertical className="dark:text-gray-100"></DotsVertical>
      </div>
      <p className="font-normal text-base text-gray-600 w-full dark:text-gray-100">
        {props.text}
      </p>
      <div className="relative w-full h-fit z-10">
        <img className="w-full rounded-lg" src={props.image} alt="User Post" />
        <div className="absolute right-4 bottom-4 flex h-fit w-fit items-center p-4 rounded-full bg-black/60 backdrop-blur-sm">
          <img
            src="https://www.cryptologos.cc/logos/polygon-matic-logo.png?v=022"
            className=" h-4 w-4  "
          ></img>
          <p className="text-white text-sm  ml-1">{props.price}</p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer flex items-center text-rose-700 space-x-2">
            <Heart></Heart>
            <p className="font-medium text-sm ">{props.likeCount}</p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 dark:text-gray-100">
            <MessageCircle></MessageCircle>
            <p className="font-medium text-sm text-gray-400">
              {props.commentCount}
            </p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 dark:text-gray-100">
            <Share></Share>
          </div>
        </div>
        <div className="cursor-pointer flex items-center border-2 border-brand px-4 py-2 rounded-lg space-x-2 dark:text-gray-100">
          <p className="font-bold text-sm text-primary">Owner</p>
          <At size={20}></At>
          <p className=" font-semibold text-sm text-gray-600 dark:text-gray-300">
            {props.ownerId}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PhotoPost;
