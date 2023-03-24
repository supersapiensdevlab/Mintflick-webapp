import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  DeviceFloppy,
  Pencil,
} from "tabler-icons-react";

function SingleSnippet({ tabIndex }) {
  const [open, setopen] = useState(false);

  const [editSnippet, seteditSnippet] = useState(false);
  const [value, setvalue] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
  return (
    <div tabIndex={tabIndex} className="p-4  text-brand3 ">
      <div
        onClick={() => setopen(!open)}
        className="w-full flex justify-between items-center text-lg font-medium  "
      >
        Snippet name
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      <div
        className={`${
          open ? "h-fit pt-2 " : "h-0 -my-2"
        } transition-all ease-in-out overflow-hidden mx-4 space-y-2 `}
      >
        {editSnippet ? (
          <textarea
            value={value}
            onChange={(e) => setvalue(e.target.value)}
            className="textarea w-full h-48"
          />
        ) : (
          <p className="p-2  pb-0 w-full ">{value}</p>
        )}
        <div className="w-full  border-b-2 border-slate-300 dark:border-slate-600">
          {editSnippet ? (
            <span
              onClick={() => seteditSnippet(false)}
              className="p-2 ml-auto w-fit flex items-center gap-1 text-primary "
            >
              <DeviceFloppy size={16} />
              save
            </span>
          ) : (
            <span
              onClick={() => seteditSnippet(true)}
              className="p-2 ml-auto w-fit flex items-center gap-1 text-primary "
            >
              <Pencil size={16} />
              edit
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleSnippet;
