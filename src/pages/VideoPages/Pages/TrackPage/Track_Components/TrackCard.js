import React from 'react';
import { Link } from 'react-router-dom';

const TrackCard = (props) => {
  //console.log(props);

  return (
    <div id="tracks-section" className={` text-gray-200   mx-auto  py-2.5 -mt-3 w-full px-2 group`}>
      {/* header */}
      <div
        className="bg-white group dark:bg-dbeats-dark-primary 
        dark:text-blue-300 shadow-md  flex p-2  mx-auto  rounded-lg  
        w-full hover:scale-101 transform transition-all"
      >
        <div className=" flex items-center h-32 w-44 cursor-pointer bg-gray-300">
          <Link
            to={{
              pathname: `/track/${props.username}/${props.index}`,
            }}
            onClick={() => {
              window.sessionStorage.setItem('Track_Array', JSON.stringify(''));
              window.sessionStorage.setItem('Track_Array_Size', 0);
              window.sessionStorage.setItem('Track_Index', 0);
            }}
          >
            <img
              id="album-artwork"
              src={props.track.trackImage}
              className="mx-auto w-full h-full rounded"
              alt=""
            ></img>
          </Link>
        </div>

        <div className="flex flex-col justify-center ml-6 w-full">
          <p
            id="song-title"
            className="w-full max-w-full mt-0 mb-1 drop-shadow xl:text-lg  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
          >
            {props.track.trackName}
          </p>

          <p id="song-author" className="mt-0  mb-1 md:mb-2 text-gray-600 text-md font-semibold">
            {props.username}&nbsp;
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
