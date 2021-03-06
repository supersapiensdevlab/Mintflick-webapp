import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

export const ShareModal = ({
  show,
  handleClose,
  sharable_data,
  copybuttonText,
  setCopyButtonText,
  title,
}) => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  return (
    <div className="relative">
      <Modal
        isOpen={show}
        className={`${
          darkMode && 'dark'
        } h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
      >
        <div className={``}>
          <h2 className="grid grid-cols-5 justify-between items-center ml-24 2xl:text-2xl lg:text-lg py-4 2xl:py-4 lg:py-2 dark:bg-dbeats-dark-alt dark:text-white">
            {title ? (
              <div className="col-span-4 pl-14 text-base text-center text-white justify-center align-middle mt-1.5">
                {title}
              </div>
            ) : (
              <div className="col-span-4  md:pl-10 lg:pl-14 pl-10">Share link on</div>
            )}
            <div
              onClick={handleClose}
              className=" rounded-3xl group w-max   p-1  mx-1 md:mr-3 lg:mr-0 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
            >
              <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                <p className="self-center mx-2">
                  {' '}
                  <i className="fas fa-times"></i>{' '}
                </p>
              </span>
            </div>
          </h2>
          <hr className="pt-4 dark:bg-dbeats-dark-alt" />
          <div>
            <div className="lg:px-12 p-6 pb-4 dark:bg-dbeats-dark-alt">
              <div>
                <div className="flex lg:justify-around justify-center align-center flex-wrap">
                  <div className="px-1 py-1">
                    <WhatsappShareButton url={sharable_data}>
                      <WhatsappIcon
                        iconFillColor="white"
                        size={window.innerWidth >= '1536' ? 60 : 50}
                        round={true}
                      />
                    </WhatsappShareButton>
                  </div>
                  <div className="px-1 py-1">
                    <FacebookShareButton url={sharable_data}>
                      <FacebookIcon
                        iconFillColor="white"
                        size={window.innerWidth >= '1536' ? 60 : 50}
                        round={true}
                      />
                    </FacebookShareButton>
                  </div>
                  <div className="px-1 py-1">
                    <EmailShareButton url={sharable_data}>
                      <EmailIcon
                        iconFillColor="white"
                        size={window.innerWidth >= '1536' ? 60 : 50}
                        round={true}
                      />
                    </EmailShareButton>
                  </div>
                  <div className="px-1 py-1">
                    <PinterestShareButton url={sharable_data}>
                      <PinterestIcon
                        iconFillColor="white"
                        size={window.innerWidth >= '1536' ? 60 : 50}
                        round={true}
                      />
                    </PinterestShareButton>
                  </div>
                  <div className="px-1 py-1">
                    <TelegramShareButton url={sharable_data}>
                      <TelegramIcon
                        iconFillColor="white"
                        size={window.innerWidth >= '1536' ? 60 : 50}
                        round={true}
                      />
                    </TelegramShareButton>
                  </div>
                </div>
              </div>
              <div>
                <CopyToClipboard
                  text={sharable_data}
                  className="block mx-auto w-full text-white px-5 py-2 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                  hover:nm-inset-dbeats-secondary-light mt-3 mb-4 rounded-3xl transition-all duration-300"
                >
                  <button type="submit" onClick={() => setCopyButtonText('Link Copied!')}>
                    {copybuttonText} &nbsp;<i className="fa-solid fa-copy"></i>
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
