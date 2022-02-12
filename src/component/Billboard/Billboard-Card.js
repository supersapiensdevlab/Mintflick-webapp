import React from 'react';
import maticLogo from '../../assets/graphics/polygon-matic-logo.svg';
import Modal from 'react-modal';
import { useState } from 'react';

// components

export default function ProfileCard({ user }) {
  const [ad, setAd] = useState({
    adName: '',
    adImage: '',
    adImageFile: '',
    category: '',
    ratings: '',
    tags: '',
    description: '',
    allowAttribution: '',
    commercialUse: '',
    derivativeWorks: '',
  });

  const onVideoFileChange = (e) => {
    if (e.target.name === 'adImageFile') {
      ad.adImageFile = e.target.files[0];
      var adName = e.target.files[0].name.replace(/\.[^/.]+$/, '');

      ad.adName = adName;
      document.getElementById('ad-label').textContent = adName;

      if (e.target.files && e.target.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          document.getElementById('adImage').src = e.target.result;
          document.getElementById('adImage').style.display = 'block';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      background: '#181818',
    },
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="mb-4 ">
        <>
          <div>
            <div className=" flex items-center  text-center bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary p-0.5  sm:rounded-xl nm-flat-dbeats-dark-primary">
              <div className="  dark:text-gray-50     border-opacity-30  shadow-sm dark:shadow-md  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary  text-dbeats-dark-primary sm:rounded-xl   w-full ">
                <div className="  flex items-center h-max w-full justify-center">
                  <div className="   sm:rounded-xl ">
                    <img
                      className="  h-full w-full sm:rounded-t-xl "
                      src="https://dummyimage.com/600x400/000/fff"
                      alt="avatar"
                    />

                    <div className="flex align-middle justify-center items-center">
                      <p className="text-white text-opacity-40 mx-1">rent this billboard</p>
                      <div className="my-3 rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
                        <span
                          onClick={openModal}
                          className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary "
                        >
                          <img
                            className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                            src={maticLogo}
                            alt="logo"
                          ></img>
                          <p className="self-center mx-2"> 200</p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="  p-3 text-white">
          <button onClick={closeModal}>close</button>

          <div className="flex text-sm text-gray-600 ">
            <label
              htmlFor="file-upload3"
              className="px-2 text-center relative cursor-pointer bg-white rounded-md font-medium text-dbeats-light hover:text-blue-500 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span id="ad-label" className="text-center">
                Choose Ad Image
              </span>
              <input
                id="file-upload3"
                type="file"
                name="adImageFile"
                accept=".jpg,.png,.jpeg"
                onChange={onVideoFileChange}
                className="sr-only "
              />
            </label>
            <p className="pl-1"> </p>
          </div>

          <>
            <img id="adImage" className="w-max h-52 mt-2 hidden"></img>

            <div className="  my-3 rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out ">
              <span className="  text-white flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                <img
                  className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                  src={maticLogo}
                  alt="logo"
                ></img>
                <p className="self-center mx-2 ">200</p>
              </span>
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}
