import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { RadioGroup } from '@headlessui/react';

function ReportModal2({
  show,
  handleClose,
  reportSection,
  handleReport,
  reportValue,
  setReportValue,
  handleReportSubmit,
}) {
  return (
    <Modal
      isOpen={show}
      className={`${'dark'} border lg:w-1/3  w-5/6  text-white h-max md:w-max rounded-lg bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow pb-3`}
    >
      {/* <div className="flex py-1 text-white items-center ">
        <i
          className="fa-solid fa-arrow-left text-lg text-white p-3 cursor-pointer"
          onClick={() => {
            setReportValue(null);
            handleClose(false);
            handleReport(true);
          }}
        ></i>
        <div className="text-center w-60 flex-1 border-b-2 pb-2  font-bold pt-2 border-white">
          Report
        </div>
      </div> */}
      <div>
        <h2 className="flex justify-around items-center w-full 2xl:text-2xl lg:text-md py-4 2xl:py-6 lg:py-2  pt-7  text-center relative  ">
          <div
            onClick={() => {
              setReportValue(null);
              handleClose(false);
              handleReport(true);
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
            onClick={() => handleClose(false)}
            className="rounded-3xl group w-max   p-2  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
          >
            <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
              <i className="fas fa-times"></i>
            </span>
          </div>
        </h2>
      </div>
      <h1 className="text-xl text-white pl-7">Why are you reporting these post?</h1>
      <div className=" px-2 pl-7 pt-3 w-full text-white text-lg">
        <RadioGroup value={reportValue} onChange={setReportValue} className=" w-max mb-2">
          {reportSection.map((item, index) => {
            return (
              <RadioGroup.Option
                key={item}
                value={item}
                className="p-1 cursor-pointer flex items-center"
              >
                {({ checked }) => (
                  <>
                    <span className={checked ? 'text-dbeats-light' : ''}>{item}</span>
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
            );
          })}
        </RadioGroup>
        <div className="text-center mx-auto">
          <div
            className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
          >
            <button
              className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
              onClick={handleReportSubmit}
              disabled={reportValue == null}
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ReportModal2;
