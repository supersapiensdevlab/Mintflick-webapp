import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { X, Pencil, FileCheck, File } from "tabler-icons-react";
import { uploadFile } from "../../../Helper/uploadHelper";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

const CoverImageModal = ({ setShowCoverImageModal }) => {
  const State = useContext(UserContext);
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [uploadSucess, setUploadSuccess] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  const handleImageChange = (event) => {
    // Update the state
    setSelectedCoverImage({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleUpdateCoverImage = () => {
    if (selectedCoverImage && selectedCoverImage.file[0]) {
      setUploadingImage(true);
      uploadFile(selectedCoverImage?.file[0]).then(async (cid) => {
        const formData = new FormData();
        formData.append(
          "username",
          State.database.userData?.data?.user?.username
        );
        formData.append("coverImage", selectedCoverImage.file[0]);
        formData.append("imageHash", cid);

        axios
          .post(
            `${process.env.REACT_APP_SERVER_URL}/user/coverimage`,
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
                "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
              },
            }
          )
          .then(async (res) => {
            await loadUser().then(() => {
              setUploadingImage(false);
              setUploadSuccess("Image Updated Successfully");
            });
            await loadProfileCard();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <p className="flex space-x-2 items-center">
              <Pencil size={24} /> <p>Update Cover Image</p>
            </p>
          </h3>

          <X
            className="text-brand2 cursor-pointer"
            onClick={() => {
              setShowCoverImageModal(false);
              setSelectedCoverImage(null);
              setUploadSuccess(null);
              setUploadingImage(false);
            }}
          ></X>
        </div>
      </div>
      <div className="flex flex-col p-4 w-full">
        <label
          htmlFor="coverimage"
          className=" cursor-pointer flex justify-between items-center gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
        >
          {selectedCoverImage ? (
            selectedCoverImage.file ? (
              <div className="flex items-center">
                <FileCheck className="text-emerald-700" />
                {selectedCoverImage.file[0].name.substring(0, 16)}
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
            id="coverimage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
            required={true}
            onClick={(event) => {
              event.target.value = null;
              setSelectedCoverImage(null);
            }}
          />
          {selectedCoverImage ? (
            selectedCoverImage.file ? (
              <div className="flex-grow rounded-lg overflow-clip">
                <img src={selectedCoverImage.localurl}></img>
              </div>
            ) : null
          ) : (
            <></>
          )}
        </label>
        {uploadSucess && (
          <p className="text-green-500 text-center mt-4">{uploadSucess}</p>
        )}
        <div className="my-4">
          <button
            onClick={handleUpdateCoverImage}
            className={`btn  ${
              !selectedCoverImage?.file[0] ? "btn-disabled" : "btn-brand"
            } w-full ${
              uploadingImage ? "loading " : ""
            } flex space-x-1 capitalize`}
          >
            <Pencil size={16} />
            <p>Update Image</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverImageModal;
