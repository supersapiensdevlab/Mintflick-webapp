import React, { useState } from 'react';
import Divider from '../molecules/Divider';
import Avatar from '../molecules/Avatar';

type Props = {};

function Comment() {
  return (
    <div className="w-full px-4 py-2 border-b-[1px] border-b-vapormintBlack-200  ">
      <div className="flex items-center gap-1">
        <Avatar kind="default" size="xs" />
        <span className="text-base font-semibold text-vapormintWhite-100">
          Esther Howard
        </span>
        <span className="text-base font-semibold text-vapormintBlack-200">
          1 hour ago
        </span>
      </div>
      <div className="w-full pl-9">
        <p className="w-full text-sm font-semibold text-vapormintBlack-100">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
      </div>{' '}
      <div className="flex items-center w-full gap-4 py-2 pl-9 placeholder-sky-900">
        <span className="text-base font-bold cursor-pointer text-vapormintBlack-200">
          See 12 Replies
        </span>
        <span className="ml-auto text-base font-bold cursor-pointer text-vapormintBlack-100">
          Like
        </span>
        <span className="text-base font-bold cursor-pointer text-vapormintBlack-100">
          Reply
        </span>
        <span className="text-base font-bold cursor-pointer text-vapormintError-500">
          Delete
        </span>
      </div>
    </div>
  );
}

export default function Comments({}: Props) {
  const [comment, setComment] = useState('');
  return (
    <div className="flex flex-col items-center w-full h-full bg-vapormintBlack-300">
      <div className="flex flex-col flex-grow w-full pb-12 overflow-y-auto scrollbar-none">
        <span className="w-full px-4 py-2 text-base font-semibold text-center text-vapormintWhite-300">
          12K Comments
        </span>{' '}
        <Divider kind="center" size={1} />
        <Comment /> <Comment /> <Comment /> <Comment /> <Comment /> <Comment />{' '}
        <Comment /> <Comment /> <Comment />
      </div>
      <div className="relative flex items-center w-full p-4 mb-4">
        <span className="absolute top-0 left-0 w-full h-12 -translate-y-full bg-gradient-to-t from-vapormintBlack-300 "></span>
        <input
          className={`w-5/6  scrollbar-none text-base font-medium rounded-none    text-vapormintWhite-100 bg-vapormintBlack-300 focus:outline-none `}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          placeholder={'Add comment'}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 mx-auto -rotate-45 cursor-pointer text-vapormintWhite-100"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </div>
    </div>
  );
}
