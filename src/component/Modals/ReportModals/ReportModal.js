import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { RadioGroup } from '@headlessui/react';

function ReportModal({
  show,
  handleClose,
  handleShowReport2,
  setReportSection,
  setShowOtherReport,
}) {
  const [reportSectionValue, setReportSectionValue] = React.useState(0);

  useEffect(() => {
    switch (reportSectionValue) {
      case '1':
        setReportSection([
          'Nudity or pornography',
          'Sexual exploitation',
          'Sharing private images',
        ]);
        handleShowReport2(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
      case '2':
        setReportSection(['Violent Threat', 'Animal abuse', 'Death, severe injury, dangerous']);
        handleShowReport2(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
      case '3':
        setReportSection(['Animals', 'Firearms', 'Fake health documents']);
        handleShowReport2(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
      case '4':
        setReportSection(['Report Privacy']);
        handleShowReport2(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
      case '5':
        setReportSection(['Spam']);
        handleShowReport2(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
      case '6':
        setShowOtherReport(true);
        handleClose(false);
        setReportSectionValue(0);
        break;
    }
  }, [reportSectionValue]);
  const handleSection = (section) => {
    switch (section) {
      case 1:
        setReportSection([
          'Nudity or pornography',
          'Sexual exploitation',
          'Sharing private images',
        ]);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 2:
        setReportSection(['Violent Threat', 'Animal abuse', 'Death, severe injury, dangerous']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 3:
        setReportSection(['Animals', 'Firearms', 'Fake health documents']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 4:
        setReportSection(['Report Privacy']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 5:
        setReportSection(['Spam']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 6:
        setShowOtherReport(true);
        handleClose(false);
        break;
    }
  };
  return (
    <Modal
      isOpen={show}
      className={`${'dark'} border lg:w-1/3  w-5/6  text-white h-max md:w-max rounded-lg bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
    >
      <h2 className="flex justify-between items-center w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
        <div className="col-span-5 ml-72 text-gray-900 dark:text-gray-100 font-bold">Report</div>
        <div
          className="rounded-3xl group w-max   p-2  mx-1 mr-8 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
          onClick={() => handleClose(false)}
        >
          <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
            <i className="fas fa-times"></i>
          </span>
        </div>
      </h2>
      <h1 className="pl-7 text-white text-xl mb-2">Why are you reporting this post?</h1>
      <div className=" pl-7 mb-5 text-white text-lg">
        <RadioGroup value={reportSectionValue} onChange={setReportSectionValue} className=" w-max">
          <RadioGroup.Option value="1" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Nudity</span>
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
          <RadioGroup.Option value="2" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Voilence</span>
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
          <RadioGroup.Option value="3" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Unauthorised sales</span>
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
          <RadioGroup.Option value="4" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Pirated</span>
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
          <RadioGroup.Option value="5" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Spam</span>
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
          <RadioGroup.Option value="6" className="p-1 cursor-pointer flex items-center">
            {({ checked }) => (
              <>
                <span className={checked ? 'text-dbeats-light' : ''}>Others</span>
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
      </div>
    </Modal>
  );
}

export default ReportModal;
