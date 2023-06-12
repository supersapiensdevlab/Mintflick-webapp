'use client';
import React, { useContext, useState } from 'react';
import Avatar from '../molecules/Avatar';
import Tick from '../molecules/Tick';
import Image from 'next/image';
import social from '@/public/social.webp';
import NftCoin from './NftCoin';
import { useRouter } from 'next/navigation';
import Menu from '../molecules/Menu';
import FullScreenOverlay from '../molecules/FullScreenOverlay';
import Comments from './Comments';
import LikeButton from '../molecules/LikeButton';
import { calculateTimeToToday } from '@/app/helper/timeFunctions';
import moment from 'moment';
import ReactPlayer from 'react-player';
import { UserContext } from '@/contexts/userContext';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default function Post({ post }: any) {
  const userState = useContext(UserContext);

  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(
    post.content.likes?.includes(userState.userData.username)
  );
  const [likesCount, setLikesCount] = useState(post.content.likes?.length);
  const [commentCount, setCommentCount] = useState(
    post.content.comments?.length
  );

  const [pollVoted, setPollVoted] = useState(
    post.content.votes.includes(userState.userData.username)
  );
  const [pollVotes, setPollVotes] = useState(post.content.votes);
  const [selectedOption, setSelectedOption] = useState();

  console.log(post);
  const router = useRouter();

  const handleFollowUser = async (toFollow: string): Promise<void> => {
    const followData = {
      following: toFollow,
    };

    await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/follow`,
      headers: {
        'content-type': 'application/json',
        'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
      },
      data: followData,
    })
      .then(async function (response: AxiosResponse) {
        await userState.loadUser();
        console.log('user followed');
      })
      .catch(function (error: AxiosError) {
        console.log(error);
      });
  };

  const handlePostLikes = () => {
    setLiked((prev: Boolean) => !prev);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    const likeData = {
      reactusername: `${userState.userData.username}`,
      postusername: `${post.username}`,
      postId: `${post.content.postId}`,
      image: post.content.post_image ? post.content.post_image : null,
    };
    axios({
      method: 'POST',
      url: `/api/user/postreactions`,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          console.log(response);
        } else {
          console.log('error');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollLikes = () => {
    setLiked((prev: Boolean) => !prev);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    const likeData = {
      reactusername: `${userState.userData.username}`,
      pollusername: `${post.username}`,
      pollId: `${post.content.postId}`,
    };
    axios({
      method: 'POST',
      url: `/api/user/pollreactions`,
      headers: {
        'content-type': 'application/json',
        'auth-token': localStorage.getItem('authtoken'),
      },
      data: likeData,
    })
      .then(function (response) {
        if (response) {
          console.log(response);
        } else {
          console.log('error');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlePollVote = (choice: number) => {
    if (!pollVoted) {
      setPollVotes(pollVotes + 1);
      setPollVotes([...pollVotes, userState.userData.username]);
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
      reactusername: `${userState.userData.username}`,
      pollusername: `${post.username}`,
      pollId: `${post.content.pollId}`,
      voted: `${choice}`,
    };
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_SERVER_URL}/user/pollVote`,
      headers: {
        'content-type': 'application/json',
        'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
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
          console.log('error');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div
      key={post._id}
      className='w-full p-4 space-y-2 select-none scroll-mt-16 snap-start'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-1'>
          <Avatar src={post.profile_image} kind='default' size='md' />
          <div className='flex flex-col gap-[1px]'>
            <div className='flex items-center gap-1'>
              <span className='text-base font-semibold cursor-pointer text-vapormintWhite-100'>
                {post.username}
              </span>

              {/* <Tick /> */}
              {!userState.userData?.followee_count?.includes(post.username) &&
                userState.userData.username !== post.username && (
                  <span
                    onClick={() => handleFollowUser(post.username)}
                    className='text-sm font-medium cursor-pointer text-vapormintMint-300'>
                    Follow
                  </span>
                )}
            </div>
            <span className='text-sm font-semibold text-vapormintBlack-200'>
              {calculateTimeToToday(post.content.time)}
            </span>
          </div>
        </div>
        <Menu
          title={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6 cursor-pointer text-vapormintWhite-100'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
              />
            </svg>
          }>
          <div className='flex gap-1 flex-col items-start bg-vapormintBlack-300 rounded-lg border-[1px] border-vapormintBlack-200 p-2'>
            <span className='p-2 text-base font-semibold cursor-pointer text-vapormintWhite-100'>
              Report
            </span>
            <span className='p-2 text-base font-semibold cursor-pointer text-vapormintWhite-100'>
              Share
            </span>
          </div>
        </Menu>
      </div>
      <div className='flex items-start w-full gap-2 '>
        <div className='flex flex-col items-start flex-grow min-h-full gap-2'>
          <p className='mb-auto mr-3 text-base font-medium text-justify text-vapormintWhite-200'>
            {post.content.announcement}
          </p>{' '}
          {post.content_type === 'poll' && (
            <p className='mb-auto mr-3 text-base font-medium text-justify text-vapormintWhite-200'>
              {post.content.question}
            </p>
          )}
          {post.content.post_image && (
            <Image
              className={`w-full h-full object-cover rounded-lg border-[0.5px] border-vapormintBlack-200`}
              src={post.content.post_image}
              alt='loginImage'
              width={100}
              height={100}
            />
          )}
          {post.content.post_video && (
            <div className='w-full h-full object-cover rounded-lg border-[0.5px] border-vapormintBlack-200 aspect-video  '>
              <ReactPlayer
                className='w-full'
                width='100%'
                height={'100%'}
                playing={true}
                loop
                muted={true}
                volume={0.5}
                url={post.content.post_video}
                controls={true}
              />
            </div>
          )}
          {post.content_type === 'poll' && (
            <div className='w-full'>
              {post.content.options?.map((option: string, i: number) => {
                return (
                  <div
                    key={i}
                    // onClick={() => {
                    //   if (
                    //     !pollVoted &&
                    //     !votesArr.includes(
                    //       State.database.userData?.data?.user.username
                    //     )
                    //   ) {
                    //     handlePollVote(i);
                    //   }
                    // }}
                  >
                    <h1 className='cursor-pointer p-2 m-2 text-base font-medium text-justify text-vapormintWhite-200 rounded-lg border-[0.5px] border-vapormintWhite-200/40'>
                      {option}
                    </h1>
                  </div>
                );
              })}
              {/* <div className='space-x-2 text-sm text-brand4'>
                <span>{pollVotes}&nbsp; Votes</span>
              </div> */}
            </div>
          )}
        </div>
        <div className='flex flex-col items-center justify-end gap-3 mt-auto w-fit '>
          <div className='flex flex-col items-center gap-[2px]'>
            <LikeButton
              liked={liked}
              onClick={() =>
                post.content_type === 'poll'
                  ? handlePollLikes()
                  : handlePostLikes()
              }
            />

            <span className='text-xs font-semibold text-vapormintWhite-300'>
              {likesCount}
            </span>
          </div>
          {/* comments */}
          <div
            onClick={() => setShowComments(true)}
            className='flex flex-col items-center gap-[2px] cursor-pointer'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6 text-vapormintBlack-100'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
              />
            </svg>
            <span className='text-xs font-semibold text-vapormintWhite-300'>
              {commentCount}
            </span>
          </div>

          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-vapormintBlack-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg> */}

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 text-vapormintBlack-100'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z'
            />
          </svg>
        </div>
      </div>
      {post.content.tokenId && (
        <div className='flex gap-[2px] items-center'>
          <NftCoin />{' '}
          <span className='text-sm font-semibold text-vapormintBlack-200'>
            Owned by
          </span>
          <Avatar kind='default' size='xs' />
          <span className='text-sm font-semibold text-vapormintWhite-300'>
            Arlene McCoy
          </span>
          <span
            onClick={() => router.push(`/nft/1234`)}
            className='ml-4 text-sm font-semibold cursor-pointer text-vapormintSuccess-500'>
            View NFT
          </span>
        </div>
      )}

      {showComments && (
        <FullScreenOverlay
          animation='bottom'
          title={'Comments'}
          onClose={() => setShowComments(false)}>
          <Comments />
        </FullScreenOverlay>
      )}
    </div>
  );
}
