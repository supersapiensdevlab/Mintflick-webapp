import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, UserCircle } from "tabler-icons-react";
import EventCard from "./EventCard";

function EventCardList() {
  const [data, setData] = useState([
    {
      type: "Online",
      category: "Meetup",
      isFreeEvent: true,
      channelName: "Organiser",
      channelProfile:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.gvS0FzhUJfjlwuq3aheoRgHaHa%26pid%3DApi&f=1",
      bookings: "1k",
      prices: "$30 onwards",
      timeline: " 10th to 11th December 2022",
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Event name",
      img: "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium",
      url: "",
    },
  ]);

  async function fetchData() {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/event`
      );
      console.log("EVENTS:", response);
      setData(response.data);
    } catch (error) {}
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full sm:w-fit h-fit px-4  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-4 sm:gap-y-8 sm:mx-auto">
      {data.map((event) => (
        <EventCard
          type={event.type}
          Category={event.category}
          isFreeEvent={event.freeEvent}
          selectedPostImg={event.img}
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
  );
}

export default EventCardList;
