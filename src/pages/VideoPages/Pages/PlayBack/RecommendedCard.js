import { Menu, Transition } from '@headlessui/react';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { ReactComponent as Verified } from '../../../../assets/icons/verified-account.svg';
import { Playlist } from '../../../../component/Modals/PlaylistModals/PlaylistModal';

moment().format();

const RecommendedCard = (props) => {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  const [time, setTime] = useState(null);

  // For Add To Playlist
  const [userData,setUserData] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const handleClosePlaylist = () => setShowPlaylist(false);
  const handleShowPlaylist = () => setShowPlaylist(true);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };
  ////console.log('My : ', props.value);

  useEffect(() => {
    let ind = props.value.videos.length - 1;
    setIndex(ind);
    setUserData({
      username:props.value.username,
      videos:props.value.videos[ind]
    })

    if (props.value.videos && props.value.videos.length > 0) {
      let videotime = props.value.videos[ind].time;
      const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
      setTime(moment(timestamp).fromNow());
    }
  }, []);

  //TODO : remove link to 0
  return (
    <div className={`${props.darkMode && 'dark'} flex w-full group`}>
      <div className="cursor-pointer 2xl:h-28 lg:h-20  h-20 dark:bg-dbeats-dark-primary bg-blue-50   ">
        <Link to={`/playback/${props.value.username}/${props.value.videos[index].videoId}`}>
          <ReactPlayer
            className="justify-self-center"
            width={window.innerWidth >= '1536' ? '12rem' : '9rem'}
            height="100%"
            playing={playing}
            volume={0.5}
            url={props.value.videos[index].link}
            controls={false}
            onMouseMove={handleMouseMove}
            onMouseLeave={hanldeMouseLeave}
            muted={true}
          />
        </Link>
      </div>
      <div className="pl-3 text-sm 2xl:text-sm lg:text-xs w-full">
        {/* <p className="text-2xl font-semibold mb-0">{props.value.videos[0].videoName.slice(0, 30) + " ..."}</p> */}
        <div className="flex items-center">
          <div className="pt-1">{props.value.name}</div>
          {props.value.is_verified ? (
            <Verified className="h-4 w-4  items-center self-center justify-center text-dbeats-light mx-1" />
          ) : null}
        </div>
        <p>
          <span>{time}</span>
        </p>
      </div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <i className=" fas fa-ellipsis-v text-gray-600 group-hover:block hidden cursor-pointer   ml-auto mt-2 mr-2 2xl:text-lg text-lg lg:text-sm"></i>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100   shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button onClick={()=>{
                   handleShowPlaylist();               
                }}>Add to Playlist</button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {userData && userData.videos ? (
            <Playlist
              showPlaylist={showPlaylist}
              setShowPlaylist={setShowPlaylist}
              handleClosePlaylist={handleClosePlaylist}
              handleShowPlaylist={handleShowPlaylist}
              data={userData}
              id={userData.videos.videoId}
              datatype="video"
            />
          ) : null}
    </div>
  );
};

export default RecommendedCard;
