import React from "react";
import { useState } from "react";
import {
  At,
  DotsVertical,
  Heart,
  MessageCircle,
  Share,
} from "tabler-icons-react";
import PolygonToken from "../../Assets/logos/PolygonToken";

function PhotoPost(props) {
  const [gettingNFTData,setGettingNFTData] = useState(true);
  
  return (
    <div className="w-full h-fit lg:bg-slate-100 lg:dark:bg-slate-800 lg:rounded-xl p-4 lg:p-8 space-y-4 pb-4 border-b-2 lg:border-none  border-slate-200 dark:border-slate-900">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={props.profilePic}
            alt="Tailwind-CSS-Avatar-component"
          />
          <div>
            <p className="font-semibold text-base text-brand1">
              {props.profileName}
            </p>
            <p className="font-normal text-xs text-brand4">{props.timestamp}</p>
          </div>
        </div>
        <div className="btn btn-circle btn-ghost ">
          <DotsVertical className=""></DotsVertical>
        </div>
      </div>
      <p className="font-normal text-base text-brand2 w-full">{props.text}</p>
      <div className="relative w-full h-fit z-10">
        {props.image && <img className="w-full rounded-lg" src={props.image} alt="User Post" />}
      </div>
        <div className={props.tokenId && !gettingNFTData ? "cursor-pointer flex items-center justify-start rounded-lg space-x-2 text-brand2":"hidden"}>
          <p className="font-bold text-sm text-primary">Owner</p>
          <At size={20}></At>
          <p className=" font-semibold text-sm ">{props.ownerId}</p>
          <div className=" flex flex-grow  h-fit  items-center justify-end rounded-full ">
            <div className="flex h-fit w-fit items-center justify-end  btn-primary btn-outline rounded-full p-1">
              <PolygonToken></PolygonToken>
              <p className="text-sm  mx-1">{props.price}</p>
            </div>
          </div>
        </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer flex items-center text-rose-700 space-x-2">
            <Heart></Heart>
            <p className="font-medium text-sm ">{props.likes ? props.likes.length : ''}</p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-brand1">
            <MessageCircle></MessageCircle>
            <p className="font-medium text-sm text-brand3">
              {props.comments ? props.comments.length : ''}
            </p>
          </div>
          <div className="cursor-pointer flex items-center space-x-2 text-brand1">
            <Share></Share>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoPost;
