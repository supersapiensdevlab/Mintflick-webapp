import React from "react";
import { Link } from "react-router-dom";
import { PlayerPlay } from "tabler-icons-react";

function GameCard({ link, image, name }) {
  return (
    <div className=" sm:hover:scale-105   transition-all ease-in-out shadow-xl w-full h-fit relative   rounded-lg">
      <Link to={link}>
        <img
          className="h-96 w-full object-cover rounded-lg"
          src={image}
          alt="game-banner"
        />
        <div className="absolute bottom-0 left-0 w-full  p-4 bg-white/10 backdrop-blur-sm rounded-b-lg">
          <h1 className="w-fit mx-auto text-lg font-bold text-white">{name}</h1>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
