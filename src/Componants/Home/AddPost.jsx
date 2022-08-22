import React, { useState } from "react";
import {
  Camera,
  File,
  Music,
  PlayCard,
  Send,
  Video,
  X,
} from "tabler-icons-react";

function AddPost() {
  //text post
  const [postTextData, setpostTextData] = useState("");
  function postText() {
    alert(postTextData);
  }

  //photo post
  const [photoPostModalOpen, setphotoPostModalOpen] = useState(false);

  return (
    <div className="hidden lg:flex flex-col items-center w-full max-w-2xl h-fit bg-slate-100 dark:bg-slate-800  rounded-xl py-8  space-y-4">
      <div className="flex items-center w-full px-8 space-x-4 rounded-3xl">
        <textarea
          onChange={(e) => setpostTextData(e.target.value)}
          value={postTextData}
          className="flex-grow textarea h-12 rounded-3xl w-full "
          placeholder="What's on your mind?"
        ></textarea>
        <button
          onClick={() => {
            postText();
            setpostTextData("");
          }}
          className="btn btn-primary btn-brand rounded-full gap-2 "
        >
          <Send size={20}></Send>
          post
        </button>
      </div>
      <div className="btn-group">
        <button
          onClick={() => setphotoPostModalOpen(true)}
          className="btn btn-primary btn-outline  text-brand gap-2 group"
        >
          <Camera className="group-hover:motion-safe:animate-bounce"></Camera>
          Photo
        </button>

        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <Video className="group-hover:motion-safe:animate-bounce"></Video>
          Video
        </button>
        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <Music className="group-hover:motion-safe:animate-bounce"></Music>
          Music
        </button>
        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <PlayCard className="group-hover:motion-safe:animate-bounce "></PlayCard>
          NFT
        </button>
      </div>
      {/* photo post modal */}
      <div
        className={`${
          photoPostModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
          <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
            <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full"></div>
            <div className="flex justify-between items-center p-2">
              <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                <Camera />
                Photo post
              </h3>
              <X
                onClick={() => setphotoPostModalOpen(false)}
                className="text-brand2 cursor-pointer"
              ></X>
            </div>
          </div>
          <div className="w-full p-4 space-y-3">
            <div className="flex items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4">
              <File /> Choose file
            </div>
            <textarea
              className="textarea  w-full"
              placeholder="Enter caption."
            ></textarea>
            <div className="w-fit flex space-x-2">
              <label className="flex items-center cursor-pointer gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text text-brand3">Mint as NFT</span>
              </label>
              <div className="form-control">
                <label className="input-group">
                  <input
                    type="number"
                    placeholder="1"
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
                    Matic
                  </span>
                </label>
              </div>
            </div>
            <button className="btn btn-brand w-full">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPost;
