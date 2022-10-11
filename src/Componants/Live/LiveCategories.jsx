import React, { useState } from "react";
import game1 from "../../Assets/Gaming Posters/Bgmi.jpg";
import game2 from "../../Assets/Gaming Posters/fallguys.webp";
import game3 from "../../Assets/Gaming Posters/Fifa.webp";
import game4 from "../../Assets/Gaming Posters/Fortnite.jpg";
import game5 from "../../Assets/Gaming Posters/Godofwar.jfif";
import game6 from "../../Assets/Gaming Posters/Gta.jpg";
import game7 from "../../Assets/Gaming Posters/Rocketleague.jpg";
import game8 from "../../Assets/Gaming Posters/valorant.jpg";
import game9 from "../../Assets/Gaming Posters/apexlegends.jpg";

function LiveCategories() {
  const [data, setData] = useState([
    {
      name: "Battleground Mobile India",
      img: game1,
      url: "",
    },
    {
      name: "Fall Guys",
      img: game2,
      url: "",
    },
    {
      name: "FIFA 2023",
      img: game3,
      url: "",
    },
    {
      name: "Fortnite",
      img: game4,
      url: "",
    },
    {
      name: "God Of War",
      img: game5,
      url: "",
    },
    {
      name: "Grand Theft Auto",
      img: game6,
      url: "",
    },
    {
      name: "Rocket League",
      img: game7,
      url: "",
    },
    {
      name: "Valorant",
      img: game8,
      url: "",
    },
    {
      name: "Apex Legends",
      img: game9,
      url: "",
    },
  ]);
  return (
    <div className="w-full h-fit p-4 space-y-2 lg:rounded-xl bg-slate-100 dark:bg-slate-800 ">
      <p className="font-bold text-base text-brand5 ">Categories you’d like</p>
      <div className=" w-full overflow-x-auto">
        <div className="flex space-x-4 w-fit">
          {data.map((category) => (
            <div
              className="relative h-48 w-36 bg-cover rounded-lg"
              style={{
                backgroundImage: `url(${category.img}  )`,
              }}
            >
              <p className="absolute bottom-0 p-2 pt-6 w-full text-sm font-bold text-slate-300 bg-gradient-to-t from-black to-transparent rounded-lg">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LiveCategories;
