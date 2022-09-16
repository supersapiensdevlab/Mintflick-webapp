import React from "react";
import { Loader } from "tabler-icons-react";

function Loading(props) {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center text-brand3'>
      <Loader className='animate-spin' />

      {props.msg[Math.floor(Math.random() * props.msg?.length + 1)]}
    </div>
  );
}

export default Loading;
