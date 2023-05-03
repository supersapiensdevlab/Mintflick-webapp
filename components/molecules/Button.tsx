"use client";
import React, { useState } from "react";

type buttonProps = {
  handleClick: React.MouseEventHandler<HTMLDivElement>;
  kind: "mint" | "info" | "success" | "warning" | "luxury" | "danger" | "white";
  type: "solid" | "outlined" | "ghost";
  size: "small" | "base";
  children: any;
};
function Button({ kind, type, size, handleClick, children }: buttonProps) {
  const [animation, setAnimation] = useState(false);
  const animateClick = () => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 178);
  };

  return (
    <div
      onClick={(e) => {
        animateClick();
        setTimeout(() => {
          handleClick(e);
        }, 178 * 2);
      }}
      className={`relative w-full select-none ${
        size === "small" ? "h-[44px]" : "h-[60px]"
      }`}>
      {type === "solid" && (
        <>
          <button
            className={`
          ${
            kind === "mint" && "   bg-vapormintMint-300 text-vapormintBlack-300"
          } ${
              kind === "info" &&
              "   bg-vapormintBlue-300 text-vapormintWhite-100 "
            }  ${
              kind === "luxury" &&
              "   bg-vapormintLuxury-300 text-vapormintWhite-100 "
            }  ${
              kind === "success" &&
              "   bg-vapormintSuccess-500 text-vapormintWhite-100 "
            } ${
              kind === "warning" &&
              "   bg-vapormintWarning-500 text-vapormintWhite-100 "
            }  ${
              kind === "danger" &&
              "    bg-vapormintError-500 text-vapormintWhite-100 "
            }  ${
              kind === "white" &&
              "   bg-vapormintWhite-100 text-vapormintBlack-300 "
            }  absolute shadow-md z-20 transition-all ease-in-out ${
              animation ? "-bottom-1 -right-1" : " bottom-0  right-0"
            }    text-lg font-bold  p-4 rounded-lg h-full w-full  flex justify-center items-center gap-4`}>
            {children}
          </button>
          <div className="absolute z-10 w-full h-full rounded-lg -bottom-1 -right-1 bg-vapormintWhite-100"></div>
        </>
      )}
      {type === "outlined" && (
        <>
          <button
            className={`border-2 
          ${
            kind === "mint" &&
            " border-vapormintMint-300 bg-vapormintBlack-300 text-vapormintMint-300"
          } ${
              kind === "info" &&
              " border-vapormintBlue-300 bg-vapormintBlack-300 text-vapormintBlue-300 "
            }  ${
              kind === "luxury" &&
              " border-vapormintLuxury-300 bg-vapormintBlack-300 text-vapormintLuxury-300 "
            }  ${
              kind === "success" &&
              " border-vapormintSuccess-500 bg-vapormintBlack-300 text-vapormintSuccess-500 "
            } ${
              kind === "warning" &&
              " border-vapormintWarning-500 bg-vapormintBlack-300 text-vapormintWarning-500 "
            }  ${
              kind === "danger" &&
              " border-vapormintError-500 bg-vapormintBlack-300 text-vapormintError-500 "
            }  ${
              kind === "white" &&
              " border-vapormintWhite-100 bg-vapormintBlack-300 text-vapormintWhite-100 "
            }  absolute shadow-md z-20 transition-all ease-in-out  ${
              animation ? "-bottom-1 -right-1" : " bottom-0  right-0"
            } text-lg font-bold  p-4 rounded-lg h-full w-full  flex justify-center items-center gap-4`}>
            {children}
          </button>
          <div className="absolute z-10 w-full h-full border-2 rounded-lg -bottom-1 -right-1 border-y-vapormintWhite-100"></div>
        </>
      )}
      {type === "ghost" && (
        <>
          <button
            className={` 
          ${
            kind === "mint" && "bg-vapormintBlack-300 text-vapormintMint-300"
          } ${
              kind === "info" && "bg-vapormintBlack-300 text-vapormintBlue-300 "
            }  ${
              kind === "luxury" &&
              "bg-vapormintBlack-300 text-vapormintLuxury-300 "
            }  ${
              kind === "success" &&
              " bg-vapormintBlack-300 text-vapormintSuccess-500 "
            } ${
              kind === "warning" &&
              " bg-vapormintBlack-300 text-vapormintWarning-500 "
            }  ${
              kind === "danger" &&
              "bg-vapormintBlack-300 text-vapormintError-500 "
            }  ${
              kind === "white" &&
              "bg-vapormintBlack-300 text-vapormintWhite-100 "
            }  absolute shadow-md z-20 transition-all ease-in-out  ${
              animation ? "-bottom-1 -right-1" : " bottom-0  right-0"
            } text-lg font-bold  p-4 rounded-lg h-full w-full  flex justify-center items-center gap-4`}>
            {children}
          </button>
        </>
      )}
    </div>
  );
}

export default Button;
