import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import person from '../../assets/images/profile.svg';

import {
  AnnouncementModal,
  UploadNFTModal,
  UploadTrackModal,
  UploadVideoModal,
} from '../Modals/NavbarModals';

import useWeb3Modal from '../../hooks/useWeb3Modal';
import { useSelector } from 'react-redux';

const MainToolbar = () => {
  //Popup
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const handleCloseAnnouncement = () => setShowAnnouncement(false);
  const handleShowAnnouncement = () => setShowAnnouncement(true);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const handleCloseVideoUpload = () => setShowVideoUpload(false);
  const handleShowVideoUpload = () => setShowVideoUpload(true);

  const [showTrackUpload, setShowTrackUpload] = useState(false);
  const handleCloseTrackUpload = () => setShowTrackUpload(false);
  const handleShowTrackUpload = () => setShowTrackUpload(true);

  const [showNFTUpload, setShowNFTUpload] = useState(false);
  const handleCloseNFTUpload = () => setShowNFTUpload(false);
  const handleShowNFTUpload = () => setShowNFTUpload(true);

  const [showPictureModal, setShowPictureModal] = useState(false);
  const handleClosePictureModal = () => setShowPictureModal(false);
  const handleShowPictureModal = () => setShowPictureModal(true);

  //Loader
  const [loader, setLoader] = useState(true);
  const user = useSelector((state) => state.User.user);
  const [iceBreaker, setIceBreaker] = useState(['Hello World!']);

  const questions = [
    'how are you today?',
    'how do you feel?',
    'Hey! whats up?',
    'how are you doing?',
  ];

  useEffect(() => {
    setIceBreaker(questions[Math.floor(Math.random() * questions.length)]);
  }, []);

  return (
    <>
      <div className="p-0.5 w-full  font-bold dark:text-white sm:rounded-xl bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary nm-flat-dbeats-dark-primary-lg">
        <div className=" p-2  font-bold dark:text-white sm:rounded-xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary">
          <div className="flex justify-between mb-2 px-2">
            <Link to={`/profile/${user.username}`} className="mr-4">
              <img
                src={user.profile_image !== '' ? user.profile_image : person}
                alt=""
                className="  w-16 h-14   rounded-full    self-start"
              />
            </Link>

            <input
              onClick={() => {
                handleShowAnnouncement();
                handleCloseVideoUpload();
                handleCloseTrackUpload();
                handleCloseNFTUpload();
              }}
              placeholder={iceBreaker}
              className="border-2 border-dbeats-dark-secondary text-gray-200 rounded-3xl w-full nm-flat-dbeats-dark-primary placeholder-white placeholder-opacity-25 px-5 focus:nm-inset-dbeats-dark-primary "
            ></input>
          </div>

          <div className=" flex justify-end px-1">
            <div
              onClick={() => {
                handleShowAnnouncement();
                handleCloseVideoUpload();
                handleCloseTrackUpload();
                handleCloseNFTUpload();
              }}
              className=" rounded-3xl group w-max  p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary       hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <div className=" group h-full w-full text-black dark:text-white p-1 flex  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <i className="fas fa-camera self-center mx-2 text-white opacity-70 group-hover:opacity-100"></i>
                <p className="self-center mx-2 text-white opacity-70 group-hover:opacity-100 sm:font-normal text-xs">
                  Post
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                handleCloseAnnouncement();
                handleShowVideoUpload();
                handleCloseTrackUpload();
                handleCloseNFTUpload();
              }}
              className=" rounded-3xl group w-max  p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <div className="  h-full w-full text-black dark:text-white p-1 flex  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <i className="fas fa-video self-center mx-2 text-white opacity-70 group-hover:opacity-100"></i>
                <p className="self-center mx-2 text-white opacity-70 group-hover:opacity-100 sm:font-normal text-xs ">
                  Video
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                handleCloseAnnouncement();
                handleShowTrackUpload();
                handleCloseVideoUpload();
                handleCloseNFTUpload();
              }}
              className=" rounded-3xl group w-max  p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <div className="  h-full w-full text-black dark:text-white p-1 flex  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <i className="fas fa-music self-center mx-2 text-white opacity-70 group-hover:opacity-100"></i>
                <p className="self-center mx-2 text-white opacity-70 group-hover:opacity-100 sm:font-normal text-xs">
                  Track
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                handleShowNFTUpload();
                handleCloseVideoUpload();
                handleCloseTrackUpload();
                handleCloseAnnouncement();
              }}
              className=" rounded-3xl group w-max  p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <div className="  h-full w-full text-black dark:text-white p-1 flex  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <i className="fas fa-stroopwafel self-center mx-2 text-white opacity-70 group-hover:opacity-100"></i>
                <p className="self-center mx-2 text-white opacity-70 group-hover:opacity-100 sm:font-normal text-xs">
                  NFT
                </p>
              </div>
            </div>

            {/* <div
              onClick={() => {
                handleShowPictureModal();
                handleCloseVideoUpload();
                handleCloseTrackUpload();
                handleCloseAnnouncement();
                handleCloseNFTUpload();
              }}
              className=" rounded-3xl group w-max  p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <div className="  h-full w-full text-black dark:text-white p-1 flex  rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <i className="fas fa-stroopwafel self-center mx-2 text-white opacity-70 group-hover:opacity-100"></i>
                <p className="self-center mx-2 text-white opacity-70 group-hover:opacity-100 sm:font-normal text-xs">
                  Photo
                </p>
              </div>
            </div> */}
          </div>
        </div>
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
