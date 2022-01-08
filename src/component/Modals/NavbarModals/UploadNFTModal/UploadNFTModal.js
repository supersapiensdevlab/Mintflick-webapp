import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import CreatorDashboard from '../../../../pages/Profile/ProfileSections/Store/creator-dashboard';

const UploadNFTModal = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  return (
    <div className={`${darkMode && 'dark'}`}>
      <Modal
        isOpen={props.showNFTUpload}
        className={
          darkMode
            ? 'h-max lg:w-max w-96 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-primary dark:bg-dbeats-dark-secondary rounded-xl'
            : 'h-max lg:w-max   mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
        }
      >
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg  pt-10   bg-transparent  text-white">
          <div className="col-span-4 pl-14">Sell Digital Art</div>
          <div className="mr-7 flex justify-end w-full" onClick={props.handleCloseNFTUpload}>
            <i className="fas fa-times cursor-pointer"></i>
          </div>
        </h2>
        <CreatorDashboard></CreatorDashboard>
      </Modal>
    </div>
  );
};

export default UploadNFTModal;
