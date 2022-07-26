import React, { useState } from "react";

function LiveCategories() {
  const [data, setData] = useState([
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
      url: "",
    },
    {
      name: "Game name",
      img: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?cs=srgb&dl=pexels-lucie-liz-3165335.jpg&fm=jpg",
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
