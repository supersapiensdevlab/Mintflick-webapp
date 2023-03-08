import React, { useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import { useParams } from "react-router-dom";
import Main_logo from "../Assets/logos/Main_logo";

function NftDetails() {
  const param = useParams();
  const [nftDetails, setnftDetails] = useState(null);
  const [type, settype] = useState("");

  useEffect(() => {
    console.log(param);
    if (
      param.tokenId !== null &&
      param.tokenId !== undefined &&
      param.tokenId !== "null"
    ) {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", `${process.env.REACT_APP_SHYFT_API_KEY}`);
      //console.log(param.tokenId);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://api.shyft.to/sol/v1/nft/read?network=devnet&token_address=${param.tokenId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setnftDetails(result.result);
          console.log(result.result);
        })
        .catch((error) => console.log("error", error));
    }
  }, []);
  useEffect(() => {
    fetch(nftDetails?.image_uri)
      .then((response) => {
        const contentType = response.headers.get("content-type");
        console.log(contentType);
        settype(contentType);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className=" flex flex-col h-screen w-screen bg-white dark:bg-slate-900   pt-24">
      <div className=" w-full max-w-2xl mx-auto">
        {type !== "" ? (
          type !== "video/mp4" ? (
            <img
              className="  w-full object-contain "
              src={nftDetails?.cached_image_uri}
              alt={"nft Image"}
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
        <div className="flex flex-col p-4 flex-grow w-full items-start justify-start gap-4">
          <span className="text-2xl font-bold text-brand1 tracking-wider">
            {nftDetails?.name}
          </span>
          <span className="text-base font-semibold text-brand3 truncate w-full ">
            Owned by{" "}
            <a
              href={`https://solscan.io/token/${nftDetails?.owner}?cluster=devnet`}
              target="_blank"
              className="text-primary mx-2"
            >
              {nftDetails?.owner?.slice(0, 6)}...
              {nftDetails?.owner?.slice(
                nftDetails?.owner?.length - 4,
                nftDetails?.owner?.length
              )}
            </a>
          </span>
          <span className="flex flex-col items-start text-xl font-semibold text-brand5 w-full">
            Description
            <span className="text-xl font-semibold text-brand2 w-full ">
              {nftDetails?.description}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default NftDetails;
