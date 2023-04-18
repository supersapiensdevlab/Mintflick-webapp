import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  CalendarEvent,
  Check,
  ChevronLeft,
  Loader,
  Qrcode,
  Refresh,
  RefreshDot,
  Scan,
  Share,
  Ticket,
  X,
} from "tabler-icons-react";
import SolanaToken from "../../Assets/logos/SolanaToken";
import {
  buyTicket,
  mintNFTOnSolana2,
  signTransactionKeyWallet,
  signTransactionWithKey,
  signTransactionWithWallet,
  signTransactionWithWalletAndSend,
  signWithRelayer,
} from "../../Helper/mintOnSolana2";
import emailTemp from "../../Hooks/emailTemp";
import { UserContext } from "../../Store";
import { sendMail } from "../Home/Utility/sendMail";
import Loading from "../Loading/Loading";
import ProfileCard from "../Profile/ProfileCard";
import ContentLoader from "react-content-loader";
import imgPlaceHolder from "../../Assets/profile-pic.png";
import { transactionWithFee } from "../Home/Utility/mintflickTransaction";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { decode } from "bs58";
import { Component } from "react";
import { QrReader } from "react-qr-reader";

import QRCode from "react-qr-code";
import {
  BrandInstagram,
  BrandLinkedin,
  BrandTwitter,
  ExternalLink,
} from "tabler-icons-react/dist";

