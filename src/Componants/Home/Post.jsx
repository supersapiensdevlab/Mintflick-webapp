import React, { useContext, useEffect, useRef, useMemo } from "react";
import { useState } from "react";
import {
  AlertOctagon,
  ArrowNarrowRight,
  At,
  Award,
  CheckupList,
  CircleCheck,
  Comet,
  DotsVertical,
  // Heart,
  InfoCircle,
  MessageCircle,
  PlayerPause,
  PlayerPlay,
  Share,
  Eye,
  ShoppingCart,
  Trash,
  UserMinus,
  UserOff,
  UserPlus,
  Wallet,
  ChevronRight,
} from "tabler-icons-react";
import PolygonToken from "../../Assets/logos/PolygonToken";
import coverImage from "../../Assets/backgrounds/cover.png";
import { UserContext } from "../../Store";
import axios from "axios";
import ReactPlayer from "react-player";
import moment from "moment";
import AllComments from "./AllComments/AllComments";
import defaultProPic from "../../Assets/profile-pic.png";
import useUserActions from "../../Hooks/useUserActions";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import JoinSuperfanModal from "./Modals/JoinSuperfanModal";
import Picker from "emoji-picker-react";
import useIsInViewport from "../../Hooks/useIsInViewport";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "./defaultStyle";
import placeholderImage from "../../Assets/profile-pic.png";
import placeholderLogo from "../../Assets/logo1024.gif";

