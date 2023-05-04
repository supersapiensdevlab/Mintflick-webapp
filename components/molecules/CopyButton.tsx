import React, { useState } from "react";

function CopyToClipboard(props: {
  className: string;
  text: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(props.title ? props.title : "Copy");

  const handleCopied = () => {
    setCopied("Copied");
    setTimeout(() => {
      setCopied(props.title ? props.title : "Copy");
    }, 3000);
  };
  return (
    <div
      className={props.className}
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
