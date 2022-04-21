import React, { useEffect } from 'react';
import Modal from 'react-modal';

function ReportModal2({
  show,
  handleClose,
  reportSection,
  handleReport,
  reportValue,
  setReportValue,
  handleReportSubmit
}) {

  return (
    <Modal
      isOpen={show}
      className={`${'dark'}  border border-dbeats-white text-white h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
    >
      <div className="flex text-white items-center border-b-2 border-white">
        <i
          className="fa-solid fa-arrow-left text-lg text-white p-3 cursor-pointer"
          onClick={() =>{setReportValue(null); handleClose(false); handleReport(true); }}
        ></i>
        <div className="text-center w-60 flex-1">Report</div>
      </div>
      <div className="pt-2">Why are you reporting these post?</div>
      <div className=" px-2 pt-3 w-full max-h-70 overflow-y-scroll text-white text-lg">
        {reportSection.map((item, index) => {
          return (
            <div key={item} className="py-1 flex justify-between cursor-pointer">
              <div>
                <label htmlFor={item} className="flex-1">
                  {item}
                </label>
              </div>
              <div>
                <input
                  id={item}
                  type="radio"
                  name="report"
                  value={item}
                  onChange={(e) => {
                    setReportValue(e.target.value);
                  }}
                />
              </div>
            </div>
          );
        })}
        <div className='text-center mx-auto'>
        <button onClick={handleReportSubmit} disabled={reportValue==null} className=' mb-2 cursor-pointer mt-4 text-center px-2 text-base py-1 rounded-lg border-2 border-white hover:bg-dbeats-light '>Submit Report</button>
        </div>
      </div>
    </Modal>
  );
}

export default ReportModal2;
