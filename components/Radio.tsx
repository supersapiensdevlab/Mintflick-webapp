import React from "react";

type Props = {
  flex: "col" | "row";
  value: String;
  onChange: Function;
  options: {
    color: "default" | "info" | "danger" | "luxury" | "warning" | "success";
    option: String;
  }[];
};
Radio.defaultProps = {
  flex: "col",
};

export default function Radio(props: Props) {
  return (
    <div
      className={`flex ${
        props.flex === "col" && "flex-col"
      } gap-2 items-center justify-start p-1`}>
      {props.options.map((option) => (
        <div
          onClick={() => props.onChange(option.option)}
          className="flex items-center gap-2 p-1 cursor-pointer select-none">
          <div
            className={`w-6 h-6  border-white border-[2px] rounded-lg flex items-center justify-center`}>
            <div
              className={`w-4 h-4 ${
                props.value === option.option ? "scale-100" : "scale-0"
              } bg-white transition-all ease-in-out rounded-[4px] origin-center`}></div>
          </div>
          {option.option && (
            <span className="text-sm font-semibold tracking-wide">
              {option.option}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
