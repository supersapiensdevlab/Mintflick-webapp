import React from "react";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  title?: String;
  error?: String;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: String;
  placeholder?: String;
  count?: number;
};

function TextInput(props: Props) {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-1 py-1">
      {props.title && (
        <span className="text-xs font-semibold tracking-widest text-white uppercase">
          {props.title}
        </span>
      )}
      <input
        className="w-full h-12 text-base text-white bg-black border-b rounded-none border-slate-700 focus:border-white focus:outline-none "
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
      />
      <div className="flex items-center justify-between w-full">
        {props.error && (
          <span className="text-xs tracking-wider text-red-700 uppercase ">
            {props.error}
          </span>
        )}
        {/* {props.count && props.value?.length >= props.count && (
          <span className="text-xs font-semibold tracking-wider text-red-700 uppercase ">
            word Limit exided
          </span>
        )} */}
        {props.count && (
          <span
            className={`ml-auto ${
              props.value?.length >= props.count
                ? "text-lg text-red-700 font-bold"
                : "text-xs text-orange-700 font-semibold"
            }  text-orange-700 font-semibold uppercase transition-all ease-in-out`}>
            {props.value?.length} / {props.count}
          </span>
        )}
      </div>
    </div>
  );
}

export default TextInput;
