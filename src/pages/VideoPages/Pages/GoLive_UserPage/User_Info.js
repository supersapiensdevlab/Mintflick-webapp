import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { MultiStreamData } from '../../../../assets/Data';
import Dropdown from '../../../../component/dropdown.component';
import { makeStorageClient } from '../../../../component/uploadHelperFunction';
import VideoPlayer from '../../../../component/VideoPlayer/VideoPlayer';
import classes from '../Info.module.css';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { tokenConfig } from '../../../../helper/tokenConfig';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';
import { nftmarketaddress } from '../../../../functions/config';
import { loadUser } from '../../../../actions/userActions';
import { ProgressBar, Step } from 'react-step-progress-bar';
import icon1 from '../../../../assets/icons/cryptocurrency-art.png';
import icon2 from '../../../../assets/icons/nft.png';
import icon3 from '../../../../assets/icons/cryptocurrency-token.png';

// import LiveChat from '../LivePublicPage/LiveChat';
// import { io } from 'socket.io-client';

const UserInfo = (props) => {
  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [StreamKey, setKey] = useState('');
  const [loader, setLoader] = useState(true);
  const provider = useSelector((state) => state.web3Reducer.provider);

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

  const [uploading, setUploading] = useState(0);

  const [hideButton, setHideButton] = useState(false);

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

  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const [isNFT, setIsNFT] = useState(true);
  const [NFTprice, setPrice] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [sharable_data, setsharable_data] = useState();
  const [tokenId, setTokenId] = useState(null);
  const [formData, setFormData] = useState(null);

  const text = 'Copy Link To Clipboard';

  const [video, setVideo] = useState({
    videoName: '',
    videoImage: '',
    videoFile: '',
    category: '',
    ratings: '',
    tags: [],
    description: '',
    allowAttribution: '',
    commercialUse: '',
    derivativeWorks: '',
  });

  useEffect(() => {
    if (user && user.multistream_platform) {
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

  // useEffect(() => {
  //   const socket = io(process.env.REACT_APP_VIEWS_URL, {
  //     transports: ['websocket'],
  //     upgrade: false,
  //   });
  //   socket.on('connection');
  //   socket.emit('joinlivestream', props.stream_id);
  //   socket.on('count', (details) => {
  //     if (details.room === props.stream_id) {
  //       setLivestreamViews(details.roomSize);
  //     }
  //   });
  //   socket.on('livecount', (details) => {
  //     setLivestreamViews(details.roomSize);
  //     // console.log('emitted');
  //     // console.log('inc', livestreamViews);
  //     setViewColor('green-500');
  //     setViewAnimate('animate-pulse');
  //     setTimeout(() => {
  //       setViewColor('white');
  //       setViewAnimate('animate-none');
  //     }, 3000);
  //   });
  //   socket.on('removecount', (roomSize) => {
  //     setLivestreamViews(roomSize);
  //     // console.log('removecount emitted');
  //     // console.log('dec', livestreamViews);
  //     setViewColor('red-500');
  //     setViewAnimate('animate-pulse');
  //     setTimeout(() => {
  //       setViewColor('white');
  //       setViewAnimate('animate-none');
  //     }, 3000);
  //   });
  // }, []);

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

      console.log(cid);
    };

    const blob = new Blob([JSON.stringify(recordvideo)], { type: 'application/json' });

    const files = [recordvideo.videoFile];
    const totalSize = recordvideo.videoFile.size;
    console.log(totalSize);
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;

      let progress = Math.min(pct * 100, 100).toFixed(2);
      setUploading(progress);
      console.log(`Uploading... ${Math.min(pct * 100, 100).toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
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
    recorderdata.onstop = async () => {
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      const videoFile = new File(chunks, `video.webm`, { type: 'video/webm' });

      setRecordUrl(URL.createObjectURL(completeBlob));
      setRecordVideo({ ...recordvideo, videoFile: videoFile });
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
    // eslint-disable-next-line
  }, [recordvideo.videoFile]);

  const handleNFT = () => {
    setIsNFT(!isNFT);
  };

  useEffect(() => {
    async function uploadVideoToDB() {}

    console.log('TOKEN ID', tokenId);
    if (tokenId && mintingProgress == 66) {
      dispatch(loadUser());
      formData.append('tokenId', tokenId);
      console.log('Saving FIles to DB', formData);
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/upload_video`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
            'auth-token': localStorage.getItem('authtoken'),
          },
        })
        .then((res) => {
          setMintingProgress(100);
          axios
            .get(`${process.env.REACT_APP_SERVER_URL}/user/getLoggedInUser`, tokenConfig())
            .then((res) => {
              let latestVideoId = res.data.videos[res.data.videos.length - 1].videoId;
              setsharable_data(
                `${process.env.REACT_APP_CLIENT_URL}/playback/${res.data.username}/${latestVideoId}`,
              );
              setShow(true);
            });

          setVideo({
            videoName: '',
            videoImage: '',
            videoFile: '',
            category: '',
            ratings: '',
            tags: [],
            description: '',
            allowAttribution: '',
            commercialUse: '',
            derivativeWorks: '',
          }); // reset the form
        });
    }
  }, [mintingProgress]);

  const mintNFT = () => {
    // const videoFile = new File(chunks, `${recordvideo.videoName}.webm`, { type: 'video/webm' });
    // console.log(videoFile.size);
    //setRecordVideo({ ...recordvideo, videoFile: videoFile });
    if (recordvideo.videoFile !== null) {
      storeWithProgress().then(async () => {
        var ts = Math.round(new Date().getTime() / 1000);

        //Standard Metadata supported by OpenSea
        let metadata = {
          image: '' + user.thumbnail,

          external_url: 'https://ipfs.infura.io/ipfs/' + recordvideo.cid + '/video.mp4',

          description: recordvideo.description,

          name: recordvideo.videoName,

          attributes: [
            {
              display_type: 'date',
              trait_type: 'Created On',
              value: ts,
            },
            {
              trait_type: 'Category',
              value: recordvideo.category,
            },
          ],
          animation_url: 'https://ipfs.infura.io/ipfs/' + recordvideo.cid + '/video.webm',
        };

        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });

        const files = [new File([blob], 'meta.json')];
        const client = makeStorageClient();
        const cid = await client.put(files);
        console.log('stored files with cid:', cid);

        let url = 'https://ipfs.infura.io/ipfs/' + cid + '/meta.json';

        //saveVideoDetails to FormData
        let formData = new FormData(); // Currently empty
        formData.append('userName', user.username);
        formData.append('userImage', user.profile_image);

        formData.append('videoName', recordvideo.videoName);

        formData.append('description', recordvideo.description);

        formData.append('category', category);

        // formData.append('allowAttribution', allowAttribution);
        // formData.append('commercialUse', commercialUse);
        // formData.append('derivativeWorks', derivativeWorks);

        formData.append('videoFile', recordvideo.videoFile, 'video.webm');
        //formData.append('videoImage', user.thumbnail, 'thumbnail.jpg');
        formData.append('videoImage', recordvideo.videoFile, 'video.webm');

        formData.append('videoHash', video.cid);

        formData.append('meta_url', cid); // meta_url is the IPFS hash of the meta.json file

        setFormData(formData);

        createToken(url, metadata);
      });
    }
  };

  async function createToken(url, formData) {
    var tokenId = null;
    var biconomy = new Biconomy(provider, {
      apiKey: 'Ooz6qQnPL.10a08ea0-3611-432d-a7de-34cf9c44b49b',
    });
    console.log(provider);
    //console.log(biconomy);

    const web3 = new Web3(biconomy);
    window.web3 = web3;

    setMinting(true);
    biconomy
      .onEvent(biconomy.READY, async () => {
        console.log('Biconomy is ready', user.wallet_id);
        let contract = new web3.eth.Contract(Market, nftmarketaddress);
        await contract.methods
          .createToken(url)
          .send({ from: user.wallet_id })
          .then(async (res) => {
            console.log('#transaction : ', res);
            tokenId = res.events.Transfer.returnValues.tokenId;
            setMinting('token created');
            setMintingProgress(33);
            console.log('#token created : ', tokenId);

            setTokenId(tokenId);

            await contract.methods
              .createMarketItem(
                res.events.Transfer.returnValues.tokenId,
                ethers.utils.parseUnits(recordvideo.price, 'ether'),
              )
              .send({ from: user.wallet_id })
              .then(async (res) => {
                setShow(true);
                setMinting(res.transactionHash);
                setMintingProgress(66);
              });
          });
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(error);
        console.log(message);
      });
  }
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
          console.log('https://ipfs.infura.io/ipfs/' + cid + '/' + selectedFile.file[0].name);
          const data = {
            url: 'https://ipfs.infura.io/ipfs/' + cid + '/' + selectedFile.file[0].name,
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
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    }
  }, []);

  return user ? (
    <div className={`${darkMode && 'dark'}`}>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 grid-flow-row  pb-50  lg:ml-12  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary">
        <div className=" lg:col-span-2 pt-3 mt-10">
          <div className="self-center lg:px-8 w-screen lg:w-full lg:mt-3 mt-0.5  ">
            {' '}
            {user ? (
              <VideoPlayer playbackUrl={playbackUrl} creatorData={user} footer={false} />
            ) : null}
            {user.livepeer_data
              ? user.livepeer_data.isActive && (
                  <div className="dark:text-dbeats-white mt-3 ml-2">
                    <p className="text-md">To create NFT start Recording</p>
                    <div className="flex justify-between items-center w-full pt-2 text-white">
                      <div className="flex w-1/2">
                        <button
                          className={`text-center rounded-md w-60 
                    ${recording ? 'bg-green-300' : 'bg-green-600'} mx-2 py-2`}
                          disabled={recording}
                          onClick={startRecording}
                        >
                          Start Recording
                        </button>
                        {recording ? (
                          <button
                            className={`text-center rounded-md w-60 
                    ${!recording ? 'bg-red-300' : 'bg-red-600'} mx-2 py-2`}
                            disabled={!recording}
                            onClick={stopRecording}
                          >
                            Stop Recording
                          </button>
                        ) : (
                          <></>
                        )}
                      </div>
                      <p className={`text-white text-lg text-center pr-2 flex flex-col`}>
                        <span className={` text-${viewColor}  ${viewAnimate} font-bold`}>
                          {livestreamViews}
                        </span>
                        viewers
                      </p>
                    </div>
                  </div>
                )
              : null}
          </div>
        </div>
        {user.livepeer_data.isActive ? (
          user.username && (
            <div className="  w-full col-span-1" style={{ height: '100vh' }}>
              {/* <LiveChat userp={user} privateUser={user}></LiveChat> */}
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
                {recordvideo.cid != null ? (
                  <>
                    {/* <a
                      className=" text-white cursor-pointer mr-2 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://ipfs.infura.io/ipfs/${recordvideo.cid}/video.webm`}
                    >
                      Click here to Download
                    </a>

                     */}

                    <div className="flex flex-col text-center">
                      <div
                        className={`${minting === true ? 'block' : 'hidden'} mx-3 text-white my-5 `}
                      >
                        👻 Confirm NFT Mint on the next Popup
                      </div>
                      {minting === 'token created' ? (
                        <div className={`  mx-3 text-white my-5 `}>
                          ✅ NFT Token Created Successfully. Confirm Market Listing on the Popup
                        </div>
                      ) : null}

                      <div
                        className={`${
                          mintingProgress === 66 ? 'block' : 'hidden'
                        } text-center flex mx-3 my-5`}
                      >
                        <p className="no-underline  text-white">Wrapping Up Things &nbsp;</p>
                        <p className="no-underline  text-white"> Please Wait...</p>
                      </div>

                      <div
                        className={`${
                          minting !== null &&
                          minting !== true &&
                          mintingProgress === 100 &&
                          minting !== 'token created'
                            ? 'block'
                            : 'hidden'
                        } text-center flex mx-3 my-5`}
                      >
                        <p className="no-underline  text-dbeats-light">🚀 NFT Minted &nbsp;</p>
                        <a
                          target={'_blank'}
                          rel="noopener noreferrer "
                          className="dark:text-dbeats-light cursor-pointer underline  "
                          href={`https://polygonscan.com/tx/${minting}`}
                        >
                          Check on Polygonscan
                        </a>
                      </div>
                      <ProgressBar
                        className="w-full mx-auto"
                        percent={mintingProgress}
                        transitionDuration={1000}
                        filledBackground="linear-gradient(to right,  #31c48D, #3f83f8)"
                      >
                        <Step transition="scale">
                          {({ accomplished }) => (
                            <img
                              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                              className="w-6"
                              src={icon3}
                            />
                          )}
                        </Step>
                        <Step transition="scale">
                          {({ accomplished }) => (
                            <img
                              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                              className="w-8"
                              src={icon2}
                            />
                          )}
                        </Step>
                        <Step transition="scale">
                          {({ accomplished }) => (
                            <img
                              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                              className="w-6"
                              src={icon1}
                            />
                          )}
                        </Step>
                        <Step transition="scale">
                          {({ accomplished }) => (
                            <img
                              style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                              width="30"
                              src={icon1}
                            />
                          )}
                        </Step>
                      </ProgressBar>
                    </div>
                  </>
                ) : null}

                <div
                  hidden={hideButton}
                  onClick={() => {
                    mintNFT();
                    setHideButton(true);
                  }}
                  className="w-max font-bold cursor-pointer px-12 nowrap py-2 rounded-md text-md text-white bg-dbeats-light"
                >
                  Mint NFT
                </div>

                {recordvideo.cid == null ? (
                  <div hidden={!hideButton} className=" mx-5 flex items-center w-64">
                    <input
                      type="range"
                      defaultValue={uploading}
                      min="0"
                      max="100"
                      hidden={!hideButton}
                      className="appearance-none cursor-pointer w-full h-3 bg-green-400 
                font-white rounded-full slider-thumb  backdrop-blur-md"
                    />
                    <p className="mx-2 text-base font-medium text-white" hidden={!hideButton}>
                      {Math.round(uploading)}%
                    </p>
                  </div>
                ) : null}
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

      {/* {user.livepeer_data.isActive && (
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
      )} */}
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
    </div>
  ) : (
    <></>
  );
};

export default UserInfo;
