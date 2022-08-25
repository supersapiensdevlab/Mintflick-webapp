import React, { useContext, useState } from "react";
import {
  Camera,
  ChartBar,
  File,
  Music,
  PlayCard,
  Send,
  Video,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import AudioPostModal from "./Modals/AudioPostModal";
import PhotoPostModal from "./Modals/PhotoPostModal";
import PollModal from "./Modals/PollModal";
import VideoPostModal from "./Modals/VideoPostModal";

function AddPost() {
  //text post
  const [postTextData, setpostTextData] = useState("");
  function postText() {
    alert(postTextData);
  }
  const State = useContext(UserContext);

  // post modals
  const [photoPostModalOpen, setphotoPostModalOpen] = useState(false);

  const [videoPostModalOpen, setvideoPostModalOpen] = useState(false);

  const [audioPostModalOpen, setaudioPostModalOpen] = useState(false);

  const [pollModalOpen, setpollModalOpen] = useState(false);

  return (
    <div className=" flex flex-col items-center w-full max-w-2xl h-fit bg-slate-100 dark:bg-slate-800  rounded-xl lg:py-8  space-y-4">
      <div className="flex items-center w-full px-2 lg:px-8 space-x-4 rounded-3xl">
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
      <div className="btn-group ">
        <button
          onClick={() => {
            setphotoPostModalOpen(true);
          }}
          className="btn btn-primary btn-outline btn-sm lg:btn-md  text-brand gap-2 group"
        >
          <Camera className="group-hover:motion-safe:animate-bounce"></Camera>
          Photo
        </button>

        <button
          onClick={() => {
            setvideoPostModalOpen(true);
          }}
          className="btn btn-primary  btn-outline btn-sm lg:btn-md  text-brand gap-2 group"
        >
          <Video className="group-hover:motion-safe:animate-bounce"></Video>
          Video
        </button>
        <button
          onClick={() => {
            setaudioPostModalOpen(true);
          }}
          className="btn btn-primary  btn-outline btn-sm lg:btn-md  text-brand gap-2 group"
        >
          <Music className="group-hover:motion-safe:animate-bounce"></Music>
          Music
        </button>
        <button
          onClick={() => {
            setpollModalOpen(true);
          }}
          className="btn btn-primary  btn-outline btn-sm lg:btn-md  text-brand gap-2 group"
        >
          <ChartBar className="group-hover:motion-safe:animate-bounce "></ChartBar>
          Poll
        </button>
      </div>
      {/* photo post modal */}
      <div
        className={`${
          photoPostModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <PhotoPostModal setphotoPostModalOpen={setphotoPostModalOpen} />
      </div>
      <div
        className={`${
          videoPostModalOpen && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <VideoPostModal setVideoPostModalOpen={setvideoPostModalOpen} />
      </div>
      <div
        className={`${
          audioPostModalOpen && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <AudioPostModal setAudioPostModalOpen={setaudioPostModalOpen} />
      </div>
      <div
        className={`${
          pollModalOpen && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <PollModal setPollModalOpen={setpollModalOpen} />
      </div>
    </div>
  );
}

export default AddPost;
