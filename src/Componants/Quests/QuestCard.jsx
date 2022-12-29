import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function QuestCard({ questId, selectedPostImg, name, description, status }) {
  return (
    <NavLink
      to={status && "../quest-details"}
      className="mx-auto relative h-fit w-full sm:w-96   rounded-lg bg-white dark:bg-slate-700 sm:hover:scale-105 cursor-pointer transition-all ease-in-out shadow-xl overflow-hidden"
    >
      <img
        className="aspect-video w-full object-cover sm:rounded-t-md"
        src={selectedPostImg}
        alt="banner"
      />
      <div className="flex items-center w-full space-x-2 my-1  py-3 px-4">
        <div className="flex-grow ">
          <p className="w-48 text-lg font-semibold text-brand1 truncate">
            {name || <Skeleton />}
          </p>
        </div>
        <span className="h-8 w-1 bg-slate-200 dark:bg-slate-600 rounded-full"></span>
        <p
          className={`flex gap-1 items-end w-fit my-1 px-4 text-lg font-semibold ${
            status ? "text-green-600" : "text-error"
          }`}
        >
          <span className="font-bold text-2xl">
            {status ? (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="absolute inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                </span>
                Live
              </div>
            ) : (
              "Closed"
            )}
          </span>
        </p>
      </div>
      <div className="flex items-center w-full space-x-2  pb-4 px-2">
        <p className="flex-grow px-4  h-12  text-ellipsis  overflow-hidden text-base font-normal text-brand4">
          {description}
        </p>
      </div>
    </NavLink>
  );
}

export default QuestCard;
