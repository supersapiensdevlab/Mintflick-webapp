import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Search } from "tabler-icons-react";
import { UserContext } from "../Store";
import { Link } from "react-router-dom";
function Explore() {
  const State = useContext(UserContext);

  const [alluser, setAllUser] = useState([]);
  //filtered search data
  const [filteredData, setFilteredData] = useState([]);
  const [filteredVideoData, setFilteredVideoData] = useState([]);

  //searched word in search bar
  const [wordEntered, setWordEntered] = useState("");

  //Search div display
  const [filterResultDisplay, setFilterResultDisplay] = useState(true);

  //reference to search div
  const wrapperRef = useRef(null);
  const handleFilter = (event) => {
    setFilterResultDisplay(false);
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = alluser.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });

    const newVideoFilter = [];

    alluser.map((value) => {
      if (value.videos) {
        value.videos.map(async (video, index) => {
          if (
            video.videoName.toLowerCase().includes(searchWord.toLowerCase())
          ) {
            let data = {
              username: value.username,
              index: index,
              video: video,
            };
            newVideoFilter.push(data);
          }
          return 0;
        });
      }
      return 0;
    });

    if (searchWord === "") {
      setFilteredData([]);
      setFilteredVideoData([]);
    } else {
      setFilteredData(newFilter);
      setFilteredVideoData(newVideoFilter);
    }
  };

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilterResultDisplay(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER_URL}/user`,
    })
      .then((response) => {
        setAllUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // eslint-disable-next-line
  }, []);
  return (
    <div className=" flex w-full h-screen  bg-white dark:bg-slate-900 ">
      <div className="w-full  h-full pt-20 overflow-y-auto">
        <div className="flex lg:hidden items-center w-full max-w-xl mx-auto relative px-2 ">
          <input
            type="text"
            placeholder="Search for anything..."
            className="input input-bordered w-full max-w-xl -mr-8"
            onChange={handleFilter}
            value={wordEntered}
          ></input>
          <Search className="-translate-x-2 dark:text-slate-100"></Search>
          <div
            ref={wrapperRef}
            className=" bg-white  dark:bg-slate-700 dark:text-white mt-10 sm:mt-14 rounded-lg absolute top-0  self-center w-11/12  h-max max-h-80 overflow-hidden overflow-y-auto"
            hidden={filterResultDisplay}
          >
            {filteredVideoData.length !== 0 && (
              <>
                {filteredVideoData.slice(0, 15).map((value, key) => {
                  return (
                    <div
                      key={key}
                      className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary flex items-center"
                    >
                      <Search
                        className=" dark:text-slate-100  opacity-60 mr-2"
                        size={16}
                      ></Search>
                      {value.video.videoName.toLowerCase()}{" "}
                    </div>
                  );
                })}
              </>
            )}
            {filteredData.length !== 0 && (
              <>
                {filteredData.slice(0, 15).map((value, key) => {
                  return (
                    <div
                      key={key}
                      className="p-2 pl-3 dark:hover:bg-dbeats-dark-primary flex items-center"
                    >
                      <Search
                        className=" dark:text-slate-100 opacity-60 mr-2"
                        size={16}
                      ></Search>
                      {value.username.toLowerCase()}{" "}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className="p-2 md:p-3 my-2 md:mx-4 md:rounded-xl bg-slate-100 dark:bg-slate-800">
          <span className="font-bold text-base text-brand5">Profiles</span>
          <div className="flex gap-1 md:gap-2 mt-2 w-full overflow-x-auto ">
            {filteredData.map((u) => (
              <Link to={`/homescreen/profile/${u.username}`}>
                <div className="flex flex-col items-center">
                  <img
                    src={
                      u.profile_image
                        ? u.profile_image
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKVy7fXC26IPrrGOXVepyQiQvHEkyEHGWyjA&usqp=CAU"
                    }
                    alt="user profile pic"
                    className="h-12 w-12 md:h-16 md:w-16 rounded-full object-cover"
                  />
                  <span className="text-sm text-brand4 font-medium">
                    {u.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 p-2 gap-1 ">
          {State.database.feedData.map(
            (post) =>
              post.content_type === "post" ||
              (post.content_type === "video" && (
                <div className="col-span-1  aspect-square bg-slate-600 ">
                  <img
                    className="h-full w-full object-cover hover:scale-105 transition-all	ease-in-out duration-300"
                    src={
                      post.content.post_image
                        ? post.content.post_image
                        : post.content.videoImage
                        ? post.content.videoImage
                        : "https://picsum.photos/seed/picsum/200/300"
                    }
                    alt="post"
                    onClick={() => {}}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Explore;
