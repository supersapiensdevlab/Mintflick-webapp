import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
} from "tabler-icons-react";
import useUserActions from "../../Hooks/useUserActions";
import { UserContext } from "../../Store";

export function Walkthrough(props) {
  const State = useContext(UserContext);
  const [active, setactive] = useState(0);
  const [offset, setoffset] = useState({ x: 0, y: 0 });
  const [divHeight, setdivHeight] = useState(0);
  const [resized, setresized] = useState(0);
  const [loadFeed, loadUser, loadProfileCard, loadNftsData] = useUserActions();

  function handleSeenIntro() {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/seen_intro`,
      data: {
        field: props.type,
        username: State.database.userData?.data?.user?.username,
      },
    })
      .then((response) => {
        console.log(response);
        let temp = {
          data: {
            user: response.data,
          },
        };

        State.updateDatabase({
          userData: temp,
          walletAddress: temp.data.user.wallet_id,
        });
        props.func();
        // loadUser();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function handleClick() {
    active < props.data.length - 1 ? setactive(active + 1) : handleSeenIntro();
  }

  function getDivHeight(el) {
    // let h = 0;
    // while (el && !isNaN(el.offsetHeight)) {
    //   h = el.offsetHeight;
    // }
    return el.offsetHeight;
  }

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

  useEffect(() => {
    function debounce(fn, ms) {
      let timer;

      return (_) => {
        clearTimeout(timer);
        timer = setTimeout((_) => {
          timer = null;
          fn.apply(this, arguments);
        }, ms);
      };
    }
    function handleResize() {
      setresized(window.innerWidth);
      console.log("handleResize called");
    }
    window.addEventListener("resize", debounce(handleResize, 1000));
    console.log("listner added");
    return function cleanup() {
      window.removeEventListener("resize", debounce(handleResize, 1000));
      console.log("listner removed");
    };
  }, []);

  useEffect(() => {
    setoffset({
      x: getOffset(document.getElementById(props.data[active].id)).top,
      y: getOffset(document.getElementById(props.data[active].id)).left,
    });
    setdivHeight(getDivHeight(document.getElementById("walkthrough")));
  }, [active, resized]);

  return (
    <div
      id="walkthrough"
      className="transition-all ease-in-out duration-500 drop-shadow-md pr-4 sm:p-0"
      style={{
        position: "fixed",
        top: offset.x - divHeight,
        left: offset.y,
      }}
    >
      <div
        className={`flex flex-col items-center bg-white dark:bg-slate-900 w-full sm:w-[500px]   h-fit    rounded-lg   overflow-hidden `}
      >
        <div className="w-full flex-grow p-6 flex flex-col items-start gap-4 ">
          <span className="text-2xl  font-bold text-brand1 text-center w-full flex justify-between">
            {props.data[active].heading}
            {active !== props.data.length - 1 && (
              <button
                onClick={() => setactive(props.data.length - 1)}
                className="font-bold text-sm text-brand6"
              >
                Skip
              </button>
            )}
          </span>
          <p className="text-md font-semibold text-slate-400 flex-grow">
            {props.data[active].text}
          </p>
          <div className="flex justify-between w-full">
            {active !== 0 && (
              <button
                onClick={() => setactive(active - 1)}
                className="flex items-center gap-2   font-semibold text-lg text-brand1"
              >
                <ChevronLeft />
                Back
              </button>
            )}
            <button
              onClick={handleClick}
              className={`flex items-center gap-2  font-semibold text-lg ml-auto py-1 px-2 rounded-md
 ${
   active === props.data.length - 1
     ? ` text-success hover:bg-success hover:text-white  `
     : ` text-primary`
 }`}
            >
              {active === props.data.length - 1 ? "Finish" : "Next"}
              {active !== props.data.length - 1 ? (
                <ChevronRight />
              ) : (
                <CircleCheck />
              )}
            </button>
          </div>
        </div>
      </div>

      <svg
        className="ml-2"
        width="24"
        height="24"
        viewBox="0 0 266 266"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H266L0 266V0Z"
          fill={State.database.dark ? "#0f172a" : "#ffffff"}
        />
      </svg>
    </div>
  );
}
