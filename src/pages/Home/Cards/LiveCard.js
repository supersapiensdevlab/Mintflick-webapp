import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import person from '../../../assets/images/profile.svg';
import classes from '../Home.module.css';

const LiveCard = (props) => {
  //const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const handleMouseMove = () => {
    setMuted(false);
  };

  const handleMouseLeave = () => {
    setMuted(true);
  };

  return (
    <div className="w-full h-auto min-h-full  ">
      <div className=" cursor-pointer hover:border-dbeats-light border border-transparent  sm:p-0.5 nm-flat-dbeats-dark-secondary   rounded-md">
        <Link to={`/live/${props.username}/`}>
          <span className="fixed bg-red-600 text-white px-1 mx-1 my-1 rounded-sm font-semibold">
            {' '}
            Live{' '}
          </span>

          <ReactPlayer
            playing={true}
            autoPlay={true}
            width="100%"
            height="100%"
            muted={true}
            volume={0.5}
            url={`https://cdn.livepeer.com/hls/${props.liveUserData.livepeer_data.playbackId}/index.m3u8`}
            controls={false}
            className=" bg-gray-200 dark:bg-dbeats-dark-primary  rounded-md"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          <div className=" absolute bottom-0   px-3 py-4">
            <div className="flex items-center text-black text-sm font-medium  ">
              <img
                src={props.liveUserData ? props.liveUserData.profile_image : person}
                alt=""
                className="w-10 h-10 rounded-full mr-2 bg-gray-100  "
              />
              <div>
                <span className="text-sm font-semibold text-dbeats-white  ">
                  {props.liveUserData.name}
                </span>
                <br />
                {/* <span className="text-xs text-gray-500">{props.playbackUserData.videos[props.index].description.slice(0,30)+"..."}</span> */}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LiveCard;
