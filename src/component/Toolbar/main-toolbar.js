import React, { useState } from 'react';

import {
  AnnouncementModal,
  UploadNFTModal,
  UploadTrackModal,
  UploadVideoModal,
} from '../Modals/NavbarModals';

const MainToolbar = () => {
  //Popup
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const handleCloseAnnouncement = () => setShowAnnouncement(false);
  const handleShowAnnouncement = () => setShowAnnouncement(true);

  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const handleCloseVideoUpload = () => setShowVideoUpload(false);
  const handleShowVideoUpload = () => setShowVideoUpload(true);

  const [showTrackUpload, setShowTrackUpload] = useState(false);
  const handleCloseTrackUpload = () => setShowTrackUpload(false);
  const handleShowTrackUpload = () => setShowTrackUpload(true);

  const [showNFTUpload, setShowNFTUpload] = useState(false);
  const handleCloseNFTUpload = () => setShowNFTUpload(false);
  const handleShowNFTUpload = () => setShowNFTUpload(true);

  //Loader
  const [loader, setLoader] = useState(true);

  return (
    <>
      <div className="m-1  font-bold dark:text-white ">
        <button
          className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border border-opacity-10 
                            dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto font-semibold cursor-pointer px-3 
                             hover:text-white dark:text-white dark:hover:bg-dbeats-light"
          onClick={() => {
            handleShowAnnouncement();
            handleCloseVideoUpload();
            handleCloseTrackUpload();
            handleCloseNFTUpload();
          }}
        >
          Create Post
        </button>

        <button
          className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
          onClick={() => {
            handleCloseAnnouncement();
            handleShowVideoUpload();
            handleCloseTrackUpload();
            handleCloseNFTUpload();
          }}
        >
          Upload Video
        </button>
        <button
          className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
          onClick={() => {
            handleCloseAnnouncement();
            handleShowTrackUpload();
            handleCloseVideoUpload();
            handleCloseNFTUpload();
          }}
        >
          Upload Track
        </button>
        <button
          onClick={() => {
            handleShowNFTUpload();
            handleCloseVideoUpload();
            handleCloseTrackUpload();
            handleCloseAnnouncement();
          }}
          className="text-gray-500 lg:mx-2 2xl:mx-3 mx-4 rounded hover:bg-dbeats-light border-dbeats-light border  dark:bg-dbeats-dark-alt 2xl:h-10 h-8 my-auto border-opacity-10 font-semibold cursor-pointer px-3  hover:text-white dark:text-white dark:hover:bg-dbeats-light"
        >
          Mint NFT
        </button>
      </div>
      <AnnouncementModal
        showAnnouncement={showAnnouncement}
        setShowAnnouncement={setShowAnnouncement}
        handleCloseAnnouncement={handleCloseAnnouncement}
        handleShowAnnouncement={handleShowAnnouncement}
        loader={loader}
        setLoader={setLoader}
      />
      <UploadVideoModal
        showVideoUpload={showVideoUpload}
        setShowVideoUpload={setShowVideoUpload}
        handleCloseVideoUpload={handleCloseVideoUpload}
        handleShowVideoUpload={handleShowVideoUpload}
        loader={loader}
        setLoader={setLoader}
      />
      <UploadTrackModal
        showTrackUpload={showTrackUpload}
        setShowTrackUpload={setShowTrackUpload}
        handleCloseTrackUpload={handleCloseTrackUpload}
        handleShowTrackUpload={handleShowTrackUpload}
        loader={loader}
        setLoader={setLoader}
      />
      <UploadNFTModal
        showNFTUpload={showNFTUpload}
        setShowNFTUpload={setShowNFTUpload}
        handleCloseNFTUpload={handleCloseNFTUpload}
        handleShowNFTUpload={handleShowNFTUpload}
        loader={loader}
        setLoader={setLoader}
      />{' '}
    </>
  );
};

export default MainToolbar;
