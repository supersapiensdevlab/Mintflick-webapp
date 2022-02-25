import React from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, StackedCarousel } from 'react-stacked-center-carousel';
import person from '../../../assets/images/profile.svg';

const ResponsiveCarousel = (props) => {
  const ref = React.useRef(ResponsiveContainer);
  return (
    <div style={{ position: 'relative' }}>
      <ResponsiveContainer
        carouselRef={ref}
        render={(parentWidth, carouselRef) => {
          let currentVisibleSlide = 1;
          if (parentWidth <= 1920) currentVisibleSlide = 5;
          else if (parentWidth <= 1440) currentVisibleSlide = 3;
          else if (parentWidth <= 720) currentVisibleSlide = 2;
          return (
            <StackedCarousel
              className=""
              ref={carouselRef}
              data={props.slides}
              carouselWidth={parentWidth}
              slideWidth={750}
              slideComponent={Slide}
              maxVisibleSlide={5}
              currentVisibleSlide={currentVisibleSlide}
              useGrabCursor={true}
            />
          );
        }}
      />
      <div className="absolute flex justify-between w-full -mt-28 lg:-mt-56 z-20">
        <div
          onClick={() => ref.current.goBack()}
          className="h-10 w-10 lg:h-16 lg:w-16 bg-blue-50 dark:bg-dbeats-dark-secondary shadow-lg  rounded-full ml-1 flex justify-center items-center"
        >
          <i className="fas fa-chevron-left dark:text-white text-gray-900 text-xs lg:text-lg"></i>
        </div>
        <div
          onClick={() => ref.current.goNext()}
          className="h-10 w-10 lg:h-16 lg:w-16 bg-blue-50 dark:bg-dbeats-dark-secondary shadow-lg  rounded-full mr-1 flex justify-center items-center"
        >
          <i className="fas fa-chevron-right dark:text-white text-gray-900 text-xs lg:text-lg"></i>
        </div>
      </div>
    </div>
  );
};

const Slide = function (StackedCarouselSlideProps) {
  const { data, dataIndex } = StackedCarouselSlideProps;
  const value = data[dataIndex];
  return (
    <Link
      className="w-screen h-full bg-gray-300   nm-flat-dbeats-dark-primary-lg p-2 lg:w-max lg:h-96 md:h-96 flex mx-auto shadow-xl dark:shadow-3xl"
      to={`/live/${value.username}/`}
    >
      <span className="fixed bg-red-600 text-white px-1 mx-2 my-2 rounded-sm font-semibold z-50">
        {' '}
        Live{' '}
      </span>
      <ReactPlayer
        width="100%"
        height="100%"
        playing={true}
        muted={true}
        volume={0.3}
        controls={false}
        style={{ objectFit: 'cover' }}
        url={`https://cdn.livepeer.com/hls/${value.livepeer_data.playbackId}/index.m3u8`}
      />

      {/* <div className="p-5 self-center">
          <p className="font-bold">{value.name}</p>
        </div> */}
      <div className=" absolute bottom-0   px-3 py-4">
        <div className="flex items-center text-black text-sm font-medium  ">
          <img
            src={value.profile_image ? value.profile_image : person}
            alt=""
            className="w-10 h-10 rounded-full mr-2 bg-gray-100  "
          />
          <div>
            <span className="text-sm font-semibold text-dbeats-white  ">{value.name}</span>
            <br />
            {/* <span className="text-xs text-gray-500">{props.playbackUserData.videos[props.index].description.slice(0,30)+"..."}</span> */}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResponsiveCarousel;
