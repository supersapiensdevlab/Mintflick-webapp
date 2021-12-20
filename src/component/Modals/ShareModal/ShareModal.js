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
}) => {
  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);
  return (
    <>
      <Modal
        isOpen={show}
        className={`${
          darkMode && 'dark'
        } h-max lg:w-max w-5/6 bg-white mx-auto 2xl:mt-60 lg:mt-36 mt-32 shadow `}
      >
        <div className={``}>
          <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl lg:text-lg py-4 2xl:py-4 lg:py-2 dark:bg-dbeats-dark-primary dark:text-white">
            <div className="col-span-4 pl-14">Share link on</div>
            <div
              className="ml-5 cursor-pointer hover:bg-dbeats-dark-alt px-2.5 py-0.5"
              onClick={handleClose}
            >
              <i className="fas fa-times"></i>
            </div>
          </h2>
          <hr className="py-4 dark:bg-dbeats-dark-alt" />
          <div>
            <Container className="px-12 pb-4 dark:bg-dbeats-dark-alt">
              <Row>
                <Col className="flex lg:justify-around justify-center align-center flex-wrap">
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
                </Col>
              </Row>
              <Row>
                <CopyToClipboard
                  text={sharable_data}
                  className="block mx-auto p-2 2xl:p-2 lg:p-1.5  my-3 mt-5 2xl:w-96 lg:w-80 lg:text-md  w-full  text-white font-semibold rounded-lg bg-dbeats-light"
                >
                  <button type="submit" onClick={() => setCopyButtonText('Link Copied!')}>
                    {copybuttonText}
                  </button>
                </CopyToClipboard>
              </Row>
            </Container>
          </div>
        </div>
      </Modal>
    </>
  );
};
