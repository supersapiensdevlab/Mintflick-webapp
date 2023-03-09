import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import { useParams } from "react-router-dom";
import { CheckupList, CircleCheck, Wallet } from "tabler-icons-react";
import Main_logo from "../Assets/logos/Main_logo";
import ListNFTModal from "../Componants/Home/Modals/ListNFTModal";
import { UserContext } from "../Store";

function NftDetails() {
  const param = useParams();
  const State = useContext(UserContext);

  const [nftDetails, setnftDetails] = useState(null);
  const [type, settype] = useState("");

  const [price, setPrice] = useState(0);
  const [owner, setOwner] = useState(null);
  const [listModalOpen, setListModalOpen] = useState(false);

  useEffect(() => {
    console.log(param);
    State.updateDatabase({ showHeader: true });
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
          setOwner(result.result.owner);
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
  useEffect(() => {
    if (State.database.nftData && nftDetails) {
      State.database.nftData.forEach((value) => {
        if (nftDetails?.mint) {
          if (nftDetails?.mint === value.nft_address) {
            setPrice(value.price);
          }
        }
      });
    }
  }, [nftDetails]);

  return (
    <>
      <div className="flex flex-col xl:flex-row overflow-auto h-screen w-screen bg-white dark:bg-slate-900  xl:px-12 pt-24 pb-24 xl:pb-4 ">
        <div className="w-1/2    mx-auto bg-slate-100 dark:bg-slate-800 rounded-lg">
          {type !== "" ? (
            type !== "video/mp4" ? (
              <img
                className="aspect-square  w-full object-contain "
                src={nftDetails?.cached_image_uri}
                alt={"nft Image"}
              />
            ) : (
              <video
                className="  w-full aspect-square object-contain "
                controls
              >
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
        <div className="flex flex-col p-4 mx-auto  w-full max-w-2xl h-fit xl:h-full xl:overflow-auto items-start justify-start gap-4">
          <span className="text-2xl md:text-4xl font-bold text-brand1 tracking-wider">
            {nftDetails?.name}
          </span>
          <div className="flex gap-2 flex-wrap">
            <span className="text-base font-semibold text-brand3 truncate w-fit border-2   border-slate-100 dark:border-slate-800 p-2 px-3 rounded-full">
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
            <span className="text-base font-semibold text-brand3 truncate w-fit border-2   border-slate-100 dark:border-slate-800 p-2 px-3 rounded-full">
              Mint id
              <a
                href={`https://solscan.io/token/${nftDetails?.mint}?cluster=devnet`}
                target="_blank"
                className="text-primary mx-2"
              >
                {nftDetails?.mint?.slice(0, 6)}...
                {nftDetails?.mint?.slice(
                  nftDetails?.mint?.length - 4,
                  nftDetails?.mint?.length
                )}
              </a>
            </span>
          </div>
          <span className="flex flex-col items-start text-xl font-semibold text-brand5 w-full">
            Description
            <span className="text-xl font-semibold text-brand2 w-full ">
              {nftDetails?.description}
            </span>
          </span>
          <span className="flex flex-col gap-2 items-start text-xl font-semibold text-brand5 w-full">
            Attributes
            {nftDetails?.attributes_array.map((a) => (
              <span className="flex flex-col text-base font-semibold text-brand4 truncate w-fit border-2   border-slate-100 dark:border-slate-800 p-2 px-3 rounded-md">
                {a.trait_type}
                <span className="text-brand2 mx-2">{a.value}</span>
              </span>
            ))}
          </span>
          {price > 0 ? (
            owner === State.database.walletAddress ? (
              <div className="flex items-center justify-center p-4 bg-success gap-1 rounded-full w-full capitalize text-lg text-white font-bold">
                <CircleCheck /> Listed for Sale
              </div>
            ) : (
              <div
                onClick={() =>
                  State.updateDatabase({
                    buyNFTModalData: {
                      ownedBy: owner,
                      nftName: nftDetails?.name ? nftDetails?.name : null,
                      content: nftDetails?.cached_image_uri,
                      videoImage:
                        type === "video/mp4" && nftDetails?.cached_image_uri,
                      nftImage: nftDetails?.cached_image_uri,
                      nftDescription: nftDetails?.description,
                      nftPrice: price,
                      tokenId: nftDetails?.tokenId,
                      sellerAddress: owner,
                      setPrice: setPrice,
                      setOwner: setOwner,
                    },

                    buyNFTModalOpen: true,
                  })
                }
                className="btn btn-success  gap-1 rounded-full w-full capitalize text-lg "
              >
                {/* <PolygonToken></PolygonToken> */}
                {/* <p className="text-sm  mx-1">{props.price}</p> */}
                <Wallet size={18} />
                Buy
              </div>
            )
          ) : (
            <>
              {owner === State.database.walletAddress ? (
                <div
                  className="btn btn-primary btn-outline gap-1 rounded-full w-full capitalize text-lg "
                  onClick={() => setListModalOpen(true)}
                >
                  {/* <PolygonToken></PolygonToken> */}
                  {/* <p className="text-sm  mx-1">{props.price}</p> */}
                  <CheckupList size={24} />
                  List or Sell
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
      {listModalOpen && (
        <ListNFTModal
          text={nftDetails?.name}
          contentType={type !== "video/mp4" ? "post" : "video"}
          listModalOpen={listModalOpen}
          setListModalOpen={setListModalOpen}
          setNftPrice={setPrice}
          content={nftDetails?.cached_image_uri}
          videoUrl={nftDetails?.cached_image_uri}
          tokenId={nftDetails?.mint}
        />
      )}
    </>
  );
}

export default NftDetails;
