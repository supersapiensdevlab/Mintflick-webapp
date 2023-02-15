import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";

function getOffset(el) {
  var _x = 0;
  var _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

export function Walkthrough(props) {
  const [active, setactive] = useState(0);
  const [offset, setoffset] = useState({ x: 0, y: 0 });
  console.log(props.data);

  const divElement = document.getElementById("walkthrought");

  function handleClick() {
    active < props.data.length - 1 ? setactive(active + 1) : props.func();
  }
  useEffect(() => {
    setoffset({
      x: getOffset(document.getElementById(props.data[active].id)).top,
      y: getOffset(document.getElementById(props.data[active].id)).left,
    });
  }, [active]);

  return (
    <div
      id="walkthrought"
      className={`fixed top-[${offset.x}px] left-[${offset.y}px] flex flex-col items-center bg-white dark:bg-slate-900 w-96  h-fit   sm:rounded-lg overflow-hidden`}
    >
      {active !== 0 && (
        <button
          onClick={() => setactive(active - 1)}
          className="flex items-center gap-2 absolute top-4  left-4 font-semibold text-lg text-white"
        >
          <ChevronLeft />
          Back
        </button>
      )}
      {active !== props.data.length - 1 && (
        <button
          onClick={() => setactive(props.data.length - 1)}
          className="absolute top-4 right-4 font-semibold text-lg text-white"
        >
          Skip
        </button>
      )}
      {offset.x}
      {offset.y}
      {divElement && !isNaN(divElement.offsetHeight) && divElement.offsetHeight}
      <div className="flex-grow p-8 flex flex-col items-start gap-4 mt-8">
        <span className="text-4xl font-bold text-white">
          {props.data[active].heading}
        </span>
        <p className="text-md font-semibold text-slate-400 flex-grow">
          {props.data[active].text}
        </p>

        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-center gap-2 font-semibold text-lg  p-4 rounded-lg ${
            active === props.data.length - 1
              ? `text-white bg-primary`
              : `text-primary border-2 border-primary`
          }`}
        >
          {active === props.data.length - 1 ? "Finish" : "Next"}
          {active !== props.data.length - 1 && <ChevronRight />}
        </button>
      </div>
    </div>
  );
}
