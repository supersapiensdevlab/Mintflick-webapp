import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import classes from '../Profile.module.css';
import image from '../../../assets/images/Logo/Icon 1.png';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import useWeb3Modal from '../../../hooks/useWeb3Modal';
import { ShareModal } from '../../../component/Modals/ShareModal/ShareModal';
import { RadioGroup } from '@headlessui/react';
import { Container, Row } from 'react-bootstrap';
moment().format();

const CommonCard = (props) => {
  const user = useSelector((state) => state.User.user);
  const history = useHistory();

  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(null);

  const [shareShow, setShareShow] = useState(false);
  const handleShareClose = () => setShareShow(false);
  const handleShareShow = () => setShareShow(true);

  const [showReport, setShowReport] = useState(false);
  const handleReportShow = () => setShowReport(true);
  const handleReportClose = () => setShowReport(false);

  const [showReportSubmitThankyou, setShowReportSubmitThankyou] = useState(false);
  const handleReportThankyouShow = () => setShowReportSubmitThankyou(true);
  const handleReportThankyouClose = () => setShowReportSubmitThankyou(false);

  const [showOtherReport, setShowOtherReport] = useState(false);
  const handleOtherReportShow = () => setShowOtherReport(true);
  const handleOtherReportClose = () => setShowOtherReport(false);

  const [reportValue, setReportValue] = useState('Nudity or pornography');
  const [userReportValue, setUserReportValue] = useState('');

  const text = 'Copy Link To Clipboard';
  const [buttonText, setButtonText] = useState(text);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/playback/${props.username}/${props.playbackUserData.videoId}`;

  const handleReportSubmit = () => {
    let reportData = {
      reporter: props.myDataUser,
      reported: props.username,
      report: reportValue,
      videoId: props.playbackUserData.videoId,
    };
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/videoreports`,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
      data: reportData,
    })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setShowReport(false);
    setShowOtherReport(false);
    setShowReportSubmitThankyou(true);
  };

  const handleInputChange = (e) => {
    setReportValue(e.target.value);
  };

  const convertTimestampToTime = () => {
    const timestamp = new Date(props.playbackUserData.time * 1000); // This would be the timestamp you want to format
    setTime(moment(timestamp).fromNow());
  };

  console.log(props.playbackUserData.time);

  useEffect(() => {
    convertTimestampToTime();
    // eslint-disable-next-line
  }, []);

  const handlePlayerClick = async () => {
    if (user) {
      history.push(`/playback/${props.username}/${props.playbackUserData.videoId}`);
    } else {
      await loadWeb3Modal();
    }
  };

  return (
    <div className="w-96 bg-dbeats-black px-2 mr-10 py-1">
      <div className="flex w-full items-center">
        <img
          src={props.user.profile_image}
          alt="profile_image"
          className="h-14 w-14 rounded-full"
        />
        <div className="ml-4">
          <p className="text-white text-md">{props.playbackUserData.videoName.slice(0, 35)} ...</p>
          <p className="text-white text-sm">{props.playbackUserData.category}</p>
          <p className="text-white text-xs">{time}</p>
        </div>
      </div>
      <div className=" my-2">
        <p className="text-white py-2"> {props.playbackUserData.description.slice(0, 42)} ...</p>
      </div>
      <div
        className={`cursor-pointer h-44 lg:h-32 2xl:h-48 md:h-40 w-full  my-auto dark:bg-dbeats-dark-primary `}
      >
        <a onClick={handlePlayerClick}>
          <ReactPlayer
            width="100%"
            height="100%"
            playing={playing}
            muted={false}
            volume={0.5}
            className={`${classes.cards_videos}`}
            light={props.playbackUserData.videoImage}
            url={props.playbackUserData.link}
            controls={false}
          />
        </a>
      </div>
      <div className="flex w-full justify-between mt-3">
        <div className="flex justify-between w-2/3">
          <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100 text-white">
            <i className={`fas fa-heart mr-2 text-red-700 animate-pulse`}></i>
            Like
          </p>
          <p
            className="w-full mt-2 text-center text-white cursor-pointer opacity-50 hover:opacity-100"
            onClick={handleShareShow}
          >
            <i className="fas fa-share mr-2"></i>Share
          </p>
          <p
            className="w-full mt-2 text-center cursor-pointer  text-white opacity-50 hover:opacity-100 flex items-center justify-center"
            onClick={() => {
              handleReportShow();
            }}
          >
            <i className="fas fa-flag mr-2"></i> Report
          </p>
        </div>
        <div className="w-1/3 flex justify-end text-white">
          {/* <button>
                    Make an offer
                </button> */}
        </div>
      </div>
      <ShareModal
        show={shareShow}
        handleClose={handleShareClose}
        sharable_data={sharable_data}
        copybuttonText={buttonText}
        setCopyButtonText={setButtonText}
      />
      <div className="relative">
        <Modal
          isOpen={showReport}
          className="h-max lg:w-1/3  w-5/6  mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"
        >
          <div className={`${props.darkMode && 'dark'} border rounded-lg`}>
            <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
              <Row>
                <h2 className="flex justify-between w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                  <div className="col-span-5 ml-60 text-gray-900 dark:text-gray-100 font-bold">
                    Report
                  </div>
                  <div
                    className="rounded-3xl group w-max   p-2  mx-1 mr-8 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    onClick={handleReportClose}
                  >
                    <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                      <i className="fas fa-times"></i>
                    </span>
                  </div>
                </h2>
              </Row>
              <Row>
                <div className="w-full px-3">
                  <h1 className="text-white text-xl mb-2">Why are you reporting this post?</h1>
                  <div className="w-full max-h-60 overflow-y-scroll text-white text-lg">
                    <RadioGroup value={reportValue} onChange={setReportValue} className=" w-max">
                      <RadioGroup.Option
                        value="Nudity or pornography"
                        className="p-1 cursor-pointer flex items-center"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Nudity or pornography
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Sexual Exploitation"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Sexual Exploitation
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Sharing private images"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Sharing private images
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Violent threat"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Violent threat
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Animal abuse"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>Animal abuse</span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Death, severe injury, dangerous"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Death, severe injury, dangerous
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Firearms"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>Firearms</span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Fake health documents"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Fake health documents
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        className="p-1 cursor-pointer flex items-center"
                        value="Report piracy"
                      >
                        {({ checked }) => (
                          <>
                            <span className={checked ? 'text-dbeats-light' : ''}>
                              Report piracy
                            </span>
                            {checked ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="#00d3ff"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </RadioGroup.Option>
                    </RadioGroup>
                    <button
                      className="p-1"
                      onClick={() => {
                        handleOtherReportShow();
                        handleReportClose();
                      }}
                    >
                      Others
                    </button>
                  </div>
                </div>
              </Row>
              <Row>
                <div
                  className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
                >
                  <button
                    className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                    onClick={handleReportSubmit}
                  >
                    Submit Report
                  </button>
                </div>
              </Row>
            </Container>
          </div>
        </Modal>
      </div>

      <div className="relative">
        <Modal
          isOpen={showReportSubmitThankyou}
          className="h-max lg:w-1/3  w-5/6 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"
        >
          <div className={`${props.darkMode && 'dark'}`}>
            <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg border">
              <Row>
                <h2 className="flex justify-between  w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                  <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold">
                    Thanks for reporting!!
                  </div>
                  <div
                    className="rounded-3xl group w-max   p-2  mx-1  justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    onClick={handleReportThankyouClose}
                  >
                    <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                      <i className="fas fa-times"></i>
                    </span>
                  </div>
                </h2>
              </Row>
              <Row>
                <div className="w-full flex justify-center items-center pt-5 pb-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-28 w-28"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Row>
            </Container>
          </div>
        </Modal>
      </div>

      <div className="relative">
        <Modal
          isOpen={showOtherReport}
          className="h-max lg:w-1/3  w-5/6 mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"
        >
          <div className={`${props.darkMode && 'dark'} border rounded-lg`}>
            <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
              <Row>
                <h2 className="flex justify-around w-full 2xl:text-2xl lg:text-md py-4 2xl:py-6 lg:py-2  pt-7  text-center relative  ">
                  <div
                    onClick={() => {
                      handleOtherReportClose();
                      handleReportShow();
                    }}
                    className="cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-alt ml-5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="col-span-4 text-gray-900 dark:text-gray-100 font-bold">
                    Help us understand the problem
                  </div>
                  <div
                    className="rounded-3xl group w-max   p-2  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    onClick={handleOtherReportClose}
                  >
                    <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                      <i className="fas fa-times"></i>
                    </span>
                  </div>
                </h2>
              </Row>
              <Row>
                <div className="w-full h-max px-2">
                  <textarea
                    className="w-full text-white text-lg h-48 rounded-sm p-2  border dark:bg-dbeats-dark-primary"
                    placeholder="Issue..."
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </Row>
              <Row>
                <div
                  className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
                >
                  <button
                    className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                    onClick={handleReportSubmit}
                  >
                    Submit Report
                  </button>
                </div>
              </Row>
            </Container>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CommonCard;
