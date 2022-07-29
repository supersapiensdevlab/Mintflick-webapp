import React from "react";
import EventCardList from "./EventCardList";
import EventCategories from "./EventCategories";
import Filter from "./Filter";

function f94cEVEsNsbylR0dxXlNHctXdHwkImL12q6oq6s9euFFy5pTSjE6On7kxImJg5OTU31nzJ27p2Xxor54ewpkpFAoPJfvTwKAyrCiAgBQIa() {
  return (
    <div className=" flex w-full h-screen  bg-white dark:bg-slate-900 ">
      <div className="hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto">
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div>
      <div className="w-full lg:w-3/4 lg:mr-12 h-full pt-24 space-y-6 overflow-y-auto">
        <div className="p-2 w-full h-52 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        <EventCardList></EventCardList>
        <EventCardList></EventCardList>
        <EventCardList></EventCardList>
      </div>
    </div>
  );
}

export default f94cEVEsNsbylR0dxXlNHctXdHwkImL12q6oq6s9euFFy5pTSjE6On7kxImJg5OTU31nzJ27p2Xxor54ewpkpFAoPJfvTwKAyrCiAgBQIa;
