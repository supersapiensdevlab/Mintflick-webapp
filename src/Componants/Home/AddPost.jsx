import React, { useContext, useState } from "react";
import {
  Camera,
  File,
  Music,
  PlayCard,
  Send,
  Video,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import PhotoPostModal from "./PhotoPostModal";

function AddPost() {
  //text post
  const [postTextData, setpostTextData] = useState("");
  function postText() {
    alert(postTextData);
  }
  const State = useContext(UserContext);


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
          onClick={() => {
            setphotoPostModalOpen(true)
          }}
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
        className={`${photoPostModalOpen && "modal-open"
          } modal modal-bottom sm:modal-middle`}
      >
        <PhotoPostModal setphotoPostModalOpen={setphotoPostModalOpen} />
      </div>
    </div>
  );
}

export default AddPost;
