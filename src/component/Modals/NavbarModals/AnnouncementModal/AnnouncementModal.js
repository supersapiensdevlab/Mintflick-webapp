import axios from 'axios';
import moment from 'moment';
import { NFTStorage } from 'nft.storage';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { detectURLs, makeStorageClient } from '../../../uploadHelperFunction';
import LinkPreview from './LinkPreview';
import classes from './LinkPreview.module.css';

moment().format();

const AnnouncementModal = (props) => {
  const user = JSON.parse(window.localStorage.getItem('user'));

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  //const [postImage, setPostImage] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [announcement, setAnnouncement] = useState({
    announcementText: '',
    postImage: null,
    postVideo: null,
    event_link: '',
    cid: '',
    royalty: 5,
    tokenId: '',
    mintTrxHash: '',
  });

  const [linkPreviewUrl, setLinkPreviewUrl] = useState(null);
  const [linkPreviewData, setLinkPreviewData] = useState(null);
  const [uploading, setUploading] = useState(0);

  const handleInputChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setAnnouncement({ ...announcement, announcementText: value });
    let url = detectURLs(value);
    //getLinkPreview(url[url.length - 1]).then((data) => setLinkPreviewUrl(data));
    if (url && url.length > 0) {
      setLinkPreviewUrl(url[url.length - 1]);
      setShowLinkPreview(true);
    } else {
      setShowLinkPreview(false);
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    if (e.target.files.length) {
      setPostImage(URL.createObjectURL(e.target.files[0]));

      setAnnouncement({ ...announcement, postImage: e.target.files[0] });
    }
  };

  const handleVideoChange = (e) => {
    e.preventDefault();
    setAnnouncement({ ...announcement, postVideo: e.target.files[0] });
  };

  const handleLinkChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setAnnouncement({ ...announcement, event_link: value });
  };

  async function storeWithProgress() {
    const contract_address = process.env.CONTRACT_ADDRESS;

    const onRootCidReady = async (cid) => {
      announcement.cid = cid;

      const apiKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhMzIwRGQxRDBBNTBmMUQyYjNGNmZGZDM0MUI3ODdkNTYzQzBFYjUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDQ0ODE3MDg4MCwibmFtZSI6IkRCZWF0cyJ9.wGuicvEMGBKmKxqsiC4YhesIjBF11oP9EZXNYYN6w5k';
      const client = new NFTStorage({ token: apiKey });

      const metadata = await client.store({
        name: announcement.announcementText,
        description: '',
        image: announcement.postImage ? announcement.postImage : null,
        animation_url: announcement.postVideo
          ? 'https://ipfs.io/ipfs/' + cid + '/' + announcement.postVideo.name
          : null,
        event_link: announcement.event_link ? announcement.event_link : null,
        attributes: [
          {
            trait_type: 'Event Link',
            value: announcement.event_link ? announcement.event_link : null,
          },
        ],
      });

      // Split ipfs metadata link into two parts
      const ipfsMetadata = metadata.url.split('ipfs://')[1];
      const options = {
        method: 'POST',
        url: 'https://api.nftport.xyz/v0/mints/customizable',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'ad092d8e-feb0-4430-92f7-1fa501b83bec',
        },
        data: {
          chain: 'polygon',
          contract_address: contract_address || '0x03160747B94BE986261D9340D01128d4d5566383',
          metadata_uri: `https://ipfs.io/ipfs/${ipfsMetadata}`,
          mint_to_address: user.wallet_id,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          // //console.log(response.data);
          // //console.log(response.status);
          announcement.mintTrxHash = response.data.transaction_hash;

          const nftTokenOptions = {
            method: 'GET',
            url: `https://api.nftport.xyz/v0/mints/${response.data.transaction_hash}?chain=polygon`,
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'ad092d8e-feb0-4430-92f7-1fa501b83bec',
            },
          };
          document.getElementById('nftAddress').innerHTML = `Sailing Data from OpenSea...`;
          setTimeout(() => {
            axios
              .request(nftTokenOptions)
              .then(function (tokenIdRes) {
                announcement.tokenId = tokenIdRes.data.token_id;

                // //console.log('TOKEN ID DATA: ', tokenIdRes.data);
                // //console.log(
                //   'OpenSea Url of nft: ',
                //   `https://opensea.io/assets/matic/0x03160747b94be986261d9340d01128d4d5566383/${tokenIdRes.data.token_id}`,
                // );

                document.getElementById('nftAddress').innerHTML = `Check on OpenSea`;
                document.getElementById(
                  'nftAddress',
                ).href = `https://opensea.io/assets/matic/0x03160747b94be986261d9340d01128d4d5566383/${tokenIdRes.data.token_id}`;
              })
              .catch(function (e) {
                console.error(e);
              });
          }, 10000);
        })

        .catch(function (error) {
          console.error(error);
        });
    };

    const blob = new Blob([JSON.stringify(announcement)], { type: 'application/json' });

    let files;
    if (announcement.postVideo !== null && announcement.postImage !== null) {
      files = [announcement.postVideo, announcement.postImage, new File([blob], 'meta.json')];
    } else if (announcement.postImage !== null) {
      files = [announcement.postImage, new File([blob], 'meta.json')];
    } else {
      files = [announcement.postVideo, new File([blob], 'meta.json')];
    }
    const totalSize = announcement.postVideo
      ? announcement.postVideo.size
      : announcement.postImage.size;

    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      setUploading(10 - pct);
      console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
  }

  //TODO : Send linkPreview data to backed and save it in user announcement
  const handleAnnouncement = () => {
    props.setLoader(false);
    if (announcement.postImage !== null || announcement.postVideo !== null) {
      storeWithProgress('upload announcement image').then(() => {
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('announcement', announcement.announcementText);
        formData.append('postImage', announcement.postImage);
        formData.append('postVideo', announcement.postVideo);
        formData.append('timestamp', moment().toDate().getTime());

        formData.append('eventlink', announcement.event_link);
        formData.append('announcementHash', announcement.cid);
        formData.append('previewData', JSON.stringify(linkPreviewData));

        console.log('anu', announcement);

        if (announcement.postImage?.length !== 0 || announcement.postVideo?.length !== 0) {
          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, formData, {
              headers: {
                'content-type': 'multipart/form-data',
              },
            })
            .then(() => {
              setAnnouncement({
                announcementText: '',
                postImage: null,
                postVideo: null,
                event_link: '',
              });
              setPostImage(null);
              props.setShowAnnouncement(false);
              props.setLoader(true);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    } else {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('announcement', announcement.announcementText);
      formData.append('postImage', announcement.postImage);
      formData.append('postVideo', announcement.postVideo);
      formData.append('timestamp', moment().toDate().getTime());
      formData.append('eventlink', announcement.event_link);
      formData.append('previewData', JSON.stringify(linkPreviewData));

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/announcement`, formData, {
          headers: {
            'content-type': 'multipart/form-data',
          },
        })
        .then(() => {
          setAnnouncement({
            announcementText: '',
            postImage: null,
            postVideo: null,
            event_link: '',
          });
          setPostImage(null);
          props.setShowAnnouncement(false);
          setUploading(0);
          props.setLoader(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(announcement);
  };

  return (
    <Modal
      isOpen={props.showAnnouncement}
      className={`${
        darkMode
          ? '     rounded-xl z-500'
          : '           rounded-xl shadow-2xl    dark:bg-dbeats-dark-primary dark:text-gray-100 '
      }
          h-max lg:w-1/3 w-full mx-auto lg:mt-20 2xl:mt-40 mt-24`}
    >
      <div className={`${darkMode && 'dark'} `}>
        <div className=" rounded-xl dark:rounded-none  px-12">
          <div
            className="w-full   px-6 rounded-t-xl dark:rounded-t-sm  text-lg  align-middle  py-3 
          dark:bg-dbeats-dark-alt flex bg-white   justify-between    dark:text-gray-100 "
          >
            <p className=" self-center ">Create a post</p>

            <div
              onClick={props.handleCloseAnnouncement}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center mx-2">
                  {' '}
                  <i className="fas fa-times"></i>{' '}
                </p>
              </span>
            </div>
          </div>
          <div className="h-full w-full  align-center ">
            <Container className=" 2xl:pb-4 rounded-b-xl dark:rounded-b-sm  lg:px-7 lg:pb-2 h-full px-4 w-full dark:bg-dbeats-dark-alt overflow-y-auto lg:overflow-hidden bg-white   dark:text-gray-100 ">
              <div className="align-center bg-gray-100 h-full dark:bg-dbeats-dark-alt">
                <div className={`${classes.view_container} lg:h-72 2xl:h-96 h-80 overflow-y-auto`}>
                  <div className="p-1 nm-flat-dbeats-dark-secondary h-5/6 w-full">
                    <textarea
                      className={`${classes.textarea_container} w-full h-full
                     lg:text-sm 2xl:text-lg border-b border-gray-300  placeholder-white placeholder-opacity-25 nm-flat-dbeats-dark-primary`}
                      placeholder={`NFT of thoughts...`}
                      onChange={(e) => handleInputChange(e)}
                    ></textarea>
                  </div>
                  {showLinkPreview && !postImage ? (
                    <>
                      <LinkPreview
                        linkurl={linkPreviewUrl}
                        setShowLinkPreview={setShowLinkPreview}
                        setLinkPreviewData={setLinkPreviewData}
                      />
                    </>
                  ) : (
                    <>
                      {postImage ? (
                        <div className=" text-right">
                          <button
                            className="px-4 pt-2 text-white text-opacity-25 justify-end text-right hover:text-opacity-60"
                            onClick={() => setPostImage(null)}
                          >
                            Remove
                          </button>
                          <img
                            src={postImage}
                            alt="display"
                            height="150px"
                            width="100%"
                            className="px-4"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </div>

                <div className="px-2 mt-1 mb-2 py-2 items-center w-full   dark:bg-dbeats-dark-secondary">
                  <div className="mx-2">
                    <input
                      type="text"
                      placeholder="Enter Event Link(Optional)"
                      onChange={handleLinkChange}
                      className=" w-64 h-max my-2 py-2 rounded-sm sm:text-sm lg:text-sm 2xl:text-md
                        focus:ring-dbeats-dark-primary border dark:border-dbeats-dark-alt border-gray-300 
                        dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary ring-0 flex-1 block nm-flat-dbeats-dark-secondary"
                    />
                  </div>
                  <div className="flex items-center mx-4">
                    <div className=" ">
                      <i
                        className="far fa-images text-xl cursor-pointer opacity-40 hover:opacity-100"
                        onClick={() => {
                          document.getElementById('post_announcement_image').click();
                        }}
                      ></i>
                      <input
                        id="post_announcement_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className="mx-2 flex items-center">
                      <i
                        className="fas fa-video text-xl cursor-pointer opacity-40 hover:opacity-100"
                        onClick={() => {
                          document.getElementById('post_announcement_video').click();
                        }}
                      ></i>
                      <div className="mx-2 mb-1 w-20 truncate">
                        {announcement.postVideo ? announcement.postVideo.name : null}
                      </div>
                      <input
                        id="post_announcement_video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                  <div className=" mx-2 flex justify-end  ">
                    <div className=" mx-5  items-center  hidden">
                      <input
                        type="range"
                        value={uploading}
                        min="0"
                        max="10"
                        hidden={props.loader}
                        className="appearance-none cursor-pointer w-full h-3 bg-green-400 font-white rounded-full slider-thumb  backdrop-blur-md"
                      />
                      <p className="mx-2 text-base font-medium text-white" hidden={props.loader}>
                        {Math.round(uploading * 10)}%
                      </p>
                    </div>

                    <div
                      type="submit"
                      onClick={handleAnnouncement}
                      className="  transform-gpu  transition-all duration-300 ease-in-out mt-3 
                      cursor-pointer relative inline-flex items-center justify-center p-1 mb-2 
                      mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-3xl  
                      bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  
                      nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-secondary   hover:text-white dark:text-white  "
                    >
                      <span
                        className="relative px-5 py-2.5   
                      bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                      >
                        Post
                      </span>
                    </div>
                    <div
                      className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                      hidden={props.loader}
                    ></div>
                  </div>
                </div>
              </div>
              {/* <Row className="w-full flex justify-center items-center">
                <button
                  type="submit"
                  onClick={handleAnnouncement}
                  className=" 2xl:my-3 lg:my-2  bg-white px-3 lg:py-2 py-1 2xl:text-lg lg:text-md  font-semibold bg-dbeats-light  transform transition delay-50 duration-300 ease-in-out hover:scale-105 text-white border-0 lg:w-56 2xl:w-80 w-24 rounded-sm cursor-pointer "
                >
                  POST
                </button>
                <div
                  className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
                  hidden={props.loader}
                ></div>
              </Row> */}
            </Container>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnnouncementModal;
