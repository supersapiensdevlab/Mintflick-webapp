import React, { useEffect, useState } from "react";
import { useViewportSize } from "@mantine/hooks";

type Props = {
  title?: String;
  description?: String;
  onCancel: Function;
  children: React.ReactNode;
};

export default function Modal(props: Props) {
  const [animation, setAnimation] = useState(false);
  const { height, width } = useViewportSize();

  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 200);
  }, []);
  return height && width ? (
    <div
      style={{ height: height, width: width }}
      className={`fixed top-0 left-0 z-50 flex items-end justify-center   select-none   backdrop-blur-sm  ${
        animation ? "bg-vapormintBlack-300/25" : "bg-vapormintBlack-300/0"
      } transition-colors ease-in-out`}
    >
      <div
        className={`flex flex-col max-w-xl items-center w-full h-fit   ${
          animation ? "translate-y-0" : "translate-y-full"
        } transition-all ease-in-out`}
      >
        <div className="flex w-full h-2 px-2">
          <span className="flex-grow h-2 rounded-t-lg bg-vapormintBlack-100" />
        </div>

        <div className="flex flex-col items-start justify-start w-full p-6 rounded-t-lg bg-vapormintWhite-100">
          <div className="flex items-center justify-between w-full">
            <span className="text-3xl font-black text-vapormintBlack-300">
              {props.title}
            </span>
            <svg
              onClick={() => {
                setAnimation(false);
                setTimeout(() => {
                  props.onCancel();
                }, 200);
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer text-vapormintBlack-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <span className="w-full text-lg font-medium text-vapormintBlack-100">
            {props.description}
          </span>
          {props.children}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