function Booking(props) {
  const [info, setinfo] = useState(null);
  async function getBasicUserByWallet() {
    await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/user/shortDataWallet/${props.wallet}`,
    })
      .then((response) => {
        console.log(response);
        setinfo(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  useEffect(() => {
    getBasicUserByWallet();
  }, []);

  return info ? (
    <Link
      to={`/homescreen/profile/${info?.username}`}
      className="flex items-center gap-1 hover:opacity-80">
      <img
        className="w-10 rounded-full aspect-square"
        src={info?.profile_image || imgPlaceHolder}
        alt="Profile"
      />
      <div className="flex flex-col items-start ">
        <span className="text-base font-semibold text-brand1">
          {info?.name}
        </span>
        <span className="text-xs font-semibold text-brand4">
          {info?.wallet_id.slice(0, 6) +
            "..." +
            info?.wallet_id.slice(
              info?.wallet_id.length - 6,
              info?.wallet_id.length
            )}
        </span>
      </div>
    </Link>
  ) : (
    <div className="flex items-center gap-1 font-semibold text-brand3">
      <Loader className="text-brand2 animate-spin" />
      Loading
    </div>
  );
}

function EventDetails(lockAddress) {
  const ethers = require("ethers");
  const abis = require("@unlock-protocol/contracts");
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const [data, setData] = useState(null);
  const [mintedNfts, setmintedNfts] = useState(null);
  const [buying, setbuying] = useState(false);
  const [viewBookings, setviewBookings] = useState(false);
  const [bookings, setbookings] = useState([]);
  const [hostDetails, sethostDetails] = useState(null);
  const [loading, setloading] = useState(false);
  const [verify, setVerify] = useState(false);
  const [ticketVerified, setVerified] = useState([]);
  const [latestVerifiedTicketOwner, setLatestVerifiedTicketOwner] =
    useState(null);
  const [scannedTicket, setScannedTicket] = useState(null);
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  const [refreshLoading, setrefreshLoading] = useState(false);
  const [alreadyBought, setalreadyBought] = useState(false);
  const [ticketInfo, setticketInfo] = useState({});
  const [showQr, setshowQr] = useState(false);
  const [openReader, setopenReader] = useState(true);

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

    console.log(params.id);
    // const lockAddress =
    //   process.env.NODE_ENV === "development" ? Mumbai : PolygonMainnet;

    // Let's go purchase the membership for this lock
    const lock = new ethers.Contract(
      data.lockId,
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
  const mintTicket = async (collection, host) => {
    let nftSolanaData = data.freeEvent
      ? {
          network: process.env.REACT_APP_SOLANA_NETWORK,
          fee_payer: process.env.REACT_APP_FEEPAYER_WALLET,
          wallet: State.database.walletAddress,
          authority: host,
          candy_machine: collection,
          mint_group: "ticket",
        }
      : {
          network: process.env.REACT_APP_SOLANA_NETWORK,
          wallet: State.database.walletAddress,
          authority: host,
          candy_machine: collection,
          mint_group: "ticket",
        };

    console.log(nftSolanaData);

    const res = await axios
      .post(`https://api.shyft.to/sol/v1/candy_machine/mint`, nftSolanaData, {
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
  async function ticketBought(receipt) {
    if (receipt) {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/user/bookTicket`,
          {
            eventId: data.eventId,
            ticketId: receipt,
            ownerWallet: State.database.walletAddress,
          },
          {
            headers: {
              "content-type": "application/json",
              "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
            },
          }
        )
        .then(async (res) => {
          console.log(res);
          setData(res.data);
          setalreadyBought(true);
        })
        .catch((err) => {
          console.log(err);
          setalreadyBought(true);
        });
    } else {
      setalreadyBought(true);
    }
  }
  async function buyOnSolana() {
    setbuying(true);
    // const response = await fetch(data?.eventImage);
    // const blob = await response.blob();
    // const file = new File([blob], "image.jpg", {
    //   type: blob.type,
    // });
    mintTicket(data.lockId, data.eventHost)
      .then((mintRequest) => {
        console.log(mintRequest);
        console.log(mintRequest.data.result.encoded_transaction);

        mintRequest.data.success && data.freeEvent
          ? signTransactionWithKey(
              mintRequest.data.result.encoded_transaction,
              process.env.REACT_APP_FEEPAYER_PRIVATEKEY
            )
              .then((response) => {
                console.log(response);
                response && fetchData(params.id);
                response && ticketBought(mintRequest.data.result.mint);
                response
                  ? State.toast("success", "Ticket bought successfully!")
                  : State.toast("error", "Error while buying ticket!");
                const mailBody =
                  response &&
                  emailTemp(
                    mintRequest.data.result.mint,
                    data.title,
                    data.startTime,
                    data.location ? data.location : null,
                    data.eventUrl ? data.eventUrl : null,
                    null,
                    data.eventImage
                  );
                response &&
                  sendMail(
                    mailBody,
                    `[Important] Mintflick - ${data?.title}  ticket receipt`,
                    State.database.userData?.data?.user?.email
                  );
                setbuying(false);
              })
              .catch((error) => {
                console.log(error);
                State.toast(
                  "error",
                  "Error while signing transaction,please try again!"
                );
                setbuying(false);
              })
          : signTransactionWithWalletAndSend(
              mintRequest.data.result.encoded_transaction,
              State.database.provider
            )
              .then((response) => {
                console.log(response);
                response && fetchData(params.id);
                response && ticketBought(mintRequest.data.result.mint);
                response
                  ? State.toast("success", "Ticket bought successfully!")
                  : State.toast("error", "Error while buying ticket!");
                const mailBody =
                  response &&
                  emailTemp(
                    mintRequest.data.result.mint,
                    data.title,
                    data.startTime,
                    data.location ? data.location : null,
                    data.eventUrl ? data.eventUrl : null,
                    null,
                    data.eventImage
                  );
                response &&
                  sendMail(
                    mailBody,
                    `[Important] Mintflick - ${data?.title}  ticket receipt`,
                    State.database.userData?.data?.user?.email
                  );
                setbuying(false);
              })
              .catch((error) => {
                console.log(error);
                State.toast(
                  "error",
                  "Error while signing transaction,please try again!"
                );
                setbuying(false);
              });
        // signTransactionWithWallet(
        //   mintRequest.data.result.encoded_transaction,
        //   State.database.provider
        // )
        //   .then((signedTx) => {
        //     signWithRelayer(signedTx)
        //       .then((response) => {
        //         State.toast("success", "NFT Minted successfully");
        //       })
        //       .catch((error) => {
        //         State.toast("error", "Gas Station Signing transaction failed!");
        //         setbuying(false);
        //       });
        //   })
        //   .catch((error) => {
        //     State.toast("error", "Signing transaction with wallet failed!");
        //     setbuying(false);
        //   });
      })
      .catch((error) => {
        State.toast(
          "error",
          "Error while creating mint request,please try again!"
        );
        setbuying(false);
      });
  }
  async function fetchData(id) {
    setrefreshLoading(true);
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/event/${id}`
      );
      console.log("Event details:", response);
      setData(response.data);
      getMintedNfts(response.data.lockId);
      console.log("Verified Tickets:", response.data.verifiedTickets);
      let verifiedTickets = new Set(response.data.verifiedTickets);
      verifiedTickets = [...verifiedTickets];
      setVerified(verifiedTickets);
      getBookings(response.data.lockId, 1);
      getUserByWallet(response.data.eventHost);
      setrefreshLoading(false);
    } catch (error) {}
  }

  async function verifyTicket(ticketId) {
    console.log("Verifying", ticketId);
    setopenReader(false);
    if (ticketVerified.includes(ticketId)) {
      console.log("Already Verified");
      setAlreadyVerified(true);
    } else
      try {
        axios
          .post(
            `${process.env.REACT_APP_SERVER_URL}/user/verifyTicket`,
            { eventId: data.eventId, ticketId: ticketId },
            {
              headers: {
                "content-type": "application/json",
                "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
              },
            }
          )
          .then(async (res) => {
            console.log(ticketId);
            let verifiedTickets = new Set(res.verifiedTickets);
            verifiedTickets = [...verifiedTickets];

            setVerified(verifiedTickets);
            fetchData(params.id);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    getNftOwner(ticketId);
  }

  async function getNftOwner(mintId) {
    try {
      await axios({
        method: "post",
        url: `https://api.shyft.to/sol/v1/nft/get_owners`,
        data: {
          network: `${process.env.REACT_APP_SOLANA_NETWORK}`,
          nft_addresses: [mintId],
        },
        headers: {
          "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
          "content-type": "application/json",
        },
      }).then(async (response) => {
        setLatestVerifiedTicketOwner(response.data.result[0].owner);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function getMintedNfts(address) {
    const res = await axios
      .get(
        `https://api.shyft.to/sol/v1/candy_machine/nft_addresses?network=${process.env.REACT_APP_SOLANA_NETWORK}&address=${address}`,
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        res.data.success && setmintedNfts(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(res);
    return res;
  }

  async function getBookings(address, page) {
    const res = await axios
      .get(
        `https://api.shyft.to/sol/v1/candy_machine/nfts?network=${process.env.REACT_APP_SOLANA_NETWORK}&address=${address}&page=${page}`,
        {
          headers: {
            "x-api-key": `${process.env.REACT_APP_SHYFT_API_KEY}`,
            "content-type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);

        res.data.success && page !== 1
          ? setbookings([...bookings, ...res.data.result.nfts])
          : setbookings([...res.data.result.nfts]);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(res);
  }
  async function getUserByWallet(wallet) {
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: wallet,
      },
    })
      .then((response) => {
        console.log(response);
        sethostDetails(response.data.user);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  async function transferSol(ammount, receiver) {
    let tx;
    console.log(ammount);
    const feePayer = Keypair.fromSecretKey(
      decode(process.env.REACT_APP_FEEPAYER_PRIVATEKEY)
    );
    const connection = new Connection(process.env.REACT_APP_SOLANA_RPC);
    const blockhash = (await connection.getRecentBlockhash("finalized"))
      .blockhash;

    let transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: new PublicKey(process.env.REACT_APP_FEEPAYER_WALLET),
    }).add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(process.env.REACT_APP_FEEPAYER_WALLET),
        toPubkey: new PublicKey(receiver),
        lamports: Math.round(ammount * LAMPORTS_PER_SOL),
      })
    );
    await transaction.partialSign(feePayer);
    await connection
      .sendRawTransaction(transaction.serialize())
      .then((response) => {
        tx = response;
      });

    return tx;
  }
  async function withdrawSol(amount) {
    await transferSol(amount, data.eventHost)
      .then((receipt) => {
        console.log(receipt);
        if (receipt) {
          axios
            .post(
              `${process.env.REACT_APP_SERVER_URL}/user/withdraw`,
              { eventId: data.eventId },
              {
                headers: {
                  "content-type": "application/json",
                  "auth-token": JSON.stringify(
                    localStorage.getItem("authtoken")
                  ),
                },
              }
            )
            .then(async (res) => {
              console.log(res);
              setData(res.data);
            })
            .catch((err) => {
              console.log(err);
              setloading(false);
            });
        } else {
          setloading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        State.toast("error", "Transaction failed. Please try again");
        setloading(false);
      });
  }

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function getDayMonth(datee) {
    let dateTime = new Date(datee);
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth();
    var date = dateTime.getDate();
    var strTime = date + " " + monthList[month] + " " + year;
    return strTime;
  }
  function formatAMPM(datee) {
    let date = new Date(datee);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  useEffect(() => {
    params.id && fetchData(params.id);
    console.log(params.id);
  }, [params.id]);

  useEffect(() => {
    data?.bookings?.map((booking) => {
      booking.owner === State.database.walletAddress && setalreadyBought(true);
      booking.owner === State.database.walletAddress && setticketInfo(booking);
      return true;
    });
  }, [data]);

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);

  // return (
  //   <div className="flex flex-col w-screen h-screen gap-2 overflow-auto bg-white md:gap-4 dark:bg-slate-900">
  //     <div className="flex items-center w-full max-w-3xl p-4 mx-auto">
  //       <button
  //         onClick={() => navigateTo("../marketPlace")}
  //         className="flex items-center justify-center font-semibold text-brand3"
  //       >
  //         <ChevronLeft />
  //         Back
  //       </button>
  //       <span className="mx-auto text-xl font-bold text-brand1">
  //         Event name
  //       </span>
  //       <span
  //         // onClick={() => setwalletModalOpen(true)}
  //         className=" text-brand1"
  //       >
  //         <Share className="cursor-pointer " />
  //       </span>
  //     </div>{" "}
  //     <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
  //       <div className="flex flex-col gap-2 px-2">
  //         <div className="flex gap-2">
  //           <div className="px-2 text-sm font-semibold rounded-full w-fit bg-slate-700/60 backdrop-blur-sm text-slate-100">
  //             Online
  //           </div>
  //           <div className="px-2 text-sm font-semibold rounded-full w-fit bg-slate-700/60 backdrop-blur-sm text-slate-100">
  //             Meetup
  //           </div>
  //         </div>
  //         <span className="text-base font-semibold text-success">
  //           19 NOV 2022, 4:00 PM - 7:00 PM
  //         </span>
  //       </div>
  //     </div>
  //     <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
  //       <img
  //         className="object-cover w-full rounded-lg aspect-video"
  //         src={
  //           "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
  //         }
  //         alt="banner"
  //       />
  //       <div className="flex gap-2 overflow-auto">
  //         <img
  //           className="object-cover h-16 rounded-lg aspect-video"
  //           src={
  //             "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
  //           }
  //           alt="banner"
  //         />{" "}
  //         <img
  //           className="object-cover h-16 rounded-lg aspect-video"
  //           src={
  //             "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
  //           }
  //           alt="banner"
  //         />{" "}
  //         <img
  //           className="object-cover h-16 rounded-lg aspect-video"
  //           src={
  //             "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
  //           }
  //           alt="banner"
  //         />
  //       </div>
  //     </div>
  //     <div className="flex items-center justify-between w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
  //       <div className="flex items-center gap-2">
  //         <img
  //           className="object-cover w-10 h-10 rounded-full"
  //           src={
  //             "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAIwAXQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAUGBwIBAP/EADYQAAIBAwMCAwUGBgMBAAAAAAECAwAEEQUSIQYxQVFhEyJxgZEHFDKhwdEjM0JSseFiovAV/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECBAP/xAAdEQEBAQEBAQADAQAAAAAAAAAAARECMSEDEkEy/9oADAMBAAIRAxEAPwCxpHTCJXyLRlWqS+CV6EoiiugKAFsrhkpnbXLLQCbJQXT0p5loLrQEdJH6UpLFUo60tIlMIeaHPhSUkPNTUsdJyRc0EtaLRlFcqKKopKdAV7ivRVQ696nbSIUs7Ryt1MPecD+Wnn8fKi3BJqR1/qnT9Gk+7HfcXhGRBFyR5bj4f5qLg1/VbiD2qi0Uu2FypKKf7T4g+pqrGOO8iR7HLXcTq+ZWIZm8eee/+651XVZo1aV/b6fdbdrrLHlJfmD+eK49dW+Ok5k9XV+oZbFEbVbXYG4LRtnB/UfOn9O1Wx1VC1jcJIVOGXsy/EVjs3Vt9KvsrsRTx42uhHDj9D61FRXrWtx950+4mgkB90g8j09arnrr+l1J/G/utLyLUX0fqd1qelh75laVce8FwSD51MuK6OZCRKWePmpCRaXZeaYTq0VaEtFWg3Y7VgXUeo3F31PdXKly7TFUTPgOAP8A3nW+MGKNs/Fg7T61jn2f6aL/AKsmN6A5gyWz2Dbj/uuffyK4+3DeidOaxeusxtY7YMBgjcpI+AOPyq3DoN7u2CahcyugPCZwBV3judMslSOa4hUgYALAU+t/ZSJlZFI8xXD31p88jLJ/s502ONsKwIJxVM6q6POlWguIfe28sPStw1DV9JjYpJdwq/8AazgGqR1/cwy6S7W7JIrAglTnwpS2U7JZ9Vb7OdXZNRXTu6SqcjvggZyK0lxWL/ZyCer7MDnAdvltP7itqcVqjHSsgpdhzTcgpdxzVElloqmgoaItBjA8cd6yvQLK9TXL86aZIY5JpRIvG+RgSygeQxv8R2rU1NV2xsorPqG9LuSJnWdRnaUPI4I+f1I7Vz7vx1/HNqqanpesXku2S3sFcHkSEvL+dSOl6P1Uulag9rcWUaWsW4xzozszYyVUgjHGO/nV7vr4JGP4khdh7qgKST6e7TlpAkGivAX2tIp3sW3HJ5Jye9cddv0rDLuw1S6QXMtrasGII9rtDNnxBbNK3X35bfbEMAuIwmdyH6fWtQ0r3Y3tZmZQjkKFKsu3wwSDx6eHbwqI6uNnbW3tGZmdclAwUbeDk+6B4Z+ponQvGSqb9ni28PUNzNGX2pEVj34BwSM5+layjiSMMPGsW6euPulwZCMFuP1rUtBvRc2+N3NaIydT6k3oL96M9AfvVEkkNFU0BTRVNBjA1Vus2a0ktr2JyrMwifyxyQfqPzqzKarPXa+10l1zzkFfiO1T1NiuerzdiG03UJtP1WS91NZzEDtjkx7ijjnPrxVQ1PXdXtJ7uGx1KU2s0rsgEgOwE548qv3Ql6by0ktpGBdRtKNzj41x1RoWoyzIILO3MJOSRgY+VZufnrX/AKnqnaNrd6mkJYxiWWcOzq6ncVB8/Sg9QajOVCXRbeyKXXP4c8kVN3nttB0mUkIksg2hVqiXU8sx3SZ98kknxNVxNuuf5Osma6W4Yyhuw7ACr70heFQqk96z2MZYVcNCJj2EVojLWkq4Zc0NjzS1lNvhGaOTzTB5DRlNKI2aMp9aDMA1X+sEMmmyBe+KmwaT1WyluLViVKof6j4/ClbgzWW3U17pGqPc2blCeSAOG+NSL9cajJF75HbjB7GpTV7BZRkjmqvd6NHg4OP1rNLL61XmzxHajfXeqzj28xYg+6vgKW1JAiQBfwjI/wAVK21isIOMljxTkmmJcQLG4yDVTqSp/S2KtB+MfGrhpP8ALFc2HQ895vNrcAOnO2QcEfHwpuHTr3TjsvLd4vUjg/Ou3Nlmxn6lnyrBp0uFxmpLfmoC2kwak45Tt71RRKxvTlpDLcyBIELt6eFE0XRprtVmucxwnkDxb9qt9nbQ2sYSFAoHlS0ymnaFFCoe6/iSd9v9I/eveobM3FgxhX3o+6geFSoceNcS+anmpv2YqXLrJ7yPBIbxqv3qAEjFapq2iWt4WKn2Eh8Me6TVV1DpC7Zvdww/4sP1rheLGifklUhItzDFTVlp7SIp2mp+x6UliI9oiqBzuZhVksdPtrcA4Ezjtj8I/elOLRfySEtF002lrudcPJzjyFSoto5U2yKrAjkEZojHJ8/WiJXeTJjPbt1X9S6QtZ8yWjfd38hyv0qvXOj6jaSezaB3Hg0Y3A1oymuWxmq1ODo4AoolHnUOl2rRrMM7WXOPI+VFhdn70jSvtcihvIR2NBTgV6zUBxI5PelZIlzwoHw4o7HmuG7UAqYlBztGR4nk0VM+Jr04rxTigCGvN2K8LUN2oDoz44oU1yFk2+QoErgEc0puMtzNjnG0flQCtneD73LbHs38VPge4+uD86m7ScFeKz7S7qVpdEkLe9ImxvUYI/QVcLJjt7+NATqy5r0yDNIK7CMmhXkrx6dcSIxDiJiG8uKBbk0+ZM52kH1peWN5PxXUqDyjwv6E0nozMdLgJOSQSfqaLdzPFbySLjcqkjNF+FLs0CeyCkv/APTvYsc5MwI+hBFeW1xLGGIu0vkHIChRIB8uD9BWQ3Wq3c0txNPIZXkIY7ySAQeOPTPY8VGAlCHQlWHYjgio1TfIbyK4gSaBw8bjKsPGhyz4rOehNavmmFnLMZYWkVQH5K5DE4PyHertcOwzzVS/CcXtyBg57GojUepLXRrlhc5Jlxjbz2A/eltdnkRCVPiKr+rxLdavKZRnbFHj/tTD/9k="
  //           }
  //           alt="user profile"
  //         />
  //         <div className="">
  //           <p className="text-lg font-semibold truncate text-brand1">
  //             Username
  //           </p>
  //           <p className="text-base font-normal text-brand3">John Peter</p>
  //         </div>
  //       </div>
  //       <button
  //         onClick={run}
  //         className="capitalize rounded-full btn btn-sm sm:btn-md btn-brand"
  //       >
  //         Register for free
  //       </button>
  //     </div>
  //     <div className="flex items-center justify-between w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
  //       <progress
  //         className="w-2/3 progress progress-success progres"
  //         value="10"
  //         max="100"
  //       ></progress>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex w-screen h-screen lg:pt-24 bg-slate-100 dark:bg-slate-800 lg:bg-white lg:dark:bg-slate-900">
      <div className="flex-col hidden w-1/4 h-full pt-20 ml-12 mr-4 space-y-6 overflow-y-auto lg:flex">
        <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
          <span className="text-lg font-semibold text-brand1">
            Host your own event on mintflick
          </span>
          <p className="text-sm font-normal tracking-wide text-brand1">
            Mintflick allows you to be the host of your own events, with
            Mintflick you can create a personalized experience for your audience
            and have complete control over the content and scheduling of your
            event.
          </p>
          <Link
            to={`/homescreen/create-event`}
            className="w-full mt-4 capitalize btn btn-brand">
            Host event
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center w-full bg-white lg:w-2/4 lg:px-12 dark:bg-slate-900">
        <div className="flex items-center justify-between w-full max-w-3xl p-4 mx-auto">
          <button
            onClick={() => navigateTo("../marketPlace")}
            className="flex items-center justify-center font-semibold text-brand3">
            <ChevronLeft />
            Back
          </button>

          <span
            // onClick={() => setwalletModalOpen(true)}
            className="flex items-center gap-2 text-brand1">
            <Refresh
              onClick={() => {
                fetchData(params.id);
              }}
              className={`cursor-pointer   ${refreshLoading && "animate-spin"}`}
            />
            <Share
              onClick={() =>
                State.updateDatabase({
                  shareModalOpen: true,
                  sharePostUrl: `https://mintflick.app/homescreen/event-details/${params.id}`,
                })
              }
              className="cursor-pointer "
            />
          </span>
        </div>{" "}
        {data && mintedNfts ? (
          <div className="flex flex-col flex-grow w-full max-w-2xl gap-2 py-4 overflow-y-auto">
            <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
              <img
                className="object-cover w-full rounded-lg aspect-video"
                src={
                  data.eventImage
                    ? data.eventImage
                    : "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
                }
                alt="banner"
              />{" "}
              <span className="mt-2 text-xl font-bold text-brand1">
                {data ? data.title : ""}
              </span>
              <div className="flex items-center justify-between w-full ">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-2">
                    <div className="px-2 text-sm font-semibold rounded-full w-fit h-fit bg-slate-800/60 backdrop-blur-sm text-slate-100">
                      {data ? data.type : ""}
                    </div>
                    <div className="px-2 text-sm font-semibold rounded-full w-fit h-fit bg-slate-800/60 backdrop-blur-sm text-slate-100">
                      {data ? data.category : ""}
                    </div>
                  </div>
                  <CalendarEvent className="text-success" />
                  <span className="text-base font-semibold text-success">
                    {getDayMonth(data.startTime)}, {formatAMPM(data.startTime)}
                    {/* <span className="text-base font-semibold text-brand2">to</span>
                {getDayMonth(data.endTime)}, {formatAMPM(data.endTime)} */}
                  </span>
                </div>
              </div>
              {/* <div className="flex gap-2 overflow-auto">
            <img
              className="object-cover h-16 rounded-lg aspect-video"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />{" "}
            <img
              className="object-cover h-16 rounded-lg aspect-video"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />{" "}
            <img
              className="object-cover h-16 rounded-lg aspect-video"
              src={
                "https://pbs.twimg.com/media/DeYVmVqW4AEIjlk?format=jpg&name=medium"
              }
              alt="banner"
            />
          </div> */}
            </div>
            {data?.eventHost !== State.database.walletAddress && (
              <div className="flex items-center justify-between w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
                <div className="flex items-center gap-2">
                  {hostDetails?.profile_image && (
                    <img
                      className="object-cover w-10 h-10 rounded-full"
                      src={hostDetails?.profile_image}
                      alt="user profile"
                    />
                  )}
                  <div className="">
                    <p className="text-lg font-semibold truncate text-brand1">
                      Host
                    </p>
                    <p className="text-base font-normal text-brand3 ">
                      {data && data.eventHost
                        ? data.eventHost.length > 10
                          ? data.eventHost.slice(0, 6) +
                            "..." +
                            data.eventHost.slice(
                              data.eventHost.length - 6,
                              data.eventHost.length
                            )
                          : data.eventHost
                        : ""}
                    </p>
                  </div>
                </div>
                {alreadyBought && (
                  <span
                    onClick={() => setshowQr(true)}
                    className="gap-2 text-white capitalize rounded-full btn btn-success">
                    <Qrcode></Qrcode> View QR
                  </span>
                )}
                {!alreadyBought &&
                  (data?.unlimitedTickets ? (
                    <button
                      onClick={buyOnSolana}
                      className={`pl-3 pr-[2px] py-1 md:pl-4 md:pr-1 md:py-2 bg-success text-white flex items-center gap-1 rounded-full capitalize  `}>
                      {buying && <Loader size={16} className="animate-spin" />}
                      <span className="text-base ">Book for</span>
                      {data?.freeEvent ? (
                        <>
                          <span className="mx-1 mr-2 text-lg font-bold ">
                            free
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg font-bold">
                            {data.ticketPrice}
                          </span>
                          <div className="flex items-center gap-2 p-2 mx-1 rounded-full bg-slate-900">
                            <SolanaToken size={16} />
                          </div>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-sm font-semibold w-fit text-brand1">
                      {data.ticketCount - mintedNfts?.length === 0 ? (
                        <div className="p-2 px-3 text-white rounded-full bg-error">
                          Soldout
                        </div>
                      ) : (
                        <button
                          onClick={buyOnSolana}
                          className={`pl-3 pr-[2px] py-1 md:pl-4 md:pr-1 md:py-2 bg-success text-white flex items-center gap-1 rounded-full capitalize  `}>
                          {buying && (
                            <Loader size={16} className="animate-spin " />
                          )}{" "}
                          Book for
                          {data ? (
                            data.freeEvent ? (
                              <span className="mx-1 mr-2 text-lg font-bold">
                                free
                              </span>
                            ) : (
                              <>
                                <span className="text-lg font-bold">
                                  {data.ticketPrice}
                                </span>
                                <div className="flex items-center gap-2 p-2 mx-1 rounded-full bg-slate-900">
                                  <SolanaToken size={16} />
                                </div>
                              </>
                            )
                          ) : (
                            ""
                          )}
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {data?.eventHost === State.database.walletAddress && (
              <div className="flex items-center gap-2 ">
                <button
                  className="text-white capitalize rounded-full btn btn-info"
                  onClick={() => setVerify(!verify)}>
                  Verify Tickets
                </button>
                {!data.freeEvent && !data.withdrawn
                  ? Date.parse(data.endTime) <= Math.floor(Date.now()) && (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() =>
                            withdrawSol(
                              (
                                data.ticketPrice *
                                mintedNfts?.length *
                                0.95
                              ).toFixed(2)
                            )
                          }
                          className={`text-white capitalize rounded-full btn btn-success ${
                            loading && "loading"
                          }`}>
                          Withdraw{" "}
                          {(
                            data.ticketPrice *
                            mintedNfts?.length *
                            0.95
                          ).toFixed(2)}{" "}
                          SOL
                        </button>
                      </div>
                    )
                  : !data.freeEvent && (
                      <button
                        className={`text-white capitalize rounded-full btn btn-ghost gap-2`}>
                        <Check className="text-success"></Check> Withdrawn{" "}
                        {(data.ticketPrice * mintedNfts?.length * 0.95).toFixed(
                          2
                        )}{" "}
                        SOL
                      </button>
                    )}
              </div>
            )}
            <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold text-brand1">
                  Bookings
                </span>
                <div
                  onClick={() => setviewBookings(true)}
                  className="text-lg font-semibold cursor-pointer text-primary">
                  view all
                </div>
              </div>
              {data?.unlimitedTickets ? (
                <></>
              ) : (
                <div className="flex items-center justify-around w-full gap-1 ">
                  <Ticket className="-rotate-45 text-success" />
                  <span className="flex items-center gap-1 text-sm font-semibold w-fit text-success">
                    {mintedNfts?.length} tickets sold
                  </span>
                  <progress
                    className="w-2/3 progress progress-success"
                    value={mintedNfts?.length}
                    max={data?.ticketCount}></progress>
                  <span className="flex items-center gap-1 text-sm font-semibold w-fit text-brand1">
                    {`${data?.ticketCount - mintedNfts?.length} tickets left`}
                  </span>
                </div>
              )}
            </div>{" "}
            <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
              <span className="text-lg font-semibold text-brand1">
                Description
              </span>
              <p className="text-base font-normal text-brand1">
                {data ? data.description : ""}
              </p>
            </div>{" "}
            {data.location && (
              <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
                <span className="text-lg font-semibold text-brand1">
                  Location
                </span>
                <a
                  href={data?.location}
                  target="_blank"
                  className="flex items-center gap-2 text-white rounded-full">
                  <svg
                    width="17"
                    height="24"
                    viewBox="0 0 17 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.9035 0.388396C10.1078 0.137359 9.2552 0 8.3742 0C5.80226 0 3.50031 1.16045 1.96094 2.98875L5.91594 6.3138L10.9035 0.388396Z"
                      fill="#1A73E8"
                    />
                    <path
                      d="M1.96093 2.98877C0.692929 4.49481 -0.00165508 6.40072 2.96157e-06 8.36947C2.96157e-06 9.942 0.312614 11.2209 0.828896 12.3624L5.91593 6.31381L1.96093 2.98877Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M8.37418 5.17223C8.98474 5.17279 9.58243 5.3478 10.0969 5.67667C10.6113 6.00553 11.021 6.47454 11.2779 7.02847C11.5347 7.5824 11.6278 8.19818 11.5464 8.80329C11.465 9.40841 11.2123 9.97765 10.8182 10.444L15.8011 4.51859C14.7783 2.54806 13.015 1.0642 10.8987 0.393066L5.92065 6.31847C6.2206 5.95925 6.59586 5.67038 7.01985 5.4723C7.44384 5.27422 7.9062 5.17178 8.37418 5.17223Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M8.37415 11.5762C6.60743 11.5762 5.17226 10.141 5.17226 8.37426C5.17019 7.622 5.43541 6.89346 5.92063 6.3186L0.828857 12.3672C1.70038 14.2949 3.14502 15.8438 4.63229 17.7952L10.8182 10.4441C10.5177 10.7992 10.1433 11.0845 9.72116 11.28C9.29904 11.4755 8.83935 11.5766 8.37415 11.5762Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M10.6951 19.7988C13.4897 15.4317 16.7437 13.4471 16.7437 8.36955C16.7437 6.97701 16.4026 5.66499 15.8011 4.50928L4.63708 17.7952C5.11074 18.4157 5.58913 19.0741 6.05331 19.8035C7.74899 22.4276 7.28007 24.0001 8.37421 24.0001C9.46835 24.0001 8.99943 22.4228 10.6951 19.7988Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="underline">View on Google map</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}
            {/* {data.socialLinks &&  */}
            {
              <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
                <span className="text-lg font-semibold text-brand1">
                  Social links
                </span>
                <div className="flex items-center gap-3">
                  <a target="_blank" href={data?.socialLinks?.twitter}>
                    <BrandTwitter
                      size={28}
                      className="translate-x-2 text-[#00acee]"
                    />
                  </a>
                  <a target="_blank" href={data?.socialLinks?.instagram}>
                    <BrandInstagram
                      size={28}
                      className="translate-x-2 text-[#bc2a8d]"
                    />
                  </a>
                  <a target="_blank" href={data?.socialLinks?.linkedIn}>
                    <BrandLinkedin
                      size={28}
                      className="translate-x-2 text-[#0A66C2]"
                    />
                  </a>
                  <a target="_blank" href={data?.socialLinks?.website}>
                    <ExternalLink
                      size={28}
                      className="translate-x-2 text-brand2"
                    />
                  </a>
                </div>
              </div>
            }
            {/* {data.eventUrl && (
              <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
                <span className="text-lg font-semibold text-brand1">Link</span>
                <p className="text-base font-normal text-brand1">
                  {data ? data.eventUrl : ""}
                </p>
              </div>
            )} */}
            <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl lg:hidden">
              <span className="p-2 pb-0 text-lg font-semibold text-brand1">
                Host Details
              </span>
              {hostDetails && (
                <ProfileCard
                  coverImage={hostDetails.cover_image}
                  profileImage={hostDetails.profile_image}
                  name={hostDetails.name}
                  userName={hostDetails.username}
                  follower_count={hostDetails?.follower_count?.length}
                  followee_count={hostDetails?.followee_count?.length}
                  superfan_to={hostDetails?.superfan_to?.length}
                />
              )}
            </div>
            {/* <div className="flex flex-col items-start justify-start w-full max-w-2xl gap-2 p-2 mx-auto bg-slate-100 dark:bg-slate-700 sm:rounded-xl sm:p-4">
          <span className="text-lg font-semibold text-brand1">Location</span>
          <img
            className="object-cover w-full rounded-lg aspect-video"
            src={
              "https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png"
            }
            alt="banner"
          />
        </div> */}{" "}
            {viewBookings && (
              <div
                className={`${
                  viewBookings && "modal-open"
                } modal  modal-bottom sm:modal-middle`}>
                <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
                  <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
                    <div className="flex items-center justify-between p-2">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                        Bookings
                      </h3>
                      <X
                        onClick={() => setviewBookings(false)}
                        className="cursor-pointer text-brand2"></X>
                    </div>
                  </div>
                  <div className="flex flex-col w-full divide-y-2 dark:divide-slate-700 divide-dashed">
                    <span
                      className={`p-4 text-lg font-bold  ${
                        mintedNfts?.length === 0 ? "text-success" : "text-error"
                      }`}>
                      {mintedNfts?.length === 0
                        ? "No Bookings yet!"
                        : `${mintedNfts?.length} Tickets Booked ✨`}
                    </span>
                    {bookings?.map((booking) => (
                      <div className="flex items-center justify-between px-4 py-2">
                        <Booking wallet={booking.owner} />
                        <a
                          href={`https://translator.shyft.to/address/${booking.mint}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
                          target="_blank"
                          className="w-24 mx-2 text-sm font-semibold text-primary text-end">
                          View Ticket
                        </a>
                      </div>
                    ))}
                    {bookings?.length % 10 === 0 &&
                      mintedNfts?.length % 10 !== 0 &&
                      bookings?.length !== 0 && (
                        <button
                          onClick={() => {
                            getBookings(data.lockId, bookings?.length / 10 + 1);
                          }}
                          className="p-4 font-bold text-primary">
                          View more tickets
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ContentLoader
            viewBox="0 0 500 720"
            height={720}
            className="w-full p-2 "
            backgroundColor="#64748b"
            foregroundColor="#94a3b8">
            <rect x="12" y="3" className="w-full " height="360" />
            <rect
              x="12"
              y="370"
              rx="0"
              ry="0"
              className="w-full "
              height="60"
            />
            <rect
              x="12"
              y="435"
              rx="0"
              ry="0"
              className="w-full "
              height="60"
            />
            <rect
              x="12"
              y="500"
              rx="0"
              ry="0"
              className="w-full "
              height="60"
            />
          </ContentLoader>
        )}
        {verify && (
          <div
            className={`${
              verify && "modal-open"
            } modal  modal-bottom sm:modal-middle `}>
            <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
              <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
                <div className="flex items-center justify-between p-2">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                    <Scan /> Scan QR Code
                  </h3>
                  <X
                    onClick={() => {
                      setVerify(false);
                      setAlreadyVerified(false);
                      setScannedTicket();
                      setLatestVerifiedTicketOwner();
                      setopenReader(true);
                    }}
                    className="cursor-pointer text-brand2"></X>
                </div>
              </div>
              <div className="w-full">
                {latestVerifiedTicketOwner ? (
                  <div className="flex flex-col items-start justify-center gap-4 p-8 bg-slate-800 border-slate-600">
                    <Booking wallet={latestVerifiedTicketOwner} />{" "}
                    <div className="flex gap-2 ">
                      {alreadyVerified ? (
                        <div className="flex items-center gap-2 text-lg font-semibold text-warning">
                          <AlertTriangle
                            size={36}
                            className=" text-warning"></AlertTriangle>{" "}
                          This ticket has already been verified!
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-lg font-semibold text-success">
                          <Check size={36} className="text-success "></Check>{" "}
                          Hooray!ticket has been verified successfully!
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full gap-2">
                      <a
                        href={`https://translator.shyft.to/address/${scannedTicket}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
                        target="_blank"
                        className="w-1/2 btn btn-primary">
                        View Ticket
                      </a>
                      <div
                        className="w-1/2 capitalize btn btn-ghost text-error"
                        onClick={() => {
                          setAlreadyVerified(false);
                          setScannedTicket();
                          setLatestVerifiedTicketOwner();
                          setopenReader(true);
                          setVerify(false);
                        }}>
                        Close
                      </div>
                    </div>
                  </div>
                ) : (
                  openReader && (
                    <QrReader
                      constraints={{ facingMode: "environment" }}
                      onResult={(result, error) => {
                        if (result) {
                          console.log(result?.text);
                          setScannedTicket(result?.text);
                          let hasString = mintedNfts.includes(result?.text);

                          console.log(
                            "NFT Found in CandyMachine",
                            hasString,
                            result?.text,
                            mintedNfts,
                            verify
                          );
                          hasString
                            ? verifyTicket(result?.text)
                            : State.toast(
                                "error",
                                "Ticket not found! scan another QR"
                              );
                        }
                        if (error) {
                          // console.info(error);
                        }
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        )}
        {showQr && (
          <div
            className={`${
              showQr && "modal-open"
            } modal  modal-bottom  sm:modal-middle `}>
            <div className="p-0 modal-box bg-slate-100 dark:bg-slate-800 ">
              <div className="w-full p-2 h-fit bg-slate-300 dark:bg-slate-700">
                <div className="flex items-center justify-between p-2">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-brand2">
                    <Scan /> Scan this QR
                  </h3>
                  <X
                    onClick={() => setshowQr(false)}
                    className="cursor-pointer text-brand2"></X>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full p-2 bg-white">
                <QRCode value={ticketInfo?.ticketId} viewBox={`0 0 256 256`} />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-col items-end hidden w-1/4 h-full pt-20 ml-4 mr-12 lg:flex">
        {hostDetails && (
          <ProfileCard
            coverImage={hostDetails.cover_image}
            profileImage={hostDetails.profile_image}
            name={hostDetails.name}
            userName={hostDetails.username}
            follower_count={hostDetails?.follower_count?.length}
            followee_count={hostDetails?.followee_count?.length}
            superfan_to={hostDetails?.superfan_to?.length}
          />
        )}

        {/* {verify && (
          <div className="absolute w-screen translate-x-1/2 ">
            <div className="p-2 bg-white border-white rounded-sm border-3 w-max">
              <QrReader
                delay={1000}
                style={{ height: 240, width: 320 }}
                onError={(err) => {
                  console.log(err);
                }}
                onScan={(scan) => {
                  setScannedTicket(scan?.text);
                  const hasString = mintedNfts.indexOf(scan?.text) !== -1;

                  console.log(
                    "NFT Found in CandyMachine",
                    hasString,
                    scan?.text,
                    mintedNfts,
                    verify
                  );

                  hasString && verify && verifyTicket(scan?.text);
                }}
              />
            </div>
          </div>
        )} */}

        {/* {ticketVerified && (
          <div className="w-full h-12 text-white bg-red-200">
            {Array.from(ticketVerified)?.map((data, index) => {
              return (
                <div className="flex items-center justify-between px-4 py-2">
                  <a
                    href={`https://translator.shyft.to/address/${data}?cluster=${process.env.REACT_APP_SOLANA_NETWORK}`}
                    target="_blank"
                    className="w-24 mx-2 text-sm font-semibold text-primary text-end"
                  >
                    View Ticket
                  </a>
                </div>
              );
            })}
          </div>
        )} */}
      </div>
    </div>
  );
}

export default EventDetails;
