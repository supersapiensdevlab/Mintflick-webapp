import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Playlist } from '../../../../component/Modals/PlaylistModals/PlaylistModal';
import AudioPlayer from './Track_Components/AudioPlayer';
import TrackCard from './Track_Components/TrackCard';

const TrackInfo = () => {
  let params = useParams();
  const username = params.username;
  const track_id = params.track_id;

  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
    const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const [userData, setUserData] = useState(null);

  const [arrayData, setArrayData] = useState([]);

  const [showPlaylist, setShowPlaylist] = useState(false);
  const handleClosePlaylist = () => setShowPlaylist(false);
  const handleShowPlaylist = () => setShowPlaylist(true);
  const [hidePlaylistButton, setHidePlaylistButton] = useState(false);

  const get_User = async () => {
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${username}`).then((value) => {
      let trackdata = {
        username: '',
        tracks: {},
      };

      for (let i = 0; i < value.data.tracks.length; i++) {
        if (value.data.tracks[i].trackId === track_id) {
          trackdata = {
            username: value.data.username,
            tracks: value.data.tracks[i],
          };
        }
      }
      setUserData(trackdata);

      for (let i = 0; i < user.my_playlists.length; i++) {
        let getdata = user.my_playlists[i].playlistdata;
        console.log('getdata', getdata);
        for (let j = 0; j < getdata.length; j++) {
          // //console.log('usernames', getdata[j].username, '  ', value.data.username);
          // //console.log('index', getdata[j].index, '  ', track_id);
          if (
            getdata[j].username === value.data.username &&
            getdata[j].index === track_id &&
            getdata[j].data.trackId
          ) {
            console.log('hide');
            setHidePlaylistButton(true);
            return;
          }
        }
      }
    });
  };

  const fetchData = async () => {
    const fileRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`);
    let track_data = [];
    for (let i = 0; i < fileRes.data.length; i++) {
      if (fileRes.data[i].tracks) {
        if (user ? fileRes.data[i].username === user.username : false) {
          continue;
        }
        if (fileRes.data[i].username !== username && fileRes.data[i].tracks.length > 0) {
          setArrayData((prevState) => [...prevState, fileRes.data[i]]);
          track_data.push(fileRes.data[i]);
        }
      }
    }
    //console.log('fetch', track_data);
    if (
      JSON.parse(window.sessionStorage.getItem('Track_Array')) === '' ||
      !JSON.parse(window.sessionStorage.getItem('Track_Array'))
    ) {
      window.sessionStorage.setItem('Track_Array', JSON.stringify(track_data));
      window.sessionStorage.setItem('Track_Array_Size', track_data.length);
    }
  };

  useEffect(() => {
    get_User();
    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full p-12 dark:text-white">
      <div
        className={`${
          darkMode && 'dark'
        }  grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row pb-50  mt-10 lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary`}
      >
        <div className=" lg:col-span-2 pl-7 dark:bg-dbeats-dark-alt h-screen text-black   dark:text-white">
          <div className=" pt-5">
            {userData ? (
              <>
                <div className="flex justify-between">
                  <p
                    className="overflow-ellipsis mt-0 mb-1 md:mb-2 drop-shadow xl:text-3xl  font-extrabold 
                  text-transparent bg-clip-text bg-gradient-to-r 
                  from-green-400 to-blue-500"
                  >
                    {userData.tracks.trackName}
                  </p>
                  <button
                    onClick={handleShowPlaylist}
                    hidden={hidePlaylistButton}
                    className="py-2 px-3 mr-10 bg-dbeats-light text-xl font-bold rounded-lg"
                  >
                    Add to Playlist
                  </button>
                </div>
                <Link to={`/profile/${userData.username}/music`}>
                  <p
                    className="mt-0  mb-1 md:mb-2 cursor-pointer hover:underline text-gray-600 hover:text-gray-400 
                tracking-widest  text-lg flex font-semibold"
                  >
                    {userData.username}
                  </p>
                </Link>
              </>
            ) : null}
          </div>
          <div className="self-center lg:pr-4 lg:w-full lg:mt-3 mt-0.5">
            {userData ? <AudioPlayer userData={userData.tracks} /> : null}
          </div>
        </div>

        <div className="  w-full col-span-1 px-5 lg:pt-3 dark:bg-dbeats-dark-secondary text-black  dark:text-white">
          <div className=" w-full  grid grid-cols-1 grid-flow-row gap-3  ">
            {arrayData.map((value, index) => {
              let trackid = value.tracks.length - 1;
              //console.log(value.username, ' ', value.tracks.length, '=', trackid);
              return (
                <div key={index}>
                  <TrackCard
                    track={value.tracks[trackid]}
                    index={value.tracks[trackid].trackId}
                    username={value.username}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {userData && userData.tracks ? (
        <Playlist
          showPlaylist={showPlaylist}
          setShowPlaylist={setShowPlaylist}
          handleClosePlaylist={handleClosePlaylist}
          handleShowPlaylist={handleShowPlaylist}
          data={userData}
          id={track_id}
          datatype="track"
        />
      ) : null}
    </div>
  );
};

export default TrackInfo;
