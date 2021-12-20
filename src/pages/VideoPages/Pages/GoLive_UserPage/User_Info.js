import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { MultiStreamData } from '../../../../assets/Data';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import classes from '../Info.module.css';

const UserInfo = () => {
  const [userStreams, setUserStreams] = useState([]);

  const user = JSON.parse(window.localStorage.getItem('user'));
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const [playbackUrl, setPlaybackUrl] = useState('');
  const [StreamKey, setKey] = useState('');
  const [loader, setLoader] = useState(true);
  //const [name, setName] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  //const [selected, setSelected] = React.useState(false);

  const [multiStreamValue, setMultiStreamValue] = useState({});

  const [multiStreamConnected, setMultiStreamConnected] = useState([]);
  const [patchStream, setPatchStream] = useState([]);

  useEffect(() => {
    if (user.multistream_platform) {
      ////console.log("hello",user.multistream_platform)
      let new_array = [];
      for (let i = 0; i < user.multistream_platform.length; i++) {
        new_array.push(user.multistream_platform[i]);
      }
      setMultiStreamConnected(new_array);
      //setPatchStream(new_array)
    } else {
      setMultiStreamConnected([]);
    }
    setPlaybackUrl(`https://cdn.livepeer.com/hls/${user.livepeer_data.playbackId}/index.m3u8`);
    //setName(user.livepeer_data.name);
    setUserStreams(user.livepeer_data);
    // eslint-disable-next-line
  }, []);
  ////console.log(multiStreamConnected)

  const handleChange = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  };

  const addStreamingPlatform = async (props) => {
    setLoader(false);
    let postData = {
      username: user.username,
      platform: {
        title: multiStreamValue.title,
        logo: multiStreamValue.logo,
        image: multiStreamValue.image,
        rtmp: props,
      },
    };

    //console.log(postData);

    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_SERVER_URL}/user/add_multistream_platform`,
      data: postData,
    });

    setMultiStreamConnected([...multiStreamConnected, postData]);
    setShowStreamModal(false);
    setLoader(true);
  };

  const createMultiStream = async () => {
    ////console.log(patchStream);

    setLoader(false);

    let multi_data = {
      patchStreamData: [],
      stream_id: userStreams.id,
    };

    for (let i = 0; i < patchStream.length; i++) {
      let data = {
        profile: 'source',
        spec: {
          name: patchStream[i].platform.title,
          url: patchStream[i].platform.rtmp,
        },
      };
      multi_data.patchStreamData.push(data);
    }

    // let patchStreamData = {
    //     name: `${multiStreamValue.title}`,
    //     url: `${props}`,
    //     stream_id: userStreams.id
    // }

    ////console.log("patchStream:", multi_data);

    await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/patch_multistream`,
      data: multi_data,
    });

    ////console.log(patchingStream);

    setLoader(true);
    alert(' Multistream Connection Successfull !!!');
    setShowStreamModal(false);
  };

  const editPlatform = (value, index) => {
    if (value.selected === 1) {
      let newArr = [...multiStreamConnected];
      newArr[index].selected = 0;

      setMultiStreamConnected(newArr);
    } else {
      let newArr = [...multiStreamConnected];
      newArr[index].selected = 1;

      setMultiStreamConnected(newArr);

      setPatchStream((oldArray) => [...oldArray, newArr[index]]);
      setMultiStreamConnected(newArr);
    }
  };

  return (
    <Fragment className={`${darkMode && 'dark'}`}>
      <div className="flex flex-col lg:grid lg:grid-cols-3 pb-64 pt-16 bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary">
        <div className=" h-auto w-full lg:w-full lg:col-span-2 self-center ">
          <VideoPlayer
            playbackUrl={playbackUrl}
            creatorData={user}
            className="rounded h-full w-full"
          />
        </div>
        <div className="text-sm mx-auto ">
          <div className="bg-white w-80  lg:w-full  p-5 rounded text-sm sm:lg:text-xl shadow mt-8  lg:ml-0 ">
            <div className="pb-2">
              <span className="font-semibold">Streamer Name : </span>
              <p>{user.name}</p>
            </div>
            <div className="pb-2">
              <span className="font-semibold">Streamer Username : </span>
              <p>{user.username}</p>
            </div>
            <div className="pb-2">
              <span className="font-semibold">RTMP URL: </span>
              <p>rtmp://rtmp.livepeer.com/live</p>
            </div>
            <div className="pb-2">
              <span className="font-semibold">Streamer Key : </span>
              <p>{userStreams.streamKey}</p>
            </div>
            <div className="pb-2  break-words">
              <span className="font-semibold">Playback URL : </span>
              <p>{playbackUrl}</p>
            </div>
            <hr width="95%" className="mt-2 mb-4" />
            <div>
              <div className="flex flex-col">
                <button
                  variant="primary"
                  className="bg-gradient-to-r from-dbeats-secondary-light to-dbeats-light text-white rounded font-bold px-4 py-3 lg:text-lg w-full"
                  type="button"
                  onClick={() => setShowDestinationModal(true)}
                >
                  Add MultiStreaming Platforms
                </button>
                <div className={classes.multistream_form_spinner}>
                  <Spinner
                    animation="border"
                    variant="info"
                    role="status"
                    hidden={loader}
                  ></Spinner>
                </div>
                <p className="text-center">Currently Connected :</p>
                <div className="flex flex-wrap justify-center">
                  {multiStreamConnected.map((value, index) => {
                    ////console.log(value);
                    return (
                      <div key={index} className="m-1">
                        <img src={value.platform.logo} alt="logo" className="h-6 lg:h-10 w-auto" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDestinationModal}
        className="h-max lg:w-max w-5/6  mx-auto lg:mt-40 mt-28 shadow-xl bg-white"
      >
        <h2 className="grid grid-cols-5 justify-items-center rounded-t-xl w-full dark:rounded-t-sm text-2xl py-4 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 text-lg lg:text-2xl">Add Multistream Platforms</div>
          <div
            className="mr-7 flex justify-end w-full"
            onClick={() => setShowDestinationModal(false)}
          >
            <i className="fas fa-times cursor-pointer mr-3"></i>
          </div>
        </h2>

        <hr />
        <main className="lg:py-3 py-0.5  px-4 max-h-56 lg:max-h-96 sm:max-h-40 w-full overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5">
            {multiStreamConnected.map((value, index) => {
              return (
                <div
                  key={index}
                  className="col-span-3 lg:col-span-1 bg-white-200 mx-8 border-1 border-gray-300 rounded lg:my-2 my-0.5 flex justify-around"
                >
                  <img
                    src={value.platform.logo}
                    alt="logo"
                    className="h-auto w-20 lg:h-auto lg:w-28 p-4"
                  />
                  <input
                    type="checkbox"
                    className="h-7 w-7 mx-3 dark:text-dbeats-dark-secondary text-dbeats-light focus:ring-dbeats-light border-gray-300 rounded self-center"
                    value="check"
                    selected={value.selected}
                    onChange={() => {
                      editPlatform(value, index);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </main>
        <hr />
        <div className="flex-row lg:flex w-full lg:py-5 py-3 justify-center align-center px-4 ">
          <button
            className="lg:w-2/3 w-full mx-auto lg:mx-2 my-1 rounded-md bg-dbeats-light text-white lg:p-2 p-1 lg:text-xl text-base  font-semibold"
            onClick={() => {
              setModalShow(true);
              setShowDestinationModal(false);
            }}
          >
            Add Destination
          </button>
          <button
            className="lg:w-1/3 w-full my-1 lg:mx-2 mx-auto rounded-md bg-green-500 text-white lg:p-2 p-1 lg:text-xl text-base font-semibold"
            onClick={createMultiStream}
          >
            Apply
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalShow}
        className="h-max lg:w-1/2 w-5/6 mx-auto lg:mt-48 mt-24 shadow-xl bg-white"
      >
        <h2 className="grid grid-cols-5 justify-items-center rounded-t-xl w-full dark:rounded-t-sm text-2xl py-4 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 text-lg lg:text-2xl">
            Select the MultiStream Platform
          </div>
          <div className="mr-7 flex justify-end w-full" onClick={() => setModalShow(false)}>
            <i className="fas fa-times cursor-pointer mr-3"></i>
          </div>
        </h2>
        <hr />
        <main className="py-5 ">
          <div className="grid gap-4 justify-items-center grid-cols-2 lg:grid-cols-4 px-8 max-w-full lg:max-h-96 max-h-72  overflow-y-auto">
            {MultiStreamData.map((value, index) => {
              return (
                <div
                  key={index}
                  className="flex justify-center items-center bg-white-200 mx-1 my-1 border-1 h-full w-full shadow border-gray-300 rounded"
                >
                  <img
                    src={value.image}
                    alt="logo"
                    className="h-auto w-20 lg:w-40 p-1 lg:p-4"
                    onClick={() => {
                      setMultiStreamValue(value);
                      setShowStreamModal(true);
                      setModalShow(false);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </main>
      </Modal>

      <Modal
        isOpen={showStreamModal}
        className="h-max lg:w-1/3 w-5/6 mx-auto mt-24 shadow-xl bg-white"
      >
        <h2 className="grid grid-cols-5 justify-items-center rounded-t-xl w-full dark:rounded-t-sm text-2xl py-4 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 text-lg lg:text-2xl">{multiStreamValue.title}</div>
          <div className="mr-7 flex justify-end w-full" onClick={() => setShowStreamModal(false)}>
            <i className="fas fa-times cursor-pointer mr-3"></i>
          </div>
        </h2>
        <hr />
        <main className="lg:px-6 lg:py-6 px-4 py-2">
          <div>
            <div className="mb-3 text-md lg:text-xl">
              <div>
                <b>Enter Stream-Key </b>
              </div>
              <input
                required
                type="text"
                placeholder="Enter SECRET Key"
                onChange={(e) => handleChange(e)}
                className="self-center my-2 rounded bg-transparent border-0 shadow-md w-full lg:w-1/2 lg:ml-3"
              />
              {/* <div className="py-2 pt-3 pl-1 overflow-hidden">
                RTMP : {multiStreamValue.rtmp + StreamKey}
              </div> */}

              <div className="flex pt-4">
                <button
                  className=" border-0 bg-gradient-to-r from-dbeats-secondary-light to-dbeats-light rounded px-4 py-2 bg-dbeats-primary"
                  hidden={StreamKey ? false : true}
                  onClick={() => {
                    let rtmp = multiStreamValue.rtmp + StreamKey;
                    addStreamingPlatform(rtmp);
                  }}
                >
                  <div className="text-white text-lg font-semibold">
                    Add {multiStreamValue.title}
                  </div>
                </button>

                <div className={classes.multistream_form_spinner}>
                  <Spinner
                    animation="border"
                    variant="info"
                    role="status"
                    hidden={loader}
                  ></Spinner>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Modal>
    </Fragment>
  );
};

export default UserInfo;
