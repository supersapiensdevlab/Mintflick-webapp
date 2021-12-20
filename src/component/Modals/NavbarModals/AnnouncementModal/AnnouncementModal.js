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

  const [linkPreviewData, setLinkPreviewData] = useState(null);

  const handleInputChange = (e) => {
    e.preventDefault();
    let value = e.target.value;
    setAnnouncement({ ...announcement, announcementText: value });
    let url = detectURLs(value);
    //getLinkPreview(url[url.length - 1]).then((data) => setLinkPreviewData(data));
    if (url && url.length > 0) {
      setLinkPreviewData(url[url.length - 1]);
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
    console.log(announcement);
  };

  return (
    <Modal
      isOpen={props.showAnnouncement}
      className={
        darkMode
          ? 'h-max lg:w-1/2 w-5/6 mx-auto  lg:mt-20 2xl:mt-40 mt-24   rounded-xl z-500'
          : 'h-max lg:w-1/2 w-5/6 mx-auto  lg:mt-20 2xl:mt-40 mt-24 bg-gray-50 rounded-xl shadow-2xl bg-white  dark:bg-dbeats-dark-primary dark:text-gray-100  bg-opacity-60 dark:bg-opacity-90  dark:backdrop-filter  dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md '
      }
    >
      <div className={`${darkMode && 'dark'} `}>
        <div className=" rounded-xl dark:rounded-none  ">
          <h2 className=" justify-items-center rounded-t-xl dark:rounded-t-sm font-bold 2xl:text-2xl text-lg py-3 dark:bg-dbeats-dark-alt bg-white dark:text-white   dark:bg-dbeats-dark-primary dark:text-gray-100  bg-opacity-60 dark:bg-opacity-90  dark:backdrop-filter  dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md ">
            <div className=" text-center font-bold">Post Details</div>
            <i
              className="fas fa-times cursor-pointer absolute -mt-6 ml-auto  right-0 mr-6"
              onClick={props.handleCloseAnnouncement}
            ></i>
          </h2>
          <div className="h-full w-full flex align-center ">
            <Container className="2xl:px-12 2xl:pb-4 rounded-b-xl dark:rounded-b-sm  lg:px-7 lg:pb-2 h-full px-4 w-full dark:bg-dbeats-dark-alt overflow-y-auto lg:overflow-hidden bg-white  dark:bg-dbeats-dark-primary dark:text-gray-100  bg-opacity-60 dark:bg-opacity-90  dark:backdrop-filter  dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md ">
              <div className="align-center bg-gray-100 h-full dark:bg-dbeats-dark-alt">
                <div className={`${classes.view_container} lg:h-72 2xl:h-96 h-48 overflow-y-auto`}>
                  <textarea
                    className={`${classes.textarea_container} h-5/6 w-full 
                     lg:text-sm 2xl:text-lg border-b border-gray-300 dark:bg-dbeats-dark-secondary`}
                    placeholder="Enter Announcement Details"
                    onChange={(e) => handleInputChange(e)}
                  ></textarea>
                  {showLinkPreview ? (
                    <>
                      <LinkPreview
                        linkurl={linkPreviewData}
                        setShowLinkPreview={setShowLinkPreview}
                      />
                    </>
                  ) : (
                    <>
                      {postImage && !linkPreviewData ? (
                        <div className="">
                          <img
                            src={postImage}
                            alt="display"
                            height="150px"
                            width="100%"
                            className="p-4"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-md ml-4 ">Image Preview</span>
                      )}
                    </>
                  )}
                </div>

                <div className="mx-2  flex  items-center w-full justify-between">
                  <div className="flex items-center">
                    <div className="mx-2">
                      <input
                        type="text"
                        placeholder="Enter Event Link(Optional)"
                        onChange={handleLinkChange}
                        className=" w-64 h-8 my-1 rounded-sm lg:text-sm 2xl:text-md border border-gray-200"
                      />
                    </div>
                    <div className="mx-2">
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
                      <div className="mx-2 mb-1">
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
                  <div>
                    <button
                      type="submit"
                      onClick={handleAnnouncement}
                      className=" 2xl:my-3 lg:my-2 mr-5 bg-white px-1 2xl:py-2  py-1 2xl:text-md lg:text-sm  font-semibold bg-dbeats-light  transform transition delay-50 duration-300 ease-in-out hover:scale-105 text-white border-0 lg:w-28 2xl:w-48 w-24 rounded-sm cursor-pointer "
                    >
                      POST
                    </button>
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
