import React, { useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import placeholder_img from "../../Assets/ticket.webp";

function NftPostCard({ nftDetails }) {
  const [type, settype] = useState("");
  useEffect(() => {
    fetch(nftDetails.image_uri)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        // console.log(contentType);
        settype(contentType);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <a
      href={`https://translator.shyft.to/address/${nftDetails?.mint}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
      target="_blank"
      className="w-full h-fit  bg-slate-50  lg:bg-slate-100  dark:bg-slate-700 lg:dark:bg-slate-800  rounded-lg drop-shadow-md lg:hover:scale-[1.01] transition-all ease-in-out overflow-clip"
    >
      <div className="flex items-center justify-center w-full align-middle rounded aspect-video">
        {type !== "" ? (
          type !== "video/mp4" ? (
            <Image
              className="object-contain w-full aspect-square"
              width="100%"
              height="100%"
              src={
                nftDetails?.cached_image_uri === ""
                  ? placeholder_img
                  : nftDetails?.cached_image_uri
              }
              alt={"Post Image"}
              placeholder={
                <div className="flex flex-col items-center justify-center w-full gap-1 aspect-square">
                  <Main_logo></Main_logo>
                  <span className="text-lg font-bold text-brand6">
                    Loading...
                  </span>
                </div>
              }
            />
          ) : (
            <video className="object-contain w-full aspect-square" controls>
              <source src={nftDetails?.cached_image_uri} />
            </video>
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <Main_logo></Main_logo>
            <span className="text-lg font-bold text-brand6">Loading...</span>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full p-4">
        <span className="text-lg font-bold text-brand1">
          {nftDetails?.name}
        </span>
        <span className="text-base font-semibold truncate text-brand5">
          {nftDetails?.description}
        </span>
      </div>
    </a>
  );
}

export default NftPostCard;