import Main_logo from "../../Assets/logos/Main_logo";
import Main_logo_dark from "../../Assets/logos/Main_logo_dark";
import trackPlaceholder from "../../Assets/track-placeholder.jpg";
import { Image } from "react-img-placeholder";
import { Link } from "react-router-dom";
import ReportModal from "./Modals/ReportModal";
import { useNavigate } from "react-router-dom";
import MintNFTModal from "./Modals/MintNFTModal";
import nftCoin from "../../Assets/nftCoin.png";
import ListNFTModal from "./Modals/ListNFTModal";
import AnimatedHeart from "./AnimatedHeart";
function Post(props) {
  const navigateTo = useNavigate();
  // Common State and Functions
  const State = useContext(UserContext);
  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  const [videoLikes, setVideoLikes] = useState(0);
  const [videoLiked, setVideoLiked] = useState(null);

  const [trackLikes, setTrackLikes] = useState(0);
  const [trackLiked, setTrackLiked] = useState(null);

  const [postLikes, setPostLikes] = useState(0);
  const [postLiked, setPostLiked] = useState(null);

  const [pollLikes, setPollLikes] = useState(0);
  const [pollLiked, setPollLiked] = useState(null);

  const [pollChoice, setPollChoice] = useState(0);
  const [pollVotes, setPollVotes] = useState(0);
  const [pollVoted, setPollVoted] = useState(null);

  const [price, setPrice] = useState(0);
  const [tokenId, setTokenId] = useState(props.tokenId ? props.tokenId : null);

  //// Only Track Specific States and Functions

  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sendPlays, setSendPlays] = useState(false);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count?.forEach((value, i) => {
    renderData.push({ id: i, display: value });
  });

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  //comment
  const [text, setText] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  // local comments
  const [myComments, setMyComments] = useState([]);

  //comments
  const [showComments, setshowComments] = useState(false);

  const videoRef = useRef();
  const ref1 = useRef();

  //sharable data
  const sharable_data = `${process.env.REACT_APP_CLIENT_URL}/homescreen/${
    props.profileUsername
  }/${props.contentType}/${
    props.postId || props.videoId || props.pollId || props.trackId
  }`;

  //Delete Confirmation Modal
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  //Join superfan modal
  const [joinsuperfanModalOpen, setJoinsuperfanModalOpen] = useState(false);

  const [mintModalOpen, setMintModalOpen] = useState(false);

  const [listModalOpen, setListModalOpen] = useState(false);

  const [pollOptions, setPollOptions] = useState([]);

  const [votesArr, setVotesArr] = useState(null);

  const [owner, setOwner] = useState(null);

  const [nftLink, setnftLink] = useState(null);

  // async function getNftData(mintId) {
  //   const connection = new Connection(process.env.REACT_APP_SOLANA_RPC);
  //   const keypair = Keypair.generate();
  //   // console.log("keypair", keypair);
  //   const metaplex = new Metaplex(connection);
  //   metaplex.use(keypairIdentity(keypair));
  //   // console.log("mintId", mintId);
  //   const mint = new PublicKey(mintId);

  //   const nft = await metaplex.nfts().findByMint({ mintAddress: mint });

  //   // console.log("nft", nft);
  //   nft.json.image && setnftLink(nft.json.image);
  //   const largestAccounts = await connection.getTokenLargestAccounts(mint);
  //   const largestAccountInfo = await connection.getParsedAccountInfo(
  //     largestAccounts.value[0].address
  //   );
  //   // console.log(largestAccountInfo.value.data.parsed.info.owner);
  //   largestAccountInfo.value.data.parsed.info.owner &&
  //     setOwner(largestAccountInfo.value.data.parsed.info.owner);
  // }

  useEffect(() => {
    if (props.comments) {
      let count = 0;
      props.comments.forEach((c) => {
        count++;
        if (c.reply) {
          c.reply.forEach((r) => count++);
        }
      });
      setCommentCount(count);
    }
  }, [props.comments]);

  const handleUnfollowUser = async (toUnfollow) => {
    const unfollowData = {
      following: toUnfollow,
    };
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: unfollowData,
    })
      .then(async function (response) {
        await loadUser();
        await loadProfileCard();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFollowUser = async (toFollow) => {
    const followData = {
      following: toFollow,
    };
    await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: followData,
    })
      .then(async function (response) {
        await loadUser();
        await loadProfileCard();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (props?.content?.options) {
      setPollOptions(props.content.options);
    }
  }, [props?.content?.options]);

  useEffect(() => {
    const seconds = Math.floor(audioPlayer?.current?.duration);
    setDuration(seconds);
    if (progressBar.current) progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  useEffect(() => {
    if (props.currentPlay != props.myKey) {
      audioPlayer.current?.pause();
      setIsPlaying(false);
      if (videoRef.current) {
        if (videoRef.current.getInternalPlayer()) {
          videoRef.current?.getInternalPlayer().pause();
        }
      }
      cancelAnimationFrame(animationRef.current);
    }
  }, [props.currentPlay]);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      props.setCurrentPlay(props.myKey);
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (!sendPlays) {
      trackStarted();
    }
    if (currentTime == duration) {
      setIsPlaying(false);
    }
  }, [currentTime]);

  const trackStarted = async () => {
    const time = Math.floor(duration / 3);
    if (currentTime > time) {
      if (
        State.database.userData.data.user
          ? State.database.userData.data.user.username !== props.profileUsername
          : false
      ) {
        //   const timer = setTimeout(() => {
        const trackDetails = {
          trackusername: `${props.profileUsername}`,
          trackindex: `${props.trackId}`,
          viewed_user: `${State.database.userData.data.user.username}`,
        };

        await axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/user/plays`,
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(State.database.userData.data.jwtToken),
          },
          data: trackDetails,
        }).then(function (response) {
          setSendPlays(true);
        });
        //   }, time);
        //   return () => clearTimeout(timer);
      }
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 5);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - -5);
    changeRange();
  };

  //// Track End

  //// Only Track Specific States and Functions

  const videoStarted = () => {
    props.setCurrentPlay(props.myKey);
    if (
      State.database.userData.data.user
        ? State.database.userData.data.user.username !== props.profileUsername
        : false
    ) {
      const timer = setTimeout(() => {
        const videoDetails = {
          videousername: `${props.profileUsername}`,
          videoindex: `${props.videoId}`,
          viewed_user: `${State.database.userData.data.user.username}`,
        };

        axios({
          method: "POST",
          url: `${process.env.REACT_APP_SERVER_URL}/user/views`,
          headers: {
            "content-type": "application/json",
            "auth-token": JSON.stringify(State.database.userData.data.jwtToken),
          },
          data: videoDetails,
        }).then(function (response) {});
      }, 5000);
      return () => clearTimeout(timer);
    }
  };

  //// Video End

  //Fetch NFT Details on SOlana

  // like section
  useEffect(() => {
    if (props.likes) {
      if (props.postId) {
        setPostLikes(props.likes.length);
      } else if (props.videoId) {
        setVideoLikes(props.likes.length);
      } else if (props.pollId) {
        setPollLikes(props.likes.length);
        setPollVotes(props.votes.length);
        setVotesArr(props.votes);
      } else {
        setTrackLikes(props.likes.length);
      }
    }

    if (props.content.pollId) {
      if (
        props.content.votes &&
        props.content.votes.length > 0 &&
        props.content.votes.includes(
          State.database.userData.data?.user.username
        )
      ) {
        setPollVoted(true);
        for (let i = 0; i < props.content.options.length; i++) {
          if (
            props.content.options[i].selectedBy.includes(
              State.database.userData.data.user.username
            )
          ) {
            setPollChoice(i);
            break;
          }
        }
      } else {
        setPollVoted(false);
      }
    }
    if (
      props.likes &&
      State.database.userData.data &&
      props.likes.includes(State.database.userData.data.user.username)
    ) {
      if (props.trackId) {
        setTrackLiked(true);
      } else if (props.postId) {
        setPostLiked(true);
      } else if (props.videoId) {
        setVideoLiked(true);
      } else if (props.pollId) {
        setPollLiked(true);
      }
    } else {
      if (props.trackId) {
        setTrackLiked(false);
      } else if (props.postId) {
        setPostLiked(false);
      } else if (props.videoId) {
        setVideoLiked(false);
      } else if (props.pollId) {
        setPollLiked(false);
      }
    }
  }, [props.likes, State.database.userData.data, props.votes]);

  const handleVideoLikes = () => {
    let videotemp = videoLiked;
    setVideoLiked(!videoLiked);
    if (videotemp) {
      setVideoLikes((l) => l - 1);
    } else {
      setVideoLikes((l) => l + 1);
    }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      videousername: `${props.profileUsername}`,
      videoId: `${props.videoId}`,
      image: `${
        props.image
          ? props.image
          : props.trackImage
          ? props.trackImage
          : props.videoImage
          ? props.videoImage
          : null
      }`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/videoreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleTrackLikes = () => {
    let tracktemp = trackLiked;
    setTrackLiked(!trackLiked);
    if (tracktemp) {
      setTrackLikes((l) => l - 1);
    } else {
      setTrackLikes((l) => l + 1);
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      trackusername: `${props.profileUsername}`,
      trackId: `${props.trackId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/trackreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollLikes = () => {
    let polltemp = pollLiked;
    setPollLiked(!pollLiked);
    if (polltemp) {
      setPollLikes((l) => l - 1);
    } else {
      setPollLikes((l) => l + 1);
    }
    // if (pollLikes.includes(user.username)) {
    //   let newArr = pollLikes.filter((item, index) => item != user.username);
    //   setpollLikes(newArr);
    //   set
    // } else {
    //   let temp = pollLikes;
    //   temp.push(user.username);
    //   setpollLikes(temp);
    //   console.log(pollLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      pollusername: `${props.profileUsername}`,
      pollId: `${props.pollId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/pollreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePostLikes = () => {
    let posttemp = postLiked;
    setPostLiked(!postLiked);
    if (posttemp) {
      setPostLikes((l) => l - 1);
    } else {
      setPostLikes((l) => l + 1);
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const likeData = {
      reactusername: `${State.database.userData.data.user.username}`,
      postusername: `${props.profileUsername}`,
      postId: `${props.postId}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/postreactions`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          ////console.log(response);
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollVote = (choice) => {
    if (!pollVoted) {
      setPollVotes(pollVotes + 1);
      votesArr.push(State.database.userData.data?.user?.username);
      pollOptions[choice].selectedBy.push(
        State.database.userData.data?.user?.username
      );
    }
    // if (trackLikes.includes(user.username)) {
    //   let newArr = trackLikes.filter((item, index) => item != user.username);
    //   setTrackLikes(newArr);
    //   set
    // } else {
    //   let temp = trackLikes;
    //   temp.push(user.username);
    //   setTrackLikes(temp);
    //   console.log(trackLikes, 'in else');
    // }

    const voteData = {
      reactusername: `${State.database.userData.data.user.username}`,
      pollusername: `${props.profileUsername}`,
      pollId: `${props.pollId}`,
      voted: `${choice}`,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/pollVote`,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
      data: voteData,
    })
      .then(async function (response) {
        setPollVoted(true);
        setPollChoice(choice);
        if (response) {
          ////console.log(response);
          // await loadFeed();
        } else {
          console.log("error");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const isInViewport = useIsInViewport(ref1);

  useEffect(() => {
    if (!isInViewport) {
      if (videoRef.current) {
        if (videoRef.current.getInternalPlayer()) {
          videoRef.current?.getInternalPlayer().pause();
        }
      }
    }
  }, [isInViewport]);

  // Already reported
  const [alreadyReported, setAlreadyReported] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState({});
  useEffect(() => {
    if (State.database.userData.data) {
      let reported = props.reports.filter((re) => {
        if (re.reporter == State.database.userData.data.user.username) {
          if (re.content_type == "video" && re.id == props.videoId) {
            return true;
          } else if (re.content_type == "track" && re.id == props.trackId) {
            return true;
          } else if (re.content_type == "post" && re.id == props.postId) {
            return true;
          } else if (re.content_type == "poll" && re.id == props.pollId) {
            return true;
          }
        }
        return false;
      });
      if (reported.length > 0) {
        setAlreadyReported(reported[0].report);
      }
    }
  }, [State.database.userData?.data?.user.reports, props.reports]);

  const handleReportClick = () => {
    setReportModal(true);
    setReportData({
      reporter: State.database.userData?.data?.user?.username,
      reported: props.profileUsername,
      id: props.videoId
        ? props.videoId
        : props.postId
        ? props.postId
        : props.trackId
        ? props.trackId
        : props.pollId,
      content_type: props.contentType,
    });
  };

  // For reply comment count

  return (
    <>
      <div
        className={`relative w-full h-fit  lg:bg-slate-100 lg:dark:bg-slate-800 lg:rounded-xl p-4 lg:p-8 space-y-4 pb-4 border-b-2 lg:border-none  border-slate-200 dark:border-slate-900 `}
      >
        {/* {tokenId && owner && (
          <svg
            className="absolute -top-6 lg:top-0 right-4  "
            width="30"
            height="36"
            viewBox="0 0 30 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.8716 38.8623C28.1991 39.7694 30 38.8188 30 37.211L30 2C30 0.89543 29.1046 -3.91405e-08 28 -8.74228e-08L2 -1.22392e-06C0.895432 -1.2722e-06 1.749e-06 0.89543 1.70072e-06 2L1.61596e-07 37.211C9.13172e-08 38.8188 1.80093 39.7694 3.12838 38.8623L13.8716 31.5211C14.552 31.0561 15.448 31.0561 16.1284 31.5211L26.8716 38.8623Z"
              fill="#10B981"
            />
            <path
              d="M11.508 20H9.156L6.024 15.272V20H3.672V11.54H6.024L9.156 16.328V11.54H11.508V20ZM18.5838 11.54V13.412H15.1998V14.9H17.6958V16.688H15.1998V20H12.8478V11.54H18.5838ZM25.9463 11.54V13.412H23.6903V20H21.3383V13.412H19.1063V11.54H25.9463Z"
              fill="white"
            />
          </svg>
        )} */}
        <div className="flex w-full justify-between items-center">
          <Link to={`/homescreen/profile/${props.profileName}`}>
            <div
              // onClick={() => nav(`../profile/${props.profileName}`)}
              className="flex items-start space-x-4 cursor-pointer"
            >
              {props.profilePic ? (
                // <img
                //   className="h-12 w-12 rounded-full object-cover"
                //   src={props.profilePic ? props.profilePic : placeholderImage}
                //   alt={props.profileName}
                // />
                <Image
                  className="h-12 w-12 rounded-full object-cover"
                  width={50}
                  height={50}
                  src={props.profilePic ? props.profilePic : placeholderImage}
                  alt={props.profileName}
                  placeholderSrc={placeholderImage}
                />
              ) : (
                <div class="avatar placeholder">
                  <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
                    <span class="text-3xl uppercase">
                      {props.profileName.slice(0, 1)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <p className="font-semibold text-base text-brand1">
                  {props.profileName}
                </p>
                <p className="font-normal text-xs text-brand4">
                  {moment(props.timestamp * 1000).fromNow()}
                </p>
              </div>
              {!State.database.userData?.data?.user?.followee_count?.includes(
                props.profileUsername
              ) ? (
                <>
                  {State.database.userData?.data?.user?.username !==
                  props.profileUsername ? (
                    <Link to={"/homescreen/home"}>
                      <div
                        onClick={() => {
                          handleFollowUser(props.profileUsername);
                        }}
                      >
                        <button className="cursor-pointer items-center btn btn-xs btn-primary btn-outline gap-1 ml-auto rounded-md ">
                          Follow
                        </button>
                      </div>
                    </Link>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </Link>
          <div className=" ">
            <div className="dropdown dropdown-end">
              <label
                tabindex="0"
                className="btn btn-ghost btn-circle dark:hover:bg-slate-700"
              >
                <DotsVertical className=""></DotsVertical>
              </label>
              {!(
                State.database.userData?.data?.user?.username ===
                props.profileUsername
              ) ? (
                <ul
                  tabindex="0"
                  className="menu menu-compact dropdown-content p-1 shadow-xl bg-slate-100 dark:bg-slate-600  text-brand3 font-semibold rounded-lg w-48 "
                >
                  {props?.superfan_data ? (
                    <li>
                      <a
                        onClick={() => setJoinsuperfanModalOpen(true)}
                        className="dark:hover:bg-slate-800"
                      >
                        <Comet className="-rotate-90" /> Join Superfans
                      </a>
                    </li>
                  ) : null}
                  {alreadyReported ? (
                    <li>
                      <a>
                        <p class="tooltip" data-tip={alreadyReported}>
                          <InfoCircle size={20} strokeWidth={2} />
                        </p>{" "}
                        Already Reported{" "}
                      </a>
                    </li>
                  ) : (
                    <li onClick={handleReportClick}>
                      <a className="hover:bg-rose-500">
                        <AlertOctagon />
                        Report
                      </a>
                    </li>
                  )}
                  {State.database.userData?.data?.user?.followee_count?.includes(
                    props.profileUsername
                  ) ? (
                    <li
                      onClick={() => handleUnfollowUser(props.profileUsername)}
                    >
                      <a className="dark:hover:bg-slate-800">
                        <UserOff className="" /> Unfollow
                      </a>
                    </li>
                  ) : (
                    <li
                      onClick={() => {
                        handleFollowUser(props.profileUsername);
                      }}
                    >
                      <a className="dark:hover:bg-slate-800">
                        <UserPlus className="" /> Follow
                      </a>
                    </li>
                  )}
                </ul>
              ) : (
                <ul
                  tabindex="0"
                  className="menu menu-compact dropdown-content p-1 shadow-xl bg-slate-100 dark:bg-slate-600  text-brand3 font-semibold rounded-lg w-48 "
                >
                  <li
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                    }}
                  >
                    <a className="hover:bg-rose-500">
                      <Trash /> Delete
                    </a>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <p className="font-normal text-base text-brand2 w-full">{props.text}</p>
        {/* {props.contentType === "post" && tokenId && !props.image && nftLink && (
          <div className="items-center w-full     align-middle justify-center   flex rounded">
            <Image
              className="  w-full  object-contain"
              width="100%"
              height="100%"
              src={nftLink}
              alt={"Post Image"}
              placeholder={
                <div className="flex flex-col justify-center items-center gap-1">
                  <Main_logo></Main_logo>
                  <span className="text-lg font-bold text-brand6">
                    Loading...
                  </span>
                </div>
              }
            />
          </div>
        )} */}
        {props.contentType === "post" && (
          <div className=" w-full h-fit z-10 space-y-2">
            {props.image && (
              <>
                {/* <img  src={   props.image ? props.image : placeholderLogo  }/> */}
                <div className="items-center  aspect-square  align-middle justify-center dark:bg-slate-900 bg-slate-300 flex rounded">
                  <Image
                    className="h-full  aspect-auto w-full  object-contain"
                    width="100%"
                    height="100%"
                    src={nftLink ? nftLink : props.image}
                    alt={"Post Image"}
                    placeholder={
                      <div className="flex flex-col justify-center items-center gap-1">
                        <Main_logo></Main_logo>
                        <span className="text-lg font-bold text-brand6">
                          Loading...
                        </span>
                      </div>
                    }
                  />
                </div>
                {/* <img
                  className="w-full rounded-lg"
                  src={props.image}
                  alt="User Post"
                /> */}
              </>
            )}
            <div className="text-brand4 text-sm space-x-2">
              {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
            </div>
          </div>
        )}
        {props.contentType === "track" && (
          <>
            {" "}
            <div className="flex w-full h-fit z-10 bg-slate-200 dark:bg-slate-700 rounded-l-lg rounded-r-lg overflow-hidden">
              <img
                className="h-28 w-28 object-cover"
                src={props.trackImage ? props.trackImage : trackPlaceholder}
                alt="Track image"
              />
              <div className="flex flex-col p-3 h-28 flex-grow ">
                <div className="flex flex-col h-full">
                  <span className="text-brand3 text-base font-semibold">
                    {props.trackName}
                  </span>
                  <span className="text-brand4 text-sm font-medium">
                    {props.trackDisc}
                  </span>
                </div>
                <div className="flex flex-grow w-full items-center gap-2">
                  <audio
                    ref={audioPlayer}
                    src={props.trackUrl}
                    preload="metadata"
                  ></audio>
                  <span className="text-brand2 text-base font-medium">
                    {calculateTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    defaultValue="0"
                    min="0"
                    max="100"
                    className="w-full  p-2 bg-slate-300 dark:bg-slate-600 appearance-none rounded-full range range-primary range-xs"
                    ref={progressBar}
                    onChange={changeRange}
                  />

                  <span className="text-brand2 text-base font-medium">
                    {duration && !isNaN(duration) && calculateTime(duration)}
                  </span>

                  <label class="btn btn-circle btn-sm btn-ghost swap swap-rotate ">
                    <input type="checkbox" checked={isPlaying} />
                    <PlayerPlay
                      class="swap-off "
                      onClick={() => {
                        togglePlayPause();
                      }}
                    ></PlayerPlay>
                    <PlayerPause
                      class="swap-on "
                      onClick={() => {
                        togglePlayPause();
                      }}
                    ></PlayerPause>
                  </label>
                </div>
              </div>
            </div>{" "}
            <div className="text-brand4 text-sm space-x-2">
              <span>
                {props.trackPlays ? props.trackPlays.length : 0} plays
              </span>
              {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
            </div>
          </>
        )}

        {props.contentType === "poll" && (
          <div className="w-full">
            <div className="font-normal text-base text-brand2 w-full">
              {props.content.question}
            </div>
            {pollOptions?.map((option, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (
                      !pollVoted &&
                      !votesArr.includes(
                        State.database.userData?.data?.user.username
                      )
                    ) {
                      handlePollVote(i);
                    }
                  }}
                  className={`transition-all ease-in duration-700 ${
                    option.selectedBy &&
                    option.selectedBy.includes(
                      State.database.userData?.data?.user.username
                    ) &&
                    pollChoice === i
                      ? " bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700 bg-no-repeat"
                      : pollVoted &&
                        " bg-gradient-to-r from-slate-200 to-slate-200 dark:from-slate-700 dark:to-slate-700 bg-no-repeat "
                  }${
                    pollVoted &&
                    props.content.votes.includes(
                      State.database.userData.data.user.username
                    )
                      ? ""
                      : "hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  } my-2 flex gap-2 p-2  border-2 rounded-lg border-slate-200 dark:border-slate-700   justify-between `}
                  style={{
                    backgroundSize: `${Math.ceil(
                      (option.selectedBy.length / props.votes.length) * 100
                    )}% 100%`,
                  }}
                >
                  <h1 className="flex items-center w-full text-brand1 dark:text-brand2 gap-2">
                    {option.option}
                    {votesArr &&
                    votesArr.includes(
                      State.database.userData.data?.user.username
                    ) ? (
                      <h1 className=" text-sm text-brand4">
                        {Math.ceil(
                          (option.selectedBy.length / votesArr.length) * 100
                        )}
                        %
                      </h1>
                    ) : null}
                  </h1>
                  {/* <span
                  className={`absolute left-0 h-full bg-slate-400 dark:bg-slate-900 w-4`}
                ></span> */}
                  <div className="text-success">
                    {option.selectedBy &&
                    option.selectedBy.includes(
                      State.database.userData.data?.user.username
                    ) ? (
                      <div className="flex">
                        voted&nbsp;
                        <CircleCheck />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            <div className="text-brand4 text-sm space-x-2">
              <span>{pollVotes}&nbsp; Votes</span>
            </div>
          </div>
        )}

        {props.contentType === "video" && (
          <>
            <div className="font-normal text-base text-brand2 w-full">
              {props.content.videoName}
            </div>
            <div className="font-normal text-base text-brand5 w-full">
              {props.content.description}
            </div>

            <div
              className=" w-full h-fit z-10 rounded-lg overflow-clip"
              ref={ref1}
            >
              <ReactPlayer
                ref={videoRef}
                className="w-full h-full max-h-screen "
                width="100%"
                height="400px"
                playing={true}
                muted={true}
                volume={0.5}
                light={props.videoImage}
                url={props.videoUrl}
                controlsList="nodownload"
                controls={true}
                onPlay={() => {
                  props.setCurrentPlay(props.myKey);
                }}
                onStart={() => {
                  videoStarted();
                }}
              />
            </div>
            <div className="text-brand4 text-sm space-x-2 flex align-middle items-center">
              {/* <span
              onClick={() => setshowComments(!showComments)}
              className='cursor-pointer'>
              {commentCount} Comments
            </span> */}
              <Eye size={18} />
              <span>{props.videoViews ? props.videoViews.length : 0} </span>
            </div>
          </>
        )}
        <div className="flex items-center  justify-between">
          <div className="flex items-center space-x-4">
            {props.contentType === "post" && (
              <div className="  cursor-pointer flex items-center text-brand1  space-x-2">
                <AnimatedHeart isClick={postLiked} onClick={handlePostLikes} />
                {/* <Heart
                  className={`${
                    postLiked
                      ? "text-red-600 hover:text-white fill-rose-600"
                      : "text-brand1 hover:text-red-600"
                  }`}
                  onClick={handlePostLikes}
                ></Heart> */}
                <p className="font-medium text-sm ">{postLikes}</p>
              </div>
            )}
            {props.contentType === "video" && (
              <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
                <AnimatedHeart
                  isClick={videoLiked}
                  onClick={handleVideoLikes}
                />
                {/* <Heart
                  className={`${
                    videoLiked
                      ? "text-red-600 hover:text-white fill-rose-600"
                      : "text-brand1 hover:text-red-600"
                  }`}
                  onClick={handleVideoLikes}
                ></Heart> */}
                <p className="font-medium text-sm ">{videoLikes}</p>
              </div>
            )}
            {props.contentType === "track" && (
              <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
                <AnimatedHeart
                  className="h-12 w-12"
                  isClick={trackLiked}
                  onClick={handleTrackLikes}
                />{" "}
                {/* <Heart
                  className={`${
                    trackLiked
                      ? "text-red-600 hover:text-white fill-rose-600"
                      : "text-brand1 hover:text-red-600"
                  }`}
                  onClick={handleTrackLikes}
                ></Heart> */}
                <p className="font-medium text-sm ">{trackLikes}</p>
              </div>
            )}
            {props.contentType === "poll" && (
              <div className=" cursor-pointer flex items-center text-brand1  space-x-2">
                <AnimatedHeart isClick={pollLiked} onClick={handlePollLikes} />{" "}
                {/* <Heart
                  className={`${
                    pollLiked
                      ? "text-red-600 hover:text-white fill-rose-600"
                      : "text-brand1 hover:text-red-600"
                  }`}
                  onClick={handlePollLikes}
                ></Heart> */}
                <p className="font-medium text-sm ">{pollLikes}</p>
              </div>
            )}

            <div
              onClick={() => {
                // setshowCommentInput(!showCommentInput);
                setshowComments(true);
              }}
              className="cursor-pointer flex items-center space-x-2 text-brand1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M5.821 4.91c3.898 -2.765 9.469 -2.539 13.073 .536c3.667 3.127 4.168 8.238 1.152 11.897c-2.842 3.447 -7.965 4.583 -12.231 2.805l-.232 -.101l-4.375 .931l-.075 .013l-.11 .009l-.113 -.004l-.044 -.005l-.11 -.02l-.105 -.034l-.1 -.044l-.076 -.042l-.108 -.077l-.081 -.074l-.073 -.083l-.053 -.075l-.065 -.115l-.042 -.106l-.031 -.113l-.013 -.075l-.009 -.11l.004 -.113l.005 -.044l.02 -.11l.022 -.072l1.15 -3.451l-.022 -.036c-2.21 -3.747 -1.209 -8.392 2.411 -11.118l.23 -.168z"
                  stroke-width="0"
                  fill="#94a3b8"
                ></path>
              </svg>
              <p className="font-medium text-sm ">{commentCount}</p>
            </div>
            <div
              onClick={() =>
                State.updateDatabase({
                  shareModalOpen: true,
                  sharePostUrl: sharable_data,
                })
              }
              className="cursor-pointer flex items-center space-x-2 text-brand1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3219_26741)">
                  <path
                    d="M8.69995 10.6998L15.3 7.2998"
                    stroke="#94a3b8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.69995 13.2998L15.3 16.6998"
                    stroke="#94a3b8"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="6" cy="12" r="4" fill="#94a3b8" />
                  <circle cx="18" cy="18" r="4" fill="#94a3b8" />
                  <circle cx="18" cy="6" r="4" fill="#94a3b8" />
                </g>
                <defs>
                  <clipPath id="clip0_3219_26741">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          {props.content?.tokenId !== "null" && props.content?.tokenId && (
            <div
              onClick={() =>
                navigateTo(`../nft-details/${props.content?.tokenId}`)
              }
              className="w-fit flex items-center gap-2 cursor-pointer ml-auto bg-gradient backdrop-blur-sm text-white p-2  font-medium  text-xs rounded-full"
            >
              <img className="h-4 w-4" src={nftCoin} alt="nftCoin" />
              View NFT
              <ChevronRight size={18} />
            </div>
          )}

          {State.database.userData.data?.user.username === props.profileName &&
          (props.content?.tokenId === "null" || !props.content?.tokenId) &&
          (props.contentType === "post" || props.contentType === "video") ? (
            <div className="w-full flex justify-end">
              {console.log("in2")}
              <div
                className="flex gap-1 items-center w-fit bg-primary cursor-pointer backdrop-blur-sm text-white  py-2 px-4 font-semibold  text-sm rounded-full"
                onClick={() => {
                  setMintModalOpen(true);
                }}
              >
                {/* <PolygonToken></PolygonToken> */}
                {/* <p className="text-sm  mx-1">{props.price}</p> */}
                Make NFT
                <ChevronRight size={18} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* html for thought post nft */}
        {/* {console.log(owner ? owner : "", tokenId)} */}

        {showComments && (
          <AllComments
            myComments={myComments}
            setMyComments={setMyComments}
            user_id={props.profileuser_id}
            contentData={props.content}
            setCommentCount={setCommentCount}
            showComments={showComments}
            setshowComments={setshowComments}
          />
        )}
        {reportModal && (
          <ReportModal
            setReportModal={setReportModal}
            setAlreadyReported={setAlreadyReported}
            reportData={reportData}
          />
        )}
      </div>
      {/* Delete Confirmation modal */}
      <div
        className={`${
          deleteConfirmationModal && "modal-open"
        } modal modal-middle`}
      >
        <DeleteConfirmationModal
          setDeleteConfirmationModal={setDeleteConfirmationModal}
          content={props.content}
        />
      </div>
      {/* Join Superfan modal */}
      <div
        className={`${
          joinsuperfanModalOpen && "modal-open"
        } modal modal-bottom sm:modal-middle`}
      >
        <JoinSuperfanModal
          setJoinSuperfanModal={setJoinsuperfanModalOpen}
          content={props.content}
          superfan_data={props.superfan_data}
          toPay={props.walletId}
          postUsername={props.profileName}
        />
      </div>
      <MintNFTModal
        mintModalOpen={mintModalOpen}
        setMintModalOpen={setMintModalOpen}
        setTokenId={setTokenId}
        setOwner={setOwner}
        content={props.contentType === "post" ? props.image : props.videoUrl}
        videoImage={props.videoImage ? props.videoImage : null}
        name={
          props.contentType === "post"
            ? "Mintflick Collection"
            : props.content.videoName
        }
        description={
          props.contentType === "post" ? props.text : props.content.description
        }
        id={props.contentType === "post" ? props.postId : props.videoId}
        contentType={props.contentType}
      />{" "}
      {listModalOpen && (
        <ListNFTModal
          text={"sfdsdfsfsdf"}
          contentType={props.type !== "video/mp4" ? "post" : "video"}
          listModalOpen={listModalOpen}
          setListModalOpen={setListModalOpen}
          setNftPrice={setPrice}
          content={props.content?.post_image}
          videoUrl={props.content?.post_video}
          tokenId={props?.tokenId}
        />
      )}
    </>
  );
}

export default Post;
