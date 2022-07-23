import React from "react";
import { Camera, Music, PlayCard, Send, Video } from "tabler-icons-react";

function AddPost() {
  return (
    <div className="hidden lg:flex flex-col items-center w-full max-w-2xl h-fit bg-gray-100 dark:bg-slate-800  rounded-xl p-8  space-y-4">
      <div className="flex items-center w-full  space-x-4 rounded-3xl">
        <textarea
          className="flex-grow textarea h-12 rounded-3xl w-full dark:bg-gray-700 dark:text-gray-400"
          placeholder="What's on your mind?"
        ></textarea>
        <button className="btn btn-primary text-brand rounded-full gap-2 ">
          <Send size={20}></Send>
          post
        </button>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary btn-outline text-brand gap-2">
          <Camera></Camera>
          Photo
        </button>

        <button className="btn btn-primary  btn-outline text-brand gap-2">
          <Video></Video>
          Video
        </button>
        <button className="btn btn-primary  btn-outline text-brand gap-2">
          <Music></Music>
          Music
        </button>
        <button className="btn btn-primary  btn-outline text-brand gap-2">
          <PlayCard></PlayCard>
          NFT
        </button>
      </div>
    </div>
  );
}

export default AddPost;
