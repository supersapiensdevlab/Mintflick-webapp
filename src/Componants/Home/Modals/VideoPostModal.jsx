import React from "react";
import { useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  File,
  FileCheck,
  Video,
  X,
} from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";

function VideoPostModal({ setVideoPostModalOpen }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [advancedOptionsShow, setadvancedOptionsShow] = useState(false);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Video />
            Upload Video
          </h3>
          <X
            onClick={() => setVideoPostModalOpen(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form onSubmit={""}>
        <div className="w-full p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-1">
            <label
              htmlFor=""
              className=" cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
            >
              {/* {selectedPost ? (
                selectedPost.file ? ( */}
              <div className="w-full  rounded-lg overflow-clip">
                <img
                  src={
                    "https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                  }
                ></img>
              </div>
              {/* ) : null
              ) : (
                <></>
              )} */}
              <div className="flex ">
                <File />
                Choose video thumbnail
              </div>
            </label>
            <label
              htmlFor=""
              className=" cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
            >
              {/* {selectedPost ? (
                selectedPost.file ? ( */}
              <div className="rounded-lg overflow-clip">
                <img
                  src={
                    "https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                  }
                ></img>
              </div>
              {/* ) : null
              ) : (
                <></>
              )} */}
              <div className="flex">
                <File />
                Choose video file
              </div>
            </label>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Video title"
              className="input w-full "
            />
            <select className="select w-44">
              <option disabled selected>
                Pick Category
              </option>
              <option>Homer</option>
              <option>Marge</option>
              <option>Bart</option>
              <option>Lisa</option>
              <option>Maggie</option>
            </select>
          </div>

          <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea>
          <span
            onClick={() => setadvancedOptionsShow(!advancedOptionsShow)}
            className="flex px-2 items-center gap-1 font-semibold text-brand3 cursor-pointer"
          >
            Advanced options
            <label
              class={`swap ${
                advancedOptionsShow && "swap-active"
              } swap-rotate text-6xl`}
            >
              <div class="swap-on">
                <ChevronUp />
              </div>
              <div class="swap-off">
                <ChevronDown />
              </div>
            </label>
          </span>
          {advancedOptionsShow && (
            <div className="flex gap-1 w-full flex-wrap">
              <select className="select select-xs ">
                <option disabled selected>
                  Allow Attribution?
                </option>
                <option>Homer</option>
                <option>Marge</option>
                <option>Bart</option>
                <option>Lisa</option>
                <option>Maggie</option>
              </select>
              <select className="select select-xs ">
                <option disabled selected>
                  Commercial Use?
                </option>
                <option>Homer</option>
                <option>Marge</option>
                <option>Bart</option>
                <option>Lisa</option>
                <option>Maggie</option>
              </select>
              <select className="select select-xs ">
                <option disabled selected>
                  Derivative Works?
                </option>
                <option>Homer</option>
                <option>Marge</option>
                <option>Bart</option>
                <option>Lisa</option>
                <option>Maggie</option>
              </select>
            </div>
          )}

          <div className="w-fit flex space-x-2">
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                value={isNFT}
                onChange={() => setIsNFT(!isNFT)}
                className="checkbox checkbox-primary"
              />
              <span className="label-text text-brand3">Mint as NFT</span>
            </label>
            {isNFT && (
              <div className="form-control">
                <label className="input-group">
                  <input
                    min={1}
                    type="number"
                    placeholder="1"
                    className="input input-bordered input-sm w-24"
                    value={nftPrice}
                    onChange={(e) => setNFTPrice(e.target.value)}
                    required={true}
                  />
                  <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
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

          <button type={"submit"} className="btn btn-brand w-full">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoPostModal;
