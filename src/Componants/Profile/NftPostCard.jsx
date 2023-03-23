import React, { useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";

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
      href={`https://solscan.io/token/${nftDetails?.mint}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
      target="_blank"
      className="w-full h-fit  bg-slate-50  lg:bg-slate-100  dark:bg-slate-700 lg:dark:bg-slate-800  rounded-lg drop-shadow-md lg:hover:scale-[1.01] transition-all ease-in-out overflow-clip"
    >
      <div className="items-center w-full  aspect-square    align-middle justify-center   flex rounded">
        {type !== "" ? (
          type !== "video/mp4" ? (
            <Image
              className="  w-full aspect-square object-contain "
              width="100%"
              height="100%"
              src={
                nftDetails?.cached_image_uri === ""
                  ? "https://img.freepik.com/free-photo/two-tickets-blue-front-view-isolated-white_1101-3055.jpg"
                  : nftDetails?.cached_image_uri
              }
              alt={"Post Image"}
              placeholder={
                <div className="flex flex-col justify-center items-center gap-1">
                  <Main_logo></Main_logo>
                  <span className="text-lg font-bold text-brand6">
                    Loading...
                  </span>
                </div>
              }
            />
          ) : (
            <video className="  w-full aspect-square object-contain " controls>
              <source src={nftDetails?.cached_image_uri} />
            </video>
          )
        ) : (
          <div className="flex flex-col justify-center items-center gap-1">
            <Main_logo></Main_logo>
            <span className="text-lg font-bold text-brand6">Loading...</span>
          </div>
        )}
      </div>
      <div className="flex flex-col p-4 w-full">
        <span className="text-lg font-bold text-brand1">
          {nftDetails?.name}
        </span>
        <span className="text-base font-semibold text-brand5 truncate">
          {nftDetails?.description}
        </span>
      </div>
    </a>
  );
}

export default NftPostCard;
