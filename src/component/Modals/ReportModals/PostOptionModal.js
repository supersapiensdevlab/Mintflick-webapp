import axios from 'axios';
import React, { useState } from 'react';
import Modal from 'react-modal';
import Switch from 'react-switch';

function PostOptionModal({
  cardDetails,
  contentData,
  show,
  handleClose,
  handleShowReport,
  myReport,
  setMyReport,
  myPost,
  commentDisabled,
  setCommentDisabled,
}) {
  const handleSwitch = async (checked) => {
    setCommentDisabled(checked);
    await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/disableComments`,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
      data: { videoId: contentData.videoId, value: checked, user_data_id: cardDetails.user._id },
    });
  };
  return (
    <Modal
      isOpen={show}
      className={`${'dark'} border border-dbeats-white h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
    >
      <div className="flex items-center justify-between">
        <div className='text-white px-3'>{(!myPost && myReport) ? 'Already Reported' : <></>}</div>
        <div>
          <i
            className="fa-solid fa-xmark text-lg text-white p-3 cursor-pointer"
            onClick={() => {
              handleClose(false);
            }}
          ></i>
        </div>
      </div>
      <div className="mt-1 mx-2">
        {!myPost ? (
          myReport ? (
            <p className="mb-1 text-gray-500 text-lg cursor-pointer">
            {myReport}
            </p>
          ) : (
            <p
              className=" mb-1 text-white text-lg cursor-pointer w-60"
              onClick={() => {
                handleShowReport(true);
                handleClose(false);
              }}
            >
              Report
            </p>
          )
        ) : (
          <></>
        )}
        {myPost && (
          <div className="flex">
            <p className="text-white text-lg ">
              {commentDisabled ? 'Enable Comments' : 'Disable Comments'}
            </p>
            <span className="ml-9">
              <Switch onChange={handleSwitch} checked={commentDisabled} />
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default PostOptionModal;
