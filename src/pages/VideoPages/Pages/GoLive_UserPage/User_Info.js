import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { MultiStreamData } from '../../../../assets/Data';
import Dropdown from '../../../../component/dropdown.component';
import { makeStorageClient } from '../../../../component/uploadHelperFunction';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import classes from '../Info.module.css';
import LiveChat from '../LivePublicPage/LiveChat';
import { io } from 'socket.io-client';

const UserInfo = (props) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [StreamKey, setKey] = useState('');
  const [loader, setLoader] = useState(true);

  //Modal
  const [modalShow, setModalShow] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);

  //MultiStreams
  const [userStreams, setUserStreams] = useState([]);
  const [multiStreamValue, setMultiStreamValue] = useState({});
  const [multiStreamConnected, setMultiStreamConnected] = useState([]);
  const [patchStream, setPatchStream] = useState([]);

  //Recording
  const [recording, setRecording] = useState(false);
  const [newRecord, setNewRecord] = useState(0);
  const [recordUrl, setRecordUrl] = useState('');

  // Thumbnail
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [copied, setCopied] = useState(null);

  const [viewColor, setViewColor] = useState('white');
  const [viewAnimate, setViewAnimate] = useState('animate-none');

  //nft video
  const category = [
    'Autos & Vehicles',
    ' Music',
    'Pets & Animals',
    'Sports',
    'Travel & Events',
    'Gaming',
    'People & Blogs',
    'Comedy',
    'Entertainment',
    'News & Politics',
    ' Howto & Style',
    'Education',
    'Science & Technology',
    'Nonprofits & Activism',
  ];
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [recordvideo, setRecordVideo] = useState({
    videoName: '',
    videoFile: null,
    category: '',
    description: '',
    price: '',
    royality: '',
  });

  //socket
  const [currentSocket, setCurrentSocket] = useState(null);
  const [livestreamViews, setLivestreamViews] = useState(0);

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

  useEffect(() => {
    const socket = io(process.env.REACT_APP_VIEWS_URL, {
      transports: ['websocket'],
      upgrade: false,
    });
    socket.on('connection');
    socket.emit('joinlivestream', props.stream_id);
    socket.on('count', (details) => {
      if (details.room === props.stream_id) {
        setLivestreamViews(details.roomSize);
      }
    });
    socket.on('livecount', (details) => {
      setLivestreamViews(details.roomSize);
      // console.log('emitted');
      // console.log('inc', livestreamViews);
      setViewColor('green-500');
      setViewAnimate('animate-pulse');
      setTimeout(() => {
        setViewColor('white');
        setViewAnimate('animate-none');
      }, 3000);
    });
    socket.on('removecount', (roomSize) => {
      setLivestreamViews(roomSize);
      // console.log('removecount emitted');
      // console.log('dec', livestreamViews);
      setViewColor('red-500');
      setViewAnimate('animate-pulse');
      setTimeout(() => {
        setViewColor('white');
        setViewAnimate('animate-none');
      }, 3000);
    });
  }, []);

  //set Stream Key
  const handleChange = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  };

  //add Stream Platform
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
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
    });

    setMultiStreamConnected([...multiStreamConnected, postData]);
    setShowStreamModal(false);
    setLoader(true);
  };

  //create Mutlistream
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

  //edit platform
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

  //Recording
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const [chunks, setChunks] = useState([]);

  async function storeWithProgress() {
    const onRootCidReady = (cid) => {
      recordvideo.cid = cid;
    };

    const blob = new Blob([JSON.stringify(recordvideo)], { type: 'application/json' });

    const files = [recordvideo.videoFile, new File([blob], 'meta.json')];
    const totalSize = recordvideo.videoFile.size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      //setUploading(10 - pct);
      console.log(`Uploading... ${pct}% complete`);
    };

    const client = makeStorageClient();
    return client.put(files, { onRootCidReady, onStoredChunk });
  }

  const startRecording = async () => {
    setNewRecord(0);
    setRecordVideo({
      videoName: '',
      videoFile: null,
      category: '',
      description: '',
      price: '',
      royality: '',
    });
    setChunks([]);

    let data = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: { mediaSource: 'screen' },
    });
    setStream(data);
    if (data) {
      setRecording(true);
    }

    let recorderdata = new MediaRecorder(data);
    setRecorder(recorderdata);

    recorderdata.ondataavailable = (e) => chunks.push(e.data);
    recorderdata.onstop = () => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });

      setRecordUrl(URL.createObjectURL(completeBlob));
      setRecording(false);
      setNewRecord(1);
    };

    recorderdata.start();
  };

  const stopRecording = () => {
    setRecording(false);
    setNewRecord(1);
    recorder.stop();
    stream.getVideoTracks()[0].stop();
  };

  //video functions
  const handleVideoInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setRecordVideo({ ...recordvideo, [name]: value });
  };

  useEffect(() => {
    setRecordVideo({
      ...recordvideo,
      category: selectedCategory,
    });
    // eslint-disable-next-line
  }, [selectedCategory]);

  useEffect(() => {
    if (recordvideo.videoFile !== null) {
      storeWithProgress();
    }
    // eslint-disable-next-line
  }, [recordvideo.videoFile]);

  const mintNFT = () => {
    const videoFile = new File(chunks, `${recordvideo.videoName}.webm`, { type: 'video/webm' });
    setRecordVideo({ ...recordvideo, videoFile: videoFile });
  };

  // Thumbnail
  async function storeThumbnail(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {};
    const file = [files[0]];
    const totalSize = files[0].size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      // setUploading(10 - pct);
      // console.log(`Uploading... ${pct}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(file, { onRootCidReady, onStoredChunk });
  }
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };
  async function uploadThumbnail(e) {
    e.preventDefault();
    if (selectedFile) {
      setUploadingFile(true);
      storeThumbnail(selectedFile.file)
        .then(async (cid) => {
          setUploadingFile(false);
          console.log('https://ipfs.io/ipfs/' + cid + '/' + selectedFile.file[0].name);
          const data = {
            url: 'https://ipfs.io/ipfs/' + cid + '/' + selectedFile.file[0].name,
            username: user.username,
          };
          const res = await axios({
            method: 'POST',
            url: `${process.env.REACT_APP_SERVER_URL}/user/uploadThumbnail`,
            data: data,
            headers: {
              'content-type': 'application/json',
              'auth-token': localStorage.getItem('authtoken'),
            },
          });
          if (res.data == 'success') {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${user.username}`).then((value) => {
              window.localStorage.setItem('user', JSON.stringify(value.data));
            });
          }
        })
        .catch((err) => {
          setUploadingFile(false);
          console.log(err);
          setSelectedFile(null);
        });
      return;
    }
  }
  // async function storeWithProgress(files) {
  //   // show the root cid as soon as it's ready
  //   const onRootCidReady = (cid) => {};
  //   const file = [files[0]];
  //   const totalSize = files[0].size;
  //   let uploaded = 0;
  //   const onStoredChunk = (size) => {
  //     uploaded += size;
  //     const pct = totalSize / uploaded;
  //     // setUploading(10 - pct);
  //     // console.log(`Uploading... ${pct}% complete`);
  //   };

  //   // makeStorageClient returns an authorized Web3.Storage client instance
  //   const client = makeStorageClient();

  //   // client.put will invoke our callbacks during the upload
  //   // and return the root cid when the upload completes
  //   return client.put(file, { onRootCidReady, onStoredChunk });
  // }

  // console.log(user);
  return (
    <Fragment className={`${darkMode && 'dark'}`}>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row  pb-50  lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary">
        <div className=" lg:col-span-2 pt-3 mt-10">
          <div className="self-center lg:px-8 w-screen lg:w-full lg:mt-3 mt-0.5  ">
            {' '}
            {user ? (
              <VideoPlayer playbackUrl={playbackUrl} creatorData={user} footer={false} />
            ) : null}
            {user.livepeer_data.isActive && (
              <div className="dark:text-dbeats-white mt-3 ml-2">
                <p className="text-md">To create NFT start Recording</p>
                <div className="flex justify-between items-center w-full pt-2 text-white">
                  <button
                    className={`text-center rounded-md w-full 
                    ${recording ? 'bg-green-300' : 'bg-green-600'} mx-2 py-2`}
                    disabled={recording}
                    onClick={startRecording}
                  >
                    Start Recording
                  </button>
                  <button
                    className={`text-center rounded-md w-full 
                    ${!recording ? 'bg-red-300' : 'bg-red-600'} mx-2 py-2`}
                    disabled={!recording}
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </button>
                </div>
              </div>
            )}
            <p className={`text-white text-lg text-right pr-2 flex flex-col`}>
              <span className={` text-${viewColor}  ${viewAnimate} font-bold`}>
                {livestreamViews - 1}
              </span>
              viewers
            </p>
          </div>
        </div>
        {user.livepeer_data.isActive ? (
          user.username && (
            <div className="  w-full col-span-1" style={{ height: '100vh' }}>
              <LiveChat userp={user} privateUser={user}></LiveChat>
            </div>
          )
        ) : (
          <div className="text-sm mx-auto col-span-1  2xl:mt-10 lg:mt-4 mb-6 max-w-md">
            <div className="bg-white dark:bg-dbeats-dark-primary dark:text-dbeats-white w-80 border border-dbeats-light border-opacity-40  2xl:w-full  p-5 rounded text-sm sm:lg:text-xl shadow mt-6  lg:ml-0 ">
              <div className="grid grid-cols-2">
                <div className="pb-2">
                  <span className="font-semibold tracking-widest">Name</span>
                  <p className="opacity-50">{user.name}</p>
                </div>
                <div className="pb-2">
                  <span className="font-semibold tracking-widest">Username</span>
                  <p className="opacity-50">{user.username}</p>
                </div>
              </div>

              <div className="pb-2">
                <span className="font-semibold tracking-widest">RTMP URL</span>
                <div className="flex">
                  <p className="opacity-50">rtmp://rtmp.livepeer.com/live</p>
                  <i
                    onClick={() => {
                      navigator.clipboard.writeText('rtmp://rtmp.livepeer.com/live');
                      setCopied('rtmp://rtmp.livepeer.com/live');
                    }}
                    className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1"
                  ></i>
                  {copied == 'rtmp://rtmp.livepeer.com/live' ? (
                    <span className="text-dbeats-light">copied</span>
                  ) : null}
                </div>
              </div>
              <hr width="95%" className="mt-2 mb-2  border-dbeats-white" />

              <div className="pb-2">
                <span className="font-semibold tracking-widest ">Streamer Key</span>
                <div className="flex">
                  <p className="opacity-50">{userStreams.streamKey}</p>
                  <i
                    onClick={() => {
                      navigator.clipboard.writeText(userStreams.streamKey);
                      setCopied(userStreams.streamKey);
                    }}
                    className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1 "
                  ></i>
                  {copied == userStreams.streamKey ? (
                    <span className="text-dbeats-light">copied</span>
                  ) : null}
                </div>
              </div>
              <div className="pb-2  break-words hidden">
                <span className="font-semibold tracking-widest ">Playback URL</span>
                <p className="opacity-50">{playbackUrl}</p>
              </div>
              <div className="pb-2  break-words">
                <span className="font-semibold tracking-widest">Live URL</span>
                <p>
                  <a
                    className="opacity-50"
                    href={`https://dbeats.live/live/${user.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://dbeats.live/live/{user.username}
                  </a>
                  <i
                    onClick={() => {
                      navigator.clipboard.writeText('https://dbeats.live/live/' + user.username);
                      setCopied('https://dbeats.live/live/' + user.username);
                    }}
                    className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1 "
                  ></i>
                  {copied == 'https://dbeats.live/live/' + user.username ? (
                    <span className="text-dbeats-light">copied</span>
                  ) : null}
                </p>
              </div>
              <hr width="95%" className="mt-2 mb-2  border-dbeats-white" />
              <div className="mb-4">
                <h1 className="text-bold">Thumbnail </h1>
                {selectedFile ? (
                  <img src={selectedFile.localurl} className="my-2 rounded max-h-72"></img>
                ) : user.thumbnail ? (
                  <img src={user.thumbnail} className="my-2 rounded max-h-110"></img>
                ) : null}
                <form className="flex items-center" onSubmit={uploadThumbnail}>
                  <input
                    name="image"
                    type="file"
                    accept=".jpg,.png,.jpeg,.gif,.webp"
                    required={true}
                    onChange={onFileChange}
                  />
                  <div className="p-1 nm-flat-dbeats-dark-primary rounded-3xl hover:nm-inset-dbeats-dark-primary">
                    <button
                      disabled={uploadingFile}
                      type="submit"
                      className={`${
                        uploadingFile
                          ? 'dark:bg-dbeats-dark-primary'
                          : 'bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-light-xs'
                      }  px-4 py-2  rounded-3xl group flex items-center justify-center  `}
                    >
                      <p className="hidden md:inline">Upload</p>
                    </button>
                  </div>
                  <div
                    className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                    hidden={!uploadingFile}
                  ></div>
                </form>
              </div>
              <div>
                <div className="flex flex-col">
                  <p className="text-center mb-1">Currently Connected :</p>
                  <div className="flex flex-wrap justify-center">
                    {multiStreamConnected.map((value, index) => {
                      ////console.log(value);
                      return (
                        <div key={index} className="m-1">
                          <img
                            src={value.platform.logo}
                            alt="logo"
                            className="h-6 lg:h-10 w-auto"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="nm-flat-dbeats-dark-primary p-1 rounded-3xl hover:nm-inset-dbeats-dark w-max mx-auto">
                    <button
                      variant="primary"
                      className="bg-dbeats-dark-secondary text-center content-center justify-center align-middle hover:nm-inset-dbeats-light flex text-white rounded-3xl font-bold px-4 py-3 tracking-widest w-max"
                      type="button"
                      onClick={
                        multiStreamConnected.length < 3
                          ? () => setShowDestinationModal(true)
                          : () => setShowPriceModal(true)
                      }
                    >
                      Add MultiStream Platforms
                      <i className="fas fa-solid fa-video mx-4 cursor-pointer pt-1"></i>
                    </button>
                  </div>
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
              <>
                <hr width="95%" className="mt-2 mb-4" />
                <p className="text-md">To create NFT start Recording</p>
                <div className="flex justify-between items-center w-full pt-2 text-white">
                  <button
                    className={`text-center rounded-md w-full 
                    ${recording ? 'bg-green-300' : 'bg-green-600'} mx-2 py-2`}
                    disabled={recording}
                    onClick={startRecording}
                  >
                    Start Recording
                  </button>
                  <button
                    className={`text-center rounded-md w-full 
                    ${!recording ? 'bg-red-300' : 'bg-red-600'} mx-2 py-2`}
                    disabled={!recording}
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </button>
                </div>
              </>
            </div>
          </div>
        )}
      </div>
      {newRecord === 1 ? (
        <div className="flex justify-between m-6 py-6 px-10 bg-dbeats-dark-secondary">
          <div className="w-full flex justify-center">
            <video
              src={recordUrl}
              width="90%"
              height="90%"
              controls
              autoPlay={true}
              muted={false}
            />
          </div>
          <div className="w-full">
            <div className="space-y-6 text-gray-500 dark:text-gray-100">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                <div className="col-span-1 sm:col-span-1">
                  <label
                    htmlFor="videoName"
                    className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Video Title
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="videoName"
                      id="videoName"
                      value={recordvideo.videoName}
                      onChange={handleVideoInputs}
                      className="focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                <div className="lg:col-span-4 col-span-8 sm:col-span-4">
                  <label
                    htmlFor="videoName"
                    className="block mr-2 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Royality
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="royality"
                      id="royality"
                      value={recordvideo.royality}
                      onChange={handleVideoInputs}
                      className="focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                  <label
                    htmlFor="videoName"
                    className="block mr-2 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Pricing
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={recordvideo.price}
                      onChange={handleVideoInputs}
                      className="focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                  <label
                    htmlFor="company-website"
                    className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                  >
                    Category
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <Dropdown
                      data={category}
                      setSelected={setSelectedCategory}
                      getSelected={selectedCategory}
                    />
                  </div>
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="description"
                  className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="videoDescription"
                    name="description"
                    rows={3}
                    value={recordvideo.description}
                    onChange={handleVideoInputs}
                    className="dark:placeholder-gray-600 focus:ring-dbeats-dark-primary border dark:border-dbeats-alt border-gray-300 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                    placeholder="Any Behind the scenes you'll like your Audience to know!"
                  />
                </div>
              </div>
              <div className="float-right pt-20 flex items-center">
                <div
                  onClick={mintNFT}
                  className="w-max font-bold cursor-pointer px-12 nowrap py-2 rounded-md text-md text-white bg-dbeats-light"
                >
                  Mint NFT
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={showDestinationModal}
        className="h-max lg:w-max w-5/6  mx-auto 2xl:mt-40 lg:mt-16 mt-28 shadow-xl bg-white"
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
            className="lg:w-2/3 w-full mx-auto lg:mx-2 my-1 rounded-md bg-dbeats-light text-white lg:p-2 p-1 lg:text-xl text-base  font-semibold tracking-widest"
            onClick={() => {
              setModalShow(true);
              setShowDestinationModal(false);
            }}
          >
            Add Destination
          </button>
          <button
            className="lg:w-1/3 w-full my-1 lg:mx-2 mx-auto rounded-md bg-green-500 text-white lg:p-2 p-1 lg:text-xl text-base font-semibold tracking-widest"
            onClick={createMultiStream}
          >
            Apply
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalShow}
        className="h-max lg:w-1/2 w-5/6 mx-auto 2xl:mt-48 lg:mt-16  mt-24 shadow-xl bg-white"
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
        className="h-max lg:w-1/3 w-5/6 mx-auto 2xl:mt-24 lg:mt-16 mt-24 shadow-xl bg-white"
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
                  <div className="text-white text-lg font-semibold tracking-widest">
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

      {user.livepeer_data.isActive && (
        <div className="text-sm ml-20 col-span-1  2xl:mt-10 lg:mt-4 mb-6 max-w-md">
          <div className="bg-white dark:bg-dbeats-dark-primary dark:text-dbeats-white w-80 border border-dbeats-light border-opacity-40  2xl:w-full  p-5 rounded text-sm sm:lg:text-xl shadow mt-6  lg:ml-0 ">
            <div className="grid grid-cols-2">
              <div className="pb-2">
                <span className="font-semibold tracking-widest">Name</span>
                <p className="opacity-50">{user.name}</p>
              </div>
              <div className="pb-2">
                <span className="font-semibold tracking-widest">Username</span>
                <p className="opacity-50">{user.username}</p>
              </div>
            </div>

            <div className="pb-2">
              <span className="font-semibold tracking-widest">RTMP URL</span>
              <div className="flex">
                <p className="opacity-50">rtmp://rtmp.livepeer.com/live</p>
                <i
                  onClick={() => {
                    navigator.clipboard.writeText('rtmp://rtmp.livepeer.com/live');
                    setCopied('rtmp://rtmp.livepeer.com/live');
                  }}
                  className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1"
                ></i>
                {copied == 'rtmp://rtmp.livepeer.com/live' ? (
                  <span className="text-dbeats-light">copied</span>
                ) : null}
              </div>
            </div>
            <hr width="95%" className="mt-2 mb-2  border-dbeats-white" />

            <div className="pb-2">
              <span className="font-semibold tracking-widest ">Streamer Key</span>
              <div className="flex">
                <p className="opacity-50">{userStreams.streamKey}</p>
                <i
                  onClick={() => {
                    navigator.clipboard.writeText(userStreams.streamKey);
                    setCopied(userStreams.streamKey);
                  }}
                  className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1 "
                ></i>
                {copied == userStreams.streamKey ? (
                  <span className="text-dbeats-light">copied</span>
                ) : null}
              </div>
            </div>
            <div className="pb-2  break-words hidden">
              <span className="font-semibold tracking-widest ">Playback URL</span>
              <p className="opacity-50">{playbackUrl}</p>
            </div>
            <div className="pb-2  break-words">
              <span className="font-semibold tracking-widest">Live URL</span>
              <p>
                <a
                  className="opacity-50"
                  href={`https://dbeats.live/live/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://dbeats.live/live/{user.username}
                </a>
                <i
                  onClick={() => {
                    navigator.clipboard.writeText('https://dbeats.live/live/' + user.username);
                    setCopied('https://dbeats.live/live/' + user.username);
                  }}
                  className="fas fa-solid fa-copy mx-4 hover:text-dbeats-light cursor-pointer pt-1 "
                ></i>
                {copied == 'https://dbeats.live/live/' + user.username ? (
                  <span className="text-dbeats-light">copied</span>
                ) : null}
              </p>
            </div>
            <hr width="95%" className="mt-2 mb-2  border-dbeats-white" />
            <div className="mb-4">
              <h1 className="text-bold">Thumbnail </h1>
              {selectedFile ? (
                <img src={selectedFile.localurl} className="my-2 rounded max-h-72"></img>
              ) : user.thumbnail ? (
                <img src={user.thumbnail} className="my-2 rounded max-h-110"></img>
              ) : null}
              <form className="flex items-center" onSubmit={uploadThumbnail}>
                <input
                  name="image"
                  type="file"
                  accept=".jpg,.png,.jpeg,.gif,.webp"
                  required={true}
                  onChange={onFileChange}
                />
                <div className="p-1 nm-flat-dbeats-dark-primary rounded-3xl hover:nm-inset-dbeats-dark-primary">
                  <button
                    disabled={uploadingFile}
                    type="submit"
                    className={`${
                      uploadingFile
                        ? 'dark:bg-dbeats-dark-primary'
                        : 'bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-light-xs'
                    }  px-4 py-2  rounded-3xl group flex items-center justify-center  `}
                  >
                    <p className="hidden md:inline">Upload</p>
                  </button>
                </div>
                <div
                  className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                  hidden={!uploadingFile}
                ></div>
              </form>
            </div>
            <div>
              <div className="flex flex-col">
                <p className="text-center mb-1">Currently Connected :</p>
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
                <div className="nm-flat-dbeats-dark-primary p-1 rounded-3xl hover:nm-inset-dbeats-dark w-max mx-auto">
                  <button
                    variant="primary"
                    className="bg-dbeats-dark-secondary text-center content-center justify-center align-middle hover:nm-inset-dbeats-light flex text-white rounded-3xl font-bold px-4 py-3 tracking-widest w-max"
                    type="button"
                    onClick={
                      multiStreamConnected.length < 3
                        ? () => setShowDestinationModal(true)
                        : () => setShowPriceModal(true)
                    }
                  >
                    Add MultiStream Platforms
                    <i className="fas fa-solid fa-video mx-4 cursor-pointer pt-1"></i>
                  </button>
                </div>
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
            <>
              <hr width="95%" className="mt-2 mb-4" />
              <p className="text-md">To create NFT start Recording</p>
              <div className="flex justify-between items-center w-full pt-2 text-white">
                <button
                  className={`text-center rounded-md w-full 
                  ${recording ? 'bg-green-300' : 'bg-green-600'} mx-2 py-2`}
                  disabled={recording}
                  onClick={startRecording}
                >
                  Start Recording
                </button>
                <button
                  className={`text-center rounded-md w-full 
                  ${!recording ? 'bg-red-300' : 'bg-red-600'} mx-2 py-2`}
                  disabled={!recording}
                  onClick={stopRecording}
                >
                  Stop Recording
                </button>
              </div>
            </>
          </div>
        </div>
      )}
      <Modal
        isOpen={showPriceModal}
        className="h-max lg:w-1/3 w-5/6 mx-auto 2xl:mt-24 lg:mt-16 mt-24 shadow-xl bg-white"
      >
        <h2 className="grid grid-cols-5 justify-items-center rounded-t-xl w-full dark:rounded-t-sm text-2xl py-4 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 text-lg lg:text-2xl text-center">
            To add more than 3 platforms you have to pay $10
          </div>
          <div className="mr-7 flex justify-end w-full" onClick={() => setShowPriceModal(false)}>
            <i className="fas fa-times cursor-pointer mr-3"></i>
          </div>
        </h2>
      </Modal>
    </Fragment>
  );
};

export default UserInfo;
