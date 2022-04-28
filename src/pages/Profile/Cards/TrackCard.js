import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteModal from '../../../component/Modals/DeleteModal/DeleteModal';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';
import moment from 'moment';

const TrackCard = (props) => {
  //console.log(props);
  moment().format();

  const [play, setPlay] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [audio, setAudio] = useState(new Audio(props.track.link));

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  const [showDelete, setShowDelete] = useState(false);
  const [time, setTime] = useState(null);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/track/${props.username}/${props.index}`;

  const convertTimestampToTime = () => {
    const timestamp = new Date(props.track.time * 1000); // This would be the timestamp you want to format
    setTime(moment(timestamp).fromNow());
  };

  useEffect(() => {
    convertTimestampToTime();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!play) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [play, audio]);

  const handlePlay = () => {
    setPlay(!play);
  };

  return (
    <div id="tracks-section" className="py-1 ">
      <div
        className={`w-full  flex  md:flex-row flex-col  py-3 
      bg-gray-50 shadow-lg  sm:rounded border border-white border-opacity-5 dark:bg-dbeats-dark-secondary 
        dark:text-gray-100 
      lg:px-3 2xl:px-3 md:p-2`}
      >
        <div
          className={`cursor-pointer mx-auto items-center lg:w-80 2xl:w-80 2xl:h-48 lg:h-32 md:h-36 h-52 dark:bg-dbeats-dark-primary bg-gray-100`}
        >
          <Link
            to={{
              pathname: `/track/${props.username}/${props.track.trackId}`,
            }}
            onClick={() => {
              window.sessionStorage.setItem('Track_Array', JSON.stringify(''));
              window.sessionStorage.setItem('Track_Array_Size', 0);
            }}
          >
            <img
              id="album-artwork"
              src={props.track.trackImage}
              className="cursor-pointer   w-full h-full  my-auto "
              alt=""
            ></img>
          </Link>
        </div>

        <div className={`px-5 w-full py-2 md:ml-4 lg:ml-0`}>
          <p className="flex justify-between pb-1 text-black text-sm font-medium  dark:text-gray-100">
            <div>
              <div className="flex">
                <h4 className="playlist mr-1 mt-0  uppercase text-gray-500 tracking-widest 2xl:text-md lg:text-xs pb-1">
                  {props.track.genre}
                </h4>{' '}
                &middot;
                <p className="2xl:text-sm lg:text-xs md:text-sm text-gray-500 ml-1">{time}</p>
              </div>
              <div className="">
                <p className="2xl:text-2xl lg:text-md md:text-lg  ">{props.track.trackName}</p>
                <p className="2xl:text-base lg:text-xs md:text-sm text-gray-500 mr-2 mt-1">
                  {props.track.description}
                </p>
                <div className="flex">
                  <p className="2xl:text-lg lg:text-xs text-gray-500 mr-2 mt-1 hidden">
                    {props.username}&nbsp;
                  </p>
                </div>
                <p className="2xl:text-sm lg:text-xs text-gray-500 lg:my-3 2xl:my-0"> </p>
              </div>
            </div>
            <div>
              {props.privateUser && (
                <button
                  onClick={() => {
                    setShowDelete(true);
                  }}
                  className=" cursor-pointer      hover:bg-red-500   text-white block  py-2 px-3  hover:scale-99 transform transition-all"
                >
                  <i className="fa-solid fa-trash-can mr-2 text-sm"></i>Delete
                </button>
              )}
            </div>
          </p>
          <div className=" flex 2xl:mt-4 lg:mt-2 md:mt-2 rounded bottom-0">
            <div className="  flex  ">
              <button
                onClick={handlePlay}
                className=" cursor-pointer mr-2      bg-gradient-to-r  from-green-400  to-blue-500   text-white block 2xl:py-2 px-4  hover:scale-95 transform transition-all"
              >
                <p className="   lg:text-sm ">
                  <i className="fa-solid fa-play mr-1"></i>
                  {`${play ? 'Pause' : 'Play'}`}
                </p>
              </button>
              <div className="2xl:text-xl lg:text-lg text-gray-500  ">
                <button className=" p-2" onClick={handleShow}>
                  <i className="fas fa-share-alt hover:text-dbeats-white"></i>
                </button>
              </div>
            </div>
          </div>
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
        type="track"
        data={props.track}
        show={showDelete}
        setShowDelete={setShowDelete}
      ></DeleteModal>
    </div>
  );
};

export default TrackCard;
