import React from "react";

function Button(props) {
  return (
    <div className='flex items-center group cursor-pointer w-fit px-8 py-3 bg-brand rounded-xl space-x-2 hover:bg-brand/50'>
      {props.leftIcon}
      <p className='font-bold text-base text-alt'>{props.text}</p>
      {props.rightIcon}
    </div>
  );
}

export default Button;
