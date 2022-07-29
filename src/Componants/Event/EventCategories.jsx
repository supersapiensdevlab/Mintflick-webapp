import React from "react";
import { Certificate, Eyeglass, MoodHappy, Palette } from "tabler-icons-react";

function EventCategories() {
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-brand5 mb-2">Categories</p>

      <div className="w-full flex flex-col items-start space-y-4 ">
        <div className="h-full flex items-center space-x-2">
          <MoodHappy className="text-brand2"></MoodHappy>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Comedy
          </p>
        </div>
        <div className="h-full flex items-center space-x-2">
          <Eyeglass className="text-brand2"></Eyeglass>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Workshops
          </p>
        </div>
        <div className="h-full flex items-center space-x-2">
          <Certificate className="text-brand2"></Certificate>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Courses
          </p>
        </div>
        <div className="h-full flex items-center space-x-2">
          <Palette className="text-brand2"></Palette>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Theater and art
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventCategories;
