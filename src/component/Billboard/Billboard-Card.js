import React from 'react';
import maticLogo from '../../assets/graphics/polygon-matic-logo.svg';
import Modal from 'react-modal';
import { useState } from 'react';
import { DateRange } from 'react-date-range';
// components
import '../../assets/date-range-picker/styles.css'; // main css file
import '../../assets/date-range-picker/theme/default.css'; // theme css file
import { addDays } from 'date-fns';

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
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ]);

  const calculateDateDifference = (startDate, endDate) => {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const [urlIsValid, setUrlIsValid] = useState(null);

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
          document.getElementById('adImagePlaceholder').style.display = 'none';
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const onURLChange = (e) => {
    var url = e.target.value.substring(0, 8);

    if (url === 'https://') {
      setUrlIsValid(true);
    } else {
      setUrlIsValid(false);
    }
    console.log(urlIsValid, url);
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
        <div className="flex flex-col  p-3 text-white  rounded-xl max-h-125 justify-items-center align-middle content-center">
          <div className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg    align-middle  bg-transparent  text-white">
            <div className="flex flex-col items-center justify-center col-span-4 pl-14 ">
              <h1 className="text-2xl">Billboard on rent</h1>
            </div>
            <div
              onClick={closeModal}
              className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center mx-2">
                  {' '}
                  <i className="fas fa-times text-white"></i>{' '}
                </p>
              </span>
            </div>
          </div>
          <p className="opacity-30 text-center">Show your own custom ADs</p>
          <p className="mt-5 text-center">📅 Choose AD Start & End Date</p>

          <DateRange
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            rangeColors={['#00d3ff']}
            className=" mx-auto text-dbeats-dark my-2 bg-dbeats-dark-secondary rounded-md"
            ranges={state}
          />
          <>
            <p className="mt-3 text-center">📸 Choose Image for AD</p>
            <div
              id="adImagePlaceholder"
              className=" w-full py-28 mt-2 text-dbeats-white rounded-md bg-dbeats-dark-primary align-middle content-center self-center items-center justify-center"
            >
              <p className="opacity-30 text-center px-8 my-auto  ">
                Make sure image has a ratio of 600 x 400 px{' '}
              </p>
            </div>

            <img id="adImage" className="w-max h-52 mt-2 hidden"></img>

            <div className="flex text-sm text-gray-600 ">
              <label
                htmlFor="file-upload3"
                className="mx-auto mb-3 px-2 text-center relative cursor-pointer bg-gray-600 py-2 font-medium text-dbeats-white hover:text-white focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span id="ad-label" className="text-center">
                  Choose Image File
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

            <p className="mt-5 text-dbeats-white mb-2">
              🌍 Where will the user go on clicking the above image?
            </p>
            <input
              type="url"
              onChange={onURLChange}
              className={`${
                urlIsValid && urlIsValid != null
                  ? 'border-0 focus:ring-0 focus:border-0'
                  : 'border border-red-600'
              } nm-inset-dbeats-dark-primary placeholder-opacity-10 placeholder-dbeats-white w-full   focus:ring-0 focus:border-0`}
              placeholder="https:// only"
            ></input>
            {!urlIsValid ? <p className="text-white opacity-30"></p> : null}
            <p className="mt-5 text-center mb-2">🪙 Complete Transaction</p>
            <hr></hr>
            <div className="grid grid-cols-3 mt-3 text-sm mb-2">
              {state
                ? state.map((state, i) => {
                    return (
                      <>
                        <p key={i} className="text-dbeats-white text-center ">
                          {state.startDate.toDateString()}
                          <br></br>
                          <span className=" opacity-30 text-base">Start Date</span>
                        </p>
                        <p key={i} className="text-dbeats-white text-center ">
                          {state.endDate.toDateString()}
                          <br></br>
                          <span className=" opacity-30 text-base "> End Date</span>
                        </p>
                        <p key={i} className="text-dbeats-white text-center ">
                          {calculateDateDifference(state.startDate, state.endDate)} days
                          <br></br>
                          <span className=" opacity-30 text-base">Duration </span>
                        </p>
                      </>
                    );
                  })
                : null}
            </div>

            <br></br>
            <div className="flex justify-center mt-2">
              <input
                type="checkbox"
                className="rounded cursor-pointer  checked:bg-dbeats-light  mt-1 mx-2 default:ring-0 default:border-0  required:border-red-500 indeterminate:bg-gray-300 ring-0 border-0 focus:ring-0 focus:border-0"
              />
              I agree to the <a href="#">&nbsp;Terms of Service</a>
            </div>
            <div className="flex justify-center mb-5">
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
            </div>
          </>
        </div>
      </Modal>
    </>
  );
}
