import React, { useState } from "react";

function CopyToClipboard(props) {
  const [copied, setCopied] = useState("copy");

  const handleCopied = () =>{
    setCopied("copied");
    setTimeout(()=>{
      setCopied("copy")
    },3000)
  }
  return (
    <div
      className="font-medium mr-4 text-green-700 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.text);
        handleCopied();
      }}
    >
      {copied}
    </div>
  );
}

export default CopyToClipboard;
