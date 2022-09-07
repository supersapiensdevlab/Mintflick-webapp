import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import {
  ChevronDown,
  ChevronUp,
  File,
  FileCheck,
  Video,
  X,
} from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";

function VideoPostModal({ setVideoPostModalOpen }) {
  const State = useContext(UserContext);
  const [loadFeed] = useUserActions();

  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const [advancedOptionsShow, setadvancedOptionsShow] = useState(false);
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  const category = [
    "Autos & Vehicles",
    " Music",
    "Pets & Animals",
    "Sports",
    "Travel & Events",
    "Gaming",
    "People & Blogs",
    "Comedy",
    "Entertainment",
    "News & Politics",
    " Howto & Style",
    "Education",
    "Science & Technology",
    "Nonprofits & Activism",
  ];
  const attribution = ["No Attribution", "Allow Attribution"];
  const commercialUse = ["Non Commercial", "Commercial Use"];
  const derivativeWorks = [
    "No-Selection",
    "No Derivative Works",
    "Share-Alike",
  ];

  const [tagged, setTagged] = useState([]);

  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [videoData, setVideoData] = useState({
    videoName: "",
    videoImage: "",
    videoFile: "",
    category: "",
    tags: [],
    description: "",
    allowAttribution: "",
    commercialUse: "",
    derivativeWorks: "",
  });

  const onVideoFileChange = (e) => {
    if (e.target.name === "videoFile") {
      setSelectedVideo({
        file: e.target.files[0],
        localurl: URL.createObjectURL(e.target.files[0]),
      });
      let videoName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setVideoData({ ...videoData, videoName: videoName });
    } else if (e.target.name === "videoImage") {
      setSelectedThumbnail({
        file: e.target.files[0],
        localurl: URL.createObjectURL(e.target.files[0]),
      });
      let videoImage = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setVideoData({ ...videoData, videoImage: videoImage });
    }
  };

  const handleAdd = (e) => {
    tagged.push(e);
    console.log(tagged);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadingVideo) {
      let filter = [];
      tagged.forEach((value) => {
        if (videoData.description.includes(value)) {
          filter.push(value);
        }
      });
      setUploadingVideo(true);
      const files = [selectedThumbnail.file, selectedVideo.file];
      storeWithProgress(files)
        .then((cid) => {
          let formData = new FormData(); // Currently empty
          formData.append(
            "userName",
            State.database.userData.data.user.username
          );
          formData.append(
            "userImage",
            State.database.userData.data.user.profile_image
          );

          formData.append("videoName", videoData.videoName);

          // tags.forEach((tag) => formData.append('tags', tag));

          formData.append("description", videoData.description);

          formData.append("category", videoData.category);
          formData.append("ratings", "");
          formData.append("allowAttribution", videoData.allowAttribution);
          formData.append("commercialUse", videoData.commercialUse);
          formData.append("derivativeWorks", videoData.commercialUse);
          formData.append("tagged", filter);
          formData.append("videoFile", selectedVideo.file, selectedVideo.name);
          formData.append(
            "videoImage",
            selectedThumbnail.file,
            selectedThumbnail.name
          );
          formData.append("videoHash", cid);

          if (isNFT) {
            var ts = Math.round(new Date().getTime() / 1000);
            let metadata = {
              image:
                "https://ipfs.io/ipfs/" +
                cid +
                "/" +
                selectedThumbnail.file.name,
              external_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedVideo.file.name,
              description: videoData.description,
              name: videoData.videoName,
              attributes: [
                {
                  display_type: "date",
                  trait_type: "Created On",
                  value: ts,
                },
                {
                  trait_type: "Category",
                  value: "Category",
                },
              ],
              animation_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedVideo.file.name,
            };

            function convertBlobToFile(blob, fileName) {
              blob.lastModifiedDate = new Date();
              blob.name = fileName;
              return blob;
            }

            const blob = new Blob([JSON.stringify(metadata)], {
              type: "application/json",
            });
            var file = convertBlobToFile(blob, "meta.json");
            console.log(file);

            uploadFile(file)
              .then(async (cid) => {
                console.log("stored files with cid:", cid);
                await createToken(
                  "https://ipfs.io/ipfs/" + cid + "meta.json",
                  nftPrice,
                  window.ethereum,
                  setMinting,
                  setMintingProgress
                ).then(async (tokenId) => {
                  console.log("TOKEN ID Created : ", tokenId); // token created
                  formData.append("tokenId", tokenId);
                  axios
                    .post(
                      `${process.env.REACT_APP_SERVER_URL}/upload_video`,
                      formData,
                      {
                        headers: {
                          "content-type": "multipart/form-data",
                          "auth-token": JSON.stringify(
                            localStorage.getItem("authtoken")
                          ),
                        },
                      }
                    )
                    .then((res) => {
                      clearState();
                      setTagged([]);
                    })
                    .catch((err) => {
                      console.log(err);
                      clearState();
                      setTagged([]);
                    });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            axios
              .post(
                `${process.env.REACT_APP_SERVER_URL}/upload_video`,
                formData,
                {
                  headers: {
                    "content-type": "multipart/form-data",
                    "auth-token": JSON.stringify(
                      localStorage.getItem("authtoken")
                    ),
                  },
                }
              )
              .then((res) => {
                clearState();
                setTagged([]);
              })
              .catch((err) => {
                console.log(err);
                clearState();
                setTagged([]);
              });
          }

          // formData.append('meta_url', cid); // meta_url is the IPFS hash of the meta.json file

          // setFormData(formData);
        })
        .catch((err) => {
          console.log(err);
          clearState();
          setTagged([]);
        });
    }
  };
  const clearState = async () => {
    setUploadingVideo(false);
    setVideoPostModalOpen(false);
    setSelectedVideo(null);
    setSelectedThumbnail(null);
    setVideoData({
      videoName: "",
      videoImage: "",
      videoFile: "",
      category: "",
      tags: [],
      description: "",
      allowAttribution: "",
      commercialUse: "",
      derivativeWorks: "",
    });
    setIsNFT(false);
    setNFTPrice(1);
    await loadFeed();
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Video />
            Upload Video
          </h3>
          <X
            onClick={() => {
              clearState();
              setTagged([]);
            }}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-1">
            <label
              htmlFor="videothumbnail" className="  max-h-52 cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4">
              {selectedThumbnail ? (
                selectedThumbnail.file ? (
                  <div className="w-full  rounded-lg overflow-clip my-auto ">
                    <img src={selectedThumbnail.localurl}></img>
                  </div>
                ) : null
              ) : (
                <></>
              )}
              <div
                htmlFor="videothumbnail"
                className="flex cursor-pointer gap-1"
              >
                <input
                  id="videothumbnail"
                  type="file"
                  name="videoImage"
                  accept=".jpg,.png,.jpeg,.gif,.webp"
                  onChange={onVideoFileChange}
                  className="sr-only "
                  required={true}
                />
                {selectedThumbnail && selectedThumbnail.file ? (
                  <FileCheck className="text-emerald-700" />
                ) : (
                  <File />
                )}
                {selectedThumbnail && selectedThumbnail.file
                  ? selectedThumbnail.file.name.substring(0, 16)
                  : "Choose video thumbnail"}
              </div>
            </label>
            <div className=" max-h-52 cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4">
              {selectedVideo ? (
                selectedVideo.localurl ? (
                  <div className="rounded-lg overflow-clip ">
                    <ReactPlayer
                      className="w-full"
                      width="100%"
                      height={"100%"}
                      playing={true}
                      muted={true}
                      volume={0.5}
                      url={selectedVideo.localurl}
                      controls={true}
                    />
                  </div>
                ) : null
              ) : (
                <></>
              )}
              <label className="flex cursor-pointer gap-1" htmlFor="videofile">
                <input
                  id="videofile"
                  type="file"
                  accept=".mp4, .mkv, .mov, .avi"
                  name="videoFile"
                  onChange={onVideoFileChange}
                  className="sr-only "
                  required={true}
                />
                {selectedVideo && selectedVideo.file ? (
                  <FileCheck className="text-emerald-700" />
                ) : (
                  <File />
                )}
                {selectedVideo && selectedVideo.file
                  ? selectedVideo.file.name.substring(0, 16)
                  : "Choose video file"}
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Video title"
              className="input w-full "
              value={videoData.videoName}
              onChange={(e) =>
                setVideoData({ ...videoData, videoName: e.target.value })
              }
              required={true}
            />
            <select
              className="select w-44"
              onChange={(e) =>
                setVideoData({ ...videoData, category: e.target.value })
              }
            >
              <option disabled selected>
                Pick Category
              </option>
              {category.map((c) => (
                <option>{c}</option>
              ))}
            </select>
          </div>

          {/* <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) =>
              setVideoData({ ...videoData, description: e.target.value })
            }
            value={videoData.description}
          ></textarea> */}
          <MentionsInput
            value={videoData.description}
            onChange={(e) =>
              setVideoData({ ...videoData, description: e.target.value })
            }
            style={defaultStyle}
            className="textarea w-full h-24  pt-2 focus:outline-0"
            placeholder={"Enter caption."}
            a11ySuggestionsListLabel={"Suggested mentions"}
          >
            <Mention
              trigger="@"
              data={renderData}
              markup="@__display__"
              appendSpaceOnAdd
              onAdd={handleAdd}
            />
          </MentionsInput>
          <span
            onClick={() => setadvancedOptionsShow(!advancedOptionsShow)}
            className="flex px-2 items-center gap-1 font-semibold text-brand3 cursor-pointer"
          >
            Advanced options
            <label
              class={`swap ${advancedOptionsShow && "swap-active"
                } swap-rotate text-6xl`}
            >
              <div class="swap-on">
                <ChevronUp />
              </div>
              <div class="swap-off">
                <ChevronDown />
              </div>
            </label>
          </span>
          {advancedOptionsShow && (
            <div className="flex gap-1 w-full ">
              <select
                className="select select-xs "
                onChange={(e) =>
                  setVideoData({
                    ...videoData,
                    allowAttribution: e.target.value,
                  })
                }
              >
                <option disabled selected>
                  Allow Attribution?
                </option>
                {attribution.map((c) => (
                  <option>{c}</option>
                ))}
              </select>
              <select
                className="select select-xs "
                onChange={(e) =>
                  setVideoData({ ...videoData, commercialUse: e.target.value })
                }
              >
                <option disabled selected>
                  Commercial Use?
                </option>
                {commercialUse.map((c) => (
                  <option>{c}</option>
                ))}
              </select>
              <select
                className="select select-xs "
                onChange={(e) =>
                  setVideoData({
                    ...videoData,
                    derivativeWorks: e.target.value,
                  })
                }
              >
                <option disabled selected>
                  Derivative Works?
                </option>
                {derivativeWorks.map((c) => (
                  <option>{c}</option>
                ))}
              </select>
            </div>
          )}

          <div className="w-fit flex space-x-2">
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                value={isNFT}
                onChange={() => setIsNFT(!isNFT)}
                className="checkbox checkbox-primary"
              />
              <span className="label-text text-brand3">Mint as NFT</span>
            </label>
            {isNFT && (
              <div className="form-control">
                <label className="input-group">
                  <input
                    min={1}
                    type="number"
                    placeholder="1"
                    className="input input-bordered input-sm w-24"
                    value={nftPrice}
                    onChange={(e) => setNFTPrice(e.target.value)}
                    required={true}
                  />
                  <span className="text-brand3 bg-slate-300 dark:bg-slate-600 ">
                    <PolygonToken></PolygonToken> &nbsp; Matic
                  </span>
                </label>
              </div>
            )}
          </div>
          <button
            type={"submit"}
            className={`btn  w-full  ${selectedVideo?.file && selectedThumbnail?.file
                ? "btn-brand"
                : "btn-disabled"
              } ${uploadingVideo ? "loading" : "btn-ghost"}`}
          >
            Post Video
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoPostModal;
