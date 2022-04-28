import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import DeleteModal from '../../../component/Modals/DeleteModal/DeleteModal';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';
import classes from '../Profile.module.css';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useWeb3Modal from '../../../hooks/useWeb3Modal';
moment().format();

const CarouselCard = (props) => {
  const user = useSelector((state) => state.User.user);
  const history = useHistory();
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  //console.log(props);
  const [playing, setPlaying] = useState(false);

  const [time, setTime] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  const [showDelete, setShowDelete] = useState(false);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/playback/${props.username}/${props.playbackUserData.videoId}`;

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const convertTimestampToTime = () => {
    const timestamp = new Date(props.playbackUserData.time * 1000); // This would be the timestamp you want to format
    setTime(moment(timestamp).fromNow());
  };

  useEffect(() => {
    convertTimestampToTime();
    // eslint-disable-next-line
  }, []);

  ////console.log(props.playbackUserData)
  const handlePlayerClick = async () => {
    if (user) {
      history.push(`/playback/${props.username}/${props.playbackUserData.videoId}`);
    } else {
      await loadWeb3Modal();
    }
  };
  return (
    <div id="tracks-section" className="py-1 ">
      <div
        className={`w-full  flex  md:flex-row flex-col  lg:py-3 
      bg-gray-50 shadow-lg  sm:rounded border border-white border-opacity-5 dark:bg-dbeats-dark-secondary 
        dark:text-gray-100 
      lg:px-3 2xl:px-3 md:p-2`}
      >
        <div
          className={`cursor-pointer h-64 lg:h-32 2xl:h-48 md:h-40 lg:w-1/3 w-full  my-auto dark:bg-dbeats-dark-primary `}
        >
          <a onClick={handlePlayerClick}>
            <ReactPlayer
              width="100%"
              height="100%"
              playing={playing}
              muted={false}
              volume={0.5}
              className={`${classes.cards_videos}`}
              light={props.playbackUserData.videoImage}
              url={props.playbackUserData.link}
              controls={false}
            />
          </a>
        </div>
        <div className="col-start-1 row-start-3 py-2 px-5 w-full">
          <p className="flex justify-between mt-0 sm:pb-1 text-black text-sm font-medium dark:text-gray-100 ">
            <div>
              <div className="flex">
                <h4 className="playlist mr-1   uppercase text-gray-500 tracking-widest 2xl:text-md lg:text-xs text-xs md:text-sm ">
                  {props.playbackUserData.category}
                </h4>
                &middot;
                <p className="2xl:text-sm lg:text-xs md:text-sm text-gray-500 ml-1">{time}</p>
              </div>
              <div className="">
                <p className="2xl:text-xl lg:text-md md:text-lg ">
                  {props.playbackUserData.videoName}
                </p>
                <div className="flex">
                  <p className="2xl:text-base lg:text-xs md:text-sm text-gray-500 mr-2 mt-1">
                    {props.playbackUserData.description}
                  </p>
                </div>

                <div>
                  <div className="2xl:text-2xl lg:text-lg text-gray-500 mt-2">
                    <button className="px-1" onClick={handleShow}>
                      <i className="fas fa-share-alt hover:text-dbeats-white"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className=" mt-2">
              {props.privateUser && (
                <button
                  onClick={() => {
                    setShowDelete(true);
                  }}
                  className="flex  px-2 py-1   text-dbeats-white hover:bg-red-500"
                >
                  <i className="fa-solid fa-trash-can mr-2 text-sm"></i>Delete
                </button>
              )}
            </div>
          </p>
        </div>
      </div>
      <ShareModal
        show={show}
        handleClose={handleClose}
        sharable_data={sharable_data}
        copybuttonText={buttonText}
        setCopyButtonText={setButtonText}
      />
      <DeleteModal
        type="video"
        data={props.playbackUserData}
        show={showDelete}
        setShowDelete={setShowDelete}
      ></DeleteModal>
    </div>
  );
};

export default CarouselCard;
