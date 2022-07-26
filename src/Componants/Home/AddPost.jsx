import React from "react";
import { Camera, Music, PlayCard, Send, Video } from "tabler-icons-react";

function AddPost() {
  return (
    <div className="hidden lg:flex flex-col items-center w-full max-w-2xl h-fit bg-slate-100 dark:bg-slate-800  rounded-xl py-8  space-y-4">
      <div className="flex items-center w-full px-8 space-x-4 rounded-3xl">
        <textarea
          className="flex-grow textarea h-12 rounded-3xl w-full "
          placeholder="What's on your mind?"
        ></textarea>
        <button className="btn btn-primary btn-brand rounded-full gap-2 ">
          <Send size={20}></Send>
          post
        </button>
      </div>
      <div className="btn-group">
        <button className="btn btn-primary btn-outline  text-brand gap-2 group">
          <Camera className="group-hover:scale-110 group-hover:rotate-12 ease-in-out transition-transform delay-100"></Camera>
          Photo
        </button>

        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <Video className="group-hover:scale-110 group-hover:rotate-12 ease-in-out transition-transform delay-100"></Video>
          Video
        </button>
        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <Music className="group-hover:scale-110 group-hover:rotate-12 ease-in-out transition-transform delay-100"></Music>
          Music
        </button>
        <button className="btn btn-primary  btn-outline  text-brand gap-2 group">
          <PlayCard className="group-hover:scale-110 group-hover:rotate-12 ease-in-out transition-transform delay-100"></PlayCard>
          NFT
        </button>
      </div>
    </div>
  );
}

export default AddPost;
