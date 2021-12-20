import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import person from '../../../assets/images/profile.svg';
import classes from '../Home.module.css';

const LiveCard = (props) => {
  const [playing, setPlaying] = useState(false);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  return (
    <div className="w-full h-auto  ">
      <div className=" cursor-pointer ">
        <a href={`/live/${props.username}/`}>
          <span className="fixed bg-red-600 text-white px-1 mx-1 my-1 rounded-sm font-semibold">
            {' '}
            Live{' '}
          </span>

          <ReactPlayer
            playing={playing}
            autoplay={true}
            width="100%"
            height="auto"
            muted={false}
            volume={0.5}
            url={`https://cdn.livepeer.com/hls/${props.liveUserData.livepeer_data.playbackId}/index.m3u8`}
            controls={false}
            className={`${classes.cards_videos} `}
            onMouseMove={handleMouseMove}
            onMouseLeave={hanldeMouseLeave}
          />
        </a>
      </div>
      <div className="col-start-1 row-start-3 pb-2 pt-2  ">
        <p className="flex items-center text-black text-sm font-medium  ">
          <img src={person} alt="" className="w-10 h-10 rounded-full mr-2 bg-gray-100  " />
          <div>
            <span className="text-sm font-semibold text-gray-500  ">
              {props.liveUserData.username}
            </span>
            <br />
            {/* <span className="text-xs text-gray-500">{props.playbackUserData.videos[props.index].description.slice(0,30)+"..."}</span> */}
          </div>
        </p>
      </div>
    </div>
  );
};

export default LiveCard;
