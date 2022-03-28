import axios from 'axios';
import Noty from 'noty';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import getCroppedImg from './cropImage';
import classes from './style.module.css';
import { loadUser } from '../../../actions/userActions';
function makeStorageClient() {
  return new Web3Storage({
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhNzk3MkY3QTRDNUNkZDJlOENBQzE1RDJCZjJBRUFlQTg1QmM3MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjc1MTY1MTgyMjUsIm5hbWUiOiJEQmVhdHMifQ.16-okZlX7RmNcszqLq06lvzDkZ-Z8CHnmAIRXjQ2q5Q',
  });
}

const re = /(?:\.([^.]+))?$/;

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const UploadCoverImageModal = ({
  show,
  handleClose,
  setCoverImage,
  loader,
  setLoader,
  darkMode,
}) => {
  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
  //image Crop
  const [image, setImage] = useState({ preview: '', raw: '' });
  const wrapperRef = useRef(null);

  const [extension, setExtension] = useState('');

  let coverImage_cid = '';
  let coverImage;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleChange = (e) => {
    setExtension(re.exec(e.target.files[0].name)[1]);

    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  async function storeWithProgress() {
    const onRootCidReady = (cid) => {
      coverImage_cid = cid;
    };

    let file = coverImage;

    if (!(extension === 'webp' || extension === 'gif')) {
      file = dataURLtoFile(coverImage, image.raw.name);
      coverImage = file;
    }

    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });

    const files = [file, new File([blob], 'meta.json')];
    const totalSize = file.size;
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    // eslint-disable-next-line
  }, [wrapperRef]);

  const handleUpload = async (e) => {
    setLoader(false);
    e.preventDefault();

    if (!(extension === 'webp' || extension === 'gif')) {
      const croppedImage = await getCroppedImg(image.preview, croppedAreaPixels);
      setCoverImage(croppedImage);
      coverImage = croppedImage;
    } else {
      setCoverImage(image.preview);
      coverImage = image.raw;
    }

    storeWithProgress('upload cover image').then(() => {
      const formData = new FormData();
      formData.append('username', user.username);
      formData.append('coverImage', coverImage);
      formData.append('imageHash', coverImage_cid);

      // console.log(user.username);
      // console.log(croppedImage);
      // console.log(image.preview);
      //console.log(coverImage_cid);

      if (coverImage.length !== 0) {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/user/coverimage`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
              'auth-token': localStorage.getItem('authtoken'),
            },
          })
          .then((res) => {
            dispatch(loadUser());
            setLoader(true);
            setCoverImage(res.data);
            setImage({
              raw: '',
            });
            handleClose();
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
  };

  return (
    <div>
      <Modal
        isOpen={show}
        className={`${darkMode && 'dark'} h-max min-h-1/4 lg:w-2/5 w-5/6 bg-white  mx-auto 
        2xl:mt-48 lg:mt-36 mt-32 shadow ring-0 outline-none rounded-md z-20`}
      >
        <div ref={wrapperRef} className="p-5 w-full">
          <div className="p-4 flex justify-center">
            {image.preview ? (
              <div className={classes.crop_container}>
                {extension === 'webp' || extension === 'gif' ? (
                  <img
                    src={image.preview}
                    alt="display"
                    height="350px"
                    width="350px"
                    className="self-center mx-auto"
                  />
                ) : (
                  <Cropper
                    image={image.preview}
                    crop={crop}
                    aspect={5 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                  />
                )}
              </div>
            ) : null}
          </div>
          <div className="flex justify-evenly mt-3">
            <label className="bg-dbeats-light text-white font-bold px-5 py-2 rounded-lg cursor-pointer">
              <input type="file" style={{ display: 'none' }} onChange={handleChange} />
              Select Cover Image
            </label>
            {image.preview ? (
              <div className="flex items-center">
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white font-bold px-5 py-2 rounded-lg "
                >
                  Upload Image
                </button>
                <div
                  className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 border-green-600 "
                  hidden={loader}
                ></div>
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const UploadProfileImageModal = ({
  show,
  handleClose,
  setProfileImage,
  loader,
  setLoader,
  darkMode,
}) => {
  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
  const [image, setImage] = useState({ preview: '', raw: '' });
  const wrapperRef = useRef(null);

  const [extension, setExtension] = useState('');

  let profileImage_cid = '';
  let profileImage;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleChange = (e) => {
    setExtension(re.exec(e.target.files[0].name)[1]);
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  async function storeWithProgress() {
    const onRootCidReady = (cid) => {
      profileImage_cid = cid;
    };

    let file = profileImage;

    if (!(extension === 'webp' || extension === 'gif')) {
      file = dataURLtoFile(profileImage, image.raw.name);
      profileImage = file;
    }

    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });

    const files = [file, new File([blob], 'meta.json')];
    const totalSize = file.size;
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

    // eslint-disable-next-line
  }, [wrapperRef]);

  const handleUpload = async (e) => {
    setLoader(false);
    e.preventDefault(image.raw);

    if (!(extension === 'webp' || extension === 'gif')) {
      const croppedImage = await getCroppedImg(image.preview, croppedAreaPixels);
      setProfileImage(croppedImage);
      profileImage = croppedImage;
    } else {
      setProfileImage(image.preview);
      profileImage = image.raw;
    }

    storeWithProgress('upload cover image').then(() => {
      const formData = new FormData();
      if (user) {
        formData.append('username',user.username);
      }
      formData.append('profileImage', profileImage);
      formData.append('imageHash', profileImage_cid);

      console.log(user.username);
      console.log(image.raw);
      console.log(profileImage_cid);

      if (image.raw.length !== 0) {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/user/profileimage`, formData, {
            headers: {
              'content-type': 'multipart/form-data',
              'auth-token': localStorage.getItem('authtoken'),
            },
          })
          .then((res) => {
            dispatch(loadUser());
            setProfileImage(res.data);
            setLoader(true);
            setImage({
              preview: '',
              raw: '',
            });
            handleClose();
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
  };

  return (
    <div>
      <Modal
        isOpen={show}
        className={`${darkMode && 'dark'} h-max min-h-1/4 lg:w-2/5 w-5/6 bg-white  mx-auto 
        2xl:mt-48 lg:mt-36 mt-32 shadow ring-0 outline-none rounded-md z-20`}
      >
        <div ref={wrapperRef} className="p-5 w-full">
          <div className="p-4 flex justify-center">
            {image.preview ? (
              <div className={classes.crop_container}>
                {extension === 'webp' || extension === 'gif' ? (
                  <img
                    src={image.preview}
                    alt="display"
                    height="350px"
                    width="350px"
                    className="self-center mx-auto"
                  />
                ) : (
                  <Cropper
                    image={image.preview}
                    crop={crop}
                    aspect={1}
                    cropShape="round"
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                  />
                )}
              </div>
            ) : null}
          </div>
          <div className="flex justify-evenly">
            <label className="bg-dbeats-light flex items-center text-white font-bold px-5 py-2 rounded-lg cursor-pointer">
              <input type="file" style={{ display: 'none' }} onChange={handleChange} />
              Select Profile Image
            </label>
            {image.preview ? (
              <div className="flex items-center">
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white font-bold px-5 py-2 rounded-lg "
                >
                  Upload Image
                </button>
                <div
                  className="animate-spin rounded-full h-7 w-7 ml-3 border-t-2 border-b-2 border-green-600 "
                  hidden={loader}
                ></div>
              </div>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
};
