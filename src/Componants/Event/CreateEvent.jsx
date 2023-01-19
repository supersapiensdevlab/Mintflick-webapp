import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { ethers } from "ethers";
import axios from "axios";

import {
  AlertTriangle,
  ArrowLeft,
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
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";
const { ethereum } = window;
function CreateEvent() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [step, setstep] = useState(1);

  const [type, settype] = useState("");
  const [name, setname] = useState("");
  const [Category, setCategory] = useState("");
  const [ticketPrice, setticketPrice] = useState("");
  const [totalTickets, settotalTickets] = useState("");

  const [description, setdescription] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [timezone, settimezone] = useState("");
  const timezones = [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Algiers",
    "Africa/Bissau",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/El_Aaiun",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Khartoum",
    "Africa/Lagos",
    "Africa/Maputo",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Chicago",
    "America/Chihuahua",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Godthab",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Nassau",
    "America/New_York",
    "America/Nipigon",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Ojinaga",
    "America/Panama",
    "America/Pangnirtung",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Johns",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Thunder_Bay",
    "America/Tijuana",
    "America/Toronto",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "America/Yellowknife",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Nicosia",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qostanay",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Helsinki",
    "Europe/Istanbul",
    "Europe/Kaliningrad",
    "Europe/Kiev",
    "Europe/Kirov",
    "Europe/Lisbon",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Uzhgorod",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zaporozhye",
    "Europe/Zurich",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Enderbury",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis",
  ];

  const [isFreeEvent, setisFreeEvent] = useState(false);
  const [isUnlimited, setisUnlimited] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [location, setlocation] = useState(false);
  const [eventLink, seteventLink] = useState(false);
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [lockId, setLockId] = useState();

  const [error, seterror] = useState(false);

  const handleImageChange = (event) => {
    // Update the state
    setSelectedPost({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  // Set the minimum end date to the start date
  const handleStartDateChange = (event) => {
    setstartDate(event.target.value);
    setendDate((prevEndDate) => {
      if (
        prevEndDate === "" ||
        new Date(prevEndDate) > new Date(event.target.value)
      ) {
        return prevEndDate;
      }
      return event.target.value + 10;
    });
  };

  // Validate the end date
  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    if (new Date(newEndDate) <= new Date(startDate)) {
      alert("End date must be later than start date");
      return;
    }
    setendDate(newEndDate);
  };

  const abis = require("@unlock-protocol/contracts");

  // Wrapping all calls in an async block
  const run = async () => {
    handleSubmit();
    console.log(startDate, endDate, timezone, ticketPrice, totalTickets);

    // Set the start and end dates
    const _startDate = new Date(startDate);
    const _endDate = new Date(endDate);
    const diffInMilliseconds = _endDate - _startDate;
    const diffInDays = diffInMilliseconds / (1000 * 3600 * 24);
    console.log(diffInMilliseconds, diffInDays); // Output: 3
    console.log(diffInDays * 60 * 60 * 24);
    // Here we use a Rinkeby provider. We will be able to read the state, but not send transactions.
    // const provider = new ethers.providers.JsonRpcProvider(
    //   "https://rpc.unlock-protocol.com/5"
    // );

    // This time, we also need a signer.
    // Note: we sent some fake Eth to this address, but please replace with your own!

    //const instance = await State.database.web3Modal.connect();
    if (!State.database.provider)
      alert("You need to connect to a web3 wallet to use this feature!");
    const provider = State.database.provider;
    console.log("PROVIDER:", provider);
    const signer = provider.getSigner();
    console.log("SIGNER:", signer);
    const Address = await signer.getAddress();
    console.log("ADDRESS", Address);
    // On goerli Unlock is at 0x627118a4fB747016911e5cDA82e2E77C531e8206
    const PolygonMainnet = "0xE8E5cd156f89F7bdB267EabD5C43Af3d5AF2A78f";
    const Mumbai = "0x1FF7e338d5E582138C46044dc238543Ce555C963";
    const address =
      process.env.NODE_ENV === "development" ? Mumbai : PolygonMainnet;

    // Instantiate the Unlock contract
    const unlock = new ethers.Contract(address, abis.UnlockV11.abi, signer);

    // Lock params:
    const lockInterface = new ethers.utils.Interface(abis.PublicLockV11.abi);

    const params = lockInterface.encodeFunctionData(
      "initialize(address,uint256,address,uint256,uint256,string)",
      [
        Address,
        diffInMilliseconds, // 30 days in seconds
        ethers.constants.AddressZero, // We use the base chain currency
        ethers.utils.parseUnits(ticketPrice.length > 0 ? ticketPrice : "0", 18), // 0.01 Eth
        totalTickets,
        name,
      ]
    );

    const transaction = await unlock.createUpgradeableLockAtVersion(params, 11);
    console.log(transaction.hash);
    const receipt = await transaction.wait();
    const lockAddress = receipt.logs[0].address;
    console.log(lockAddress);
    setLockId(lockAddress);
    handleSubmit(lockAddress);
  };

  const handleSubmit = (lockId) => {
    //e.preventDefault();
    setUploadingEvent(true);
    console.log(name);
    if (name.length > 1 && lockId) {
      let data = {
        title: name,
        type: type,
        category: Category,
        freeEvent: isFreeEvent,
        ticketPrice: ticketPrice,
        unlimitedTickets: isUnlimited,
        ticketCount: totalTickets,
        description: description,
        startTime: startDate,
        endTime: endDate,
        timeZone: timezone,
        eventImage: selectedPost,
        eventGallery: "",
        eventHost: State.database.walletAddress,
        eventUrl: eventLink,
        location: location,
        lockId: lockId,
        chainId: "80001",
      };
      console.log(data);

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/user/addevent`, data, {
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
          },
        })
        .then(async (res) => {
          State.toast("success", "Your event uploaded successfully!");
          //await clearState();
        })
        .catch((err) => {
          State.toast("error", "Oops!somthing went wrong uploading event!");
          console.log(err);
          //clearState();
        });
    }
  };

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
      <div className="w-full p-4 flex items-center justify-end   max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("../marketPlace")}
          className="flex w-fit justify-center items-center text-brand3 font-semibold"
        >
          {/* <ChevronLeft /> */}
          Cancel
        </button>
      </div>{" "}
      <div className="flex-grow flex flex-col w-full p-4 overflow-y-auto max-w-2xl md:rounded-lg gap-2 text-brand3 bg-slate-100 dark:bg-slate-800">
        {step !== 1 && (
          <button
            onClick={() => setstep(step - 1)}
            className="flex justify-start items-center gap-2 text-brand3 font-semibold"
          >
            <ArrowLeft />
            Previous step
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
        ></progress>{" "}
        {error && (
          <div className="alert alert-error shadow-lg text-white">
            <div>
              <AlertTriangle />
              <span className="font-semibold">
                Please fill all the details.
              </span>
            </div>
          </div>
        )}
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
              <div className="">
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
                name && type && Category ? seterror(false) : seterror(true);
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
              <label className="ml-2 text-sm font-bold">Event Start Time</label>
              <input
                value={startDate}
                onChange={(e) => handleStartDateChange(e)}
                className="w-full input"
                type={"datetime-local"}
                min={moment().format("YYYY-MM-DDThh:mm")}
                required={true}
              />
            </div>{" "}
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event End Time</label>
              <input
                value={endDate}
                onChange={(e) => handleEndDateChange(e)}
                className="w-full input"
                type={"datetime-local"}
                min={startDate}
                required={true}
              />
            </div>{" "}
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Timezone</label>
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
                <div className="flex flex-wrap w-full gap-2">
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
                description &&
                  startDate &&
                  endDate &&
                  timezone &&
                  selectedPost &&
                  setstep(3);

                description && startDate && endDate && timezone && selectedPost
                  ? seterror(false)
                  : seterror(true);
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
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                  type="text"
                  placeholder="Location of event"
                  className="textarea textarea-bordered w-full flex-grow"
                />
              </div>
            ) : (
              <div className="mt-2 ">
                <label className="ml-2 text-sm font-bold">Event Link</label>
                <input
                  value={eventLink}
                  onChange={(e) => seteventLink(e.target.value)}
                  type="text"
                  placeholder="Link of event"
                  className="input input-bordered w-full flex-grow"
                />
              </div>
            )}

            <button
              onClick={() => {
                type === "In-person" && location ? setstep(4) : seterror(true);
                type !== "In-person" && eventLink ? setstep(4) : seterror(true);

                type === "In-person" && location && seterror(false);
                type !== "In-person" && eventLink && seterror(false);
              }}
              className="mt-2 btn gap-2 btn-brand capitalize"
            >
              Review Details <ArrowNarrowRight />
            </button>
          </>
        )}
        {step === 4 && (
          <>
            <EventCard
              type={type}
              Category={Category}
              isFreeEvent={isFreeEvent}
              selectedPostImg={selectedPost.localurl}
              name={name}
              userImg={
                State.database.userData.data?.user.profile_image
                  ? State.database.userData.data.user.profile_image
                  : coverImage
              }
              username={
                State.database.userData.data?.user.username
                  ? State.database.userData.data.user.username
                  : "loading..."
              }
              description={description}
            />
            {/* <div className="mx-auto relative h-fit w-96  rounded-lg bg-white dark:bg-slate-700 hover:scale-105 transition-all ease-in-out shadow-md overflow-hidden">
              <div className=" absolute flex items-center gap-1  top-2 left-2 w-fit">
                <div className=" bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
                  {type}
                </div>
                <div className=" bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
                  {Category}
                </div>
              </div>
              {isFreeEvent && (
                <div className="absolute right-2 top-2 w-fit bg-teal-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
                  free
                </div>
              )}
              <img
                className="aspect-video w-full object-cover rounded-t-md"
                src={`${selectedPost.localurl}`}
                alt="banner"
              />
             
              <div className="flex items-center w-full space-x-2 my-1  py-3 px-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={selectedPost.localurl}
                  alt="user profile"
                />
                <div className=" ">
                  <p className="w-48 text-lg font-semibold text-brand1 truncate">
                    {name}
                  </p>
                  <p className="text-base font-normal text-brand3">
                    {State.database.userData.data?.user.username
                      ? State.database.userData.data.user.username
                      : "loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full space-x-2 mb-1  pb-1 px-4">
                <p className="flex flex-col items-center w-fit my-1 px-4 text-lg font-semibold text-success  ">
                  <span className="font-bold text-2xl">14</span> Dec
                </p>
                <span className="h-8 w-1 bg-slate-200 dark:bg-slate-600 rounded-full"></span>
                <p className="flex-grow px-4  h-12  text-ellipsis  overflow-hidden text-base font-normal text-brand4">
                  {description}
                </p>
              
              </div>
             
            </div>*/}
            <button
              onClick={() => {
                run();
              }}
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
