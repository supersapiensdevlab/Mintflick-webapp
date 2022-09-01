import axios from "axios";
import React from "react";
import { useState } from "react";
import { Bulb, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import useUserActions from "../../../Hooks/useUserActions";

function ThoughtPostModal({ setthoughtPostModalOpen }) {
  const [uploadingPost, setUploadingPost] = useState(false);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  // const [loadFeed] = useUserActions();

  // Minting
  // const [minting, setMinting] = useState(null);
  // const [mintingProgress, setMintingProgress] = useState(0);

  //handle thought submit
  const handleThoughtPost = () => {
    console.log(caption);
    const data = {
      announcement: caption,
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, data, {
        headers: {
          "content-type": "multipart/form-data",
          "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
        },
      })
      .then(() => {
        setthoughtPostModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Bulb />
            Post a Thought
          </h3>
          <X
            onClick={() => setthoughtPostModalOpen(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-full p-4 space-y-3">
          <textarea
            className="textarea  w-full"
            placeholder="Whats on your mind!"
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea>
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
          <progress
            class="progress progress-success w-56 hidden"
            value="50"
            max="100"
          ></progress>

          <button
            type={"submit"}
            onClick={handleThoughtPost}
            className={`btn  w-full ${uploadingPost && "loading"} ${
              caption === "" ? "btn-disabled" : "btn-brand"
            }`}
          >
            Post thought
          </button>
        </div>
      </form>
    </div>
  );
}

export default ThoughtPostModal;
