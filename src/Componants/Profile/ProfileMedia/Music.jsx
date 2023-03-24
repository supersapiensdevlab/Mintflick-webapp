import React from "react";
import { PlayerPause, PlayerPlay } from "tabler-icons-react";

function Music() {
  let data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  return (
    <div className="grid   sm:grid-cols-3 lg:grid-cols-4 pt-2 gap-2 ">
      {data.map(() => (
        <div className="flex sm:flex-col w-full h-fit z-10 bg-slate-200 dark:bg-slate-700 rounded-l-lg rounded-r-lg overflow-hidden">
          <img
            className="aspect-square sm:aspect-video w-28 sm:w-full object-cover"
            src="https://picsum.photos/seed/picsum/200/300"
            alt="Track image"
          />
          <div className="flex flex-col p-2 h-fit flex-grow space-y-1">
            <div className="flex flex-col h-full">
              <span className="text-brand3 text-base font-semibold">
                track name
              </span>
              <span className="text-brand4 text-sm font-medium">
                track discription
              </span>
            </div>
            <input
              type="range"
              defaultValue="0"
              min="0"
              max="100"
              className="w-full  p-2 bg-slate-300 dark:bg-slate-600 appearance-none rounded-full range range-primary range-xs"
              // ref={progressBar}
              // onChange={changeRange}
            />
            <div className="flex  justify-between w-full items-center ">
              <audio
              // ref={audioPlayer}
              // src={props.trackUrl}
              // preload="metadata"
              ></audio>
              <span className="text-brand2 text-base font-medium">
                00:00/00:00{" "}
              </span>

              <label class="btn btn-circle btn-sm btn-ghost swap swap-rotate ">
                <input type="checkbox" />
                <PlayerPlay className="swap-off "></PlayerPlay>
                <PlayerPause className="swap-on "></PlayerPause>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Music;
