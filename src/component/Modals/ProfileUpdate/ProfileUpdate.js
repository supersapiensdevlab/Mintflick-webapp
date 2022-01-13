import React from 'react';
import Modal from 'react-modal';

const ProfileUpdateModal = ({ show, handleClose, userData, darkMode }) => {
  return (
    <Modal
      isOpen={show}
      className={`${darkMode && 'dark'} h-max min-h-1/4 lg:w-2/5 w-5/6 bg-white  mx-auto 
  2xl:mt-48 lg:mt-36 mt-32 shadow ring-0 outline-none rounded-md z-20`}
    >
      <p>{userData.username}</p>
      <p>{userData.email}</p>
      <p>{userData.name}</p>
      <p>{userData.wallet_id}</p>
    </Modal>
  );
};

export default ProfileUpdateModal;
