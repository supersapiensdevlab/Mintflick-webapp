import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  File,
  FileCheck,
  Plus,
  Trash,
  X,
} from "tabler-icons-react";
import { makeStorageClient } from "../../Helper/uploadHelper";

function QuestAdmin() {
  const navigateTo = useNavigate();
  const [loading, setloading] = useState(false);
  const [uploadingFile, setuploadingFile] = useState(false);
  const [open, setopen] = useState(false);
  const [questName, setquestName] = useState("");
  const [questDescription, setquestDescription] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostUrl, setSelectedPostUrl] = useState(null);
  const [tasks, settasks] = useState([]);
  const [task, settask] = useState({
    taskId: "",
    name: "",
    description: "",
    points: "",
    action: "scan",
  });

  const [data, setData] = useState([
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: true,
    },
    {
      description:
        "Supermeet is back with it's Jaipur edition! This time for Builders, Creators, Operators and those that are web3 curious. Get access to the Superteam network & earning opportunities. We might have some special alpha for those that join us. You don’t want to miss this one! 🙂",
      topic: "Quest1",
      img: "https://gameranx.com/wp-content/uploads/2022/06/DiabloImmortal-Tower.jpg",
      status: false,
    },
  ]);
  async function storeFile(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {};
    const file = [files[0]];
    const totalSize = files[0].size;
    let uploaded = 0;
    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = totalSize / uploaded;
      // setUploading(10 - pct);
      // console.log(`Uploading... ${pct}% complete`);
    };

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(file, { onRootCidReady, onStoredChunk });
  }

  const handleImageChange = (event) => {
    // Update the state
    setSelectedPost({
      file: event.target.files,
      localurl: URL.createObjectURL(event.target.files[0]),
    });

    setuploadingFile(true);
    storeFile(event.target.files).then(async (cid) => {
      setuploadingFile(false);
      setSelectedPostUrl(
        "https://ipfs.io/ipfs/" + cid + "/" + event.target.files[0].name
      );
      console.log(
        "https://ipfs.io/ipfs/" + cid + "/" + event.target.files[0].name
      );
    });

    return;
  };

  function addQuest() {
    setloading(true);
    axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/quest/add`,

      headers: {
        "content-type": "multipart/form-data",
        "auth-token": localStorage.getItem("authtoken"),
      },
      data: {
        name: questName,
        banner: selectedPostUrl,
        description: questDescription,
        tasks: tasks,
      },
    })
      .then((response) => {
        {
          console.log(response);
          setloading(false);
          setopen(false);
          setquestName("");
          setSelectedPost(null);
          setquestDescription("");
          settasks([]);
        }
      })
      .catch(function (error) {
        console.log(error.response);

        setloading(false);
      });
  }
  return (
    <div className="lg:px-12  w-screen h-screen  bg-white dark:bg-slate-900 flex flex-col items-center">
      {/* <div className='hidden lg:flex flex-col h-full w-1/4 ml-12 pt-24  space-y-6 overflow-y-auto'>
        <Filter></Filter>
        <EventCategories></EventCategories>
      </div> */}
      <div className="w-full p-4 flex items-center  max-w-3xl mx-auto">
        <button
          onClick={() => navigateTo("/")}
          className="flex justify-center items-center text-brand3 font-semibold"
        >
          <ChevronLeft />
          Back
        </button>
        <span className="text-xl font-bold text-brand1 mx-auto">
          Quest admin
        </span>
      </div>
      <div className="flex-grow w-full py-4 overflow-y-auto">
        {data.map((quest) => (
          <div
            onClick={() => navigateTo("/quest-details-admin")}
            className="p-4 m-2 h-fit w-full max-w-3xl mx-auto  sm:rounded-lg bg-white dark:bg-slate-700 sm:hover:scale-105 cursor-pointer transition-all ease-in-out shadow-xl overflow-hidden"
          >
            <p className="w-48 text-lg font-semibold text-brand1 truncate">
              {quest.topic}
            </p>
          </div>
        ))}
      </div>{" "}
      <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
        <button
          onClick={() => setopen(true)}
          className="btn w-full btn-brand rounded-full capitalize"
        >
          Add Quest
        </button>
      </div>
      {open && (
        <div className="h-screen w-screen fixed top-0">
          <div className="flex flex-col h-full w-full p-0 bg-slate-100 dark:bg-slate-800 ">
            <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
              <div className="flex justify-between items-center p-2">
                <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
                  Add Quest
                </h3>
                <X
                  onClick={() => setopen()}
                  className="text-brand2 cursor-pointer"
                ></X>
              </div>
            </div>
            <div className="flex-grow w-full max-w-3xl p-4  overflow-y-auto flex flex-col items-center justify-start mx-auto gap-4">
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
              <progress
                hidden={!uploadingFile}
                className="progress progress-success w-full dark:bg-slate-400"
              ></progress>
              <div className="w-full ">
                <input
                  value={questName}
                  onChange={(e) => setquestName(e.target.value)}
                  type="text"
                  placeholder="Quest name"
                  className="input input-bordered w-full "
                />
              </div>{" "}
              <div className="w-full ">
                <textarea
                  value={questDescription}
                  onChange={(e) => setquestDescription(e.target.value)}
                  placeholder="Quest Description"
                  className="textarea textarea-bordered w-full"
                />
              </div>
              <div
                // onClick={() => setquestStarted(false)}
                className="flex flex-col gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-4   mx-auto w-full justify-start items-start max-w-3xl"
              >
                <span className="text-lg font-semibold text-brand1">Tasks</span>
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex flex-col  items-start w-full  rounded-md bg-white dark:bg-slate-600 p-4 shadow-md hover:shadow-xl"
                  >
                    <span className="flex gap-2 w-full justify-between text-lg font-semibold text-brand1">
                      {task.name}{" "}
                      <Trash
                        onClick={() =>
                          settasks(tasks.filter((t, i) => i !== index))
                        }
                        size={20}
                        className="text-error cursor-pointer"
                      />
                    </span>
                    <p className="text-base font-normal text-brand3">
                      {task.description}
                    </p>
                    <div className="w-full flex items-center justify-between mt-4">
                      <span className="flex-grow font-bold text-2xl flex items-baseline gap-1">
                        <div className="flex items-center gap-2 text-success">
                          {task.points}
                        </div>
                        <span className="text-sm text-brand3">Points</span>
                      </span>
                      <span className="text-lg font-semibold text-brand1">
                        Action: {task.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                // onClick={() => setquestStarted(false)}
                className="flex flex-col gap-2   rounded-lg p-4   mx-auto w-full justify-start items-start max-w-3xl"
              >
                <span className="text-lg font-semibold text-brand1">
                  Add task
                </span>
                <input
                  value={task.name}
                  onChange={(e) => settask({ ...task, name: e.target.value })}
                  type="text"
                  placeholder="Task name"
                  className="input input-bordered w-full "
                />
                <textarea
                  value={task.description}
                  onChange={(e) =>
                    settask({ ...task, description: e.target.value })
                  }
                  placeholder="Task Description"
                  className="textarea textarea-bordered w-full"
                />
                <input
                  value={task.points}
                  onChange={(e) => settask({ ...task, points: e.target.value })}
                  type="text"
                  placeholder="Task Points"
                  className="input input-bordered w-full "
                />
                <select
                  value={task.action}
                  onChange={(e) => settask({ ...task, action: e.target.value })}
                  className="select select-bordered w-full "
                >
                  <option>scan</option>
                </select>
                <button
                  onClick={() => {
                    task.name &&
                      task.description &&
                      task.points &&
                      tasks.push({ ...task, taskId: tasks.length });
                    settask({
                      name: "",
                      description: "",
                      points: "",
                      action: "scan",
                    });
                  }}
                  className="btn w-full btn-primary rounded-lg capitalize"
                >
                  Add Task
                </button>
              </div>
            </div>
            <div className="flex   gap-2   sm:rounded-xl p-4   mx-auto w-full justify-between items-center max-w-2xl">
              <button
                onClick={() => {
                  console.log(questName, questDescription, tasks);
                  questName && questDescription && tasks && addQuest();
                }}
                className={`btn w-full btn-brand rounded-full capitalize ${
                  loading && "loading"
                }`}
              >
                Add Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestAdmin;
