import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { X, Pencil, FileCheck, File } from "tabler-icons-react";
import { sanitizeFilename } from "../../../functions/sanitizeFilename";
import { uploadFile } from "../../../Helper/uploadHelper";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";

const ProfileImageModal = ({ setShowProfileImageModal }) => {
  const State = useContext(UserContext);
  const hiddenFileInput = useRef(null);

  const [selectedProfileImageChange, setselectedProfileImageChange] =
    useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loadFeed, loadUser, loadProfileCard] = useUserActions();

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleImageChange = (event) => {
    // Update the state

    const file = sanitizeFilename(event.target.files[0]);
    console.log(file);
    setselectedProfileImageChange({
      file: [file],
      localurl: URL.createObjectURL(event.target.files[0]),
    });
  };

  const handleUpdateProfileImage = () => {
    if (selectedProfileImageChange && selectedProfileImageChange.file[0]) {
      setUploadingImage(true);
      uploadFile(selectedProfileImageChange?.file)
        .then(async (cid) => {
          const formData = new FormData();
          formData.append(
            "username",
            State.database.userData?.data?.user?.username
          );
          formData.append("profileImage", selectedProfileImageChange.file[0]);
          formData.append("imageHash", cid);

          axios
            .post(
              `${process.env.REACT_APP_SERVER_URL}/user/profileimage`,
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
            .then(async (res) => {
              await loadUser().then(async () => {
                State.toast("success", "Profile photo updated successfully!");

                await loadProfileCard();
                setUploadingImage(false);
                setShowProfileImageModal(false);
                setselectedProfileImageChange(null);
              });
            })
            .catch((error) => {
              console.log(error);
              State.toast("error", error.message);
              setUploadingImage(false);
            });
        })
        .catch((error) => {
          console.log(error);
          State.toast("error", error.message);
          setUploadingImage(false);
        });
    }
  };

  useEffect(() => {
    console.log(selectedProfileImageChange?.localurl);
  }, [selectedProfileImageChange]);

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <p className="flex space-x-2 items-center">
              <Pencil size={24} /> <p>Update Profile Image</p>
            </p>
          </h3>

          <X
            className="text-brand2 cursor-pointer"
            onClick={() => {
              setShowProfileImageModal(false);
              setselectedProfileImageChange(null);
              setUploadingImage(false);
            }}
          ></X>
        </div>
      </div>
      <div className="flex flex-col p-4 w-full">
        <label
          onClick={handleClick}
          className=" cursor-pointer flex flex-col   items-start   gap-2  w-full p-2 border-2 border-slate-400 dark:border-slate-600 border-dashed rounded-lg text-brand4"
        >
          {selectedProfileImageChange &&
            selectedProfileImageChange.localurl && (
              <div className="w-full flex items-center justify-center rounded-lg aspect-square  dark:bg-slate-900 bg-slate-300 overflow-clip">
                <img src={selectedProfileImageChange.localurl}></img>
              </div>
            )}
          {selectedProfileImageChange ? (
            selectedProfileImageChange.file ? (
              <div className="flex items-center truncate ">
                <FileCheck className="text-emerald-700" />
                <span className="flex-grow truncate text-brand2">
                  {selectedProfileImageChange.file[0].name}
                </span>
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
        </label>
        <input
          ref={hiddenFileInput}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          onClick={(event) => {
            event.target.value = null;
            setselectedProfileImageChange(null);
            console.log("setting null");
          }}
        />
        <div className="my-4">
          <button
            onClick={handleUpdateProfileImage}
            className={`btn  ${
              !selectedProfileImageChange?.file[0]
                ? "btn-disabled"
                : "btn-brand"
            } w-full ${
              uploadingImage ? "loading " : ""
            } flex space-x-1 capitalize`}
          >
            <p>Update Image</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageModal;
