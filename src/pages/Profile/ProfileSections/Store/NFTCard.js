import React, { useEffect, useState } from 'react';
import { Image } from 'react-img-placeholder';
import maticLogo from '../../../../assets/graphics/polygon-matic-logo.svg';
import dbeatsLogoBnW from '../../../../assets/images/Logo/logo-blacknwhite.png';
import axios from 'axios';

import moment from 'moment';
import ReactPlayer from 'react-player/lazy';
import { Link } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import person from '../../../../assets/images/profile.svg';
import BidModal from '../../../../component/Modals/BidModal/BidModal';
import { ShareModal } from '../../../../component/Modals/ShareModal/ShareModal';
import { RadioGroup } from '@headlessui/react';
import { useHistory } from 'react-router-dom';
import useWeb3Modal from '../../../../hooks/useWeb3Modal';
import SuperfanModal from '../../../../component/Modals/SuperfanModal/superfan-modal';
import dbeatsDAOLogo from '../../../../assets/images/dbeats-logo.png';
import Addcomment from './comments/Addcomment';
import Allcomments from './comments/Allcomments';
import { nftmarketaddress } from '../../../../functions/config';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import { ethers } from 'ethers';
import Market from '../../../../artifacts/contracts/Market.sol/NFTMarket.json';

const NFTCard = ({ nft, buyNft }) => {
  //console.log(nft);

  const [seeMore, setSeeMore] = useState(false);
  const [nameSeeMore, setNameSeeMore] = useState(false);

  const [cardDetails, setCardDetails] = useState();
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [contentData, setConentData] = useState();

  const [subscribeLoader, setSubscribeLoader] = useState(true);

  const [buttonText, setButtonText] = useState('follow');
  const [followers, setFollowers] = useState(0);
  const [listingPrice, setListingPrice] = useState(null);
  const provider = useSelector((state) => state.web3Reducer.provider);

  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/profile/${nft.username}`;
  useEffect(async () => {
    // console.log(nft);
    const userData = {
      walletId: nft.creator,
    };
    console.log(nft);

    //Fetch Seller Details
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`, userData, {})
      .then((value) => {
        // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
        // //window.location.href = '/';
        console.log(value);
        console.log('ownerdetails', ownerDetails);
        setCardDetails(value.data);

        //Fetch Owner details
        const OwnerData = {
          walletId: nft.owner,
        };
        console.log('NFT DATA:', nft);
        if (ownerDetails === nftmarketaddress) {
          setOwnerDetails('DAO');
        } else {
          console.log('OWNER :', OwnerData, ownerDetails);
          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`, OwnerData, {})
            .then((value) => {
              // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
              // //window.location.href = '/';
              setOwnerDetails(value.data);
              console.log('OWNER DATA : ', OwnerData);
            });
        }
      });

    if (cardDetails && user && user.your_reactions.length != 0 && cardDetails.user) {
      let checkVideo = `${cardDetails.user.username}/${cardDetails.id}`;
      for (let i = 0; i < user.your_reactions.length; i++) {
        if (user.your_reactions[i].link == checkVideo) {
          setUserreact('like');
        }
      }
    }

    setListingPrice(nft.price);
  }, []);
  useEffect(() => {
    if (cardDetails) {
      console.log('creators details');
      console.log(cardDetails);
      const extension = nft.external_url.split(/[#?]/)[0].split('.').pop().trim();
      if (extension == 'mp4' || extension == 'mkv' || extension == 'mov' || extension == 'avi') {
        cardDetails.user.videos.map((video) => {
          if (video.tokenId == nft.tokenId) {
            let temp = video;
            // for reversing the comments of videos
            if (temp.comments) {
              let temprevcomments = video.comments.reverse();
              temp.comments = temprevcomments;
            }
            setConentData(temp);
          }
        });
      }
    }
  }, [cardDetails]);
  ///////////////////
  const [playing, setPlaying] = useState(false);
  const user = useSelector((state) => state.User.user);
  const dispatch = useDispatch();
  const [like, setLike] = useState(0);
  const [userreact, setUserreact] = useState('');
  const ref = React.createRef();
  const history = useHistory();
  const [loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  //let history = useHistory();
  const [showMore, setShowMore] = useState(false);

  // const setUserName = cardDetails.user.name.toLower();
  // console.log(setUserName);

  const darkMode = useSelector((darkmode) => darkmode.toggleDarkMode);

  const shareText = 'Copy Link To Clipboard';
  const [shareButtonText, setShareButtonText] = useState(shareText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShareButtonText(shareText);
    }, 2000);
    return () => clearTimeout(timer);
  }, [shareButtonText]);

  // console.log(cardDetails);
  // console.log(user);

  const handleMouseMove = () => {
    setPlaying(true);
  };

  const hanldeMouseLeave = () => {
    setPlaying(false);
  };

  const [time, setTime] = useState(null);

  const [showShare, setShowShare] = useState(false);
  const handleShareClose = () => setShowShare(false);
  const handleShareShow = () => setShowShare(true);

  useEffect(() => {
    if (contentData) {
      console.log(contentData);
      let videotime = contentData.time;
      const timestamp = new Date(videotime * 1000); // This would be the timestamp you want to format
      setTime(moment(timestamp).fromNow());
    }
    // eslint-disable-next-line
  }, [contentData]);

  const trackFollowers = () => {
    setSubscribeLoader(false);
    if (buttonText === 'Login to Follow') {
      // window.location.href = '/signup';
    }
    //console.log(followers);
    const followData = {
      following: `${cardDetails.user.username}`,
      follower: `${user.username}`,
    };

    if (buttonText === 'follow') {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            setButtonText('following');
            setFollowers(followers + 1);
            setSubscribeLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/unfollow`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
        data: followData,
      })
        .then(function (response) {
          if (response) {
            setButtonText('follow');
            setFollowers(followers - 1);
            setSubscribeLoader(true);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  function createMarketSale(tokenId) {
    var biconomy = new Biconomy(provider, {
      apiKey: 'Ooz6qQnPL.10a08ea0-3611-432d-a7de-34cf9c44b49b',
    });
    console.log(provider);
    console.log(biconomy);

    const web3 = new Web3(biconomy);
    window.web3 = web3;
    // const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();

    biconomy
      .onEvent(biconomy.READY, async () => {
        console.log('Biconomy is ready', user.wallet_id);
        let contract = new web3.eth.Contract(Market, nftmarketaddress);
        var NFTPrice = ethers.utils.parseUnits(nft.price, 'ether');
        console.log(NFTPrice, nft.price);
        await contract.methods
          .createMarketSale(tokenId)
          .send({ from: user.wallet_id, value: NFTPrice.toString() })
          .then(async (res) => {
            console.log('Transferring Token with #:', tokenId);

            console.log('#transaction : ', res);
          });
        // transaction
        //   .on('transactionHash', function (hash) {
        //     console.log(`Transaction hash is ${hash}`);
        //     console.log(`Transaction sent. Waiting for confirmation ..`);
        //   })
        //   .once('confirmation', function (confirmationNumber, receipt) {
        //     console.log(receipt);
        //     console.log(receipt.transactionHash);
        //     setShow(true);
        //     setMinting(false);
        //     //do something with transaction hash
        //   });
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(error);
        console.log(message);
      });

    /* next, create the item */
    //let contract = new web3.eth.Contract(Market.abi, nftmarketaddress);

    //let event = tx.events[0];
    //let value = event.args[2];
    //let tokenId = value.toNumber();
    // {
    //   value: listingPrice,
    // }
    //transaction = await contract.createMarketItem(tokenId, price);
    //await transaction.wait();
    // props.handleCloseVideoUpload();
  }

  const [showSubscriptionModal, setshowSubscriptionModal] = useState(false);
  const handleCloseSubscriptionModal = () => setshowSubscriptionModal(false);
  const handleShowSubscriptionModal = () => setshowSubscriptionModal(true);

  const [showBidModal, setShowBidModal] = useState(false);
  const handleCloseBidModal = () => setShowBidModal(false);
  const handleShowBidModal = () => setShowBidModal(true);

  const [showReport, setShowReport] = useState(false);
  const handleReportShow = () => {
    if (user) {
      setShowReport(true);
    } else {
      loadWeb3Modal();
    }
  };
  const handleReportClose = () => setShowReport(false);

  const [showReportSubmitThankyou, setShowReportSubmitThankyou] = useState(false);
  const handleReportThankyouShow = () => setShowReportSubmitThankyou(true);
  const handleReportThankyouClose = () => setShowReportSubmitThankyou(false);

  const [showOtherReport, setShowOtherReport] = useState(false);
  const handleOtherReportShow = () => setShowOtherReport(true);
  const handleOtherReportClose = () => setShowOtherReport(false);

  const [showComment, setShowComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const [reportValue, setReportValue] = useState('Nudity or pornography');
  const [userReportValue, setUserReportValue] = useState('');

  const handleReportSubmit = () => {
    if (user) {
      let reportData = {
        reporter: user.username,
        reported: cardDetails.user.username,
        report: reportValue,
        videoId: cardDetails.id,
      };
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/videoreports`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
        data: reportData,
      })
        .then((response) => {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      setShowReport(false);
      setShowOtherReport(false);
      setShowReportSubmitThankyou(true);
    } else {
      loadWeb3Modal();
    }
  };

  // const handleLike = () => {
  //   if (user) {
  //     // Code For Like
  //   } else {
  //     window.location.href = '/signup';
  //   }
  // };

  const handleInputChange = (e) => {
    setReportValue(e.target.value);
  };

  const handlereaction = (videoprops) => {
    if (!user) {
      loadWeb3Modal();
      return;
    }
    if (userreact === '') {
      const reactionData = {
        reactusername: `${user.username}`,
        videousername: `${cardDetails.user.username}`,
        reaction: videoprops,
        videostreamid: `${cardDetails.user.username}`,
        videoindex: `${cardDetails.id}`,
        videolink: `${cardDetails.link}`,
      };

      if (videoprops === 'like') {
        setLike(like + 1);
        setUserreact('like');
      }
      // else if (videoprops === 'dislike') {
      //   setDislike(dislike + 1);
      //   setUserreact('dislike');
      // } else if (videoprops === 'happy') {
      //   setHappy(happy + 1);
      //   setUserreact('happy');
      // } else {
      //   setAngry(angry + 1);
      //   setUserreact('angry');
      // }

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/reactions`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
        data: reactionData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      const reactionData = {
        reactusername: `${user.username}`,
        videousername: `${cardDetails.user.username}`,
        newreaction: videoprops,
        oldreaction: userreact,
        videostreamid: `${cardDetails.user.username}`,
        videoindex: `${cardDetails.id}`,
        videolink: `${cardDetails.link}`,
      };

      if (videoprops === userreact) {
        if (videoprops === 'like') {
          setLike(like - 1);
        }
        // else if (videoprops === 'dislike') {
        //   setDislike(dislike - 1);
        // } else if (videoprops === 'happy') {
        //   setHappy(happy - 1);
        // } else {
        //   setAngry(angry - 1);
        // }
        setUserreact('');
      } else {
        if (videoprops === 'like') {
          setLike(like + 1);
          setUserreact('like');
        }
        // else if (videoprops === 'dislike') {
        //   setDislike(dislike + 1);
        //   setUserreact('dislike');
        // } else if (videoprops === 'happy') {
        //   setHappy(happy + 1);
        //   setUserreact('happy');
        // } else {
        //   setAngry(angry + 1);
        //   setUserreact('angry');
        // }

        if (userreact === 'like') {
          setLike(like - 1);
        }
        // else if (userreact === 'dislike') {
        //   setDislike(dislike - 1);
        // } else if (userreact === 'happy') {
        //   setHappy(happy - 1);
        // } else {
        //   setAngry(angry - 1);
        // }
      }

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_SERVER_URL}/user/removeuserreaction`,
        headers: {
          'content-type': 'application/json',
          'auth-token': localStorage.getItem('authtoken'),
        },
        data: reactionData,
      })
        .then(function (response) {
          if (response) {
            ////console.log(response);
          } else {
            alert('Invalid Login');
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  // const handleReport = () => {
  //   if (user) {
  //     // Code For Report
  //   } else {
  //     window.location.href = '/signup';
  //   }
  // };
  const handleClick = () => {
    if (user) {
      history.push(`/profile/${cardDetails.user.username}/`);
    } else {
      loadWeb3Modal();
    }
  };

  return (
    // <div className="dark:bg-gradient-to-b  h-full  shadow-md  hover:border-gray-500 dark:from-dbeats-dark-secondary dark:to-dbeats-dark-secondary  dark:hover:bg-gradient-to-b  dark:hover:from-green-400 dark:hover:via-dbeats-dark-secondary  dark:hover:to-dbeats-dark-alt sm:hover:scale-101 transform   bg-gradient-to-b from-white to-white dark:hover:bg-opacity-10 hover:bg-opacity-90 hover:bg-gradient-to-b hover:from-white hover:via-blue-50 hover:to-green-50   group  backdrop-blur-2xl  backdrop-filter dark:hover:backdrop-blur-2xl  dark:hover:backdrop-filter    hover:shadow-md cursor-pointer    sm:rounded-lg flex flex-col items-center justify-center transition-all duration-200 ease-in-out">
    //   <div className="relative sm:mt-2 sm:mx-2">
    //     <div className=" h-full w-full max-h-100 md:h-56    sm:rounded-md overflow-hidden">
    //       <Image
    //         onContextMenu={(e) => e.preventDefault()}
    //         src={nft.image}
    //         height={200}
    //         width={200}
    //         className="object-cover  h-full w-full"
    //         alt={nft.name}
    //         placeholderSrc={dbeatsLogoBnW}
    //       />

    //       {/* <img
    //         // `https://ipfs.io/ipfs/` + nft.image.split('ipfs://')[1] for nftport
    //         src={nft.image}
    //         alt="ipfs"
    //         className="object-cover  h-full w-full"
    //         background={dbeatsLogoBnW}
    //       /> */}
    //     </div>

    //     <div className="absolute bottom-0 left-0 -mb-4 ml-3 flex flex-row">
    //       <div className="h-10 w-10 flex items-center justify-center text-xl bg-white dark:bg-dbeats-dark-secondary  bg-opacity-20 dark:bg-opacity-10 dark:hover:bg-opacity-80  dark:backdrop-blur-md  backdrop-filter hover:bg-opacity-25  backdrop-blur-md hover:text-red-500 text-white   rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="h-5 w-5"
    //           viewBox="0 0 20 20"
    //           fill="currentColor"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
    //             clipRule="evenodd"
    //           />
    //         </svg>
    //       </div>
    //       <div className="h-10  ml-2 w-max   px-2 bg-white dark:bg-dbeats-dark-secondary bg-opacity-20  dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-80 dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md hover:bg-dbeats-light    grad flex items-center justify-center font-medium text-white hover:text-white rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out group">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           className="h-5 w-5"
    //           viewBox="0 0 20 20"
    //           fill="currentColor"
    //         >
    //           <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
    //           <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
    //         </svg>
    //         <span className="group-hover:text-white text-white ml-2"></span>
    //       </div>
    //       <div
    //         onClick={() => buyNft(nft)}
    //         className="h-10w-max ml-2 px-2 bg-white dark:bg-dbeats-dark-secondary bg-opacity-20  dark:bg-opacity-10 hover:bg-opacity-25 dark:hover:bg-opacity-80 dark:backdrop-blur-md  backdrop-filter  backdrop-blur-md hover:bg-dbeats-light    grad flex items-center justify-center font-medium text-white hover:text-white rounded-2xl shadow-sm dark:shadow-md  transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out group"
    //       >
    //         <span className="group-hover:text-white text-white mx-1 flex group ">
    //           {nft.price}{' '}
    //           <img
    //             className="h-5 w-5 ml-1 text-white self-center align-middle items-center"
    //             src={maticLogo}
    //             alt="maticLogo"
    //           ></img>
    //         </span>
    //       </div>
    //       {/* <!-- Component Start --> */}

    //       {/* <!-- Component End  --> */}
    //     </div>
    //   </div>

    //   {/* {nft.name} */}
    //   <div className="pt-10 pb-6 w-full px-4" style={{ minHeight: '145px' }}>
    //     <h1 className="font-medium leading-none text-base tracking-wider text-gray-900 dark:text-white">
    //       <p
    //         className={`${!nameSeeMore ? 'line-clamp-2' : ''} mr-2 mt-1 `}
    //         style={{ wordBreak: 'break-words' }}
    //       >
    //         {nft ? (
    //           <>
    //             {nft.name.split('\n').map(function (item) {
    //               return (
    //                 <>
    //                   {item}
    //                   <br />
    //                 </>
    //               );
    //             })}
    //           </>
    //         ) : null}
    //       </p>

    //       {nft ? (
    //         <>
    //           {nft.name.split(/\r\n|\r|\n/).length > 1 ? (
    //             <p
    //               className="cursor-pointer text-md hover:underline text-gray-600  "
    //               onClick={() => setNameSeeMore(!nameSeeMore)}
    //             >
    //               {nameSeeMore ? '...see less' : '...see more'}
    //             </p>
    //           ) : null}{' '}
    //         </>
    //       ) : null}
    //     </h1>

    //     {/* {nft.description} */}
    //     {nft.description ? (
    //       <div className=" leading-none text-base tracking-wider text-gray-900 dark:text-gray-200 mt-2">
    //         <p
    //           className={`${!seeMore ? 'line-clamp-1' : ''} mr-2`}
    //           style={{ wordBreak: 'break-words' }}
    //         >
    //           {nft.description.split('\n').map(function (item) {
    //             return (
    //               <>
    //                 {item}
    //                 <br />
    //               </>
    //             );
    //           })}
    //         </p>
    //         {nft.description.split(/\r\n|\r|\n/).length > 2 ? (
    //           <p
    //             className="cursor-pointer text-md hover:underline text-gray-600 mt-2"
    //             onClick={() => setSeeMore(!seeMore)}
    //           >
    //             {seeMore ? '...see less' : '...see more'}
    //           </p>
    //         ) : null}
    //       </div>
    //     ) : null }
    //   </div>
    // </div>

    <>
      {cardDetails && cardDetails.user && contentData && ownerDetails && ownerDetails.user ? (
        <div
          className="dark my-4  dark:text-gray-50 
           shadow-sm dark:shadow-md  p-0.5  sm:rounded-xl bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary-lg      text-dbeats-dark-primary    relative   "
        >
          <div className="sm:rounded-xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary">
            <div className=" pb-4 ">
              <div className="flex justify-between items-center  text-black text-sm font-medium   px-4  py-3">
                <div className="flex">
                  <a onClick={handleClick} className="mr-4  w-16 h-14  cursor-pointer">
                    <img
                      src={cardDetails.user.profile_image ? cardDetails.user.profile_image : person}
                      alt=""
                      className="  w-14 h-14    rounded-full    self-start"
                    />
                  </a>
                  <div className="flex  justify-between mt-2">
                    <div>
                      <div className="w-full self-center  ">
                        <a
                          onClick={handleClick}
                          className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2 cursor-pointer"
                        >
                          <div className="flex align-middle">
                            <p className="text-white mr-1">{cardDetails.user.name}</p>
                            &middot;
                            <p className="text-white ml-1 text-opacity-40 text-xs self-center align-middle">
                              {time}
                            </p>
                          </div>

                          <p className="text-white text-opacity-40">@{cardDetails.user.username}</p>
                        </a>{' '}
                      </div>
                    </div>
                    {/* Hiding Follow Button due to bugs 
                <div>
                  <div
                    onClick={trackFollowers}
                    className="  rounded-3xl group w-max ml-2 p-0.5  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-secondary      hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  >
                    <div className="  h-full w-full text-black dark:text-white p-1 flex   rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary ">
                      <p className="self-center mx-2 flex">
                        <span>
                          {buttonText === 'follow' ? (
                            <i className="fas fa-plus self-center mx-2"></i>
                          ) : null}
                          &nbsp;{buttonText}
                        </span>
                        <div
                          hidden={subscribeLoader}
                          className="w-3 h-3 ml-2 border-t-4 border-b-4 border-white rounded-full animate-spin"
                        ></div>
                      </p>
                    </div>
                  </div>
                </div> */}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (user) handleShowSubscriptionModal();
                    else loadWeb3Modal();
                  }}
                  className={
                    cardDetails.user.superfan_data
                      ? ' flex dark:bg-dbeats-dark-primary border border-dbeats-light dark:hover:bg-dbeats-light p-1   text-sm    rounded  2xl:px-4 px-4 lg:px-2      mr-1   text-white   '
                      : 'hidden'
                  }
                >
                  <span
                    className={`${
                      cardDetails.user.superfan_data ? '' : 'hidden'
                    } whitespace-nowrap sm:flex hidden`}
                  >
                    🥳 Become a Superfan
                  </span>
                  <span
                    className={`${
                      cardDetails.user.superfan_data ? '' : 'hidden'
                    } whitespace-nowrap sm:hidden flex`}
                  >
                    Become a Superfan
                  </span>
                </button>
              </div>

              <div className=" text-lg   text-white px-4  ">{nft.name}</div>

              <div className=" text-base     text-opacity-50 text-white px-4  ">
                {showMore ? nft.description : `${nft.description.substring(0, 120)}`}
                {nft.description.length > 120 && !showMore ? '...' : null}
                {/* {nft.description.slice(0, 120)} */}
              </div>

              {nft.description.length > 120 ? (
                <button
                  className="btn justify-end text-right text-base  cursor-pointer   text-opacity-40 text-dbeats-light px-4"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? '...see less' : '...see more'}
                </button>
              ) : null}
            </div>
            <div
              className={`cursor-pointer w-full 2xl:h-max lg:h-max md:h-max xs:h-max min-h-full   dark:bg-black bg-black `}
            >
              <Link
                to={`/playback/${cardDetails.user.username}/${cardDetails.id}`}
                className="h-full "
              ></Link>
              <ReactPlayer
                className="w-full h-full max-h-screen "
                width="100%"
                height="400px"
                playing={true}
                muted={true}
                volume={0.5}
                light={nft.image}
                url={contentData.link}
                controls={true}
                ref={ref}
              />
            </div>
            <div className="flex   text-black text-sm font-medium   px-4  py-3">
              <a onClick={handleClick} className="mr-4">
                <img
                  src={
                    nft.owner === nftmarketaddress
                      ? dbeatsDAOLogo
                      : ownerDetails && ownerDetails.user
                      ? ownerDetails.user.profile_image
                      : person
                  }
                  alt=""
                  loading="lazy"
                  className="w-16 h-14 rounded-full self-start"
                />
              </a>
              <div className="w-full flex justify-between mt-2">
                <div>
                  {nft.owner === nftmarketaddress ? (
                    <div className="w-full self-center  ">
                      <Link
                        to={`/profile/dbeatsDAO/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                      >
                        <h4>DBeats DAO</h4>
                      </Link>{' '}
                      <div className="2xl:text-sm lg:text-xs text-sm text-gray-500 pr-2 flex  ">
                        owner
                      </div>
                      <div
                        onClick={() => setShowAllComments(true)}
                        className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                      >
                        comments
                      </div>
                    </div>
                  ) : (
                    <div className="w-full self-center  ">
                      <Link
                        to={`/profile/${
                          ownerDetails !== undefined &&
                          ownerDetails !== 'Try Again' &&
                          ownerDetails.user &&
                          ownerDetails.user.username
                        }/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                      >
                        <h4>
                          {ownerDetails !== undefined &&
                            ownerDetails !== 'Try Again' &&
                            ownerDetails.user &&
                            ownerDetails.user.name}{' '}
                        </h4>
                      </Link>{' '}
                      <div className="2xl:text-sm lg:text-xs text-sm text-gray-500 pr-2 flex  ">
                        owner
                      </div>
                      <div className="flex">
                        <div className="text-xs text-dbeats-light  flex pr-2 ">
                          {`${contentData.views ? contentData.views.length : 0} views`}
                        </div>
                        <div
                          onClick={() => setShowAllComments(true)}
                          className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                        >
                          {` ${contentData.comments ? contentData.comments.length : 0} comments`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex ">
                  {listingPrice ? (
                    <div
                      onClick={() => buyNft(nft)}
                      className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    >
                      <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                        <img
                          className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                          src={maticLogo}
                          alt="logo"
                        ></img>
                        <p className="self-center mr-2 ml-1">
                          {parseFloat(nft.price) > 0 ? nft.price : `Make an offer`}
                        </p>
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={handleShowBidModal}
                      className=" rounded-3xl group w-max ml-2 p-1  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                    >
                      <span className="  text-black dark:text-white  flex p-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-secondary hover:nm-inset-dbeats-dark-secondary ">
                        <img
                          className="h-7 w-7 p-1  mr-1   text-white self-center align-middle items-center     "
                          src={maticLogo}
                          alt="logo"
                        ></img>
                        <p className="self-center mx-2">Make an offer</p>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-around border-t border-opacity-20 mx-2">
              <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                <p
                  onClick={handlereaction}
                  className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100"
                >
                  <i
                    className={
                      userreact === 'like'
                        ? `fas fa-heart mr-2 text-red-700 animate-pulse`
                        : `fas fa-heart mr-2`
                    }
                  ></i>
                  <span className="text-dbeats-light font-extrabold	">
                    {contentData.reaction.like.length} Like
                  </span>
                </p>
              </div>

              <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                <p
                  onClick={() => setShowComment(true)}
                  className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100"
                >
                  <i className="fa-solid fa-comment text-white"></i>
                  <span className="text-dbeats-light font-extrabold	"> Comment</span>
                </p>
              </div>

              <div
                onClick={handleShareShow}
                className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3"
              >
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fa-solid fa-share-nodes"></i>{' '}
                  <span className="text-dbeats-light font-extrabold	"> Share</span>
                </p>
              </div>

              {/* {user == null || user.username != cardDetails.user.username ? (
                <div className="flex  text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p
                    onClick={handleReportShow}
                    className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100 flex items-center justify-center"
                  >
                    <i className="fas fa-flag mr-2"></i> Report
                  </p>
                </div>
              ) : (
                <></>
              )} */}
            </div>
            {showComment && (
              <Addcomment user_id={cardDetails.user._id} contentData={contentData}></Addcomment>
            )}
            {showAllComments && (
              <Allcomments
                contentData={contentData}
                setShowAllComments={setShowAllComments}
              ></Allcomments>
            )}
          </div>
        </div>
      ) : null}
      <BidModal isBidOpen={showBidModal} handleCloseBid={handleCloseBidModal}></BidModal>
      <ShareModal
        show={showShare}
        handleClose={handleShareClose}
        sharable_data={sharable_data}
        copybuttonText={shareButtonText}
        setCopyButtonText={setShareButtonText}
      />
      <Modal
        isOpen={showReport}
        className="h-max lg:w-1/3  w-5/6  mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && 'dark'} border rounded-lg`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
            <Row>
              <h2 className="flex justify-between w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 ml-60 text-gray-900 dark:text-gray-100 font-bold">
                  Report
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1 mr-8 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleReportClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full px-3">
                <h1 className="text-white text-xl mb-2">Why are you reporting this post?</h1>
                <div className="w-full max-h-60 overflow-y-scroll text-white text-lg">
                  <RadioGroup value={reportValue} onChange={setReportValue} className=" w-max">
                    <RadioGroup.Option
                      value="Nudity or pornography"
                      className="p-1 cursor-pointer flex items-center"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
                            Nudity or pornography
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Sexual Exploitation"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
                            Sexual Exploitation
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Sharing private images"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
                            Sharing private images
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Violent threat"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>Violent threat</span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Animal abuse"
                    >
                      {({ checked }) => (
                        <span className={checked ? 'text-dbeats-light' : ''}>Animal abuse</span>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Death, severe injury, dangerous"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
                            Death, severe injury, dangerous
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Firearms"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>Firearms</span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Fake health documents"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>
                            Fake health documents
                          </span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option
                      className="p-1 cursor-pointer flex items-center"
                      value="Report piracy"
                    >
                      {({ checked }) => (
                        <>
                          <span className={checked ? 'text-dbeats-light' : ''}>Report piracy</span>
                          {checked ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              viewBox="0 0 20 20"
                              fill="#00d3ff"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </RadioGroup.Option>
                  </RadioGroup>
                  <button
                    className="p-1"
                    onClick={() => {
                      handleOtherReportShow();
                      handleReportClose();
                    }}
                  >
                    Others
                  </button>
                </div>
              </div>
            </Row>
            <Row>
              <div
                className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
              >
                <button
                  className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                  onClick={handleReportSubmit}
                >
                  Submit Report
                </button>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>

      <Modal
        isOpen={showReportSubmitThankyou}
        className="h-max lg:w-1/3  w-5/6 mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && 'dark'}`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg border">
            <Row>
              <h2 className="flex justify-between  w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold">
                  Thanks for reporting!!
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1  justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleReportThankyouClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full flex justify-center items-center pt-5 pb-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-28 w-28"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>

      <Modal
        isOpen={showOtherReport}
        className="h-max lg:w-1/3  w-5/6 mx-auto lg:mt-60 mt-32 rounded-lg"
      >
        <div className={`${darkMode && 'dark'} border rounded-lg`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg">
            <Row>
              <h2 className="flex justify-around w-full 2xl:text-2xl lg:text-md py-4 2xl:py-6 lg:py-2  pt-7  text-center relative  ">
                <div
                  onClick={() => {
                    handleOtherReportClose();
                    handleReportShow();
                  }}
                  className="cursor-pointer text-gray-900 dark:text-gray-100 dark:bg-dbeats-dark-alt ml-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="col-span-4 text-gray-900 dark:text-gray-100 font-bold">
                  Help us understand the problem
                </div>
                <div
                  className="rounded-3xl group w-max   p-2  mx-1 justify-center  cursor-pointer bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-secondary   hover:nm-inset-dbeats-dark-primary          flex items-center   font-medium          transform-gpu  transition-all duration-300 ease-in-out "
                  onClick={handleOtherReportClose}
                >
                  <span className="text-black dark:text-white  flex px-2 py-1 rounded-3xl bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-dark-primary hover:nm-inset-dbeats-dark-secondary">
                    <i className="fas fa-times"></i>
                  </span>
                </div>
              </h2>
            </Row>
            <Row>
              <div className="w-full h-max px-2">
                <textarea
                  className="w-full text-white text-lg h-48 rounded-sm p-2  border dark:bg-dbeats-dark-primary"
                  placeholder="Issue..."
                  required
                  onChange={handleInputChange}
                />
              </div>
            </Row>
            <Row>
              <div
                className="w-full flex justify-center items-center py-2  
                      cursor-pointer  "
              >
                <button
                  className="text-white px-5 py-3 text-lg  bg-gradient-to-br from-dbeats-dark-secondary to-dbeats-secondary-dark-primary 
                      hover:nm-inset-dbeats-secondary-light  rounded-3xl transition-all duration-300"
                  onClick={handleReportSubmit}
                >
                  Submit Report
                </button>
              </div>
            </Row>
          </Container>
        </div>
      </Modal>
      <SuperfanModal
        userDataDetails={cardDetails ? cardDetails.user : null}
        show={showSubscriptionModal}
        handleClose={handleCloseSubscriptionModal}
        className={`${darkMode && 'dark'}   mx-auto    mt-32 shadow `}
      />
    </>
  );
};

export default NFTCard;
