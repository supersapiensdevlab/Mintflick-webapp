import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import CarouselCard from '../../pages/Profile/Cards/CarouselCard';
import person from '../../assets/images/profile.svg';

const SearchResult = () => {
  const darkMode = useSelector((state) => state.toggleDarkMode);
  const [data, setData] = useState(null);
  //console.log(data);

  useEffect(() => {
    setData(JSON.parse(window.sessionStorage.getItem('searchResult')));

    // eslint-disable-next-line
  }, [JSON.parse(window.sessionStorage.getItem('searchResult'))]);

  return (
    <div id="outer-container" className="h-full ">
      <div id="page-wrap" className={`${darkMode && 'dark'}  `}>
        <div className="pb-10 pt-4 bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-primary  dark:to-dbeats-dark-primary mx-auto  self-center  relative w-full h-screen     ">
          {data ? (
            <>
              <div className="w-full pt-16 justify-center text-center mx-auto">
                <p
                  id="song-title"
                  className="mb-3 w-max mx-auto   self-center text-center  drop-shadow 2xl:text-2xl lg:text-xl text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 dark:from-white dark:to-gray-800"
                >
                  Search Results
                </p>
                {data.usernameData && data.usernameData.length > 0 ? (
                  <>
                    <Splide
                      options={{
                        drag: true,
                        arrows: false,
                        rewind: true,
                        perPage: window.innerWidth >= '768' ? 6 : 4,
                      }}
                      className="lg:w-2/3 w-full mx-auto p-7 m-5 "
                    >
                      {data.usernameData.map((value, i) => {
                        return (
                          <SplideSlide className=" md:px-5 " key={i}>
                            <Link to={`/profile/${value.username}`}>
                              <img
                                className="mx-auto  h-32 w-32 rounded-full self-center  cursor-pointer"
                                src={value.profile_image ? value.profile_image : person}
                                alt={`Profile ${i}`}
                              />
                            </Link>
                            <p className="dark:text-white lg:text-xs 2xl:text-lg text-xs mt-2">
                              {value.username.length > 12
                                ? value.username.slice(0, 14) + '..'
                                : value.username}
                            </p>
                          </SplideSlide>
                        );
                      })}
                    </Splide>{' '}
                  </>
                ) : (
                  <div className="w-full text-center">
                    <p className="dark:text-white p-5">No Users Found with matching Terms</p>
                  </div>
                )}
              </div>
              <div>
                {data.videoData && data.videoData.length > 0 ? (
                  <div className="lg:px-20 px-5 md:px-10 lg:ml-16 ml-0 py-10 dark:bg-dbeats-dark-alt">
                    {data.videoData.map((value, i) => {
                      ////console.log(playbackUser)
                      return (
                        <div key={i}>
                          <CarouselCard
                            playbackUserData={value.video}
                            index={value.index}
                            username={value.username}
                            type="video"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full text-center">
                    <p className="dark:text-white p-5">No Videos Found with matching Terms</p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
