import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import person from '../../../assets/images/profile.svg';
import { Link } from 'react-router-dom';

const PlaylistCard = (props) => {
  const [playing, setPlaying] = useState(false);

  const handleMouseMove = () => {
    setPlaying(true);
  };
  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const [audio, setAudio] = useState(null);
  useEffect(() => {
    if (props.playlistData.data.trackId) {
      setAudio(new Audio(props.playlistData.data.link));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (audio) {
      if (!playing) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  }, [playing, audio]);

  return (
    <div className="w-full">
      {/* <a href={`/playback/${props.videoData.username}/0`}> */}
      {props.playlistData.data.trackId ? (
        <div className={`cursor-pointer 2xl:h-48 lg:h-32 md:h-36 h-44 dark:bg-black w-full `}>
          <Link
            to={`/track/${props.playlistData.username}/${props.playlistData.index}`}
            onClick={() => audio.pause()}
          >
            <img
              src={props.playlistData.data.trackImage}
              alt=""
              className="h-full mx-auto"
              onMouseMove={handleMouseMove}
              onMouseLeave={hanldeMouseLeave}
            />
          </Link>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center cursor-pointer 2xl:h-48 lg:h-32 md:h-36 h-44 dark:bg-black w-full`}
        >
          <Link
            to={`/playback/${props.playlistData.username}/${props.playlistData.data.videoId}`}
            className="2xl:h-48 lg:h-32 md:h-36 h-44"
          >
            <ReactPlayer
              width="100%"
              height="100%"
              playing={playing}
              muted={false}
              volume={0.5}
              url={props.playlistData.data.link}
              controls={false}
              onMouseMove={handleMouseMove}
              onMouseLeave={hanldeMouseLeave}
            />
          </Link>
        </div>
      )}

      <div className="col-start-1 row-start-3 pb-2 pt-2">
        <p className="flex   text-black text-sm font-medium">
          <img
            src={person}
            alt=""
            className="2xl:w-10 2xl:h-10 lg:h-7 lg:w-7 h-5 w-5 rounded-full mr-2 bg-gray-100"
          />
          <div>
            <span className="2xl:text-lg lg:text-xs font-semibold dark:text-gray-200">
              {props.playlistData.data.trackId
                ? props.playlistData.data.trackName.slice(0, 45) + '...'
                : props.playlistData.data.videoName.slice(0, 45) + '...'}
            </span>
            <br />
            <span className="lg:text-xs 2xl:text-sm text-gray-500  ">
              {props.playlistData.username}
            </span>
          </div>
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
