import { useViewportSize } from '@mantine/hooks';
import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
  title?: String;
  onClose: Function;
  children: ReactNode;
  animation: 'bottom' | 'right';
};

export default function FullScreenOverlay(props: Props) {
  const [animation, setAnimation] = useState(false);
  // const { height, width } = useViewportSize();
  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 200);
  }, []);

  return (
    <div
      // style={{ height: height, width: width }}
      className={`h-full w-full  absolute top-0 left-0 z-50 flex flex-col  items-center justify-start   select-none transition-all ease-in-out   ${
        animation
          ? props.animation === 'bottom'
            ? 'translate-y-0'
            : 'translate-x-0'
          : props.animation === 'bottom'
          ? 'translate-y-full'
          : 'translate-x-full'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full max-w-lg p-4 mx-auto bg-vapormintBlack-300 ">
        <span className="text-2xl font-black from-vapormintWhite-100 text-vapormintWhite-100">
          {props.title || ''}
        </span>
        <svg
          onClick={() => {
            setAnimation(false);
            setTimeout(() => {
              props.onClose();
            }, 200);
          }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 cursor-pointer text-vapormintWhite-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className="flex flex-col flex-grow w-full max-w-lg mx-auto overflow-y-auto scrollbar-none backdrop-blur-lg bg-vapormintBlack-200/40 overflow-x-clip">
        {props.children}
      </div>
    </div>
  );
}
