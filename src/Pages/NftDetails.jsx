import React, { useContext, useEffect, useState } from "react";
import { Image } from "react-img-placeholder";
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
import SolanaToken from "../Assets/logos/SolanaToken";

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
      <div className="flex flex-col w-screen h-screen pt-20 pb-24 overflow-auto bg-white xl:flex-row dark:bg-slate-800 xl:px-12 xl:pb-4 ">
        {error ? (
          <div className="flex flex-col flex-wrap items-center justify-center w-full h-full text-xl font-bold text-center text-brand1">
            NFT not found on {process.env.REACT_APP_SOLANA_NETWORK}
            {/* <span className="text-sm text-primary ">{param.tokenId}</span>  */}
            <NavLink
              to={"/homescreen/home"}
              className="gap-2 mt-4 capitalize rounded-full btn btn-sm btn-primary btn-outline"
            >
              <ArrowBackUp /> Back to homepage
            </NavLink>
          </div>
        ) : (
          <>
            <div className="w-full max-w-2xl mx-auto xl:w-1/2 aspect-square bg-slate-50 dark:bg-slate-900 md:rounded-lg">
              {type !== "" ? (
                type !== "video/mp4" ? (
                  <img
                    className="object-contain w-full aspect-square "
                    src={nftDetails?.image_uri}
                    alt={"nft Image"}
                  />
                ) : (
                  <video
                    className="object-contain w-full aspect-square"
                    controls
                  >
                    <source src={nftDetails?.files[0].uri} />
                  </video>
                )
              ) : (
                <div className="flex flex-col items-center justify-center w-full gap-1 aspect-square">
                  <Main_logo></Main_logo>
                  <span className="text-lg font-bold text-brand6">
                    Loading...
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-4 p-4 mx-auto h-fit xl:h-full xl:overflow-auto">
              <span className="text-2xl font-bold tracking-wider md:text-4xl text-brand1">
                {nftDetails?.name}
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="p-1 px-2 text-sm font-semibold truncate border-2 rounded-full md:text-base text-brand3 w-fit border-slate-100 dark:border-slate-700 md:p-2 md:px-3">
                  Owner
                  <a
                    href={`https://translator.shyft.to/address/${nftDetails?.owner}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
                    target="_blank"
                    className="mx-2 text-primary"
                  >
                    {nftDetails?.owner?.slice(0, 6)}...
                    {nftDetails?.owner?.slice(
                      nftDetails?.owner?.length - 4,
                      nftDetails?.owner?.length
                    )}
                  </a>
                </span>
                <span className="p-1 px-2 text-sm font-semibold truncate border-2 rounded-full md:text-base text-brand3 w-fit border-slate-100 dark:border-slate-700 md:p-2 md:px-3">
                  Mint id
                  <a
                    href={`https://translator.shyft.to/address/${nftDetails?.mint}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
                    target="_blank"
                    className="mx-2 text-primary"
                  >
                    {nftDetails?.mint?.slice(0, 6)}...
                    {nftDetails?.mint?.slice(
                      nftDetails?.mint?.length - 4,
                      nftDetails?.mint?.length
                    )}
                  </a>
                </span>
              </div>
              <span className="flex flex-col items-start w-full text-xl font-semibold text-brand5">
                Description
                <span className="w-full text-xl font-semibold text-brand2 ">
                  {nftDetails?.description || (
                    <span className="text-base font-semibold text-brand5">
                      Loading...
                    </span>
                  )}
                </span>
              </span>
              <span className="flex flex-col items-start w-full gap-2 text-xl font-semibold text-brand5">
                Attributes{" "}
                <span className="flex flex-wrap items-start w-full gap-2">
                  {nftDetails?.attributes_array.map((a, index) => (
                    <span
                      key={index}
                      className="flex flex-col items-center p-2 px-3 text-base font-semibold truncate border-2 rounded-md text-brand4 w-fit border-slate-100 dark:border-slate-700"
                    >
                      {a.trait_type}
                      <span className="text-brand2 ">{a.value}</span>
                    </span>
                  )) || (
                    <span className="text-base font-semibold text-brand5">
                      Loading...
                    </span>
                  )}
                </span>
              </span>{" "}
              {price > 0 ? (
                owner === State.database.walletAddress ? (
                  <div className="flex items-center justify-center w-full gap-1 p-4 text-lg font-bold text-white capitalize rounded-full bg-success">
                    <CircleCheck /> Listed for{" "}
                    <>
                      <span className="text-lg font-bold">{price}</span>
                      <div className="flex items-center gap-2 p-2 mx-1 rounded-full bg-slate-900">
                        <SolanaToken size={16} />
                      </div>
                    </>
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
                            type === "video/mp4" &&
                            nftDetails?.cached_image_uri,
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
                    className="w-full gap-1 text-lg text-white capitalize rounded-full btn btn-success "
                  >
                    <Wallet size={18} />
                    Buy for
                    <>
                      <span className="text-lg font-bold">{price}</span>
                      <div className="flex items-center gap-2 p-2 mx-1 rounded-full bg-slate-900">
                        <SolanaToken size={16} />
                      </div>
                    </>
                  </div>
                )
              ) : (
                <>
                  {owner === State.database.walletAddress ? (
                    <div
                      className="w-full gap-1 text-lg capitalize rounded-full btn btn-primary btn-outline "
                      onClick={() => setListModalOpen(true)}
                    >
                      <CheckupList size={24} />
                      List or Sell
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              )}
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
