import React from "react";
import { Image } from "react-img-placeholder";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";

function NftPostCard({ nftDetails }) {
  return (
    <div className="w-full h-fit  bg-slate-50  lg:bg-slate-100  dark:bg-slate-700 lg:dark:bg-slate-800  rounded-lg drop-shadow-md">
      <div className="items-center w-full  aspect-square    align-middle justify-center   flex rounded">
        <Image
          className="  w-full  object-contain"
          width="100%"
          height="100%"
          src={nftDetails.nft.image_uri}
          alt={"Post Image"}
          placeholder={<Main_logo></Main_logo>}
        />
      </div>
      <div className="flex flex-col p-4 w-full">
        <span className="text-xl font-bold text-brand1">
          {nftDetails.nft.name}
        </span>
        <span className="text-base font-semibold text-brand3">
          {nftDetails.nft.description}
        </span>
      </div>
    </div>
  );
}

export default NftPostCard;
