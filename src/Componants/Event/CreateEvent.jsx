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
  CircleCheck,
  Confetti,
  File,
  FileCheck,
  Loader,
  Photo,
} from "tabler-icons-react";
import { UserContext } from "../../Store";
import coverImage from "../../Assets/backgrounds/cover.png";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom";
import {
  mintNFTOnSolana2,
  signTransactionKeyWallet,
  signTransactionWithWallet,
  signTransactionWithWalletAndSend,
  signWithRelayer,
} from "../../Helper/mintOnSolana2";
import { uploadFile } from "../../Helper/uploadHelper";
import { sanitizeFilename } from "../../functions/sanitizeFilename";
import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";
import CustomImageInput from "../../Helper/CustomImageInput";
const { ethereum } = window;
function CreateEvent() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();

  const [step, setstep] = useState(1);

  const [type, settype] = useState("");
  const [name, setname] = useState("");
  const [nameError, setnameError] = useState(null);
  const [Category, setCategory] = useState("");
  const [ticketPrice, setticketPrice] = useState(0);
  const [totalTickets, settotalTickets] = useState("");

  const [description, setdescription] = useState("");
  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [timezone, settimezone] = useState("");

  const timezones = [
    "Baker Island, Howland Island",
    "Samoa, Midway Atoll",
    "Hawaii, Aleutian Islands",
    "Alaska",
    "Pacific Time (US and Canada)",
    "Mountain Time (US and Canada)",
    "Central Time (US and Canada), Mexico City",
    "Eastern Time (US and Canada), Bogota, Lima",
    "Atlantic Time (Canada), Caracas, La Paz",
    "Newfoundland",
    "Brasilia, Buenos Aires, Greenland",
    "Mid-Atlantic",
    "Azores, Cape Verde Islands",
    "Western Europe Time, London, Lisbon, Casablanca",
    "Central European Time, Brussels, Copenhagen, Madrid",
    "Eastern European Time, Athens, Istanbul, Jerusalem",
    "Moscow, Baghdad, Nairobi",
    "Tehran",
    "Abu Dhabi, Muscat, Baku, Tbilisi",
    "Kabul",
    "Islamabad, Karachi, Yekaterinburg",
    "New Delhi, Mumbai, Kolkata",
    "Kathmandu",
    "Almaty, Dhaka, Novosibirsk",
    "Yangon",
    "Bangkok, Hanoi, Jakarta",
    "Beijing, Perth, Singapore, Taipei",
    "Eucla",
    "Tokyo, Seoul, Yakutsk",
    "Adelaide, Darwin",
    "Eastern Australia, Guam, Vladivostok",
    "Lord Howe Island",
    "Magadan, Solomon Islands, Vanuatu",
    "Norfolk Island",
    "Auckland, Fiji, Kamchatka",
    "Chatham Islands",
    "Samoa, Tonga",
    "Kiritimati",
  ];

  const [isFreeEvent, setisFreeEvent] = useState(false);
  const [isUnlimited, setisUnlimited] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [location, setlocation] = useState("");
  const [eventLink, seteventLink] = useState("");
  const [uploadingEvent, setUploadingEvent] = useState(false);
  const [lockId, setLockId] = useState();
  const [cid, setCid] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [error, seterror] = useState(false);

  const [stepper, setstepper] = useState({
    uploadingFile: false,
    creatingEvent: false,
    signingTransaction1: false,
    creartingMachine: false,
    signingTransaction2: false,
  });

  // const handleImageChange = (event) => {
  //   // Update the state
  //   const file = sanitizeFilename(event.target.files[0]);
  //   setSelectedPost({
  //     file: [file],
  //     localurl: URL.createObjectURL(event.target.files[0]),
  //   });
  // };
  // const handleThumbnailChange = (event) => {
  //   // Update the state
  //   const file = sanitizeFilename(event.target.files[0]);
  //   setThumbnail({
  //     file: [file],
  //     localurl: URL.createObjectURL(event.target.files[0]),
  //   });
  // };

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

  const handleSubmit = (lockId, cid) => {
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
        eventImage:
          "https://nftstorage.link/ipfs/" + cid + "/" + selectedPost.name,
        eventGallery: "",
        eventHost: State.database.walletAddress,
        eventUrl: eventLink,
        location: location,
        lockId: lockId,
        // chainId: "80001",
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
          State.toast("success", "Your event created successfully!");
          //await clearState();
          navigateTo("../marketPlace");
        })
        .catch((err) => {
          State.toast("error", "Oops!something went wrong uploading event!");
          uploadingEvent(false);
          console.log(err);
          //clearState();
        });
    }
  };
  const createCandyMachine = async (collection, metacid) => {
    let nftSolanaData = {
      network: process.env.REACT_APP_SOLANA_NETWORK,
      wallet: State.database.walletAddress,
      fee_payer: process.env.REACT_APP_FEEPAYER_WALLET,
      symbol: "FLICK",
      max_supply: 0,
      royalty: 0,
      collection: collection,
      // collection: "7KnYuwbcG3EDLBnpUTovGN1WjpB1WvvyNuMgjRezG33s",
      items_available: isUnlimited ? "8000000000" : totalTickets,
      bulk_item_settings: {
        name: `${name} ticket #$ID+1$`,
        uri: "https://nftstorage.link/ipfs/" + metacid + "/meta.json",
      },
      // amount: isUnlimited ? 0 : ticketPrice,
      groups: [
        {
          label: "ticket",
          guards: {
            solPayment: {
              amount: isFreeEvent ? 0 : ticketPrice,
              destination: State.database.walletAddress,
            },
            mintLimit: {
              limit: 1,
            },
          },
        },
      ],
      // creators: [
      //   { address: State.database.walletAddress, share: 90 },
      //   { address: "BeRmvLjhKRu11j7U2bB1stiuxZWbFfBMKkxcau7ACJqz", share: 10 },
      // ],
    };

    console.log(nftSolanaData);
    const res = await axios
      .post(`https://api.shyft.to/sol/v1/candy_machine/create`, nftSolanaData, {
        headers: {
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(res);
    return res;
  };

  function candyMachine(mint, cid) {
    const metadata = {
      name: "Mintflick events",
      symbol: "FLICK",
      description: description,
      seller_fee_basis_points: 500,
      external_url:
        "https://nftstorage.link/ipfs/" + cid + "/" + selectedPost.name,
      image: "https://nftstorage.link/ipfs/" + cid + "/" + selectedPost.name,
      attributes: [{ trait_type: "Event", value: name }],
      properties: {
        files: [
          {
            uri:
              "https://nftstorage.link/ipfs/" + cid + "/" + selectedPost.name,
            type: "image/jpeg",
          },
        ],
      },
    };

    function convertBlobToFile(blob, fileName) {
      blob.lastModifiedDate = new Date();
      blob.name = fileName;
      return blob;
    }
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    var file = convertBlobToFile(blob, "meta.json");
    uploadFile([file])
      .then((metacid) =>
        createCandyMachine(mint, metacid)
          .then((response) => {
            console.log(response);
            response.data.success &&
              setstepper({
                uploadingFile: true,
                creatingEvent: true,
                signingTransaction1: true,
                creartingMachine: true,
                signingTransaction2: false,
              });

            response.data.success &&
              signTransactionKeyWallet(
                response.data.result.encoded_transaction,
                process.env.REACT_APP_FEEPAYER_PRIVATEKEY,
                State.database.provider
              )
                .then((res) => {
                  res
                    ? setstepper({
                        uploadingFile: true,
                        creatingEvent: true,
                        signingTransaction1: true,
                        creartingMachine: true,
                        signingTransaction2: true,
                      })
                    : setUploadingEvent(false);
                  res
                    ? handleSubmit(response.data?.result?.candy_machine, cid)
                    : setstep(4);
                })
                .catch((error) => {
                  console.log(error);
                  setUploadingEvent(false);
                  setstep(4);
                  State.toast(
                    "error",
                    "Error while sending transaction to blockchain,please try again!"
                  );
                  setstepper({
                    uploadingFile: false,
                    creatingEvent: false,
                    signingTransaction1: false,
                    creartingMachine: false,
                    signingTransaction2: false,
                  });
                });

            // response.data.success &&
            //   signTransactionWithWalletAndSend(
            //     response.data.result.encoded_transaction,
            //     State.database.provider
            //   )
            //     .then((res) => {
            //       res
            //         ? setstepper({
            //             uploadingFile: true,
            //             creatingEvent: true,
            //             signingTransaction1: true,
            //             creartingMachine: true,
            //             signingTransaction2: true,
            //           })
            //         : setUploadingEvent(false);
            //       res
            //         ? handleSubmit(response.data?.result?.candy_machine, cid)
            //         : setstep(4);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       setUploadingEvent(false);
            //       setstep(4);
            //       State.toast(
            //         "error",
            //         "Error while sending transaction to blockchain,please try again!"
            //       );
            //       setstepper({
            //         uploadingFile: false,
            //         creatingEvent: false,
            //         signingTransaction1: false,
            //         creartingMachine: false,
            //         signingTransaction2: false,
            //       });
            //     });
          })
          .catch((error) => {
            console.log(error);
            setUploadingEvent(false);
            setstep(4);
            State.toast(
              "error",
              "Error while setting up ticket counter,please try again!"
            );
            setstepper({
              uploadingFile: false,
              creatingEvent: false,
              signingTransaction1: false,
              creartingMachine: false,
              signingTransaction2: false,
            });
          })
      )
      .catch((error) => {
        console.log(error);
        setUploadingEvent(false);
        setstep(4);
        setstepper({
          uploadingFile: false,
          creatingEvent: false,
          signingTransaction1: false,
          creartingMachine: false,
          signingTransaction2: false,
        });
        State.toast(
          "error",
          "Error while uploading metadata,please try again!"
        );
      });
  }

  function createOnSolana() {
    setstep(5);
    setUploadingEvent(true);

    uploadFile([thumbnail])
      .then(async (cid) => {
        setCid(cid);
        setstepper({
          uploadingFile: true,
          creatingEvent: false,
          signingTransaction1: false,
          creartingMachine: false,
          signingTransaction2: false,
        });

        mintNFTOnSolana2(
          State.database.walletAddress,
          name,
          description,
          "https://nftstorage.link/ipfs/" + cid + "/" + selectedPost.name,
          selectedPost,
          [
            {
              trait_type: "Organizer",
              value: State.database.walletAddress,
            },
            {
              trait_type: "Category",
              value: Category,
            },
            {
              trait_type: "Type",
              value: type,
            },
          ]
        )
          .then((mintRequest) => {
            setstepper({
              uploadingFile: true,
              creatingEvent: true,
              signingTransaction1: false,
              creartingMachine: false,
              signingTransaction2: false,
            });

            console.log(mintRequest);
            signTransactionKeyWallet(
              mintRequest.data.result.encoded_transaction,
              process.env.REACT_APP_FEEPAYER_PRIVATEKEY,
              State.database.provider
            )
              .then((response) => {
                setstepper({
                  uploadingFile: true,
                  creatingEvent: true,
                  signingTransaction1: true,
                  creartingMachine: false,
                  signingTransaction2: false,
                });

                console.log(response);

                setCollectionId(mintRequest.data.result.mint);
                candyMachine(mintRequest.data.result.mint, cid);
              })
              .catch((error) => {
                console.log(error);
                setstep(4);

                State.toast(
                  "error",
                  "Error while signing transaction,please try again!"
                );
                setUploadingEvent(false);
                setstep(4);

                setstepper({
                  uploadingFile: false,
                  creatingEvent: false,
                  signingTransaction1: false,
                  creartingMachine: false,
                  signingTransaction2: false,
                });
              });
            // signTransactionWithWallet(
            //   mintRequest.data.result.encoded_transaction,
            //   State.database.provider
            // )
            //   .then((signedTx) => {
            //     signWithRelayer(signedTx)
            //       .then((response) => {
            //         State.toast("success", "Event created successfully");
            //         handleSubmit(mintRequest.data.result.mint, cid);
            //       })
            //       .catch((error) => {
            //         State.toast(
            //           "error",
            //           "Gas Station Signing transaction failed!"
            //         );
            //         setUploadingEvent(false);
            //       });
            //   })
            //   .catch((error) => {
            //     State.toast("error", "Signing transaction with wallet failed!");
            //     setUploadingEvent(false);
            //   });
          })
          .catch((error) => {
            State.toast(
              "error",
              "Error while creating mint request,please try again!"
            );
            setUploadingEvent(false);
            setstep(4);

            setstepper({
              uploadingFile: false,
              creatingEvent: false,
              signingTransaction1: false,
              creartingMachine: false,
              signingTransaction2: false,
            });
          });
      })
      .catch((error) => {
        State.toast("error", "Error while uploading image,please try again!");
        setUploadingEvent(false);
        setstep(4);

        setstepper({
          uploadingFile: false,
          creatingEvent: false,
          signingTransaction1: false,
          creartingMachine: false,
          signingTransaction2: false,
        });
      });
  }

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  return (
    <div className="flex flex-col items-center w-screen h-full bg-white lg:px-12 lg:pt-24 dark:bg-slate-900">
      <div className="flex items-center justify-start w-full max-w-2xl p-4 mx-auto">
        {step !== 1 && (
          <button
            onClick={() => setstep(step - 1)}
            className="flex items-center justify-start gap-2 font-semibold text-brand3"
          >
            <ChevronLeft />
            Previous step
          </button>
        )}{" "}
        <button
          onClick={() => navigateTo("../marketPlace")}
          className="flex items-center justify-center ml-auto font-semibold w-fit text-brand3"
        >
          {/* <ChevronLeft /> */}
          Cancel
        </button>
      </div>{" "}
      <div className="flex flex-col flex-grow w-full max-w-2xl gap-2 p-4 overflow-y-auto md:rounded-lg text-brand3 bg-slate-100 dark:bg-slate-800">
        <span className="flex my-2 text-3xl font-bold text-brand-gradient">
          {step === 1 && "Event Details"}
          {step === 2 && "Some more Details"}
          {step === 3 && "Almost Done"}
          {step === 4 && "Review"}
          {step === 5 && "Creating event"}
        </span>
        <progress
          className="w-full progress progress-success "
          value={step * 25}
          max="100"
        ></progress>
        {step === 1 && (
          <>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    e.target.value.length > 32
                      ? setnameError("Event name is too long!")
                      : setnameError(null);
                    setname(e.target.value);
                  }}
                  placeholder="Name of event"
                  className="flex-grow w-full input input-bordered"
                />
                <div
                  className="absolute right-3 top-3 radial-progress text-brand3"
                  style={{
                    "--value": `${(name.length * 100) / 32}`,
                    "--size": "24px",
                    "--thickness": "4px",
                  }}
                ></div>
              </div>
              <div className="flex items-center justify-between w-full mx-2 text-sm font-semibold ">
                <label className=" text-error">{nameError}</label>
                <label className="mr-4 text-brand4">{`${name.length}/32`}</label>
              </div>
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">Event Type</label>
              <select
                onChange={(e) => settype(e.target.value)}
                className="block w-full font-semibold select"
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
                className="block w-full font-semibold select"
              >
                <option disabled selected>
                  Category of event
                </option>
                <option>Party</option>
                <option>Meetup</option>
              </select>
            </div>
            <label className="gap-2 cursor-pointer label w-fit ">
              <span className="text-brand3">Is it a free event?</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={isFreeEvent}
                onChange={() => setisFreeEvent(!isFreeEvent)}
              />
            </label>
            {!isFreeEvent && (
              <div className="">
                <label className="ml-2 text-sm font-bold">Ticket Price</label>
                <input
                  value={ticketPrice}
                  onChange={(e) => setticketPrice(parseFloat(e.target.value))}
                  type="number"
                  placeholder="Price of a ticket"
                  className="flex-grow w-full input input-bordered"
                />
              </div>
            )}

            <label className="gap-2 cursor-pointer label w-fit ">
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
                  className="flex-grow w-full input input-bordered"
                />
              </div>
            )}

            <button
              onClick={() => {
                name && type && Category && setstep(2);
                name && type && Category ? seterror(false) : seterror(true);
              }}
              className="gap-2 mt-2 capitalize btn btn-brand"
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
                className="flex-grow w-full textarea textarea-bordered"
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
              <label className="ml-2 text-sm font-bold">
                Event End Time (approx)
              </label>
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
                className="block w-full font-semibold select"
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
              <label className="ml-2 text-sm font-bold">NFT Ticket Image</label>
              <CustomImageInput
                setImage={setSelectedPost}
                label="Choose NFT image"
                aspect={16 / 9}
                cropShape="rect"
                showGrid={false}
                compression={0.5}
              />
            </div>
            <div className="mt-2 ">
              <label className="ml-2 text-sm font-bold">
                Event Thumbnail Image
              </label>
              <CustomImageInput
                setImage={setThumbnail}
                label="Choose Thumbnail image"
                aspect={16 / 9}
                cropShape="rect"
                showGrid={false}
                compression={0.5}
              />
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
              className="gap-2 mt-2 capitalize btn btn-brand"
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
              <div className="flex items-center justify-start h-10 my-2">
                <img
                  className="object-cover w-10 h-10 rounded-full"
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
                  className="flex-grow w-full textarea textarea-bordered"
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
                  className="flex-grow w-full input input-bordered"
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
              className="gap-2 mt-2 capitalize btn btn-brand"
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
              selectedPostImg={URL.createObjectURL(thumbnail)}
              name={name}
              startDate={startDate}
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

            {/* <div className="relative mx-auto overflow-hidden transition-all ease-in-out bg-white rounded-lg shadow-md h-fit w-96 dark:bg-slate-700 hover:scale-105">
              <div className="absolute flex items-center gap-1 top-2 left-2 w-fit">
                <div className="px-2 text-sm font-semibold rounded-full bg-slate-700/60 backdrop-blur-sm text-slate-100">
                  {type}
                </div>
                <div className="px-2 text-sm font-semibold rounded-full bg-slate-700/60 backdrop-blur-sm text-slate-100">
                  {Category}
                </div>
              </div>
              {isFreeEvent && (
                <div className="absolute px-2 text-sm font-semibold rounded-full right-2 top-2 w-fit bg-teal-700/60 backdrop-blur-sm text-slate-100">
                  free
                </div>
              )}
              <img
                className="object-cover w-full aspect-video rounded-t-md"
                src={`${selectedPost.localurl}`}
                alt="banner"
              />
             
              <div className="flex items-center w-full px-4 py-3 my-1 space-x-2">
                <img
                  className="w-10 h-10 rounded-full"
                  src={selectedPost.localurl}
                  alt="user profile"
                />
                <div className="">
                  <p className="w-48 text-lg font-semibold truncate text-brand1">
                    {name}
                  </p>
                  <p className="text-base font-normal text-brand3">
                    {State.database.userData.data?.user.username
                      ? State.database.userData.data.user.username
                      : "loading..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full px-4 pb-1 mb-1 space-x-2">
                <p className="flex flex-col items-center px-4 my-1 text-lg font-semibold w-fit text-success ">
                  <span className="text-2xl font-bold">14</span> Dec
                </p>
                <span className="w-1 h-8 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                <p className="flex-grow h-12 px-4 overflow-hidden text-base font-normal text-ellipsis text-brand4">
                  {description}
                </p>
              
              </div>
             
            </div>*/}
            <button
              onClick={() => {
                // run();
                createOnSolana();
              }}
              className={`${
                uploadingEvent ? "loading" : ""
              } mt-2 btn gap-2 btn-brand capitalize`}
            >
              Publish event <Confetti />
            </button>
          </>
        )}
        {step === 5 && (
          <div className="flex flex-col items-center justify-start gap-2">
            <div
              className={`flex items-center gap-2 w-full bg-slate-300 dark:bg-slate-700 p-4 rounded-lg text-lg font-semibold ${
                stepper.uploadingFile && "text-success"
              }`}
            >
              {stepper.uploadingFile ? (
                <CircleCheck />
              ) : (
                <Loader className="animate-spin" />
              )}
              Uploading file{" "}
            </div>
            <div
              className={`flex items-center gap-2 w-full bg-slate-300 dark:bg-slate-700 p-4 rounded-lg text-lg font-semibold ${
                stepper.creatingEvent && "text-success"
              }`}
            >
              {stepper.creatingEvent ? (
                <CircleCheck />
              ) : (
                <Loader className="animate-spin" />
              )}{" "}
              Creating event
            </div>
            <div
              className={`flex items-center gap-2 w-full bg-slate-300 dark:bg-slate-700 p-4 rounded-lg text-lg font-semibold ${
                stepper.signingTransaction1 && "text-success"
              }`}
            >
              {stepper.signingTransaction1 ? (
                <CircleCheck />
              ) : (
                <Loader className="animate-spin" />
              )}{" "}
              Signing transaction
            </div>{" "}
            <div
              className={`flex items-center   gap-2 w-full bg-slate-300 dark:bg-slate-700 p-4 rounded-lg text-lg font-semibold ${
                stepper.creartingMachine && "text-success"
              }`}
            >
              {stepper.creartingMachine ? (
                <CircleCheck />
              ) : (
                <Loader className="animate-spin" />
              )}{" "}
              Creating ticket counter
              {/* {!stepper.creartingMachine && (
                <div onClick={() => candyMachine(collectionId, cid)}>Retry</div>
              )} */}
            </div>{" "}
            <div
              className={`flex items-center gap-2 w-full bg-slate-300 dark:bg-slate-700 p-4 rounded-lg text-lg font-semibold ${
                stepper.signingTransaction2 && "text-success"
              }`}
            >
              {stepper.signingTransaction2 ? (
                <CircleCheck />
              ) : (
                <Loader className="animate-spin" />
              )}{" "}
              Signing transaction
            </div>
          </div>
        )}{" "}
        {error && (
          <div className="text-white shadow-lg alert alert-error">
            <div>
              <AlertTriangle />
              <span className="font-semibold">
                Please fill all the details.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateEvent;
