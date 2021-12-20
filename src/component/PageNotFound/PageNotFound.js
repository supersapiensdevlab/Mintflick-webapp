import React from 'react';
import { useSelector } from 'react-redux';
import Lottie from 'react-lottie';
import './PageNotFound.css';

import animationData from '../../lotties/error-animation.json';

const PageNotFound = ({ headtext = '404', text = 'Page Not Found', animation = animationData }) => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={`${darkMode && 'dark'}`}>
      <div className="py-32 px-20 dark:text-white flex justify-center dark:bg-dbeats-dark-alt h-screen">
        <div className="flex flex-col items-center">
          <div className="LottieButton opacity-20 absolute">
            <Lottie
              className="cursor-not-allowed"
              options={defaultOptions}
              height={500}
              width={500}
            />
          </div>
          <div className="text-6xl font-bold mt-6">{headtext}</div>
          <div className="text-2xl font-bold py-4">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
