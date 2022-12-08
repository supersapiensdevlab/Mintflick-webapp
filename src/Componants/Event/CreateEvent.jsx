import React, { useContext, useState } from "react";
import moment from "moment";

import {
  ArrowNarrowLeft,
  ArrowNarrowRight,
  Camera,
  ChevronLeft,
  Confetti,
  File,
  FileCheck,
  Photo,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import coverImage from "../../Assets/backgrounds/cover.png";

function CreateEvent() {
  const State = useContext(UserContext);

  const [step, setstep] = useState(1);

  const [type, settype] = useState("");
  const [name, setname] = useState("");
  const [Category, setCategory] = useState("");
  const [ticketPrice, setticketPrice] = useState("");
  const [totalTickets, settotalTickets] = useState("");

  const [description, setdescription] = useState("");

  const [isFreeEvent, setisFreeEvent] = useState(false);
  const [isUnlimited, setisUnlimited] = useState(false);
  const [date, setdate] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);

  const handleImageChange = (event) => {
    // Update the state
    setSelectedPost({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };
  return (
    <div className="mt-24 lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 text-white">
      <div className="p-4 text-brand3 mx-auto w-full  sm:max-w-lg flex flex-col gap-2 sm:rounded-xl bg-slate-100 dark:bg-slate-800">
        {step !== 1 && (
          <button
            onClick={() => setstep(step - 1)}
            className="flex justify-start items-center text-brand3 font-semibold"
          >
            <ChevronLeft />
            Back
          </button>
        )}
        <span className="mx-auto my-2 text-5xl font-bold text-brand-gradient flex">
          {step === 1 && "Event Details"}
          {step === 2 && "Some more Details"}
          {step === 3 && "Almost Done"}
          {step === 4 && "Review"}
        </span>
        <progress
          className="progress progress-success w-full"
          value={step * 20}
          max="100"
        ></progress>
        {step === 1 && (
          <>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Name of event"
                className="input input-bordered w-full flex-grow"
              />
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Type</label>
              <select
                onChange={(e) => settype(e.target.value)}
                className="select block w-full font-semibold"
              >
                <option disabled selected>
                  Type of event
                </option>
                <option>Online</option>
                <option>In-person</option>
              </select>
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Category</label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="select block w-full font-semibold"
              >
                <option disabled selected>
                  Category of event
                </option>
                <option>Party</option>
                <option>Meetup</option>
              </select>
            </div>
            <label className="cursor-pointer label w-fit gap-2 ">
              <span className="text-brand3">Is it a free event?</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isFreeEvent}
                onChange={() => setisFreeEvent(!isFreeEvent)}
              />
            </label>
            {!isFreeEvent && (
              <div className=" ">
                <label className="ml-2 text-sm font-bold">Ticket Price</label>
                <input
                  value={ticketPrice}
                  onChange={(e) => setticketPrice(e.target.value)}
                  type="text"
                  placeholder="Price of a ticket"
                  className="input input-bordered w-full flex-grow"
                />
              </div>
            )}

            <label className="cursor-pointer label w-fit gap-2 ">
              <span className="text-brand3">Unlimited Tickets</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isUnlimited}
                onChange={() => setisUnlimited(!isUnlimited)}
              />
            </label>
            {!isUnlimited && (
              <div className="  ">
                <label className="ml-2 text-sm font-bold">Total tickets</label>
                <input
                  value={totalTickets}
                  onChange={(e) => settotalTickets(e.target.value)}
                  type="text"
                  placeholder="How many tickets you want to generate?"
                  className="input input-bordered w-full flex-grow"
                />
              </div>
            )}

            <button
              onClick={() => setstep(2)}
              className="mt-2 btn gap-2 btn-brand capitalize"
            >
              Next <ArrowNarrowRight />
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                type="text"
                placeholder="Description of event"
                className="textarea textarea-bordered w-full flex-grow"
              />
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Date</label>
              <input
                value={date}
                onChange={(e) => setdate(e.target.value)}
                className="w-full input"
                type={"datetime-local"}
                min={moment().format("YYYY-MM-DDThh:mm")}
                required={true}
              />
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Ticket Image</label>
              <label
                htmlFor="post_announcement_image"
                className=" cursor-pointer flex justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
              >
                {selectedPost ? (
                  selectedPost.file ? (
                    <div className="flex items-center">
                      <FileCheck className="text-emerald-700" />
                      {selectedPost.file[0].name.substring(0, 16)}
                    </div>
                  ) : (
                    "No file choosen!"
                  )
                ) : (
                  <div className="flex items-center gap-1">
                    <Photo />
                    Choose file *
                  </div>
                )}
                <input
                  id="post_announcement_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  required={true}
                  onClick={(event) => {
                    event.target.value = null;
                    setSelectedPost(null);
                  }}
                />
                {selectedPost ? (
                  selectedPost.file ? (
                    <div className="h-24 w-24 rounded-lg overflow-clip">
                      <img src={selectedPost.localurl}></img>
                    </div>
                  ) : null
                ) : (
                  <></>
                )}
              </label>
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Ticket Gallery</label>
              <label
                htmlFor="post_announcement_image"
                className=" cursor-pointer flex flex-col justify-between items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
              >
                <div className="flex w-full gap-2">
                  <div className="border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg h-12 aspect-video"></div>
                  <div className="border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg h-12 aspect-video"></div>
                  <div className="border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg h-12 aspect-video"></div>
                  <div className="border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg h-12 aspect-video"></div>
                </div>
                <div className="flex items-center gap-1">
                  <Camera />
                  Add Photo
                </div>

                <input
                  id="post_announcement_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  required={true}
                  onClick={(event) => {
                    event.target.value = null;
                    setSelectedPost(null);
                  }}
                />
              </label>
            </div>
            <button
              onClick={() => setstep(3)}
              className="mt-2 btn gap-2 btn-brand capitalize"
            >
              Next <ArrowNarrowRight />
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">
                Who is hosting event?
              </label>
              <div className="h-10 my-2 flex justify-start items-center">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={
                    State.database.userData.data?.user.profile_image
                      ? State.database.userData.data.user.profile_image
                      : coverImage
                  }
                />
                <div className="flex flex-col">
                  <span className="ml-2 text-lg font-semibold">
                    {State.database.userData.data?.user.username
                      ? State.database.userData.data.user.username
                      : "loading..."}
                  </span>
                  <span className="ml-2 text-xs font-semibold">
                    {`(${localStorage.getItem("walletAddress")})`}
                  </span>
                </div>
              </div>
            </div>
            {type === "In-person" ? (
              <div className="mt-2 ">
                <label className="ml-2 text-sm font-bold">Event Location</label>
                <textarea
                  type="text"
                  placeholder="Location of event"
                  className="textarea textarea-bordered w-full flex-grow"
                />
              </div>
            ) : (
              <div className="mt-2 ">
                <label className="ml-2 text-sm font-bold">Event Link</label>
                <input
                  type="text"
                  placeholder="Link of event"
                  className="input input-bordered w-full flex-grow"
                />
              </div>
            )}

            <button
              onClick={() => setstep(4)}
              className="mt-2 btn gap-2 btn-brand capitalize"
            >
              Review Details <ArrowNarrowRight />
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <div className="mx-auto relative h-fit w-64  py-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-700">
              {/* <div className="absolute flex items-center gap-1  top-4 left-4 w-fit bg-slate-600/30 backdrop-blur-sm rounded-full px-1 text-slate-100 text-sm font-semibold">
                <UserCircle size={16}></UserCircle> {event.bookings}
              </div> */}
              <div
                className="my-1 h-36 w-full bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${selectedPost.localurl}  )`,
                }}
              ></div>
              <div className="flex w-full space-x-2 my-1 ">
                <img
                  className="h-10 w-10 rounded-full"
                  src={selectedPost.localurl}
                  alt="user profile"
                />
                <div className=" ">
                  <p className="w-48 text-sm font-medium text-brand3 truncate">
                    {name}
                  </p>
                  <p className="text-sm font-normal text-brand5">
                    {State.database.userData.data?.user.username
                      ? State.database.userData.data.user.username
                      : "loading..."}
                  </p>
                </div>
              </div>
              <p className="w-64 my-1 text-sm font-medium text-brand3 truncate">
                {date}
              </p>
            </div>
            <button
              onClick={() => setstep(5)}
              className="mt-2 btn gap-2 btn-brand capitalize"
            >
              Publish event <Confetti />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CreateEvent;
