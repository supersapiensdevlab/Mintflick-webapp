import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import personImg from '../../assets/images/profile.svg';
import useWeb3Modal from '../../hooks/useWeb3Modal';
import { useHistory } from 'react-router-dom';

const PinnedPanel = () => {
  const darkMode = useSelector((state) => state.toggleDarkMode);
  const userdata = useSelector((state) => state.User.user);
  const history = useHistory();
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [pinnedData, setPinnedData] = useState([]);

  useEffect(() => {
    if (userdata && userdata.pinned) {
      for (let i = 0; i < userdata.pinned.length; i++) {
        axios
          .get(`${process.env.REACT_APP_SERVER_URL}/user/${userdata.pinned[i]}`)
          .then((value) => {
            setPinnedData((oldArray) => [...oldArray, value.data]);
          });
      }
    }
    // eslint-disable-next-line
  }, [userdata]);

  const handlePlusClick = async () => {
    if (userdata) {
      history.push(`/profile/${userdata.username}/following`);
    } else {
      await loadWeb3Modal();
    }
  };
  return (
    <div className={` w-full fixed top-0 ${darkMode && 'dark'} z-2  `}>
      <div
        className={`hidden   lg:block 2xl:pt-16 lg:pt-14 bg-white w-max shadow  z-10 h-full fixed  nm-flat-dbeats-dark-secondary  px-2  dark:text-gray-100  flex flex-col justify-center `}
      >
        {/* Subscribed User Avatar */}
        {userdata && pinnedData ? (
          <>
            {pinnedData.map((pinnedUser, i) => {
              console.log(pinnedUser.username);
              return (
                <div key={i} className="flex justify-center content-center w-full cursor-pointer ">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip
                        id="button-tooltip-2"
                        className="bg-blue-50 shadow-md dark:bg-dbeats-dark-primary   z-20 ml-16 -mt-10 mb-1 px-3 py-1 rounded-lg"
                      >
                        <span className="text-md">{pinnedUser.username}</span>
                      </Tooltip>
                    }
                  >
                    <Link to={`/profile/${pinnedUser.username}/`} className=" my-2 relative">
                      <div className="p-0.5 nm-flat-dbeats-dark-secondary rounded-full hover:nm-inset-dbeats-dark-secondary">
                        <img
                          src={pinnedUser.profile_image ? pinnedUser.profile_image : personImg}
                          alt=""
                          className=" 2xl:w-14 2xl:h-14 lg:h-10 lg:w-10 rounded-full hover:shadow hover:scale-99 transform transition-all"
                        />{' '}
                      </div>
                    </Link>
                  </OverlayTrigger>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
        <div className="flex justify-center cursor-pointer  ">
          <a
            onClick={handlePlusClick}
            className="2xl:w-14 2xl:h-14 lg:h-10 lg:w-10  my-2 rounded-full hover:shadow hover:scale-99 transition-all transform  relative nm-flat-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary "
          >
            <div className="w-max mx-auto 2xl:mt-3.5 lg:mt-1.5 ">
              <i className="fas fa-plus 2xl:text-lg lg:text-sm text-center text-white dark:text-blue-200"></i>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PinnedPanel;
