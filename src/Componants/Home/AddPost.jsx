import React, { useContext, useState } from "react";
import {
  Bulb,
  Camera,
  ChartBar,
  DeviceGamepad2,
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
import { Link } from "react-router-dom";
import producthuntImage from "../../Assets/productHunt.webp";

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
      <a
        href="https://airtable.com/shrF2lZX7vSV844Oe"
        target={"_blank"}
        className=" w-full my-2 bg-white lg:rounded-lg  cursor-pointer"
      >
        <img
          className=" w-full lg:rounded-md"
          src={producthuntImage}
          alt="quest-banner"
        />
      </a>
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
      <div
        // className={`${State.database.showHeader ? "" : "translate-y-20"}
        className={`bottom-20 transition-all ease-in-out lg:hidden fixed  right-2 z-40 space-x-1 `}
      >
        {/* for games */}
        {/* <Link
          to={`/homescreen/allgames`}
          className="btn btn-circle btn-md rounded-full btn-brand"
        >
          <DeviceGamepad2 />
        </Link> */}
        <div
          className={`
         dropdown dropdown-top dropdown-end `}
        >
          <label
            tabindex="0"
            className={`${
              State.database.showHeader ? "gap-1 " : "btn-circle"
            } btn btn-md rounded-full btn-brand transition-all ease-in-out capitalize font-semibold`}
          >
            <Plus size={State.database.showHeader ? 20 : 24} />
            {State.database.showHeader && <span>New Post</span>}
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
      </div>
      {/*  post modal */}
      {thoughtPostModalOpen && (
        <div
          className={`${
            thoughtPostModalOpen && "modal-open"
          } modal modal-bottom sm:modal-middle`}
        >
          <ThoughtPostModal setthoughtPostModalOpen={setthoughtPostModalOpen} />
        </div>
      )}
      {photoPostModalOpen && (
        <div
          className={`${
            photoPostModalOpen && "modal-open"
          } modal  modal-bottom sm:modal-middle`}
        >
          <PhotoPostModal setphotoPostModalOpen={setphotoPostModalOpen} />
        </div>
      )}
      {videoPostModalOpen && (
        <div
          className={`${
            videoPostModalOpen && "modal-open"
          } modal  modal-bottom sm:modal-middle`}
        >
          <VideoPostModal setVideoPostModalOpen={setvideoPostModalOpen} />
        </div>
      )}
      {audioPostModalOpen && (
        <div
          className={`${
            audioPostModalOpen && "modal-open"
          } modal  modal-bottom sm:modal-middle`}
        >
          <AudioPostModal setAudioPostModalOpen={setaudioPostModalOpen} />
        </div>
      )}
      {pollModalOpen && (
        <div
          className={`${
            pollModalOpen && "modal-open"
          } modal  modal-bottom sm:modal-middle`}
        >
          <PollModal setPollModalOpen={setpollModalOpen} />
        </div>
      )}
    </>
  );
}

export default AddPost;
