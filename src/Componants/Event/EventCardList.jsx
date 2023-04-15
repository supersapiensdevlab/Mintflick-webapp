import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Adjustments,
  ChevronLeft,
  Filter,
  Plus,
  UserCircle,
} from "tabler-icons-react";
import Loading from "../Loading/Loading";
import EventCard from "./EventCard";
import ContentLoader from "react-content-loader";

function EventCardList() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [filteredData, setfilteredData] = useState([]);
  const [price, setprice] = useState(null);
  const [type, settype] = useState(null);

  async function fetchData() {
    setloading(true);
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/event`
      );
      console.log("EVENTS:", response);
      setfilteredData(response.data);
      setData(response.data);
      setloading(false);
    } catch (error) {}
  }
  function filterData(text) {
    let filtered = [];
    data.map((event) => {
      JSON.stringify(event).includes(text) && filtered.push(event);
    });
    setfilteredData(filtered);
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    let filtered = [];
    type &&
      data.map((event) => {
        event.type === type &&
          (price
            ? event.freeEvent === (price === "free" ? true : false)
            : true) &&
          filtered.push(event);
      });
    type ? setfilteredData(filtered) : setfilteredData(data);
  }, [type]);

  useEffect(() => {
    let filtered = [];
    price &&
      data.map((event) => {
        event.freeEvent === (price === "free" ? true : false) &&
          (type ? event.type === type : true) &&
          filtered.push(event);
      });
    price ? setfilteredData(filtered) : setfilteredData(data);
  }, [price]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-start w-full h-full gap-2 overflow-auto lg:mr-12">
        <div className="sticky top-0 z-40 flex items-center w-full max-w-2xl gap-2 p-2 lg:rounded-xl bg-slate-900/25 backdrop-blur-xl border-[1px] border-gray-300/20">
          <input
            type="text"
            onChange={(e) => filterData(e.target.value)}
            placeholder="Search events"
            className="flex-grow w-full input input-bordered"
          />
          <div className=" dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost text-brand3">
              {/* <Filter /> */}
              <Adjustments />
            </label>
            <div
              tabIndex={0}
              className="p-2 mt-3 text-base font-medium border-2 rounded-lg shadow-xl menu menu-compact dropdown-content border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-brand1 w-52"
            >
              <div className="flex items-center w-full gap-2 text-sm font-semibold text-brand2">
                <div className="flex-grow h-[2px] bg-slate-400 rounded-full"></div>
                Price
                <div className="flex-grow h-[2px] bg-slate-400 rounded-full"></div>
              </div>
              <span className="flex items-center justify-between w-full p-2">
                Free
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? setprice("free") : setprice(null)
                  }
                  checked={price === "free"}
                  className="checkbox checkbox-primary"
                />
              </span>
              <span className="flex items-center justify-between w-full p-2">
                Paid
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? setprice("paid") : setprice(null)
                  }
                  checked={price === "paid"}
                  className="checkbox checkbox-primary"
                />
              </span>
              <div className="flex items-center w-full gap-2 text-sm font-semibold text-brand2">
                <div className="flex-grow h-[2px] bg-slate-400 rounded-full"></div>
                Type
                <div className="flex-grow h-[2px] bg-slate-400 rounded-full"></div>
              </div>

              <span className="flex items-center justify-between w-full p-2">
                Online
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? settype("Online") : settype(null)
                  }
                  checked={type === "Online"}
                  className="checkbox checkbox-primary"
                />
              </span>
              <span className="flex items-center justify-between w-full p-2">
                In-person
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? settype("In-person") : settype(null)
                  }
                  checked={type === "In-person"}
                  className="checkbox checkbox-primary"
                />
              </span>
            </div>
          </div>
          <Link className="gap-2 btn btn-brand" to={"../create-event"}>
            <Plus />
            <span className="hidden sm:block">Create Event</span>
          </Link>
        </div>

        <div className="grid w-full grid-cols-1 px-4 pb-24 sm:w-fit h-fit md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((x) => (
                <ContentLoader
                  width={450}
                  height={400}
                  viewBox="0 0 450 400"
                  backgroundColor="#64748b"
                  foregroundColor="#94a3b8"
                  className="w-full"
                >
                  <rect x="43" y="304" rx="4" ry="4" width="271" height="9" />
                  <rect x="44" y="323" rx="3" ry="3" width="119" height="6" />
                  <rect
                    x="42"
                    y="77"
                    rx="10"
                    ry="10"
                    width="388"
                    height="217"
                  />
                </ContentLoader>
              ))
            : filteredData.map((event) => (
                <EventCard
                  type={event.type}
                  Category={event.category}
                  isFreeEvent={event.freeEvent}
                  selectedPostImg={event.eventImage}
                  name={event.title}
                  startDate={event.startTime}
                  price={event.ticketPrice}
                  userImg={event.channelProfile}
                  username={event.channelName || event.eventHost}
                  description={event.description}
                  lockId={event.lockId}
                  id={event.eventId}
                />
              ))}
        </div>
      </div>
    </>
  );
}

export default EventCardList;
