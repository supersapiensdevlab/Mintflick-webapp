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
  const [date, setdate] = useState("");
  const [timezone, settimezone] = useState("");
  const timezones = [
    "Europe/Andorra",
    "Asia/Dubai",
    "Asia/Kabul",
    "Europe/Tirane",
    "Asia/Yerevan",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    "Antarctica/Mawson",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Cordoba",
    "America/Argentina/Salta",
    "America/Argentina/Jujuy",
    "America/Argentina/Tucuman",
    "America/Argentina/Catamarca",
    "America/Argentina/La_Rioja",
    "America/Argentina/San_Juan",
    "America/Argentina/Mendoza",
    "America/Argentina/San_Luis",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Ushuaia",
    "Pacific/Pago_Pago",
    "Europe/Vienna",
    "Australia/Lord_Howe",
    "Antarctica/Macquarie",
    "Australia/Hobart",
    "Australia/Currie",
    "Australia/Melbourne",
    "Australia/Sydney",
    "Australia/Broken_Hill",
    "Australia/Brisbane",
    "Australia/Lindeman",
    "Australia/Adelaide",
    "Australia/Darwin",
    "Australia/Perth",
    "Australia/Eucla",
    "Asia/Baku",
    "America/Barbados",
    "Asia/Dhaka",
    "Europe/Brussels",
    "Europe/Sofia",
    "Atlantic/Bermuda",
    "Asia/Brunei",
    "America/La_Paz",
    "America/Noronha",
    "America/Belem",
    "America/Fortaleza",
    "America/Recife",
    "America/Araguaina",
    "America/Maceio",
    "America/Bahia",
    "America/Sao_Paulo",
    "America/Campo_Grande",
    "America/Cuiaba",
    "America/Santarem",
    "America/Porto_Velho",
    "America/Boa_Vista",
    "America/Manaus",
    "America/Eirunepe",
    "America/Rio_Branco",
    "America/Nassau",
    "Asia/Thimphu",
    "Europe/Minsk",
    "America/Belize",
    "America/St_Johns",
    "America/Halifax",
    "America/Glace_Bay",
    "America/Moncton",
    "America/Goose_Bay",
    "America/Blanc-Sablon",
    "America/Toronto",
    "America/Nipigon",
    "America/Thunder_Bay",
    "America/Iqaluit",
    "America/Pangnirtung",
    "America/Atikokan",
    "America/Winnipeg",
    "America/Rainy_River",
    "America/Resolute",
    "America/Rankin_Inlet",
    "America/Regina",
    "America/Swift_Current",
    "America/Edmonton",
    "America/Cambridge_Bay",
    "America/Yellowknife",
    "America/Inuvik",
    "America/Creston",
    "America/Dawson_Creek",
    "America/Fort_Nelson",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Dawson",
    "Indian/Cocos",
    "Europe/Zurich",
    "Africa/Abidjan",
    "Pacific/Rarotonga",
    "America/Santiago",
    "America/Punta_Arenas",
    "Pacific/Easter",
    "Asia/Shanghai",
    "Asia/Urumqi",
    "America/Bogota",
    "America/Costa_Rica",
    "America/Havana",
    "Atlantic/Cape_Verde",
    "America/Curacao",
    "Indian/Christmas",
    "Asia/Nicosia",
    "Asia/Famagusta",
    "Europe/Prague",
    "Europe/Berlin",
    "Europe/Copenhagen",
    "America/Santo_Domingo",
    "Africa/Algiers",
    "America/Guayaquil",
    "Pacific/Galapagos",
    "Europe/Tallinn",
    "Africa/Cairo",
    "Africa/El_Aaiun",
    "Europe/Madrid",
    "Africa/Ceuta",
    "Atlantic/Canary",
    "Europe/Helsinki",
    "Pacific/Fiji",
    "Atlantic/Stanley",
    "Pacific/Chuuk",
    "Pacific/Pohnpei",
    "Pacific/Kosrae",
    "Atlantic/Faroe",
    "Europe/Paris",
    "Europe/London",
    "Asia/Tbilisi",
    "America/Cayenne",
    "Africa/Accra",
    "Europe/Gibraltar",
    "America/Godthab",
    "America/Danmarkshavn",
    "America/Scoresbysund",
    "America/Thule",
    "Europe/Athens",
    "Atlantic/South_Georgia",
    "America/Guatemala",
    "Pacific/Guam",
    "Africa/Bissau",
    "America/Guyana",
    "Asia/Hong_Kong",
    "America/Tegucigalpa",
    "America/Port-au-Prince",
    "Europe/Budapest",
    "Asia/Jakarta",
    "Asia/Pontianak",
    "Asia/Makassar",
    "Asia/Jayapura",
    "Europe/Dublin",
    "Asia/Jerusalem",
    "Asia/Kolkata",
    "Indian/Chagos",
    "Asia/Baghdad",
    "Asia/Tehran",
    "Atlantic/Reykjavik",
    "Europe/Rome",
    "America/Jamaica",
    "Asia/Amman",
    "Asia/Tokyo",
    "Africa/Nairobi",
    "Asia/Bishkek",
    "Pacific/Tarawa",
    "Pacific/Enderbury",
    "Pacific/Kiritimati",
    "Asia/Pyongyang",
    "Asia/Seoul",
    "Asia/Almaty",
    "Asia/Qyzylorda",
    "Asia/Qostanay", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
    "Asia/Aqtobe",
    "Asia/Aqtau",
    "Asia/Atyrau",
    "Asia/Oral",
    "Asia/Beirut",
    "Asia/Colombo",
    "Africa/Monrovia",
    "Europe/Vilnius",
    "Europe/Luxembourg",
    "Europe/Riga",
    "Africa/Tripoli",
    "Africa/Casablanca",
    "Europe/Monaco",
    "Europe/Chisinau",
    "Pacific/Majuro",
    "Pacific/Kwajalein",
    "Asia/Yangon",
    "Asia/Ulaanbaatar",
    "Asia/Hovd",
    "Asia/Choibalsan",
    "Asia/Macau",
    "America/Martinique",
    "Europe/Malta",
    "Indian/Mauritius",
    "Indian/Maldives",
    "America/Mexico_City",
    "America/Cancun",
    "America/Merida",
    "America/Monterrey",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Chihuahua",
    "America/Ojinaga",
    "America/Hermosillo",
    "America/Tijuana",
    "America/Bahia_Banderas",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Africa/Maputo",
    "Africa/Windhoek",
    "Pacific/Noumea",
    "Pacific/Norfolk",
    "Africa/Lagos",
    "America/Managua",
    "Europe/Amsterdam",
    "Europe/Oslo",
    "Asia/Kathmandu",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Auckland",
    "Pacific/Chatham",
    "America/Panama",
    "America/Lima",
    "Pacific/Tahiti",
    "Pacific/Marquesas",
    "Pacific/Gambier",
    "Pacific/Port_Moresby",
    "Pacific/Bougainville",
    "Asia/Manila",
    "Asia/Karachi",
    "Europe/Warsaw",
    "America/Miquelon",
    "Pacific/Pitcairn",
    "America/Puerto_Rico",
    "Asia/Gaza",
    "Asia/Hebron",
    "Europe/Lisbon",
    "Atlantic/Madeira",
    "Atlantic/Azores",
    "Pacific/Palau",
    "America/Asuncion",
    "Asia/Qatar",
    "Indian/Reunion",
    "Europe/Bucharest",
    "Europe/Belgrade",
    "Europe/Kaliningrad",
    "Europe/Moscow",
    "Europe/Simferopol",
    "Europe/Kirov",
    "Europe/Astrakhan",
    "Europe/Volgograd",
    "Europe/Saratov",
    "Europe/Ulyanovsk",
    "Europe/Samara",
    "Asia/Yekaterinburg",
    "Asia/Omsk",
    "Asia/Novosibirsk",
    "Asia/Barnaul",
    "Asia/Tomsk",
    "Asia/Novokuznetsk",
    "Asia/Krasnoyarsk",
    "Asia/Irkutsk",
    "Asia/Chita",
    "Asia/Yakutsk",
    "Asia/Khandyga",
    "Asia/Vladivostok",
    "Asia/Ust-Nera",
    "Asia/Magadan",
    "Asia/Sakhalin",
    "Asia/Srednekolymsk",
    "Asia/Kamchatka",
    "Asia/Anadyr",
    "Asia/Riyadh",
    "Pacific/Guadalcanal",
    "Indian/Mahe",
    "Africa/Khartoum",
    "Europe/Stockholm",
    "Asia/Singapore",
    "America/Paramaribo",
    "Africa/Juba",
    "Africa/Sao_Tome",
    "America/El_Salvador",
    "Asia/Damascus",
    "America/Grand_Turk",
    "Africa/Ndjamena",
    "Indian/Kerguelen",
    "Asia/Bangkok",
    "Asia/Dushanbe",
    "Pacific/Fakaofo",
    "Asia/Dili",
    "Asia/Ashgabat",
    "Africa/Tunis",
    "Pacific/Tongatapu",
    "Europe/Istanbul",
    "America/Port_of_Spain",
    "Pacific/Funafuti",
    "Asia/Taipei",
    "Europe/Kiev",
    "Europe/Uzhgorod",
    "Europe/Zaporozhye",
    "Pacific/Wake",
    "America/New_York",
    "America/Detroit",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Indiana/Indianapolis",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Vevay",
    "America/Chicago",
    "America/Indiana/Tell_City",
    "America/Indiana/Knox",
    "America/Menominee",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/North_Dakota/Beulah",
    "America/Denver",
    "America/Boise",
    "America/Phoenix",
    "America/Los_Angeles",
    "America/Anchorage",
    "America/Juneau",
    "America/Sitka",
    "America/Metlakatla",
    "America/Yakutat",
    "America/Nome",
    "America/Adak",
    "Pacific/Honolulu",
    "America/Montevideo",
    "Asia/Samarkand",
    "Asia/Tashkent",
    "America/Caracas",
    "Asia/Ho_Chi_Minh",
    "Pacific/Efate",
    "Pacific/Wallis",
    "Pacific/Apia",
    "Africa/Johannesburg",
  ];

  const [isFreeEvent, setisFreeEvent] = useState(false);
  const [isUnlimited, setisUnlimited] = useState(false);

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
              onClick={() => {
                name && type && Category && setstep(2);
              }}
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
            </div>{" "}
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Category</label>
              <select
                onChange={(e) => settimezone(e.target.value)}
                className="select block w-full font-semibold"
              >
                <option disabled selected>
                  Select timezone
                </option>
                {timezones.map((timezone) => (
                  <option>{timezone}</option>
                ))}
              </select>
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
              onClick={() => {
                description && date && timezone && selectedPost && setstep(3);
              }}
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
            <div className="mx-auto relative h-fit w-64  rounded-lg bg-slate-200 dark:bg-slate-700 hover:scale-105 transition-all ease-in-out shadow-md overflow-hidden">
              <div
                className=" 
absolute flex items-center gap-1  top-2 left-2 w-fit"
              >
                <div className=" bg-slate-600/30 backdrop-blur-sm rounded-full px-1 text-slate-100 text-sm font-semibold">
                  {type}
                </div>
                <div className=" bg-slate-600/30 backdrop-blur-sm rounded-full px-1 text-slate-100 text-sm font-semibold">
                  {Category}
                </div>
              </div>
              <div
                className="my-1 h-36 w-full bg-cover rounded-t-md"
                style={{
                  backgroundImage: `url(${selectedPost.localurl}  )`,
                }}
              ></div>
              <div className="flex w-full space-x-2 my-1  py-1 px-2">
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
              <p className="w-64 my-1 px-2 text-sm font-medium text-success truncate">
                {date}
              </p>
              <span className=" absolute bottom-0 right-2 text-brand2 text-xs text-semibold z-[999]">
                Only 20 tickets left
              </span>{" "}
              <div className="w-full relative bg-white/20 h-4">
                <div className="w-1/3 absolute top-0 left-0 h-full bg-gradient-to-tr   from-[#A36CFC]  via-primary  to-brand px-1  "></div>
              </div>
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
