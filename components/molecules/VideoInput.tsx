import ReactPlayer from "react-player";

function sanitizeFilename(file: any) {
  // const sanitized = file.name.replace(/[^\w\s\.\-]/g, "_");

  // // Trim whitespace from the beginning and end of the filename
  // const trimmed = sanitized.trim();

  // // Replace multiple spaces with a single space
  // const normalized = trimmed.replace(/\s+/g, " ");

  // // Limit the filename to 255 characters
  // const newFilename = normalized.slice(0, 255);
  const newFilename = file.name.replace(/[^a-zA-Z0-9\.]/g, "_");
  const renamedFile = new File([file], newFilename, { type: file.type });
  return renamedFile;
}

type Props = {
  label: String;
  selectedVideo: any;
  setSelectedVideo: Function;
};

export default function VideoInput(props: Props) {
  //   const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const onVideoFileChange = (event: any) => {
    event?.target.files[0]
      ? props.setSelectedVideo({
          file: sanitizeFilename(event.target.files[0]),
          localurl: URL.createObjectURL(event?.target.files[0]),
        })
      : props.setSelectedVideo(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer border-vapormintBlack-200 text-brand4">
      {props.selectedVideo && props.selectedVideo.localurl && (
        <div className="object-cover w-full overflow-hidden rounded-lg aspect-video bg-vapormintBlack-200">
          <ReactPlayer
            className="w-full"
            width="100%"
            height={"100%"}
            playing={true}
            muted={true}
            volume={0.5}
            url={props.selectedVideo.localurl}
            controls={true}
          />
        </div>
      )}
      <label className="flex items-center justify-start w-full gap-2 text-base font-semibold capitalize text-vapormintWhite-100">
        <input
          id="videofile"
          type="file"
          accept=".mp4, .mkv, .mov, .avi"
          name="videoFile"
          onChange={onVideoFileChange}
          className="sr-only "
          required={true}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>

        {props.selectedVideo && props.selectedVideo.file
          ? props.selectedVideo.file.name.substring(0, 16)
          : props.label}
      </label>
    </div>
  );
}
