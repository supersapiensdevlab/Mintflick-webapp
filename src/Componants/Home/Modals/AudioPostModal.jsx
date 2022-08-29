import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  File,
  FileCheck,
  FileMusic,
  Music,
  Video,
  X,
} from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

function AudioPostModal({ setAudioPostModalOpen }) {
  const State = useContext(UserContext);
  const [loadFeed] = useUserActions();
  const genre = [
    "EDM",
    "Rock",
    "Jazz",
    "Dubsteps",
    "Rhythm & Blues",
    "Techno",
    "Country Music",
    "Electro",
    "Indies Rock",
    "Pop",
  ];

  const mood = [
    "Happy",
    "Exuberant",
    "Energetic",
    "Frantic",
    "Anxious/Sad",
    "Depression",
    "Calm",
    "Contentment",
  ];

  const attribution = ["No Attribution", "Allow Attribution"];

  const commercialUse = ["Non Commercial", "Commercial Use"];

  const derivativeWorks = [
    "No-Selection",
    "No Derivative Works",
    "Share-Alike",
  ];

  const suggestions = ["Games", "Edu", "Sci-Fi", "Counter-Strike"];

  const [advancedOptionsShow, setadvancedOptionsShow] = useState(false);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);

  const [uploadingTrack, setUploadingTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const [track, setTrack] = useState({
    trackName: "",
    trackImage: "",
    trackFile: "",
    albumArt: "",
    fileName: "",
    cid: "",
    genre: "",
    mood: "",
    tags: [],
    description: "",
    royalty: 5,
    isrc: "",
    iswc: "",
    allowAttribution: "",
    commercialUse: "",
    derivativeWorks: "",
    mintTrxHash: "",
  });

  const onTrackFileChange = (e) => {
    if (e.target.name === "trackFile") {
      setSelectedTrack({
        file: e.target.files[0],
        localurl: URL.createObjectURL(e.target.files[0]),
      });
      let trackName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setTrack({ ...track, trackName: trackName });
    } else if (e.target.name === "trackImage") {
      setSelectedThumbnail({
        file: e.target.files[0],
        localurl: URL.createObjectURL(e.target.files[0]),
      });
      let trackImage = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setTrack({ ...track, trackImage: trackImage });
    }
  };

  const clearState = async () => {
    setUploadingTrack(false);
    setAudioPostModalOpen(false);
    setSelectedTrack(null);
    setSelectedThumbnail(null);
    setTrack({
      trackName: "",
      trackImage: "",
      trackFile: "",
      albumArt: "",
      fileName: "",
      cid: "",
      genre: "",
      mood: "",
      tags: [],
      description: "",
      royalty: 5,
      isrc: "",
      iswc: "",
      allowAttribution: "",
      commercialUse: "",
      derivativeWorks: "",
      mintTrxHash: "",
    });
    setIsNFT(false);
    setNFTPrice(1);
    await loadFeed();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadingTrack) {
      setUploadingTrack(true);
      const files = [selectedThumbnail.file, selectedTrack.file];
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
          formData.append("trackName", track.trackName);
          formData.append("genre", track.genre);
          formData.append("mood", track.mood);

          // tags.forEach((tag) => formData.append('tags', tag));

          formData.append("description", track.description);
          formData.append("isrc", track.isrc);
          formData.append("iswc", track.iswc);
          formData.append("allowAttribution", track.allowAttribution);
          formData.append("commercialUse", track.commercialUse);
          formData.append("derivativeWorks", track.derivativeWorks);
          formData.append(
            "trackFile",
            selectedTrack.file,
            selectedTrack.file.name
          );
          formData.append(
            "trackImage",
            selectedThumbnail.file,
            selectedThumbnail.file.name
          );
          formData.append("trackHash", cid);
          if (isNFT) {
            var ts = Math.round(new Date().getTime() / 1000);
            let metadata = {
              image:
                "https://ipfs.io/ipfs/" +
                cid +
                "/" +
                selectedThumbnail.file.name,
              external_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedTrack.file.name,
              description: track.description,
              name: track.trackName,
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
                "https://ipfs.io/ipfs/" + cid + "/" + selectedTrack.file.name,
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
                      `${process.env.REACT_APP_SERVER_URL}/upload_music`,
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
                    })
                    .catch((err) => {
                      console.log(err);
                      clearState();
                    });
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            axios
              .post(
                `${process.env.REACT_APP_SERVER_URL}/upload_music`,
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
              })
              .catch((err) => {
                console.log(err);
                clearState();
              });
          }

          // axios
          //   .post(`${process.env.REACT_APP_SERVER_URL}/upload_music`, formData, {
          //     headers: {
          //       'content-type': 'multipart/form-data',
          //       'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
          //     },
          //   })
          //   .then((res) => {
          //     clearState()
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //     clearState()
          //   });
        })
        .catch((err) => {
          console.log(err);
          clearState();
        });
    }
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Music />
            Upload Audio
          </h3>
          <X
            onClick={() => setAudioPostModalOpen(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-1">
            <div className=" cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4">
              {selectedThumbnail ? (
                selectedThumbnail.file ? (
                  <div className="w-full  rounded-lg overflow-clip">
                    <img src={selectedThumbnail.localurl}></img>
                  </div>
                ) : null
              ) : (
                <></>
              )}
              <label
                htmlFor="trackthumbnail"
                className="flex gap-1 cursor-pointer"
              >
                <input
                  id="trackthumbnail"
                  type="file"
                  name="trackImage"
                  accept=".jpg,.png,.jpeg,.gif,.webp"
                  onChange={onTrackFileChange}
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
                  : "Choose album image"}
              </label>
            </div>
            <div
              htmlFor=""
              className=" cursor-pointer flex flex-col items-start gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
            >
              {selectedTrack ? (
                selectedTrack.file ? (
                  // <div className='rounded-lg overflow-clip'>
                  //   <img
                  //     src={
                  //       "https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
                  //     }></img>
                  // </div>
                  <></>
                ) : null
              ) : (
                <></>
              )}
              <label htmlFor="trackfile" className="flex gap-1 cursor-pointer">
                <input
                  required
                  id="trackfile"
                  type="file"
                  accept=".mp3"
                  name="trackFile"
                  onChange={onTrackFileChange}
                  className="sr-only "
                />
                {selectedTrack && selectedTrack.file ? (
                  <FileCheck className="text-emerald-700" />
                ) : (
                  <FileMusic />
                )}
                {selectedTrack && selectedTrack.file
                  ? selectedTrack.file.name.substring(0, 16)
                  : "Choose audio file"}
              </label>
            </div>
          </div>
          <input
            type="text"
            placeholder="Track name"
            className="input w-full "
            value={track.trackName}
            onChange={(e) => setTrack({ ...track, trackName: e.target.value })}
            required
          />
          <div className="flex space-x-2">
            <select
              className="select flex-grow"
              onChange={(e) => setTrack({ ...track, genre: e.target.value })}
            >
              <option disabled selected>
                Genre
              </option>
              {genre.map((c) => (
                <option>{c}</option>
              ))}
            </select>
            <select
              className="select flex-grow"
              onChange={(e) => setTrack({ ...track, mood: e.target.value })}
            >
              <option disabled selected>
                Mood
              </option>
              {mood.map((c) => (
                <option>{c}</option>
              ))}
            </select>
          </div>

          <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) =>
              setTrack({ ...track, description: e.target.value })
            }
            value={track.description}
          ></textarea>
          <span
            onClick={() => setadvancedOptionsShow(!advancedOptionsShow)}
            className="flex px-2 items-center gap-1 font-semibold text-brand3 cursor-pointer"
          >
            Advanced options
            <label
              class={`swap ${
                advancedOptionsShow && "swap-active"
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
            <>
              <div className="flex flex-col lg:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Track ISRC"
                  className="input flex-grow "
                  value={track.isrc}
                  onChange={(e) => setTrack({ ...track, isrc: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Track ISWC"
                  className="input flex-grow "
                  value={track.iswc}
                  onChange={(e) => setTrack({ ...track, iswc: e.target.value })}
                />
              </div>
              <div className="flex gap-1 w-full flex-wrap">
                <select
                  className="select select-xs flex-grow"
                  onChange={(e) =>
                    setTrack({ ...track, allowAttribution: e.target.value })
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
                  className="select select-xs flex-grow"
                  onChange={(e) =>
                    setTrack({ ...track, commercialUse: e.target.value })
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
                  className="select select-xs flex-grow"
                  onChange={(e) =>
                    setTrack({ ...track, derivativeWorks: e.target.value })
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
            </>
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

          {/* While minting NFT */}
          {/* <div className="flex flex-col text-center">
                        <div
                            className={`${minting === true ? 'block' : 'hidden'} mx-3 text-white my-5 `}
                        >
                            👻 Confirm NFT Mint on the next Popup
                        </div>
                        {minting === 'token created' ? (
                            <div className={`  mx-3 text-white my-5 `}>
                                ✅ NFT Token Created Successfully. Confirm Market Listing on the Popup
                            </div>
                        ) : null}

                        <div
                            className={`${mintingProgress === 66 ? 'block' : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-white">Wrapping Up Things &nbsp;</p>
                            <p className="no-underline  text-white"> Please Wait...</p>
                        </div>

                        <div
                            className={`${minting !== null &&
                                minting !== true &&
                                mintingProgress === 100 &&
                                minting !== 'token created'
                                ? 'block'
                                : 'hidden'
                                } text-center flex mx-3 my-5`}
                        >
                            <p className="no-underline  text-dbeats-light">🚀 NFT Minted &nbsp;</p>
                            <a
                                target={'_blank'}
                                rel="noopener noreferrer "
                                className="dark:text-dbeats-light cursor-pointer underline  "
                                href={`https://polygonscan.com/tx/${minting}`}
                            >
                                Check on Polygonscan
                            </a>
                        </div>
                        <ProgressBar
                            className="w-full mx-auto"
                            percent={mintingProgress}
                            transitionDuration={1000}
                            filledBackground="linear-gradient(to right,  #31c48D, #3f83f8)"
                        >
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon3}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-8"
                                        src={icon2}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        className="w-6"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                            <Step transition="scale">
                                {({ accomplished }) => (
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }}
                                        width="30"
                                        src={icon1}
                                    />
                                )}
                            </Step>
                        </ProgressBar>
                    </div> */}

          <button
            type={"submit"}
            className={`btn  w-full ${
              uploadingTrack ? "loading" : "btn-brand"
            }`}
          >
            Post audio
          </button>
        </div>
      </form>
    </div>
  );
}

export default AudioPostModal;
