import React from "react";
import { Loader } from "tabler-icons-react";

function Loading(props) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <Loader className="animate-spin" />
      {props.msg}
    </div>
  );
}

export default Loading;
