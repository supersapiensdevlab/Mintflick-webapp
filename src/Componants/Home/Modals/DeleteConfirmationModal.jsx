import React, { useState } from "react";
import { X, AlertTriangle } from "tabler-icons-react";
import axios from "axios";
import useUserActions from "../../../Hooks/useUserActions";

const DeleteConfirmationModal = ({ setDeleteConfirmationModal, content }) => {
  const [loadFeed] = useUserActions();

  const handlePostDelete = () => {
    const data = content;
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_SERVER_URL}/user/postdelete`,
      data: data,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then(async (res) => {
        setDeleteConfirmationModal(false);
        await loadFeed();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
      <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
        <div className="flex justify-between items-center p-2">
          <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
            <AlertTriangle className="text-error" />
            Are you share you want to delete ?
          </h3>
          <X
            onClick={() => setDeleteConfirmationModal(false)}
            className="text-brand2 cursor-pointer"
          ></X>
        </div>
        <div className="bg-slate-700 my-4 w-full px-2">
          <button
            onClick={handlePostDelete}
            className="btn btn-error text-white w-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
