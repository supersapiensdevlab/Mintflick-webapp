import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
  icon: ReactNode;
  text: String;
  size: 'xsmall' | 'small' | 'base';
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
  showText: Boolean;
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
  const [animation, setAnimation] = useState(false);

  // const { height, width } = useViewportSize();
  useEffect(() => {
    const t = setTimeout(() => {
      setShowText(false);
    }, 1000);
    const t2 = setTimeout(() => {
      setAnimation(true);
    }, 300);

    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      setShowText(false);
      setAnimation(false);
    };
  }, []);
  return (
    <div
      onClick={props.onClick}
      className={`absolute bottom-20 right-0 flex items-center w-fit gap-2  cursor-pointer select-none  rounded-l-full ${
        props.size === 'xsmall' ? 'p-2' : props.size === 'small' ? 'p-3' : 'p-5'
      } ${animation ? `translate-x-0` : 'translate-x-full'}  ${
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
      }   transition-all ease-in-out  `}>
      {props.icon}
      {props.showText && (
        <div
          className={`mr-1 text-lg font-semibold  ${
            showText ? `scale-x-100` : `scale-x-0`
          } transition-all origin-right duration-300 ease-in-out`}>
          {props.text}
        </div>
      )}
    </div>
  );
}

export default Fab;
