import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';

const LiveCard = (props) => {
  const [playing, setPlaying] = useState(false);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };
  //console.log('My : ', props);
  return (
    <div className="flex w-full">
      <div className="cursor-pointer">
        <Link to={`/live/${props.value.username}/`}>
          <ReactPlayer
            className="justify-self-center"
            width="12rem"
            height="auto"
            playing={playing}
            volume={0.5}
            url={`https://cdn.livepeer.com/hls/${props.value.livepeer_data.playbackId}/index.m3u8`}
            controls={false}
            onMouseMove={handleMouseMove}
            onMouseLeave={hanldeMouseLeave}
            muted={true}
          />
        </Link>
      </div>
      <div className="pl-3 text-sm w-full">
        {/* <p className="text-2xl font-semibold mb-0">{props.value.videos[0].videoName.slice(0, 30) + " ..."}</p> */}
        <span>{props.value.name}</span>
        <i className="ml-1 fas fa-check-circle"></i>
        <p>
          <span className="text-sm font-semibold mr-2">55K views</span>
          <span>1 Month Ago</span>
        </p>
      </div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <i className=" fas fa-ellipsis-v text-gray-600 cursor-pointer block ml-auto mt-2 mr-2 text-lg"></i>
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
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button>Edit</button>
              </Menu.Item>
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button>Duplicate</button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button>Archive</button>
              </Menu.Item>
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button>Move</button>
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item className="w-full text-gray-700 text-left text-lg pl-2 hover:text-white hover:bg-dbeats-light">
                <button>Delete</button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default LiveCard;
