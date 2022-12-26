import React from "react";
import { Link } from "react-router-dom";
import { PlayerPlay } from "tabler-icons-react";

function GameCard({ link, image }) {
  return (
    <div className="group w-full h-full relative overflow-hiddden rounded-lg">
      <img
        className="h-full w-full object-cover rounded-lg"
        src={image}
        alt="game-banner"
      />
      <div
        className={`backdrop-blur-none group-hover:backdrop-blur-sm duration-300 absolute top-0 left-0 h-full w-full bg-black/10  rounded-lg flex justify-center items-center`}
      >
        <Link
          to={link}
          className="hidden p-2 lg:p-4 bg-primary rounded-full group-hover:flex justify-center items-center gap-1 space-x-2 text-white font-semibold "
        >
          <PlayerPlay size={20} /> Play
        </Link>
      </div>
    </div>
  );
}

export default GameCard;
