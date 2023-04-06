import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronUp } from "tabler-icons-react";

function ArtCard() {
  return (
    <div
      className={`flex mx-auto relative h-32 sm:h-44 w-full   max-w-3xl   rounded-lg bg-white dark:bg-slate-700 sm:hover:scale-105 transition-all ease-in-out shadow-xl overflow-hidden`}
    >
      <img
        className="object-cover h-full aspect-square sm:rounded-l-md"
        src={`https://cdn.britannica.com/87/2087-004-264616BB/Mona-Lisa-oil-wood-panel-Leonardo-da.jpg`}
        alt="banner"
      />
      <div className="flex items-center flex-grow px-4 py-3 my-1 space-x-2">
        <div className="flex-grow h-full overflow-hidden ">
          <p className="text-lg font-semibold truncate text-brand1">name</p>
          <p className="text-sm font-normal sm:text-base text-brand4">
            sdasda as as as das asd asd asd sdasda as as as das asd asd asd
            sdasda as as as das asd asd asd sdasda as as as das asd asd asd
            sdasda as as as das asd asd asd sdasda as as as das asd asd asd
            sdasda as as as das asd asd asd sdasda as as as das asd asd asd
          </p>
        </div>
        <span className="w-1 h-full rounded-full bg-slate-200 dark:bg-slate-600"></span>
        <span className="flex flex-col items-center gap-1 font-semibold group text-success border-[1px] p-2 rounded-md border-success cursor-pointer">
          <ChevronUp className="group-hover:animate-bounce" />
          123
        </span>
      </div>
    </div>
  );
}

export default ArtCard;
