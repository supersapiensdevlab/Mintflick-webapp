import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, UserCircle } from "tabler-icons-react";
import Loading from "../Loading/Loading";
import EventCard from "./EventCard";

function EventCardList() {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  async function fetchData() {
    setloading(true);
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/event`
      );
      console.log("EVENTS:", response);
      setData(response.data);
      setloading(false);
    } catch (error) {}
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full sm:w-fit h-fit px-4  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
      {loading ? (
        <Loading />
      ) : (
        data.map((event) => (
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
        ))
      )}
    </div>
  );
}

export default EventCardList;
