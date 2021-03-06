import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-img-placeholder';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import maticLogo from '../../../assets/graphics/polygon-matic-logo.svg';
import dbeatsLogoBnW from '../../../assets/images/Logo/logo-blacknwhite.png';
import person from '../../../assets/images/profile.svg';
import { ReactComponent as Verified } from '../../../assets/icons/verified-account.svg';

moment().format();

const PlayBackCard = (props) => {
  const [playing, setPlaying] = useState(false);

  //let history = useHistory();

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const [time, setTime] = useState(null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    let ind = props.playbackUserData.videos.length - 1;
    setIndex(ind);
    if (props.playbackUserData.videos && props.playbackUserData.videos.length > 0) {
      let videotime = props.playbackUserData.videos[ind].time;
      const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
      setTime(moment(timestamp).fromNow());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {props.playbackUserData.videos && props.playbackUserData.videos.length > 0 ? (
        <div className={`${props.darkMode && 'dark'} w-full h-auto relative `}>
          <div
            className={`cursor-pointer w-full 2xl:h-52 lg:h-32 h-44 dark:bg-dbeats-dark-primary bg-black `}
          >
            <Link
              to={`/playback/${props.playbackUserData.username}/${props.playbackUserData.videos[index].videoId}`}
            >
              <ReactPlayer
                width="100%"
                height="100%"
                playing={playing}
                muted={false}
                volume={0.5}
                url={props.playbackUserData.videos[index].link}
                controls={false}
                onMouseMove={handleMouseMove}
                onMouseLeave={hanldeMouseLeave}
              />
            </Link>

            <Image
              src={props.playbackUserData.videos[index].videoImage}
              height={200}
              width={200}
              className="object-cover  h-52 w-full absolute top-0 z-500 hidden "
              alt={props.playbackUserData.videos[index].videoName}
              placeholderSrc={dbeatsLogoBnW}
            />
          </div>

          <div className="col-start-1 row-start-3 pb-2 pt-4">
            <div className="flex   text-black text-sm font-medium">
              <Link to={`/profile/${props.playbackUserData.username}/`} className="mr-4">
                <img
                  src={
                    props.playbackUserData.profile_image
                      ? props.playbackUserData.profile_image
                      : person
                  }
                  alt=""
                  className="2xl:w-10 2xl:h-10 w-10 h-10 lg:w-7 lg:h-7 rounded-full  bg-gray-100 self-start"
                />
              </Link>
              <div className="w-full flex  justify-between ">
                <div>
                  <span className=" text-base font-semibold dark:text-gray-200 mb-2   text-gray-900">
                    {props.playbackUserData.videos[index].videoName.slice(0, 45)}
                    {props.playbackUserData.videos[index].videoName.length > 45 ? '...' : ''}
                  </span>
                  <br />
                  <div className="w-full   ">
                    <div className="flex items-center">
                      <Link
                        to={`/profile/${props.playbackUserData.username}/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500"
                      >
                        {props.playbackUserData.username}
                      </Link>
                      {props.playbackUserData.is_verified ? (
                        <Verified className="h-4 w-4  items-center self-center justify-center text-dbeats-light mx-1" />
                      ) : null}
                    </div>
                    <div className="2xl:text-sm lg:text-xs text-sm text-gray-500 pr-2 flex  ">
                      {time}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="  w-max ml-2 p-2   justify-center  cursor-pointer  dark:bg-dbeats-dark-secondary  hover:bg-opacity-25 dark:hover:bg-opacity-80 dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md hover:bg-gray-200  dark:hover:bg-dbeats-dark-primary   grad flex items-center   font-medium   dark:hover:text-white      transform-gpu  transition-all duration-300 ease-in-out ">
                    <span className="  text-black dark:text-white mx-1 flex ">
                      200
                      <img
                        className="h-5 w-5 ml-1 text-white self-center align-middle items-center"
                        src={maticLogo}
                        alt="logo"
                      ></img>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PlayBackCard;
