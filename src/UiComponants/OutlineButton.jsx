import React from "react";

function OutlineButton(props) {
  return (
    <div className='flex items-center group cursor-pointer border-2 border-brand w-fit px-5 py-3 rounded-xl space-x-2 hover:bg-brand/50'>
      {props.leftIcon}
      <p className='font-medium text-base text-white'>{props.text}</p>
      {props.rightIcon}
    </div>
  );
}

export default OutlineButton;
