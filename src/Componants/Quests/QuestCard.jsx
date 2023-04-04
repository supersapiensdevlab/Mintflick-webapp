import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function QuestCard({ questId, selectedPostImg, name, description, status }) {
  return (
    <NavLink
      to={status && "../quest-details/" + questId}
      className={`${
        !status && "grayscale"
      } mx-auto relative h-fit w-full sm:w-96   rounded-lg bg-white dark:bg-slate-700 sm:hover:scale-105 cursor-pointer transition-all ease-in-out shadow-xl overflow-hidden`}
    >
      <img
        className="object-cover w-full aspect-video sm:rounded-t-md"
        src={selectedPostImg}
        alt="banner"
      />
      <div className="flex items-center w-full px-4 py-3 my-1 space-x-2">
        <div className="flex-grow ">
          <p className="w-48 text-lg font-semibold truncate text-brand1">
            {name}
          </p>
        </div>
        <span className="w-1 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></span>
        <p
          className={`flex gap-1 items-end w-fit my-1 px-4 text-lg font-semibold ${
            status ? "text-green-600" : "text-error"
          }`}
        >
          <span className="text-2xl font-bold">
            {status ? (
              <div className="flex items-center gap-2">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute inline-flex w-3 h-3 bg-green-600 rounded-full"></span>
                </span>
                Live
              </div>
            ) : (
              "Closed"
            )}
          </span>
        </p>
      </div>
      <div className="flex items-center w-full px-2 pb-4 space-x-2">
        <p className="flex-grow h-12 px-4 overflow-hidden text-base font-normal text-ellipsis text-brand4">
          {description}
        </p>
      </div>
    </NavLink>
  );
}

export default QuestCard;
