import React from 'react';
import Modal from 'react-modal';

function ReportModal({ show, handleClose, handleShowReport2,setReportSection ,setShowOtherReport}) {

  const handleSection = (section)=>{
    switch(section){
      case 1:
        setReportSection(['Nudity or pornography','Sexual exploitation','Sharing private images']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 2:
        setReportSection(['Violent Threat','Animal abuse','Death, severe injury, dangerous']);
        handleShowReport2(true);
        handleClose(false);
        break;
      case 3:
        setReportSection(['Animals','Firearms','Fake health documents']);
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
  }
  return (
    <Modal
      isOpen={show}
      className={`${'dark'} text-white h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
    >
      <div className="flex text-white items-center border-b-2 border-white">
        <div className="text-center w-60 flex-1">Report</div>
        <div>
          <i
            className="fa-solid fa-xmark text-lg text-white p-3 cursor-pointer"
            onClick={() => handleClose(false)}
          ></i>
        </div>
      </div>
      <div>Please select a problem</div>
      <div className=' mb-2'>
        <div onClick={()=> handleSection(1)} className="px-2 py-1  flex items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Nudity</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        <div onClick={()=> handleSection(2)} className="px-2 py-1  flex items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Voilence</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        <div onClick={()=> handleSection(3)} className="px-2 py-1  flex items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Unauthorised sales</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        <div onClick={()=> handleSection(4)} className="flex px-2  py-1 items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Pirated</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        <div onClick={()=> handleSection(5)} className="flex px-2  py-1  items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Spam</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        <div onClick={()=> handleSection(6)} className="flex px-2   py-1 items-center mt-3 w-80 justify-between cursor-pointer hover:bg-dbeats-dark">
            <div>Something Else</div>
            <div><i className="fa-solid fa-circle-chevron-right text-lg text-dbeats-light"></i></div>
        </div>
        
      </div>
    </Modal>
  );
}

export default ReportModal;
