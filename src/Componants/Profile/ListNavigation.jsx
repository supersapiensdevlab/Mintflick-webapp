import React, { useState } from "react";
import { ChevronLeft } from "tabler-icons-react";

function ListNavigation(props) {
  const [active, setactive] = useState(false);
  const [activeTab, setactiveTab] = useState(0);

  return (
    <div className="w-full h-96 relative">
      <div className="w-full flex flex-col justify-start items-start p-4">
        {props.list.map((x, index) => (
          <div
            onClick={() => {
              setactive(true);
              setactiveTab(index);
            }}
            className="cursor-pointer p-2 w-full text-brand2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
          >
            {x}
          </div>
        ))}
      </div>
      <div
        className={`${
          active ? "w-full py-2 px-1" : "w-0 "
        } absolute h-full right-0 top-0 bg-slate-100 dark:bg-slate-800  transition-all ease-in-out flex flex-col justify-start items-start `}
      >
        <button
          onClick={() => setactive(false)}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        {props.content.map(
          (x, index) => activeTab === index && <div className="w-full">{x}</div>
        )}
      </div>
    </div>
  );
}

export default ListNavigation;
