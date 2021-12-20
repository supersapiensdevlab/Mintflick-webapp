import React from 'react';
import ReactPlayer from 'react-player';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

const RecommendedCard = (props) => {
  const [playing, setPlaying] = useState(false);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };
  ////console.log('My : ', props.value);

  //TODO : remove link to 0
  return (
    <div className={`${props.darkMode && 'dark'} flex w-full`}>
      <div className="cursor-pointer 2xl:h-28 lg:h-20 dark:bg-dbeats-dark-primary">
        <a href={`/playback/${props.value.username}/0`}>
          <ReactPlayer
            className="justify-self-center"
            width={window.innerWidth >= '1536' ? '12rem' : '9rem'}
            height="100%"
            playing={playing}
            volume={0.5}
            url={props.value.videos[0].link}
            controls={false}
            onMouseMove={handleMouseMove}
            onMouseLeave={hanldeMouseLeave}
            muted={true}
          />
        </a>
      </div>
      <div className="pl-3 text-sm 2xl:text-sm lg:text-xs w-full">
        {/* <p className="text-2xl font-semibold mb-0">{props.value.videos[0].videoName.slice(0, 30) + " ..."}</p> */}
        <span>{props.value.name}</span>
        <i className="ml-1 fas fa-check-circle"></i>
        <p>
          <span className="text-sm 2xl:text-sm lg:text-xs font-semibold mr-2">55K views</span>
          <span>1 Month Ago</span>
        </p>
      </div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <i className=" fas fa-ellipsis-v text-gray-600 cursor-pointer block ml-auto mt-2 mr-2 2xl:text-lg text-lg lg:text-sm"></i>
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

export default RecommendedCard;
