import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import classes from '../Profile.module.css';
import image from '../../../assets/images/Logo/Icon 1.png'

const CommonCard = (props) =>{
    
    const user = useSelector((state) => state.User.user);

    const [playing, setPlaying] = useState(false);

    const handleMouseMove = () => {
        setPlaying(true);
      };
    
      const hanldeMouseLeave = () => {
        setPlaying(false);
      };

    return(
        <div className='w-96 bg-dbeats-black px-2 py-1'>
            <div className='flex w-full items-center'>
                <img src = {image} alt="profile_image" className='h-24 w-24'/>
                <div className='ml-4'>
                    <p className='text-white text-lg'>Name</p>
                    <p className='text-white text-sm'>Username</p>
                    <p className='text-white text-xs'>2 days ago</p>
                </div>
            </div>
            <div className='bg-dbeats-dark-alt'>
                <p className='text-white p-2'>Description</p>
            </div>
            <div
          className={`cursor-pointer h-44 lg:h-32 2xl:h-48 md:h-40 w-full  my-auto dark:bg-dbeats-dark-primary `}
        >
          <a >
            <ReactPlayer
              width="100%"
              height="100%"
              playing={playing}
              muted={false}
              volume={0.5}
              className={`${classes.cards_videos}`}
              light={props.playbackUserData.videoImage}
              url={props.playbackUserData.link}
              controls={false}
            />
          </a>
        </div>
        <div className='flex w-full justify-between mt-3'>
            <div className='flex justify-between w-1/2'>
            <button className='text-white'>Like</button>
            <button className='text-white'>Share</button>
            <button className='text-white'>Report</button>
            </div>
            <div className='w-1/2 flex justify-end text-white'>
                <button>
                    Make an offer
                </button>
            </div>
        </div>
        </div>
    )
}

export default CommonCard;