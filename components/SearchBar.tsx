import React from "react";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: String;
  placeholder?: String;
  onClear: Function;
  solid?: Boolean;
};

function SearchBar(props: Props) {
  return (
    <div className={` flex flex-col items-center justify-start w-full`}>
      <div
        className={`flex items-center justify-start w-full gap-3 px-6 py-4 ${
          props.solid && "bg-slate-700"
        }`}>
        {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`w-6 h-6 `}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        }

        <input
          className={`flex-grow text-base font-semibold tracking-wider text-white h-fit focus:outline-none ${
            props.solid ? "bg-slate-700" : " bg-black"
          }`}
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
        />
        <svg
          onClick={() => props.onClear()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`w-6 h-6 ${
            !props.value && "scale-0"
          } transition-all ease-in-out cursor-pointer origin-center`}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <span
        style={{ height: `1px` }}
        className={`  w-full  bg-gradient-to-r from-black via-white to-black"`}
      />
    </div>
  );
}

export default SearchBar;
