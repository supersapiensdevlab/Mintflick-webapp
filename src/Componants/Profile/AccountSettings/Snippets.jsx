import React, { useState } from "react";
import { Pencil, Plus } from "tabler-icons-react";
import SingleSnippet from "./SingleSnippet";

function Snippets() {
  const [openForm, setopenForm] = useState(false);
  return (
    <div className="mt-2">
      <div
        onClick={() => setopenForm(!openForm)}
        className="cursor-pointer pr-4 flex items-center gap-1 text-lg w-full justify-end  font-medium  text-primary"
      >
        <Plus size={16} /> New Snippet
      </div>
      <div className={`${openForm ? "block" : "hidden"} mx-4 space-y-2 pt-2`}>
        <input
          placeholder="Snippet name"
          className="input input-sm w-full"
        ></input>
        <textarea
          placeholder="Snippet content"
          className="  textarea   w-full"
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={() => setopenForm(false)}
            className="btn btn-primary btn-sm"
          >
            Add snippet
          </button>
        </div>
      </div>
      <SingleSnippet tabIndex={1} />
      <SingleSnippet tabIndex={2} />
    </div>
  );
}

export default Snippets;
