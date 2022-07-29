import React from "react";
import { Calendar, CurrencyEthereum, Language, Map2 } from "tabler-icons-react";

function Filter() {
  return (
    <div className="w-full h-fit space-y-4">
      <p className="font-extrabold text-lg text-brand5 mb-2">Filter</p>

      <div className="w-full flex flex-col items-start space-y-4 ">
        <div className="h-full flex items-center space-x-2">
          <Calendar className="text-brand2"></Calendar>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Date
          </p>
          <select className="select select-ghost select-xs text-brand3">
            <option disabled selected>
              Pick
            </option>
            <option>Svelte</option>
            <option>Vue</option>
            <option>React</option>
          </select>
        </div>
        <div className="h-full flex items-center space-x-2">
          <Language className="text-brand2"></Language>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Language
          </p>
          <select className="select select-ghost select-xs text-brand3">
            <option disabled selected>
              Pick
            </option>
            <option>Svelte</option>
            <option>Vue</option>
            <option>React</option>
          </select>
        </div>
        <div className="h-full flex items-center space-x-2">
          <Map2 className="text-brand2"></Map2>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Area
          </p>
          <select className="select select-ghost select-xs text-brand3">
            <option disabled selected>
              Pick
            </option>
            <option>Svelte</option>
            <option>Vue</option>
            <option>React</option>
          </select>
        </div>
        <div className="h-full flex items-center space-x-2">
          <CurrencyEthereum className="text-brand2"></CurrencyEthereum>
          <p className="cursor-pointer text-base font-medium text-brand3">
            Price
          </p>
          <select className="select select-ghost select-xs text-brand3">
            <option disabled selected>
              Pick
            </option>
            <option>Svelte</option>
            <option>Vue</option>
            <option>React</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;
