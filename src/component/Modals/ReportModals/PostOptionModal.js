import React, { useState } from 'react';
import Modal from 'react-modal';
import Switch from "react-switch";

function PostOptionModal({ show, handleClose,handleShowReport }) {
  const [commentDisabled,setCommentDisabled] = useState(false);
  const handleSwitch = (checked)=>{
    setCommentDisabled(checked);
  }
  return (
    <Modal
      isOpen={show}
      className={`${'dark'} h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
    >
      <div className="text-right">
        <i className="fa-solid fa-xmark text-lg text-white p-3 cursor-pointer" onClick={() =>{ handleClose(false); }}></i>
      </div>
      <div className='mt-1 mx-2'>
        <p className="mb-1 text-white text-lg cursor-pointer" onClick={()=>{handleShowReport(true);handleClose(false); }}>Report</p>
        <div className="flex">
        <p className="text-white text-lg ">Disable Comments </p>
        <span className='ml-9'><Switch onChange={handleSwitch} checked={commentDisabled} /></span>
        </div>
      </div>
    </Modal>
  );
}

export default PostOptionModal;
