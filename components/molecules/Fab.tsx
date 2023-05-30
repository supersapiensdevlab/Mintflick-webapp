import { useElementSize, useHover } from '@mantine/hooks';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  icon: ReactNode;
  text: String;
  size: 'xsmall' | 'small' | 'base';
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  kind:
    | 'default'
    | 'mint'
    | 'info'
    | 'danger'
    | 'luxury'
    | 'warning'
    | 'success';
};

function Fab(props: Props) {
  const [showText, setShowText] = useState(true);
  const ref1: React.MutableRefObject<HTMLDivElement> = useRef();
  const { hovered, ref } = useHover();

  useEffect(() => {
    const t = setTimeout(() => {
      setShowText(false);
    }, 2000);

    return () => {
      clearTimeout(t);
      setShowText(false);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        transform: `translate(${
          showText || hovered ? 0 : ref1.current.clientWidth + 16
        }px)`,
      }}
      onClick={props.onClick}
      className={`lg:hidden absolute bottom-20 right-0 flex items-center w-fit gap-2  cursor-pointer select-none  rounded-l-full ${
        props.size === 'xsmall' ? 'p-2' : props.size === 'small' ? 'p-3' : 'p-5'
      } ${
        props.kind === 'default'
          ? 'bg-vapormintWhite-100 text-vapormintBlack-300'
          : props.kind === 'mint'
          ? 'bg-vapormintMint-300 text-vapormintBlack-300'
          : props.kind === 'info'
          ? 'bg-vapormintBlue-300 text-vapormintWhite-100'
          : props.kind === 'danger'
          ? 'bg-vapormintError-500 text-vapormintWhite-100'
          : props.kind === 'luxury'
          ? 'bg-vapormintLuxury-300 text-vapormintWhite-100'
          : props.kind === 'warning'
          ? 'bg-vapormintWarning-500 text-vapormintWhite-100'
          : props.kind === 'success' &&
            'bg-vapormintSuccess-500 text-vapormintWhite-100'
      }   transition-all ease-in-out  `}
    >
      {props.icon}

      <div ref={ref1} className={`mr-1 text-lg font-semibold`}>
        {props.text}
      </div>
    </div>
  );
}

export default Fab;
