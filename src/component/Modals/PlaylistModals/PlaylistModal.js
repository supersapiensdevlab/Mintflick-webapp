import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

const user = JSON.parse(window.localStorage.getItem('user'));

const NewPlaylist = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const [playlist, setPlaylist] = useState('');

  const handleNameChange = (e) => {
    setPlaylist(e.target.value);
  };

  const handleSubmitPlaylist = async () => {
    let data;
    if (props.datatype === 'video') {
      data = {
        playlistname: playlist,
        data: props.data.videos,
        username: user.username,
        playlistUsername: props.data.username,
        playlistDataIndex: props.id,
      };
    } else {
      data = {
        playlistname: playlist,
        data: props.data.tracks,
        username: user.username,
        playlistUsername: props.data.username,
        playlistDataIndex: props.id,
      };
    }

    //console.log(data);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/playlist`,
      data: data,
    });

    props.handleCloseNewPlaylist();
    props.handleClosePlaylist();
  };

  return (
    <>
      <Modal
        isOpen={props.showNewPlaylist}
        className={
          darkMode
            ? 'h-max w-80 mx-auto mt-28  bg-dbeats-dark-primary rounded-xl '
            : 'h-max w-80 mx-auto mt-28  bg-gray-50 rounded-xl shadow-2xl'
        }
      >
        <div className={`${darkMode && 'dark'} dark:text-white p-5`}>
          <div className=" flex justify-end w-full" onClick={props.handleCloseNewPlaylist}>
            <i className="fas fa-times cursor-pointer text-lg text-white mr-5 mt-2"></i>
          </div>
          <div className="h-32 w-full flex flex-col justify-center items-center">
            <input
              type="text"
              placeholder="Enter Playlist Name"
              className="h-10 w-full px-4 py-2 mb-4"
              onChange={(e) => handleNameChange(e)}
            ></input>
            <button
              className="h-10 w-2/3 rounded-md dark:text-white dark:bg-dbeats-light text-lg  "
              onClick={() => {
                handleSubmitPlaylist();
              }}
            >
              Add Playlist
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export const Playlist = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const handleCloseNewPlaylist = () => setShowNewPlaylist(false);
  const handleShowNewPlaylist = () => setShowNewPlaylist(true);

  const handleSubmitPlaylist = async (playlistTitle) => {
    let data;
    if (props.datatype === 'video') {
      data = {
        playlistname: playlistTitle,
        data: props.data.videos,
        username: user.username,
        playlistUsername: props.data.username,
        playlistDataIndex: props.id,
      };
    } else {
      data = {
        playlistname: playlistTitle,
        data: props.data.tracks,
        username: user.username,
        playlistUsername: props.data.username,
        playlistDataIndex: props.id,
      };
    }

    //console.log(data);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/playlist`,
      data: data,
    });

    props.handleClosePlaylist();
  };

  return (
    <div className="z-100">
      <Modal
        isOpen={props.showPlaylist}
        className={
          darkMode
            ? 'h-max w-80 mx-auto mt-28  bg-dbeats-dark-primary rounded-xl z-100'
            : 'h-max w-80 mx-auto mt-28  bg-gray-50 rounded-xl shadow-2xl z-100'
        }
      >
        <div className={`${darkMode && 'dark'} dark:text-white z-100`}>
          <div className="mr-7 flex justify-end w-full" onClick={props.handleClosePlaylist}>
            <i className="fas fa-times cursor-pointer text-lg text-white mr-5 mt-2"></i>
          </div>
          <div className="dark:text-white text-xl flex flex-col justify-center items-center w-full ">
            <p>Add to Existing</p>
            <div className="pt-3 w-full ">
              {user && user.my_playlists ? (
                <>
                  {user.my_playlists.map((value, i) => {
                    return (
                      <div
                        key={i}
                        className="hover:bg-dbeats-dark-alt w-full p-2 text-center cursor-pointer"
                        onClick={() => {
                          handleSubmitPlaylist(value.playlistname);
                        }}
                      >
                        <p className="">{value.playlistname}</p>
                      </div>
                    );
                  })}
                </>
              ) : null}
            </div>
          </div>
          <hr className="my-2 " />
          <div className="h-14 my-2 w-full rounded-xl">
            <div className="flex justify-center items-center cursor-pointer hover:bg-dbeats-dark-alt py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 dark:text-white mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                className="dark:text-white text-xl"
                onClick={() => {
                  handleShowNewPlaylist();
                  props.handleClosePlaylist();
                }}
              >
                Create New Playlist
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <NewPlaylist
        showNewPlaylist={showNewPlaylist}
        setShowNewPlaylist={setShowNewPlaylist}
        handleCloseNewPlaylist={handleCloseNewPlaylist}
        handleShowNewPlaylist={handleShowNewPlaylist}
        handleClosePlaylist={props.handleClosePlaylist}
        data={props.data}
        id={props.id}
        datatype={props.datatype}
      />
    </div>
  );
};
