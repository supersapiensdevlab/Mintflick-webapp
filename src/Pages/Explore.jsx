import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Search } from "tabler-icons-react";
import { UserContext } from "../Store";
import imgPlaceHolder from "../Assets/profile-pic.png";

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
      State.updateDatabase({
        filteredData: [],
        filteredVideoData: [],
      });
    } else {
      // setFilteredData(newFilter);
      // setFilteredVideoData(newVideoFilter);
      State.updateDatabase({
        filteredData: newFilter,
        filteredVideoData: newVideoFilter,
      });
    }
  };

  useEffect(() => {
    console.log(State.database.filteredVideoData);
  }, [State.database.filteredVideoData]);
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
    return () => {
      console.log("Explore clear");
      State.updateDatabase({
        filteredData: [],
        filteredVideoData: [],
      });
    };
  }, []);
  return (
    <div className="flex w-full h-screen bg-white dark:bg-slate-900">
      <div className="w-full h-full pt-20 overflow-y-auto">
        <div className="relative flex items-center w-full max-w-xl px-2 mx-auto lg:hidden ">
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full max-w-xl -mr-8 input input-bordered"
            onChange={handleFilter}
            value={wordEntered}
          ></input>
          <Search className="-translate-x-2 dark:text-slate-100"></Search>
          <div
            ref={wrapperRef}
            className="absolute top-0 self-center w-11/12 mt-10 overflow-hidden overflow-y-auto bg-white rounded-lg dark:bg-slate-700 dark:text-white sm:mt-14 h-max max-h-80"
            hidden={filterResultDisplay}
          >
            {State.database.filteredVideoData.length !== 0 && (
              <>
                {State.database.filteredVideoData
                  .slice(0, 15)
                  .map((value, key) => {
                    return (
                      <div
                        key={key}
                        className="flex items-center p-2 pl-3 dark:hover:bg-dbeats-dark-primary"
                      >
                        <Search
                          className="mr-2 dark:text-slate-100 opacity-60"
                          size={16}
                        ></Search>
                        {value.video.videoName.toLowerCase()}{" "}
                      </div>
                    );
                  })}
              </>
            )}
            {State.database.filteredData.length !== 0 && (
              <>
                {State.database.filteredData.slice(0, 15).map((value, key) => {
                  return (
                    <div
                      key={key}
                      className="flex items-center p-2 pl-3 dark:hover:bg-dbeats-dark-primary"
                    >
                      <Search
                        className="mr-2 dark:text-slate-100 opacity-60"
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
        {State.database.filteredData.length > 0 && (
          <div className="p-2 my-2 md:p-3 md:mx-4 md:rounded-xl bg-slate-100 dark:bg-slate-800">
            <span className="text-base font-bold text-brand5">Profiles</span>
            <div className="flex w-full gap-1 mt-2 overflow-x-auto md:gap-2 ">
              {State.database.filteredData.map((u) => (
                <Link to={`/homescreen/profile/${u.username}`}>
                  <div className="flex flex-col items-center w-20 lg:w-32">
                    <img
                      src={u.profile_image ? u.profile_image : imgPlaceHolder}
                      alt="user profile pic"
                      className="object-cover w-12 h-12 rounded-full md:h-16 md:w-16"
                    />
                    <span className="text-sm font-medium text-brand4">
                      {u.username.length > 10
                        ? `${u.username.substring(0, 10)}...`
                        : u.username}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="ml-2 lg:ml-4">
          <span className="text-base font-bold text-brand5">Recommended </span>
        </div>
        <div className="grid grid-cols-3 gap-1 p-2 lg:grid-cols-4 ">
          {State.database.filteredVideoData.length <= 0
            ? State.database.feedData.map(
                (post) =>
                  post.content_type === "post" ||
                  (post.content_type === "video" && (
                    <Link
                      to={`/homescreen/${post.username}/${post.content_type}/${
                        post.content.postId
                          ? post.content.postId
                          : post.content.videoId
                      }`}
                    >
                      <div className="col-span-1 aspect-square bg-slate-600 ">
                        <img
                          className="object-cover w-full h-full transition-all duration-300 ease-in-out hover:scale-105"
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
                    </Link>
                  ))
              )
            : State.database.filteredVideoData.map((post) => (
                <Link
                  to={`/homescreen/${post.username}/video/${post.video.videoId}`}
                >
                  {" "}
                  <div className="col-span-1 aspect-square bg-slate-600 ">
                    <img
                      className="object-cover w-full h-full transition-all duration-300 ease-in-out hover:scale-105"
                      src={
                        post.video.videoImage
                          ? post.video.videoImage
                          : "https://picsum.photos/seed/picsum/200/300"
                      }
                      alt="post"
                      onClick={() => {}}
                    />
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
