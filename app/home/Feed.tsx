import Post from "@/components/organisms/Post";

type Props = {};

export default function Feed({}: Props) {
  return (
    <div className="snap-y w-full h-full py-16 overflow-y-scroll divide-y-[1px] divide-vapormintBlack-200/60 scrollbar-none">
      <Post /> <Post /> <Post /> <Post /> <Post /> <Post /> <Post /> <Post />
      <Post />
    </div>
  );
}
