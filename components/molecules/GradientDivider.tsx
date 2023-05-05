import React, { useEffect, useState } from "react";

type Props = {
  animate?: boolean;
};

export default function GradientDivider({ animate }: Props) {
  //   const [animation, setanimation] = useState(true);

  //   useEffect(() => {
  //     const animationTimeout = setTimeout(() => {
  //       setanimation(!animation);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(animationTimeout);
  //     };
  //   }, [animation]);
  return (
    <div className="flex items-center justify-center w-full ">
      <span
        // style={{ height: `0.5px` }}
        className={`h-[1px] w-1/2 bg-gradient-to-l from-vapormintBlue-300 via-vapormintMint-300   max-w-sm`}
        // ${
        //   animation && "from-vapormintMint-300 via-vapormintBlue-300 "
        // }
      />
      <span
        // style={{ height: `0.5px` }}
        className={`h-[1px] w-1/2 bg-gradient-to-r from-vapormintBlue-300 via-vapormintMint-300 max-w-sm `}
      />
    </div>
  );
}
