import React from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import CreatorDashboard from '../../../../pages/Profile/ProfileSections/Store/creator-dashboard';

const UploadNFTModal = (props) => {
  const darkMode = useSelector((state) => state.toggleDarkMode);

  return (
    <div className={`${darkMode && 'dark'} border-0 ring-0`}>
      <Modal
        isOpen={props.showNFTUpload}
        className={
          darkMode
            ? 'h-max lg:w-max w-96 mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-dbeats-dark-alt rounded-xl border-0 ring-0'
            : 'h-max lg:w-max   mx-auto 2xl:mt-32 lg:mt-16 mt-20 bg-gray-50 rounded-xl shadow-2xl'
        }
      >
        <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl text-lg  pt-10 align-middle  bg-transparent  text-white">
          <div className="col-span-4 pl-14">Sell Digital Art</div>
          <div
            onClick={props.handleCloseNFTUpload}
            className=" rounded-3xl group w-max   p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
          >
            <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
              <p className="self-center mx-2">
                {' '}
                <i className="fas fa-times text-white"></i>{' '}
              </p>
            </span>
          </div>
        </h2>
        <CreatorDashboard></CreatorDashboard>
      </Modal>
    </div>
  );
};

export default UploadNFTModal;
