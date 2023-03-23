import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { NavLink, useParams } from "react-router-dom";
import {
  ArrowBackUp,
  CheckupList,
  CircleCheck,
  Wallet,
} from "tabler-icons-react";
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
  const [error, seterror] = useState(false);
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
        `https://api.shyft.to/sol/v1/nft/read?network=${process.env.REACT_APP_SOLANA_NETWORK}&token_address=${param.tokenId}`,
        requestOptions
      ).then((response) => {
        console.log(response);
        response
          .json()
          .then((result) => {
            setnftDetails(result.result);
            setOwner(result.result.owner);
            console.log(result.result);
          })
          .catch((error) => {
            seterror(true);
            console.log("error", error);
          });
      });
    }
  }, []);
  useEffect(() => {
    nftDetails && settype(nftDetails?.files[0].type);
    // fetch(nftDetails?.image_uri)
    //   .then((response) => {
    //     const contentType = response.headers.get("content-type");
    //     console.log(contentType);
    //     settype(contentType);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, [nftDetails]);
  useEffect(() => {
    if (State.database.nftData && nftDetails) {
      State.database.nftData.forEach((value) => {
        if (nftDetails?.mint) {
          if (nftDetails?.mint === value.nft_address) {
            setPrice(value.price);
            return;
          }
        }
      });
    }
  }, [State.database.nftData, nftDetails]);

  return (
    <>
      <div className="flex flex-col xl:flex-row overflow-auto h-screen w-screen bg-white dark:bg-slate-800  xl:px-12 pt-20 pb-24 xl:pb-4 ">
        {error ? (
          <div className="w-full h-full flex flex-col   justify-center items-center text-xl font-bold text-brand1 flex-wrap text-center">
            NFT not found on {process.env.REACT_APP_SOLANA_NETWORK}
            {/* <span className="text-primary text-sm ">{param.tokenId}</span>  */}
            <NavLink
              to={"/homescreen/home"}
              className="btn btn-sm capitalize btn-primary btn-outline rounded-full gap-2 mt-4"
            >
              <ArrowBackUp /> Back to homepage
            </NavLink>
          </div>
        ) : (
          <>
            <div className="xl:w-1/2 max-w-2xl  w-full aspect-square  mx-auto bg-slate-50 dark:bg-slate-900  md:rounded-lg">
              {type !== "" ? (
                type !== "video/mp4" ? (
                  <img
                    className="aspect-square w-full object-contain "
                    src={nftDetails?.image_uri}
                    alt={"nft Image"}
                  />
                ) : (
                  <video
                    className="  w-full aspect-square object-contain "
                    controls
                  >
                    <source src={nftDetails?.files[0].uri} />
                  </video>
                )
              ) : (
                <div className="w-full  aspect-square flex flex-col justify-center items-center gap-1">
                  <Main_logo></Main_logo>
                  <span className="text-lg font-bold text-brand6">
                    Loading...
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col p-4 mx-auto  w-full max-w-2xl h-fit xl:h-full xl:overflow-auto items-start justify-start gap-4">
              <span className="text-2xl md:text-4xl font-bold text-brand1 tracking-wider">
                {nftDetails?.name}
              </span>
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm md:text-base font-semibold text-brand3 truncate w-fit border-2   border-slate-100 dark:border-slate-700 p-1 md:p-2 px-2 md:px-3 rounded-full">
                  Owner
                  <a
                    href={`https://translator.shyft.to/address/${nftDetails?.owner}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
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
                <span className="text-sm md:text-base font-semibold text-brand3 truncate w-fit border-2   border-slate-100 dark:border-slate-700 p-1 md:p-2 px-2 md:px-3 rounded-full">
                  Mint id
                  <a
                    href={`https://translator.shyft.to/address/${nftDetails?.mint}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
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
                Attributes{" "}
                <span className="flex  gap-2 items-start flex-wrap w-full">
                  {nftDetails?.attributes_array.map((a, index) => (
                    <span
                      key={index}
                      className="flex flex-col items-center text-base font-semibold text-brand4 truncate w-fit border-2   border-slate-100 dark:border-slate-700 p-2 px-3 rounded-md"
                    >
                      {a.trait_type}
                      <span className="text-brand2 ">{a.value}</span>
                    </span>
                  ))}
                </span>
              </span>{" "}
              {/* {price > 0 ? (
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
                      tokenId: nftDetails?.mint,
                      sellerAddress: owner,
                      setPrice: setPrice,
                      setOwner: setOwner,
                    },

                    buyNFTModalOpen: true,
                  })
                }
                className="btn btn-success  gap-1 rounded-full w-full capitalize text-lg "
              >
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
                
                  <CheckupList size={24} />
                  List or Sell
                </div>
              ) : (
                <></>
              )}
            </>
          )} */}
            </div>
          </>
        )}
      </div>

      <ListNFTModal
        text={nftDetails?.name}
        contentType={type !== "video/mp4" ? "post" : "video"}
        listModalOpen={listModalOpen}
        setListModalOpen={setListModalOpen}
        setNftPrice={setPrice}
        content={nftDetails?.cached_image_uri}
        tokenId={param?.tokenId}
        videoUrl={nftDetails?.cached_image_uri}
      />
    </>
  );
}

export default NftDetails;
