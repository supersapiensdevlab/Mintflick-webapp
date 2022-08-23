import axios from "axios";
import React from "react";
import { useState } from "react";
import { Camera, File, X } from "tabler-icons-react";
import PolygonToken from "../../Assets/logos/PolygonToken";
import { uploadFile } from "../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../Helper/nftMinter";

function PhotoPostModal({ setphotoPostModalOpen }) {
  const [uploadingPost, setUploadingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);

  // Minting
  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const handleImageChange = (event) => {
    // Update the state
    setSelectedPost({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadingPost(true);
    uploadFile(selectedPost.file)
      .then(async (cid) => {
        let formData = new FormData();
        formData.append("announcement", caption);
        formData.append("postImage", selectedPost.file[0]);
        formData.append("announcementHash", cid);

        if (isNFT) {
          var ts = Math.round(new Date().getTime() / 1000);
          let metadata = {
            image:
              "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
            external_url:
              "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
            description: `Post description`,
            name: caption,
            attributes: [
              {
                display_type: "date",
                trait_type: "Created On",
                value: ts,
              },
              {
                trait_type: "Category",
                value: "Category",
              },
            ],
            animation_url:
              "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
          };
          const blob = new Blob([JSON.stringify(metadata)], {
            type: "application/json",
          });
          const metaFile = [new File([blob], "meta.json")];
          uploadFile(selectedPost.file)
            .then(async (cid) => {
              console.log("stored files with cid:", cid);
              createToken(
                "https://ipfs.io/ipfs/" + cid,
                nftPrice,
                window.ethereum,
                setMinting,
                setMintingProgress,
              ).then(async (tokenId) => {
                console.log("TOKEN ID Created : ", tokenId); // token created
                formData.append("tokenId", tokenId);
              });
            })
            .catch((err) => {
              console.log(err);
            });
          //storeWithProgress(metaFile);
          //   .then(async (metaCid) => {
          //     console.log(metaCid);
          //     createToken(
          //       "https://ipfs.io/ipfs/" + metaCid,
          //       nftPrice,
          //       window.web3,
          //       setMinting,
          //       setMintingProgress,
          //     ).then(async (tokenId) => {
          //       console.log("TOKEN ID Created : ", tokenId); // token created
          //       formData.append("tokenId", tokenId);
          //     });
          //   });
        }

        axios
          .post(
            `${process.env.REACT_APP_SERVER_URL}/user/announcement`,
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
                "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
              },
            },
          )
          .then((data) => {
            setUploadingPost(false);
            setSelectedPost(null);
            setCaption("");
            setphotoPostModalOpen(false);
          })
          .catch((err) => {
            console.log(err);
            setUploadingPost(false);
            setSelectedPost(null);
            setCaption("");
          });
      })
      .catch((err) => {
        console.log(err);
        setUploadingPost(false);
        setSelectedPost(null);
        setCaption("");
      });
  };

  return (
    <div className='modal-box p-0 bg-slate-100 dark:bg-slate-800 '>
      <div className='w-full h-fit p-2 bg-slate-300 dark:bg-slate-700'>
        <div className='flex justify-between items-center p-2'>
          <h3 className='flex items-center gap-2 font-bold text-lg text-brand2'>
            <Camera />
            Photo post
          </h3>
          <X
            onClick={() => setphotoPostModalOpen(false)}
            className='text-brand2 cursor-pointer'></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='w-full p-4 space-y-3'>
          <label
            htmlFor='post_announcement_image'
            className=' cursor-pointer flex items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4'>
            <File />{" "}
            {selectedPost ? (
              selectedPost.file ? (
                `${selectedPost.file[0].name.substring(0, 20)}`
              ) : null
            ) : (
              <> Choose file *</>
            )}
            <input
              id='post_announcement_image'
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='sr-only'
              required={true}
              onClick={(event) => {
                event.target.value = null;
                setSelectedPost(null);
              }}
            />
          </label>
          {selectedPost ? (
            selectedPost.file ? (
              <div className='max-h-36 flex justify-center'>
                <div>
                  <img className='max-h-36' src={selectedPost.localurl}></img>
                </div>
              </div>
            ) : null
          ) : (
            <></>
          )}
          <textarea
            className='textarea  w-full'
            placeholder='Enter caption.'
            onChange={(e) => setCaption(e.target.value)}
            value={caption}></textarea>
          <div className='w-fit flex space-x-2'>
            <label className='flex items-center cursor-pointer gap-2'>
              <input
                type='checkbox'
                value={isNFT}
                onChange={() => setIsNFT(!isNFT)}
                className='checkbox checkbox-primary'
              />
              <span className='label-text text-brand3'>Mint as NFT</span>
            </label>
            {isNFT && (
              <div className='form-control'>
                <label className='input-group'>
                  <input
                    min={1}
                    type='number'
                    placeholder='1'
                    className='input input-bordered input-sm w-24'
                    value={nftPrice}
                    onChange={(e) => setNFTPrice(e.target.value)}
                    required={true}
                  />
                  <span className='text-brand3 bg-slate-300 dark:bg-slate-600 '>
                    <PolygonToken></PolygonToken> &nbsp; Matic
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* While minting NFT */}
          {/* <div className="flex flex-col text-center">
                        <div
                            className={`${minting === true ? 'block' : 'hidden'} mx-3 text-white my-5 `}
                        >
                            👻 Confirm NFT Mint on the next Popup
                        </div>
                        {minting === 'token created' ? (
                            <div className={`  mx-3 text-white my-5 `}>
                                ✅ NFT Token Created Successfully. Confirm Market Listing on the Popup
                            </div>
                        ) : null}

                        <div
                            className={`${mintingProgress === 66 ? 'block' : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-white">Wrapping Up Things &nbsp;</p>
                            <p className="no-underline  text-white"> Please Wait...</p>
                        </div>

                        <div
                            className={`${minting !== null &&
                                minting !== true &&
                                mintingProgress === 100 &&
                                minting !== 'token created'
                                ? 'block'
                                : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-dbeats-light">🚀 NFT Minted &nbsp;</p>
                            <a
                                target={'_blank'}
                                rel="noopener noreferrer "
                                className="dark:text-dbeats-light cursor-pointer underline  "
                                href={`https://polygonscan.com/tx/${minting}`}
                            >
                                Check on Polygonscan
                            </a>
                        </div>
                        <ProgressBar
                            className="w-full mx-auto"
                            percent={mintingProgress}
                            transitionDuration={1000}
                            filledBackground="linear-gradient(to right,  #31c48D, #3f83f8)"
                        >
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon3}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-8"
                                        src={icon2}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                        </ProgressBar>
                    </div> */}

          <button type={"submit"} className='btn btn-brand w-full'>
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoPostModal;
