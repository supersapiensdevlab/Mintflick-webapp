import axios from 'axios';
import Noty from 'noty';
import React, { useEffect, useState } from 'react';
import Chips from 'react-chips';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import Dropdown from '../../../dropdown.component';
import { makeStorageClient } from '../../../uploadHelperFunction';
import { chipTheme, theme } from '../Theme';

const UploadVideoModal = (props) => {
  const user = JSON.parse(window.localStorage.getItem('user'));

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  const attribution = ['No Attribution', 'Allow Attribution'];

  const commercialUse = ['Non Commercial', 'Commercial Use'];

  const derivativeWorks = ['No-Selection', 'No Derivative Works', 'Share-Alike'];

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

  const suggestions = ['Games', 'Edu', 'Sci-Fi', 'Counter-Strike'];

  const [selectedAttribution, setSelectedAttribution] = useState(attribution[0]);
  const [selectedCommercialUse, setSelectedCommercialUse] = useState(commercialUse[0]);
  const [selectedDerivativeWorks, setSelectedDerivativeWorks] = useState(derivativeWorks[0]);
  const [selectedCategory, setSelectedCategory] = useState(category[0]);
  const [tags, setTags] = useState([]);

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

  const handleVideoTags = (e) => {
    setTags(e);
  };

  let name, value;

  const handleVideoInputs = (e) => {
    name = e.target.name;
    value = e.target.value;
    setVideo({ ...video, [name]: value });
  };

  const fetchSuggestions = (value) => {
    return new Promise((resolve) => {
      if (value.length >= 1) {
        setTimeout(() => {
          let filtered = suggestions.filter(
            (opt) => opt.toLowerCase().indexOf(value.toLowerCase()) !== -1,
          );
          if (filtered.length === 0) {
            if (filtered[0] !== value) {
              let data = [value];
              resolve(data);
            }
          } else {
            resolve(filtered);
          }
        }, 1000);
      } else {
        resolve([]);
      }
    });
  };

  async function storeWithProgress() {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      //console.log('uploading files with cid:', cid);
      video.cid = cid;
    };
    const blob = new Blob([JSON.stringify(video)], { type: 'application/json' });

    const files = [video.videoFile, video.videoImage, new File([blob], 'meta.json')];
    const totalSize = video.videoFile.size;
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

  const onVideoFileChange = (e) => {
    if (e.target.name === 'videoFile') {
      video.videoFile = e.target.files[0];
      var trckName = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('videoName').value = trckName;
      video.videoName = trckName;
      document.getElementById('video-label').textContent = trckName;
    } else if (e.target.name === 'videoImage') {
      video.videoImage = e.target.files[0];
      console.log(e.target.files[0]);
      var videoImage = e.target.files[0].name.replace(/\.[^/.]+$/, '');
      document.getElementById('video-thumbnail-label').textContent = videoImage;
    }
  };

  useEffect(() => {
    setVideo({
      ...video,
      category: selectedCategory,
      allowAttribution: selectedAttribution,
      commercialUse: selectedCommercialUse,
      derivativeWorks: selectedDerivativeWorks,
      tags: tags,
    });
    // eslint-disable-next-line
  }, [selectedCategory, selectedCommercialUse, selectedDerivativeWorks, selectedAttribution, tags]);

  const PostData = async (e) => {
    props.setLoader(false);
    e.preventDefault();
    if (e.target.value === 'Upload Video') {
      const {
        videoName,
        videoImage,
        videoFile,
        category,
        ratings,
        tags,
        description,
        allowAttribution,
        commercialUse,
        derivativeWorks,
      } = video;
      storeWithProgress(e.target.value).then(() => {
        let formData = new FormData(); // Currently empty
        formData.append('userName', user.username);
        formData.append('userImage', user.profile_image);

        formData.append('videoName', videoName);

        tags.forEach((tag) => formData.append('tags', tag));

        formData.append('description', description);

        formData.append('category', category);
        formData.append('ratings', ratings);
        formData.append('allowAttribution', allowAttribution);
        formData.append('commercialUse', commercialUse);
        formData.append('derivativeWorks', derivativeWorks);

        formData.append('videoFile', videoFile, videoFile.name);
        formData.append('videoImage', videoImage, videoImage.name);
        formData.append('videoHash', video.cid);

        if (
          video.videoFile.length !== 0 &&
          video.videoImage.length !== 0 &&
          video.videoName.length !== 0
        ) {
          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/upload_video`, formData, {
              headers: {
                'content-type': 'multipart/form-data',
              },
            })
            .then(() => {
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
              });
              props.setLoader(true);
              props.handleCloseVideoUpload();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          Noty.closeAll();
          new Noty({
            type: 'error',
            text: 'Choose Video File & Fill other Details',
            theme: 'metroui',
            layout: 'bottomRight',
          }).show();
        }
      });
    }
  };

  return (
    <Modal
      isOpen={props.showVideoUpload}
      className={
        darkMode
          ? 'h-max lg:w-max w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-primary rounded-xl'
          : 'h-max lg:w-max w-5/6 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
      }
    >
      <div className={`${darkMode && 'dark'} px-5 py-5 lg:px-3 lg:py-3 2xl:px-5 2xl:py-5 h-max`}>
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg 2xl:py-4 py-4 lg:py-3 dark:bg-dbeats-dark-alt bg-white dark:text-white">
          <div className="col-span-4 pl-14 ">Upload Video</div>
          <div className="mr-7 flex justify-end w-full" onClick={props.handleCloseVideoUpload}>
            <i className="fas fa-times cursor-pointer"></i>
          </div>
        </h2>
        <hr />
        <form method="POST" encType="multipart/formdata">
          <div className=" bg-white text-gray-500  dark:bg-dbeats-dark-alt dark:text-gray-100   shadow-sm rounded-lg  2xl:px-5 2xl:py-5  lg:px-2 lg:py-1 px-2 py-1 mb-5 lg:mb-2 2xl:mb-5 lg:max-h-full  max-h-96  overflow-y-auto overflow-hidden">
            <div className="md:grid md:grid-cols-3 md:gap-6  ">
              <div className="md:col-span-1  ">
                <div className="lg:mt-5 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className="flex justify-center px-6 2xl:py-6 lg:py-4 py-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex justify-center text-sm text-gray-600 ">
                        <label
                          htmlFor="file-upload3"
                          className="text-center relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span id="video-thumbnail-label" className="truncate w-32">
                            Choose Video Thumbnail
                          </span>
                          <input
                            id="file-upload3"
                            type="file"
                            name="videoImage"
                            accept=".jpg,.png,.jpeg,.gif,.webp"
                            onChange={onVideoFileChange}
                            className="sr-only "
                          />
                        </label>
                        <p className="pl-1"> </p>
                      </div>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF</p>
                    </div>
                  </div>
                </div>
                <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2 2xl:p-5 lg:p-3 p-2">
                  <label className="block 2xl:text-sm text-sm lg:text-xs font-medium text-gray-700"></label>
                  <div className=" mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center ">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload4"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <p className="truncate w-32 " id="video-label">
                            Choose Video file
                          </p>
                          <input
                            id="file-upload4"
                            type="file"
                            accept=".mp4, .mkv, .mov, .avi"
                            name="videoFile"
                            onChange={onVideoFileChange}
                            className="sr-only "
                          />
                        </label>
                        <p className="pl-1"></p>
                      </div>
                      <p className="text-xs text-gray-400">Mp4, MKV, MOV, AVI</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="2xl:mt-5 lg:mt-1 mt-0 md:col-span-2">
                <div className=" sm:rounded-md  ">
                  <div className="2xl:p-5 lg:p-3 p-5  space-y-6">
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
                            value={video.videoName}
                            onChange={handleVideoInputs}
                            className="focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-8 gap-6 sm:grid-cols-8">
                      <div className="lg:col-span-4 col-span-8 sm:col-span-4">
                        {' '}
                        <label
                          htmlFor="videoTags"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Tags
                        </label>
                        <div className="mt-1 flex rounded-md max-w-sm shadow-sm text-black">
                          <Chips
                            theme={theme(darkMode)[0]}
                            chipTheme={chipTheme(darkMode)[0]}
                            value={tags}
                            onChange={handleVideoTags}
                            suggestions={suggestions}
                            fromSuggestionsOnly={false}
                            fetchSuggestions={fetchSuggestions}
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-4 col-span-8  sm:col-span-4">
                        <label
                          htmlFor="company-website"
                          className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                        >
                          Category
                        </label>
                        <div className="  flex rounded-md shadow-sm">
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
                          value={video.description}
                          onChange={handleVideoInputs}
                          className="dark:placeholder-gray-600 focus:ring-dbeats-dark-primary border-0 dark:bg-dbeats-dark-primary ring-dbeats-dark-secondary  ring-0   flex-1 block w-full rounded-md sm:text-sm  "
                          placeholder="Any Behind the scenes you'll like your Audience to know!"
                        />
                      </div>
                    </div>

                    <div className="grid grid-col-2 gap-6 2xl:pb-20">
                      <div className="grid lg:grid-cols-3 grid-col-1 gap-6">
                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Allow Attribution?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={attribution}
                              setSelected={setSelectedAttribution}
                              getSelected={selectedAttribution}
                            />
                          </div>
                        </div>

                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Commercial Use?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={commercialUse}
                              setSelected={setSelectedCommercialUse}
                              getSelected={selectedCommercialUse}
                            />
                          </div>
                        </div>

                        <div className="col-span-2  sm:col-span-1">
                          <label
                            htmlFor="company-website"
                            className="block 2xl:text-sm text-sm lg:text-xs font-medium dark:text-gray-100 text-gray-700"
                          >
                            Derivative Works?
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Dropdown
                              data={derivativeWorks}
                              setSelected={setSelectedDerivativeWorks}
                              getSelected={selectedDerivativeWorks}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:px-4 2xl:py-3 lg:py-1 lg:text-right text-center sm:px-6 flex justify-end items-center">
            <input
              type="submit"
              onClick={PostData}
              value="Upload Video"
              className="inline-flex justify-center 2xl:py-2 py-1 lg:px-5 
                px-3 border border-transparent shadow-sm 2xl:text-lg 
                lg:text-md text-md font-bold rounded-md text-white 
                bg-gradient-to-r from-green-400 to-blue-500 hover:bg-indigo-700 
                transform transition delay-50 duration-300 ease-in-out 
                hover:scale-105 focus:outline-none focus:ring-0 focus:ring-offset-2 
                focus:ring-blue-500"
            ></input>
            <div
              className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 bg-gradient-to-r from-green-400 to-blue-500 "
              hidden={props.loader}
            ></div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UploadVideoModal;
