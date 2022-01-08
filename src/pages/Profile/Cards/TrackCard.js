import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';

const TrackCard = (props) => {
  //console.log(props);

  const [play, setPlay] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [audio, setAudio] = useState(new Audio(props.track.link));

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/track/${props.username}/${props.index}`;

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
      bg-gray-50 shadow-lg  rounded  dark:bg-dbeats-dark-secondary 
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
          <p className="flex justify-between pb-1 text-black text-sm font-medium dark:text-gray-100">
            <div>
              <h4 className="playlist  mt-0  uppercase text-gray-500 tracking-widest 2xl:text-md lg:text-xs pb-1">
                {props.track.genre}
              </h4>
              <div className="">
                <p className="2xl:text-2xl lg:text-md md:text-lg font-semibold">
                  {props.track.trackName}
                </p>
                <div className="flex">
                  <p className="2xl:text-lg lg:text-xs text-gray-500 mr-2 mt-1">
                    {props.username}&nbsp;
                  </p>
                </div>
                <p className="2xl:text-sm lg:text-xs text-gray-500 lg:my-3 2xl:my-0"> </p>
              </div>
            </div>
            <div>
              <div className="2xl:text-2xl lg:text-lg text-gray-500 ">
                <button className="px-1" onClick={handleShow}>
                  <i className="fas fa-share-alt hover:text-dbeats-light"></i>
                </button>
              </div>
            </div>
          </p>
          <div className=" flex 2xl:mt-4 lg:mt-2 md:mt-2 rounded bottom-0">
            <div className=" sm:flex 2xl:text-lg lg:text-md ">
              <button
                onClick={handlePlay}
                className=" cursor-pointer mr-2 uppercase font-bold  bg-gradient-to-r from-green-400 to-blue-500   text-white block 2xl:py-2 2xl:px-10 lg:px-7 lg:py-1 py-1 px-5   hover:scale-95 transform transition-all"
              >
                <p className=" 2xl:text-lg lg:text-sm ">{`${play ? 'Pause' : 'Play'}`}</p>
              </button>
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
    </div>
  );
};

export default TrackCard;
