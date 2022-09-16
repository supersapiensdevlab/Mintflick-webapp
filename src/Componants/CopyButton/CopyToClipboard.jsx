import React, { useState } from "react";

function CopyToClipboard(props) {
  const [copied, setCopied] = useState("copy");
  return (
    <div
      className="font-medium mr-4 text-green-700 cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(props.text);
        setCopied("copied");
      }}
    >
      {copied}
    </div>
  );
}

export default CopyToClipboard;
