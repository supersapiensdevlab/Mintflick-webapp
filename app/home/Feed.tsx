import Post from '@/components/organisms/Post';
import { UserContext } from '@/contexts/userContext';
import axios from 'axios';
import { useContext, useEffect, useMemo, useState } from 'react';

type Props = {};

export default function Feed({}: Props) {
  const userState = useContext(UserContext);
  const [feed, setfeed] = useState([]);
  // const feed = useMemo(() => loadFeed(), []);
  function loadFeed() {
    axios
      .get(`/api/feed`)
      .then((res) => {
        console.log(res);
        setfeed(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className='snap-y w-full h-full py-16 lg:py-2 overflow-y-scroll divide-y-[1px] divide-vapormintBlack-200/60 scrollbar-none'>
      {feed.length !== 0 ? (
        feed?.map((post: any) => <Post post={post} />)
      ) : (
        //loading animation
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6 mx-auto mt-12 animate-spin text-vapormintWhite-100'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
          />
        </svg>
      )}
    </div>
  );
}
