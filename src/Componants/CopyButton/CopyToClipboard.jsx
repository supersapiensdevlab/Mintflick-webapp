import React, { useState } from "react";

function CopyToClipboard(props) {
  const [copied, setCopied] = useState(props.title ? props.title : "Copy");

  const handleCopied = () => {
    setCopied("Copied");
    setTimeout(() => {
      setCopied(props.title ? props.title : "Copy");
    }, 3000);
  };
  return (
    <div
      className="font-medium  text-green-700 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.text);
        handleCopied();
      }}
    >
      {props.children}
      {copied}
    </div>
  );
}

export default CopyToClipboard;
