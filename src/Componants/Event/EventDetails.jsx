import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Share, Ticket } from "tabler-icons-react";
import { UserContext } from "../../Store";

function EventDetails(lockAddress) {
  const ethers = require("ethers");
  const abis = require("@unlock-protocol/contracts");
  const State = useContext(UserContext);
  const params = useParams();
  // Wrapping all calls in an async block
  const run = async () => {
    if (!State.database.provider)
      alert("You need to connect to a web3 wallet to use this feature!");
    const provider = State.database.provider;
    console.log("PROVIDER:", provider);

    const signer = provider.getSigner();
    console.log("SIGNER:", signer);

    const Address = await signer.getAddress();
    console.log("ADDRESS", Address);

    console.log(params.lockId);
    // const lockAddress =
    //   process.env.NODE_ENV === "development" ? Mumbai : PolygonMainnet;

    // Let's go purchase the membership for this lock
    const lock = new ethers.Contract(
      params.lockId,
      abis.PublicLockV11.abi,
      signer
    );

    // If the lock was using an ERC20 as currency, we would need to send an approval transaction on the ERC20 contract first...

    // Let's get the key price so we know how much we need to send (we could send more!)
    const amount = await lock.keyPrice();

    console.log(amount);
    // Purchase params:
    // The purchase function in v11 supports making multiple purchases... here we just pass a single one.
    const purchaseParams = [
      [amount],
      [Address], // This is the recipient of the membership (us!)
      [Address], // The is the referrer who will earn UDT tokens (we'd like this to be us!)
      [ethers.constants.AddressZero], // The key manager. if 0x0, then it is the recipient by default
      [[]], // empty data object (not used here)
    ];

    const options = {
      value: amount, // This is a lock that uses Ether, so it means we need send value. If it was an ERC20 we could set this to 0 and just use the amount on purchase's first argument
    };

    // We can now send transactions to modify the state of the lock, like purchase a key!
    const transaction = await lock.purchase(...purchaseParams, options);
    console.log(transaction.hash);
    const receipt = await transaction.wait();
    console.log(receipt);
  };

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  return (
    <div className="flex flex-col gap-2 md:gap-4 py-24   w-screen h-screen  bg-white dark:bg-slate-900 overflow-auto">
      <div className="mx-auto w-full flex justify-between items-center max-w-2xl">
        <div className="flex flex-col gap-2 px-2">
          <span className="flex items-center gap-3 text-2xl font-bold text-brand1">
            Event name{" "}
            <div className="tooltip tooltip-right " data-tip="Share">
              <Share className="text-brand5 cursor-pointer" size={16} />
            </div>
          </span>
          <span className="text-base font-semibold text-success">
            19 NOV 2022, 4:00 PM - 7:00 PM
          </span>
          <div className="flex gap-2">
            <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
              Online
            </div>
            <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
              Meetup
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-start     items-start max-w-2xl">
        <img
          className="aspect-video w-full object-cover rounded-lg"
          src={
            "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
          }
          alt="banner"
        />
        <div className="flex gap-2 overflow-auto">
          <img
            className="aspect-video h-16 object-cover rounded-lg"
            src={
              "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
            }
            alt="banner"
          />{" "}
          <img
            className="aspect-video h-16 object-cover rounded-lg"
            src={
              "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
            }
            alt="banner"
          />{" "}
          <img
            className="aspect-video h-16 object-cover rounded-lg"
            src={
              "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
            }
            alt="banner"
          />
        </div>
      </div>
      <div className="flex   gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-between items-center max-w-2xl">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={
              "data:image/jpeg;base64,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"
            }
            alt="user profile"
          />
          <div className=" ">
            <p className="  text-lg font-semibold text-brand1 truncate">
              Username
            </p>
            <p className="text-base font-normal text-brand3">John Peter</p>
          </div>
        </div>
        <button
          onClick={run}
          className="btn btn-sm sm:btn-md btn-brand rounded-full capitalize"
        >
          Register for free
        </button>
      </div>
      <div className="flex   gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-between items-center max-w-2xl">
        <progress
          className="progress progress-success progres w-2/3"
          value="10"
          max="100"
        ></progress>
      </div>
    </div>
  );

  {
    /* return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
        <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> 
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <Link
          to={"../marketPlace"}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </Link>
        <span className="text-xl font-bold text-brand1 mx-auto -translate-x-8"></span>
          <span
          onClick={() => setwalletModalOpen(true)}
          className="  text-brand1 "
        >
          <Wallet />
        </span>  
      </div>{" "}
      <div className="flex-grow flex flex-col w-full py-4 overflow-y-auto max-w-2xl gap-2">
        <div className="mx-auto w-full flex justify-between items-center max-w-2xl">
          <div className="flex flex-col gap-2 px-2">
            <span className="flex items-center gap-3 text-2xl font-bold text-brand1">
              Event name{" "}
              <div className="tooltip tooltip-right " data-tip="Share">
                <Share className="text-brand5 cursor-pointer" size={16} />
              </div>
            </span>
            <span className="text-base font-semibold text-success">
              19 NOV 2022, 4:00 PM - 7:00 PM
            </span>
            <div className="flex gap-2">
              <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
                Online
              </div>
              <div className="w-fit bg-slate-700/60 backdrop-blur-sm rounded-full px-2 text-slate-100 text-sm font-semibold">
                Meetup
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-start     items-start max-w-2xl">
          <img
            className="aspect-video w-full object-cover rounded-lg"
            src={
              "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
            }
            alt="banner"
          />
          <div className="flex gap-2 overflow-auto">
            <img
              className="aspect-video h-16 object-cover rounded-lg"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />{" "}
            <img
              className="aspect-video h-16 object-cover rounded-lg"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />{" "}
            <img
              className="aspect-video h-16 object-cover rounded-lg"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />
          </div>
        </div>
        <div className="flex   gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-between items-center max-w-2xl">
          <div className="flex items-center gap-2">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={
                "data:image/jpeg;base64,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"
              }
              alt="user profile"
            />
            <div className=" ">
              <p className="  text-lg font-semibold text-brand1 truncate">
                Username
              </p>
              <p className="text-base font-normal text-brand3">John Peter</p>
            </div>
          </div>{" "}
          <button className="btn btn-sm sm:btn-md btn-brand rounded-full capitalize">
            Register for free
          </button>
        </div>
        <div className="flex   gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-between items-center max-w-2xl">
          <progress
            className="progress progress-success progres w-2/3"
            value="10"
            max="100"
          ></progress>

          <span className="flex items-center gap-1 w-fit text-sm font-semibold text-brand1">
            <Ticket className="text-success -rotate-45" />
            34 Tickets left
          </span>
        </div>
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Description</span>
          <p className="text-base font-normal text-brand1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sints
          </p>
        </div>{" "}
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Link</span>
          <p className="text-base font-normal text-brand1">link.com</p>
        </div>
        <div className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 sm:rounded-xl p-2 sm:p-4 mx-auto w-full justify-start items-start max-w-2xl">
          <span className="text-lg font-semibold text-brand1">Location</span>
          <img
            className="aspect-video w-full object-cover rounded-lg"
            src={
              "https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png"
            }
            alt="banner"
          />
        </div>
      </div>
    </div>
          );  */
  }
}

export default EventDetails;
