import axios from "axios";
import React from "react";
import { useState, useContext } from "react";
import { Camera, File, FileCheck, X } from "tabler-icons-react";
import PolygonToken from "../../../Assets/logos/PolygonToken";
import { uploadFile } from "../../../Helper/uploadHelper";
import { storeWithProgress, createToken } from "../../../Helper/nftMinter";
import useUserActions from "../../../Hooks/useUserActions";
import { MentionsInput, Mention } from "react-mentions";
import defaultStyle from "../defaultStyle";
import { UserContext } from "../../../Store";

function PhotoPostModal({ setphotoPostModalOpen }) {
  const State = useContext(UserContext);
  const [uploadingPost, setUploadingPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [caption, setCaption] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [nftPrice, setNFTPrice] = useState(1);
  const [loadFeed] = useUserActions();

  // Minting
  const [minting, setMinting] = useState(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  const renderData = [];
  State.database.userData?.data?.user?.followee_count.forEach((value, i) => {
    renderData.push({ id: value, display: value });
  });

  const handleImageChange = (event) => {
    // Update the state
    setSelectedPost({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleAdd = (e) => {
    tagged.push(e);
    console.log(tagged);
  };

  const [tagged, setTagged] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!uploadingPost) {
      let filter = [];
      tagged.forEach((value) => {
        if (caption.includes(value)) {
          filter.push(value);
        }
      });
      setUploadingPost(true);
      uploadFile(selectedPost.file)
        .then(async (cid) => {
          let formData = new FormData();
          formData.append("announcement", caption);
          formData.append("postImage", selectedPost.file[0]);
          formData.append("announcementHash", cid);
          formData.append("tagged", filter);
          console.log(filter);
          if (isNFT) {
            var ts = Math.round(new Date().getTime() / 1000);
            let metadata = {
              image:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
              external_url:
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
              description: `Post description`,
              name: caption,
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
                "https://ipfs.io/ipfs/" + cid + "/" + selectedPost.file[0].name,
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
                createToken(
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
                      `${process.env.REACT_APP_SERVER_URL}/user/announcement`,
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
                    .then(async (data) => {
                      setUploadingPost(false);
                      setSelectedPost(null);
                      setCaption("");
                      setTagged([]);
                      setphotoPostModalOpen(false);
                      await loadFeed();
                    })
                    .catch((err) => {
                      console.log(err);
                      setUploadingPost(false);
                      setSelectedPost(null);
                      setCaption("");
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
                `${process.env.REACT_APP_SERVER_URL}/user/announcement`,
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
              .then(async (data) => {
                setUploadingPost(false);
                setSelectedPost(null);
                setCaption("");
                setTagged([]);
                setphotoPostModalOpen(false);
                await loadFeed();
              })
              .catch((err) => {
                console.log(err);
                setUploadingPost(false);
                setSelectedPost(null);
                setCaption("");
                setTagged([]);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setUploadingPost(false);
          setSelectedPost(null);
          setCaption("");
        });
    }
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <Camera />
            Upload Photo
          </h3>
          <X
            onClick={() => setphotoPostModalOpen(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="w-full p-4 space-y-3">
          <label
            htmlFor="post_announcement_image"
            className=" cursor-pointer flex justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
          >
            {selectedPost ? (
              selectedPost.file ? (
                <div className="flex items-center">
                  <FileCheck className="text-emerald-700" />
                  {selectedPost.file[0].name.substring(0, 16)}
                </div>
              ) : (
                "No file choosen!"
              )
            ) : (
              <div className="flex items-center gap-1">
                <File />
                Choose file *
              </div>
            )}
            <input
              id="post_announcement_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              required={true}
              onClick={(event) => {
                event.target.value = null;
                setSelectedPost(null);
              }}
            />
            {selectedPost ? (
              selectedPost.file ? (
                <div className="flex-grow rounded-lg overflow-clip">
                  <img src={selectedPost.localurl}></img>
                </div>
              ) : null
            ) : (
              <></>
            )}
          </label>

          {/* <textarea
            className="textarea  w-full"
            placeholder="Enter caption."
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
          ></textarea> */}
          <MentionsInput
            multiline
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
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
          <progress
            class="progress progress-success w-56 hidden"
            value="50"
            max="100"
          ></progress>
          <button
            type={"submit"}
            className={`btn  ${
              !selectedPost?.file[0] ? "btn-disabled" : "btn-brand"
            } w-full ${uploadingPost ? "loading " : ""}`}
          >
            Post photo
          </button>
        </div>
      </form>
    </div>
  );
}

export default PhotoPostModal;
