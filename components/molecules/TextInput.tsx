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
        <span className="text-xs font-semibold tracking-widest uppercase text-vapormintWhite-100">
          {props.title}
        </span>
      )}
      <input
        className={`w-full h-12 text-base border-b rounded-none text-vapormintWhite-100 bg-vapormintBlack-300  ${
          props.error
            ? "border-vapormintError-500"
            : "border-vapormintBlack-200 focus:border-vapormintWhite-100"
        }  focus:outline-none `}
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
      />
      <div className="flex items-center justify-between w-full">
        {props.error && (
          <span className="text-sm tracking-wider text-vapormintError-500 ">
            {props.error}
          </span>
        )}
        {/* {props.count && props.value?.length >= props.count && (
          <span className="text-xs font-semibold tracking-wider uppercase text-vapormintError-500 ">
            word Limit exided
          </span>
        )} */}
        {props.count && (
          <span
            className={`ml-auto ${
              props.value?.length >= props.count
                ? "text-lg text-vapormintError-500 font-bold"
                : "text-xs text-vapormintWarning-500 font-semibold"
            }    font-semibold uppercase transition-all ease-in-out`}
          >
            {props.value?.length} / {props.count}
          </span>
        )}
      </div>
    </div>
  );
}

export default TextInput;
