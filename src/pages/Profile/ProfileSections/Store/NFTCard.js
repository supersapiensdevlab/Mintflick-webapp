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
import PostOptionModal from '../../../../component/Modals/ReportModals/PostOptionModal';
import ReportModal from '../../../../component/Modals/ReportModals/ReportModal';
import ReportModal2 from '../../../../component/Modals/ReportModals/ReportModal2';

const NFTCard = ({ nft, buyNft, address }) => {
  //console.log(nft);
  const user = useSelector((state) => state.User.user);

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

  const [myComments, setMyComments] = useState([]);
  const [myPost, setMyPost] = useState(false);
  const [myReport, setMyReport] = useState(null);
  const [commentDisabled, setCommentDisabled] = useState(false);
  let sharable_data = `${process.env.REACT_APP_CLIENT_URL}/profile/${nft.username}`;
  useEffect(async () => {
    // console.log(nft);
    const userData = {
      walletId: nft.creator,
    };
    //console.log(nft);

    //Fetch Seller Details
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`, userData, {})
      .then((value) => {
        // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
        // //window.location.href = '/';
        //console.log(value);
        //console.log('ownerdetails', ownerDetails);
        setCardDetails(value.data);

        //Fetch Owner details
        const OwnerData = {
          walletId: nft.owner,
        };
        //console.log('NFT DATA:', nft);
        if (ownerDetails === nftmarketaddress) {
          setOwnerDetails('DAO');
        } else {
          //console.log('OWNER :', OwnerData, ownerDetails);
          axios
            .post(`${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`, OwnerData, {})
            .then((value) => {
              // window.localStorage.setItem('authtoken', JSON.stringify(value.data.jwtToken));
              // //window.location.href = '/';
              setOwnerDetails(value.data);
              //console.log('OWNER DATA : ', OwnerData);
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
      //console.log('creators details', cardDetails);
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
            if (cardDetails.user._id == user._id) {
              setMyPost(true);
            }
          }
        });
      }
    }
  }, [cardDetails]);

  useEffect(() => {
    if (contentData && cardDetails && !myPost) {
      if (contentData.disableComments) {
        setCommentDisabled(true);
      }
      if (cardDetails.user.reports) {
        cardDetails.user.reports.map((rep) => {
          if (rep.reporter == user.username) {
            setMyReport(rep.report);
          }
        });
      }
    }
    if (contentData) {
      if (contentData.disableComments) {
        setCommentDisabled(true);
      }
    }
  }, [contentData]);
  ///////////////////
  const [playing, setPlaying] = useState(false);
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
  const [showPostOption, setShowPostOption] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showReport2, setShowReport2] = useState(false);

  useEffect(() => {
    if (contentData) {
      //console.log(contentData);
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

  async function createMarketSale(nft) {
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
        const contract = new web3.eth.Contract(Market, nftmarketaddress);
        var NFTPrice = ethers.utils.parseEther(nft.price);
        console.log(NFTPrice.toString(10), nft.price);

        let marketFees = await contract.methods.getListingPrice().call();
        const transaction = await contract.methods
          .createMarketSale(2)
          .send({ from: user.wallet_id, value: NFTPrice.toString(10) })
          .on('receipt', function () {
            if (transaction) {
              console.log('Transaction Receipt:', transaction);
              console.log('Transferring Token with #:', nft.tokenId);
            }
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

  const [reportValue, setReportValue] = useState(null);
  const [userReportValue, setUserReportValue] = useState('');
  const [reportSection, setReportSection] = useState([]);
  const handleReportSubmit = () => {
    if (user) {
      let reportData = {
        reporter: user.username,
        reported: cardDetails.user.username,
        report: reportValue,
        videoId: contentData.videoId,
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
      setShowPostOption(false);
      setShowReport(false);
      setShowOtherReport(false);
      setShowReport2(false);
      setShowReportSubmitThankyou(true);
      setMyReport(reportValue);
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
    <>
      {contentData && address === cardDetails.user.wallet_id ? (
        <div
          className="dark mt-2   w-full dark:text-gray-50 
             p-0.5  sm:rounded-xl bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary-lg      text-dbeats-dark-primary   "
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
                  </div>
                </div>
                <div>
                  <div className="text-right">
                    <i
                      onClick={() => setShowPostOption(true)}
                      className="fa-solid fa-ellipsis text-3xl pr-2 text-white cursor-pointer"
                    ></i>
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
                      <div className="flex">
                        <div className="text-xs text-dbeats-light  flex pr-2 ">
                          {`${contentData.views ? contentData.views.length : 0} views`}
                        </div>
                        {!commentDisabled ? (
                          <div
                            onClick={() => setShowAllComments(true)}
                            className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                          >
                            {contentData.comments ? contentData.comments.length : 0} comments
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full self-center  ">
                      <Link
                        to={`/profile/${
                          ownerDetails !== undefined &&
                          ownerDetails !== 'Try Again' &&
                          ownerDetails &&
                          ownerDetails.user &&
                          ownerDetails.user.username
                        }/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                      >
                        <h4>
                          {ownerDetails !== undefined &&
                            ownerDetails !== 'Try Again' &&
                            ownerDetails &&
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
                        {!commentDisabled ? (
                          <div
                            onClick={() => setShowAllComments(true)}
                            className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                          >
                            {contentData.comments ? contentData.comments.length : 0} comments
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex ">
                  {listingPrice ? (
                    <div>
                      <div
                        onClick={() => createMarketSale(nft)}
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
              {commentDisabled ? (
                <div className="flex text-gray-500  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p className="w-full mt-2 text-center cursor-pointer opacity-50 ">
                    <i className="fa-solid fa-comment text-white"></i>
                    <span className="text-dbeats-light font-extrabold	"> Comment</span>
                  </p>
                </div>
              ) : (
                <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p
                    onClick={() => setShowComment(true)}
                    className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100"
                  >
                    <i className="fa-solid fa-comment text-white"></i>
                    <span className="text-dbeats-light font-extrabold	"> Comment</span>
                  </p>
                </div>
              )}

              <div
                onClick={handleShareShow}
                className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3"
              >
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fa-solid fa-share-nodes"></i>{' '}
                  <span className="text-dbeats-light font-extrabold	"> Share</span>
                </p>
              </div>
            </div>
            {showComment && !commentDisabled && (
              <Addcomment
                user_id={cardDetails.user._id}
                contentData={contentData}
                setMyComments={setMyComments}
                myComments={myComments}
              ></Addcomment>
            )}
            {showAllComments && !commentDisabled && (
              <Allcomments
                myComments={myComments}
                user_id={cardDetails.user._id}
                contentData={contentData}
                setShowAllComments={setShowAllComments}
              ></Allcomments>
            )}
          </div>
        </div>
      ) : contentData && !address ? (
        <div
          className="dark mt-2   dark:text-gray-50 
             p-0.5  sm:rounded-xl bg-gradient-to-br from-dbeats-dark-alt to-dbeats-dark-primary  nm-flat-dbeats-dark-primary-lg      text-dbeats-dark-primary    relative   "
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
                  </div>
                </div>
                <div>
                  <div className="text-right">
                    <i
                      onClick={() => setShowPostOption(true)}
                      className="fa-solid fa-ellipsis text-3xl pr-2 text-white cursor-pointer"
                    ></i>
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
                      <div className="flex">
                        <div className="text-xs text-dbeats-light  flex pr-2 ">
                          {`${contentData.views ? contentData.views.length : 0} views`}
                        </div>
                        {!commentDisabled ? (
                          <div
                            onClick={() => setShowAllComments(true)}
                            className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                          >
                            {contentData.comments ? contentData.comments.length : 0} comments
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full self-center  ">
                      <Link
                        to={`/profile/${
                          ownerDetails !== undefined &&
                          ownerDetails !== 'Try Again' &&
                          ownerDetails &&
                          ownerDetails.user &&
                          ownerDetails.user.username
                        }/`}
                        className="2xl:text-sm lg:text-xs text-sm text-gray-500  mb-2"
                      >
                        <h4>
                          {ownerDetails !== undefined &&
                            ownerDetails !== 'Try Again' &&
                            ownerDetails &&
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
                        {!commentDisabled ? (
                          <div
                            onClick={() => setShowAllComments(true)}
                            className="text-xs cursor-pointer text-dbeats-light pr-2 flex  "
                          >
                            {contentData.comments ? contentData.comments.length : 0} comments
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex ">
                  {listingPrice ? (
                    <div>
                      <div
                        onClick={() => createMarketSale(nft)}
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
              {commentDisabled ? (
                <div className="flex text-gray-500  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p className="w-full mt-2 text-center cursor-pointer opacity-50 ">
                    <i className="fa-solid fa-comment text-white"></i>
                    <span className="text-dbeats-light font-extrabold	"> Comment</span>
                  </p>
                </div>
              ) : (
                <div className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3">
                  <p
                    onClick={() => setShowComment(true)}
                    className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100"
                  >
                    <i className="fa-solid fa-comment text-white"></i>
                    <span className="text-dbeats-light font-extrabold	"> Comment</span>
                  </p>
                </div>
              )}

              <div
                onClick={handleShareShow}
                className="flex text-white  items-center justify-center text-sm font-medium  text-center px-4  py-3"
              >
                <p className="w-full mt-2 text-center cursor-pointer opacity-50 hover:opacity-100">
                  <i className="fa-solid fa-share-nodes"></i>{' '}
                  <span className="text-dbeats-light font-extrabold	"> Share</span>
                </p>
              </div>
            </div>
            {showComment && !commentDisabled && (
              <Addcomment
                user_id={cardDetails.user._id}
                contentData={contentData}
                setMyComments={setMyComments}
                myComments={myComments}
              ></Addcomment>
            )}
            {showAllComments && !commentDisabled && (
              <Allcomments
                myComments={myComments}
                user_id={cardDetails.user._id}
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
      <PostOptionModal
        cardDetails={cardDetails}
        contentData={contentData}
        commentDisabled={commentDisabled}
        setCommentDisabled={setCommentDisabled}
        myReport={myReport}
        setMyReport={setMyReport}
        myPost={myPost}
        show={showPostOption}
        handleShowReport={setShowReport}
        handleClose={setShowPostOption}
      ></PostOptionModal>
      <ReportModal
        show={showReport}
        handleClose={setShowReport}
        setReportSection={setReportSection}
        handleShowReport2={setShowReport2}
        setShowOtherReport={setShowOtherReport}
      ></ReportModal>
      <ReportModal2
        handleReportSubmit={handleReportSubmit}
        reportValue={reportValue}
        setReportValue={setReportValue}
        reportSection={reportSection}
        handleReport={setShowReport}
        show={showReport2}
        handleClose={setShowReport2}
      ></ReportModal2>
      <Modal isOpen={false} className="h-max lg:w-1/3  w-5/6  mx-auto lg:mt-60 mt-32 rounded-lg">
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
        className={`${'dark'} h-max md:w-max w-full bg-dbeats-dark-alt mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow `}
      >
        <div className={`${darkMode && 'dark'}`}>
          <Container className="2xl:px-5 px-5 lg:px-1 pb-4 dark:bg-dbeats-dark-alt rounded-lg border">
            <Row>
              <h2 className="flex justify-between  w-full 2xl:text-2xl lg:text-md py-4 2xl:py-4 lg:py-2  pt-7  text-center relative  ">
                <div className="col-span-5 text-gray-900 dark:text-gray-100 font-bold"></div>
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
              <div className="w-full pt-5 pb-10 px-20">
                <div className="text-center">
                  <i className="fa-regular fa-circle-check text-white text-5xl text-center"></i>
                </div>
                <div className="text-center">
                  <p className="text-white text-center mt-2 mb-2">Thanks for reporting!</p>
                </div>
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
                    setReportValue(null);
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
