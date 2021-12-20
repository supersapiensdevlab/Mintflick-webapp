import { RadioGroup } from '@headlessui/react';
import React, { useState } from 'react';
import Modal from 'react-awesome-modal';
import { Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChannelSection = (props) => {
  const [showChannelModal, setShowChannelModal] = useState(false);
  const handleShowChannelModal = () => setShowChannelModal(true);
  const handleCloseChannelModal = () => setShowChannelModal(false);

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const server_channels = [
    { name: 'Voice-Channel', type: 'voice' },
    { name: 'Text-Channel', type: 'text' },
    { name: 'Store', type: 'store' },
    { name: 'Event', type: 'event' },
  ];

  const channels = [
    {
      name: 'Voice Channel',
      ram: 'Host a live voice chat room',
    },
    {
      name: 'Text Channel',
      ram: 'Post Images, GIFs, Stickers, Links & everything else',
    },
    {
      name: 'Events',
      ram: 'Go Live! host events & Podcasts, sell tickets to your audience',
    },
  ];

  const [selected, setSelected] = useState(channels[0]);

  return (
    <div
      className={`${
        darkMode && 'dark'
      } pl-3 h-full  hidden lg:block  bg-gradient-to-b from-blue-50 via-blue-50 to-white  dark:bg-gradient-to-b dark:from-dbeats-dark-secondary  dark:to-dbeats-dark-primary`}
    >
      <div
        id="recommended_channel"
        className="w-full h-full   pt-8 lg:col-span-1 hidden  lg:block sm:hidden  "
      >
        {/* <div className="relative">
          <img src={background} alt="background"></img>
          {props.privateUser ? (
            <i className="fas fa-edit absolute right-2 bottom-2 text-white p-3 rounded-full hover:bg-dbeats-dark-alt hover:opacity-100 opacity-25 cursor-pointer"></i>
          ) : (
            false
          )}{' '}
        </div> */}

        <div className="2xl:px-5 lg:px-2 2xl:pt-10 lg:pt-5 fixed ">
          <h5 className="font-semibold text-base dark:text-gray-200 w-full 2xl:text-lg lg:text-sm relative pl-2">
            {' '}
            {props.user.name}&apos;s Channels
            {props.privateUser ? (
              <i
                className="fas fa-plus    cursor-pointer rounded p-2 -top-1 hover:text-white dark:hover:bg-dbeats-dark-secondary hover:bg-dbeats-light ml-2 dark:hover:text-dbeats-light"
                onClick={handleShowChannelModal}
              ></i>
            ) : (
              false
            )}
          </h5>

          {server_channels.map((channel, i) => {
            return (
              <div key={i} className="  2xl:pb-2 2xl:pt-2 lg:my-1 lg:mt-3 2xl:mt-0">
                <div>
                  <a href={`/profile/${props.user.username}/${channel.type}`}>
                    <div className="text-gray-600   cursor-pointer 2xl:text-base lg:text-xs dark:text-gray-200 hover:text-white w-full justify-between self-center hover:bg-dbeats-light dark:hover:bg-dbeats-dark-secondary dark:hover:text-dbeats-light  rounded 2xl:p-2 lg:p-1.5 relative">
                      {' '}
                      {channel.type === 'text' ? <i className="fas fa-hashtag mr-2"></i> : ''}
                      {channel.type === 'voice' ? (
                        <i className="fas fa-headphones-alt mr-2"></i>
                      ) : (
                        ''
                      )}
                      {channel.type === 'event' ? <i className="fas fa-ticket-alt mr-2  "></i> : ''}
                      {channel.type === 'store' ? <i className="fas fa-store mr-2 "></i> : ''}
                      {channel.name}
                      {/* <i className="fas fa-user-plus ml-5 absolute right-3 self-center text-center mt-1"></i> */}
                    </div>
                  </a>

                  {/* <span className="text-gray-400 text-sm cursor-pointer ml-5 dark:hover:text-white hover:text-dbeats-light">
                    {' '}
                    Counter Strike...{' '}
                  </span> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        visible={showChannelModal}
        className="h-max w-max"
        effect="fadeInUp"
        aria-labelledby="contained-modal-title-vcenter "
        centered
      >
        <div className={`${darkMode && 'dark'} h-max w-max`}>
          <h2 className="grid grid-cols-5 justify-items-center 2xl:text-2xl lg:text-lg 2xl:py-4 lg:py-2  dark:bg-dbeats-dark-alt">
            <div className="col-span-4 pl-14  text-gray-900 dark:text-gray-100">
              Create New Channel
            </div>
            <div
              className="ml-5 cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-alt"
              onClick={handleCloseChannelModal}
            >
              <i className="fas fa-times"></i>
            </div>
          </h2>

          <div>
            <Container className="2xl:px-12 lg:px-6 2xl:pb-4 lg:pb-2  text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-alt">
              <Row>
                <Col className="flex justify-around align-center">
                  <RadioGroup value={selected} onChange={setSelected}>
                    <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
                    <div className="space-y-2">
                      {channels.map((plan) => (
                        <RadioGroup.Option
                          key={plan.name}
                          value={plan}
                          className={({ active, checked }) =>
                            `${
                              active
                                ? 'ring-2 ring-offset-2 ring-offset-sky-300 ring-white ring-opacity-60  '
                                : 'dark:bg-dbeats-dark-primary '
                            }
                  ${
                    checked
                      ? 'bg-sky-900 bg-opacity-75 text-gray-900 dark:text-gray-100  '
                      : ' text-gray-900 dark:text-gray-100   '
                  }
                    relative rounded-lg shadow-md 2xl:px-5 2xl:py-4 lg:px-2.5 lg:py-2 cursor-pointer flex focus:outline-none`
                          }
                        >
                          {({ checked }) => (
                            <>
                              <div className="flex items-center justify-between w-full ">
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <RadioGroup.Label
                                      as="p"
                                      className={`font-medium  ${
                                        checked
                                          ? 'text-white'
                                          : 'text-gray-900 dark:text-gray-100  '
                                      }`}
                                    >
                                      {plan.name}
                                    </RadioGroup.Label>
                                    <RadioGroup.Description
                                      as="span"
                                      className={`inline ${
                                        checked ? 'text-sky-100' : 'text-gray-500'
                                      }`}
                                    >
                                      <span>{plan.ram}</span>{' '}
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                                {checked && (
                                  <div className="flex-shrink-0 text-white">
                                    <CheckIcon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </Col>
              </Row>
              <Row>
                <input
                  className="rounded my-3 w-full ring-0 focus:ring-0 focus:border-dbeats-light dark:bg-dbeats-dark-primary dark:text-white"
                  type="text"
                  placeholder="Enter New Channel Name"
                ></input>{' '}
                <i className="fas fa-users mr-2"></i>Subscriber Only
                <div className="grid grid-cols-3 gap-4 w-full">
                  <button
                    onClick={handleCloseChannelModal}
                    className=" block text-center col-span-1 px-5 w-full  mx-auto p-2 mt-4 mb-2  text-dbeats-light font-semibold rounded-lg border  border-dbeats-light hover:border-white hover:text-white hover:bg-dbeats-dark-secondary transition-all transform hover:scale-95"
                  >
                    Cancel
                  </button>

                  <button className="block shadow-md text-center col-span-2 px-5 w-full  mx-auto p-2 mt-4 mb-2  text-white font-semibold rounded-lg bg-dbeats-light hover:shadow-none transition-all transform hover:scale-95">
                    Create Channel
                  </button>
                </div>
              </Row>
            </Container>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ChannelSection;
