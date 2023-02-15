import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

function CustomInput() {
  const [testMentions, settestMentions] = useState("");
  function handleMentions(e) {
    settestMentions(e.target.value);
    e.target.value.charAt(e.target.value.length - 1) === "@" &&
      settestMentions(`${e.target.value} Sahil`);
  }
  return (
    <div className="container">
      <input
        type="text"
        placeholder="Video title"
        className="input w-full "
        value={testMentions}
        onChange={handleMentions}
        required={true}
      />
      <MDEditor value={testMentions} onChange={settestMentions} />
      <MDEditor.Markdown
        source={testMentions}
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}

export default CustomInput;
