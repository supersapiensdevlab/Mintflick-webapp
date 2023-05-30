'use client';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Feed from './Feed';
import Fab from '@/components/molecules/Fab';
import { useRouter } from 'next/navigation';

type Props = {};

export default function page({}: Props) {
  const router = useRouter();
  return (
    <FullscreenContainer className="relative border-x-[1px] border-vapormintBlack-200/60 flex flex-col items-start max-w-lg mx-auto overflow-hidden bg-vapormintBlack-300">
      <Feed />
      <Fab
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        }
        kind="mint"
        onClick={() => router.push('/new_post')}
        size="small"
        text={'New Post'}
      />
    </FullscreenContainer>
  );
}
