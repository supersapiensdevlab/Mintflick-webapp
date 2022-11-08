import React, { useContext, useState } from "react";
import {
  Bulb,
  Camera,
  ChartBar,
  File,
  Music,
  PlayCard,
  Plus,
  Send,
  Video,
  X,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import ThoughtPostModal from "./Modals/ThoughtPostModal";
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
  const [thoughtPostModalOpen, setthoughtPostModalOpen] = useState(false);

  const [photoPostModalOpen, setphotoPostModalOpen] = useState(false);

  const [videoPostModalOpen, setvideoPostModalOpen] = useState(false);

  const [audioPostModalOpen, setaudioPostModalOpen] = useState(false);

  const [pollModalOpen, setpollModalOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:flex flex-col items-center w-full max-w-2xl h-fit bg-slate-100 dark:bg-slate-800  rounded-xl lg:py-8  space-y-4">
        <div className="flex items-center w-full px-2 lg:px-8 space-x-4 rounded-3xl">
          <textarea
            onClick={() => setthoughtPostModalOpen(true)}
            className="flex-grow textarea h-12 rounded-3xl w-full "
            placeholder="What's on your mind?"
          ></textarea>
          {/* <button className="btn btn-primary btn-brand rounded-full gap-2 ">
            <Send size={20}></Send>
            post
          </button> */}
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
          {/* <button
            onClick={() => {
              setaudioPostModalOpen(true);
            }}
            className="btn btn-primary  btn-outline btn-sm lg:btn-md  text-brand gap-2 group"
          >
            <Music className="group-hover:motion-safe:animate-bounce"></Music>
            Music
          </button> */}
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
      </div>
      {/* FAB */}
      <div className="lg:hidden fixed bottom-24 right-2 z-40 dropdown dropdown-top dropdown-end ">
        <label tabindex="0" className="btn btn-lg btn-circle btn-brand">
          <Plus />
        </label>
        <ul
          tabindex="0"
          className="dropdown-content menu p-2 m-2 shadow-lg   bg-slate-100 dark:bg-slate-600 text-brand2 font-semibold rounded-lg w-fit "
        >
          <li>
            <a
              onClick={() => {
                setthoughtPostModalOpen(true);
              }}
              className="dark:hover:bg-slate-800"
            >
              <Bulb />
              Thought
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setphotoPostModalOpen(true);
              }}
              className="dark:hover:bg-slate-800"
            >
              <Camera />
              Photo
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setvideoPostModalOpen(true);
              }}
              className="dark:hover:bg-slate-800"
            >
              <Video />
              Video
            </a>
          </li>
          {/* <li>
            <a
              onClick={() => {
                setaudioPostModalOpen(true);
              }}
              className="dark:hover:bg-slate-800"
            >
              <Music />
              Audio
            </a>
          </li> */}
          <li>
            <a
              onClick={() => {
                setpollModalOpen(true);
              }}
              className="dark:hover:bg-slate-800"
            >
              <ChartBar />
              Poll
            </a>
          </li>
        </ul>
      </div>
      {/*  post modal */}
      <div
        className={`${
          thoughtPostModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <ThoughtPostModal setthoughtPostModalOpen={setthoughtPostModalOpen} />
      </div>
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
    </>
  );
}

export default AddPost;
