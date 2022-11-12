import React, { useState } from "react";
import { useContext } from "react";
import {
  AlertTriangle,
  Check,
  CircleCheck,
  DeviceFloppy,
  Edit,
  Link,
  Pencil,
  Settings,
  Trash,
  Unlink,
  Upload,
  X,
} from "tabler-icons-react";
import coverImage from "../../../Assets/backgrounds/cover.png";
import SolanaToken from "../../../Assets/logos/SolanaToken";
import useUserActions from "../../../Hooks/useUserActions";
import { UserContext } from "../../../Store";
import axios from "axios";
import CoverImageModal from "./CoverImageModal";
import ProfileImageModal from "./ProfileImageModal";
import ConfirmationModal from "../../Home/Modals/ConfirmationModal";
import LinkNewWalletModal from "../../Home/Modals/LinkNewWalletModal";
import ListNavigation from "../ListNavigation";

function SettingsModal(props) {
  const [activeTab, setactiveTab] = useState("editProfile");
  const [selectedPlan, setselectedPlan] = useState(0);

  const [showCoverImageModal, setShowCoverImageModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);
  const [unlinkWalletModal, setunlinkWalletModal] = useState(false);
  const [linkNewWalletModalopen, setlinkNewWalletModalopen] = useState(false);

  //verify account form fields
  const [ensDomain, setensDomain] = useState("");
  const [socialLinks, setsocialLinks] = useState([]);

  const planImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYttbDyk8tE55gznNpc1ujtwlaNTtX4ahdrg&usqp=CAU";
  const State = useContext(UserContext);
  const [superfanPlans, setSuperfanPlans] = useState({
    plan: "Basic",
    plan2: "Silver",
    plan3: "Gold",
    perks: State.database.userData.data?.user?.superfan_data?.perks
      ? State.database.userData.data?.user?.superfan_data?.perks
      : "",
    perks2: State.database.userData.data?.user?.superfan_data?.perks2
      ? State.database.userData.data?.user?.superfan_data?.perks2
      : "",
    perks3: State.database.userData.data?.user?.superfan_data?.perks3
      ? State.database.userData.data?.user?.superfan_data?.perks3
      : "",
    price: State.database.userData.data?.user?.superfan_data?.price
      ? State.database.userData.data?.user?.superfan_data?.price
      : "",
    price2: State.database.userData.data?.user?.superfan_data?.price2
      ? State.database.userData.data?.user?.superfan_data?.price2
      : "",
    price3: State.database.userData.data?.user?.superfan_data?.price3
      ? State.database.userData.data?.user?.superfan_data?.price3
      : "",
  });
  const [loadFeed, loadUser] = useUserActions();
  const [warning, setWarning] = useState(null);
  const [success, setSuccess] = useState(null);
  const [description, setDescription] = useState(null);

  const handleUpdateSuperfanPlans = async () => {
    if (superfanPlans === State.database.userData.data?.user?.superfan_data)
      return;
    if (
      superfanPlans.price == "" ||
      superfanPlans.price == "0" ||
      superfanPlans.price2 == "" ||
      superfanPlans.price2 == "0" ||
      superfanPlans.price3 == "" ||
      superfanPlans.price3 == "0"
    ) {
      setWarning("Price must be > 0");
      return;
    }

    if (
      superfanPlans.perks == "" ||
      superfanPlans.perks2 == "" ||
      superfanPlans.perks3 == ""
    ) {
      setWarning("Please add perks");
      return;
    }
    console.log(superfanPlans);
    setWarning(null);
    let data = {
      superfanData: superfanPlans,
    };
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/user/update_superfanplans`,
      data: data,
      headers: {
        "content-type": "application/json",
        "auth-token": JSON.stringify(localStorage.getItem("authtoken")),
      },
    })
      .then(async () => {
        await loadUser();
        setSuccess("Plans updated successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clearData = () => {
    props.setOpen(false);
    setSuperfanPlans({
      plan: "Basic",
      plan2: "Silver",
      plan3: "Gold",
      perks: State.database.userData.data?.user?.superfan_data?.perks
        ? State.database.userData.data?.user?.superfan_data?.perks
        : "",
      perks2: State.database.userData.data?.user?.superfan_data?.perks2
        ? State.database.userData.data?.user?.superfan_data?.perks2
        : "",
      perks3: State.database.userData.data?.user?.superfan_data?.perks3
        ? State.database.userData.data?.user?.superfan_data?.perks3
        : "",
      price: State.database.userData.data?.user?.superfan_data?.price
        ? State.database.userData.data?.user?.superfan_data?.price
        : "",
      price2: State.database.userData.data?.user?.superfan_data?.price2
        ? State.database.userData.data?.user?.superfan_data?.price2
        : "",
      price3: State.database.userData.data?.user?.superfan_data?.price3
        ? State.database.userData.data?.user?.superfan_data?.price3
        : "",
    });
    setSuccess(null);
    setWarning(null);
  };

  const handlePlanImageUpdate = (updateFor) => {
    // let data = {
    //   updateFor: updateFor,
    // }
  };

  return (
    <div
      className={`${
        props.open && "modal-open"
      } modal  modal-bottom sm:modal-middle`}
    >
      <div className="modal-box p-0 bg-slate-100 dark:bg-slate-800 ">
        <div className="w-full h-fit p-2 bg-slate-300 dark:bg-slate-700">
          <div className="flex justify-between items-center p-2">
            <h3 className="flex items-center gap-2 font-bold text-lg text-brand2">
              <Settings />
              Settings
            </h3>
            <X
              onClick={() => clearData()}
              className="text-brand2 cursor-pointer"
            ></X>
          </div>
        </div>
        <div className="flex w-full  bg-slate-200 dark:bg-slate-600">
          <span
            onClick={() => setactiveTab("editProfile")}
            className={`  flex justify-center font-semibold cursor-pointer text-sm text-brand2 p-2 ${
              activeTab === "editProfile" &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            Edit Profile
          </span>
          <span
            onClick={() => setactiveTab("manageSuperfans")}
            className={`  flex justify-center font-semibold cursor-pointer text-sm text-brand2 p-2 ${
              activeTab === "manageSuperfans" &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            Manage Superfans
          </span>
          <span
            onClick={() => setactiveTab("account")}
            className={`  flex justify-center font-semibold cursor-pointer text-sm text-brand2 p-2 ${
              activeTab === "account" &&
              "bg-slate-100  border-t-2 border-success dark:bg-slate-800"
            }`}
          >
            Account
          </span>
        </div>
        {activeTab === "editProfile" && (
          <div className="flex flex-col gap-2 p-4 w-full  justify-center">
            <div className="w-full relative h-32">
              <img
                src={
                  State.database.userData?.data?.user?.cover_image
                    ? State.database.userData?.data?.user?.cover_image
                    : coverImage
                }
                alt="cover image"
                className="w-full aspect-{4/2} rounded-lg object-cover h-full"
              />
              <button
                onClick={() => {
                  setShowCoverImageModal(true);
                }}
                className="p-1 rounded-full bg-slate-400/40 dark:bg-slate-600/50 text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm absolute top-1 right-1"
              >
                <Pencil className=" " size={16} />

                {/* <input
                    className=""
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={true}
                    onClick={(event) => {
                      event.target.value = null;
                      setSelectedCoverImage(null);
                    }}
                  /> */}
              </button>
            </div>
            <div className="mx-auto relative">
              <img
                src={
                  State.database.userData?.data?.user?.profile_image
                    ? State.database.userData?.data?.user?.profile_image
                    : coverImage
                }
                alt="Profile image"
                className="w-24 h-24 -mt-14 object-cover rounded-full"
              />
              <button
                onClick={() => {
                  setShowProfileImageModal(true);
                }}
                className="p-1 rounded-full bg-slate-400/40 dark:bg-slate-600/40 text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm absolute bottom-0 right-0"
              >
                <Pencil className=" " size={16} />
              </button>
            </div>

            <div className="flex gap-2 w-full">
              <input
                type="text"
                className="input  w-full"
                placeholder={State.database.userData?.data?.user?.username}
                readOnly
                //   onChange={(e) =>
                //   value={}
              />
              <input
                type="text"
                className="input  w-full"
                placeholder={State.database.userData?.data?.user?.name}
                //   onChange={(e) =>
                //   value={}
              />
            </div>

            <input
              type="text"
              className="input  w-full"
              placeholder={State.database.userData?.data?.user?.email}
              readOnly
              //   onChange={(e) =>
              //   value={}
            />
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand4 font-semibold">
                  Category
                </span>
              </label>
              <select className="select select-bordered">
                <option disabled selected>
                  What best describes you?
                </option>
                <option>option1</option>
                <option>option2</option>
                <option>option3</option>
                <option>option4</option>
                <option>option5</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full p-4 bg-white dark:bg-slate-700 rounded-lg">
              <span className="text-md font-semibold text-brand4">
                Connected Wallets
              </span>
              <div className="flex justify-between items-center text-sm text-brand2 p-2 bg-slate-100 dark:bg-slate-600 rounded-md">
                <span className="flex-grow truncate">
                  {localStorage.getItem("walletAddress")}
                </span>
                <div
                  onClick={() => setunlinkWalletModal(true)}
                  className="tooltip"
                  data-tip="Unlink wallet"
                >
                  <button className="p-1 rounded-full bg-slate-200 dark:bg-slate-700 text-brand2 flex gap-1 cursor-pointer backdrop-blur-sm">
                    <Unlink className="text-primary " size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setlinkNewWalletModalopen(true)}
                className="btn btn-outline btn-primary btn-xs gap-1 mx-auto w-fit rounded-full capitalize"
              >
                <Link size={16} />
                link other wallet
              </button>
            </div>
            <button className="btn btn-brand gap-2 capitalize ">
              <DeviceFloppy /> Save Changes
            </button>
          </div>
        )}
        {activeTab === "manageSuperfans" && (
          <div className="flex flex-col gap-2 p-4 w-full  justify-center">
            <div className="flex flex-col items-start gap-1">
              <span className=" text-brand4 font-semibold">
                Your Wallet address
              </span>
              <input
                type="text"
                className="input w-full"
                value={localStorage.getItem("walletAddress")}
                readOnly
              />
            </div>
            {/* <div className="flex flex-col items-start gap-1">
              <span className=" text-brand4 font-semibold">
                Superfan Description
              </span>
              <textarea
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
                rows={1}
                name="superfanDescription"
                type="text"
                placeholder="Describe your plans"
                required
                autoComplete="false"
                className="w-full rounded-md textarea "
              ></textarea>
            </div> */}
            <span className=" text-brand font-semibold ">
              Choose plan to edit
            </span>
            <div
              onClick={() => setselectedPlan(1)}
              className={`${
                selectedPlan === 1 && "ring-2"
              } cursor-pointer p-1 -m-1 ring-primary dark:ring-brand rounded-lg`}
            >
              <div className="flex w-full bg-slate-200 dark:bg-slate-700 h-fit rounded-lg overflow-hidden ">
                <img
                  src={planImage}
                  className=" w-32 bg-red-600 object-cover"
                  onClick={() => {
                    handlePlanImageUpdate("basic");
                  }}
                />
                <span className="p-2 h-full flex-grow ">
                  <h3 className="text-xl font-semibold text-primary dark:text-brand">
                    Basic
                  </h3>
                  <h5 className="w-full text-sm font-medium text-brand4">
                    {State.database.userData.data?.user?.superfan_data?.perks
                      ? State.database.userData.data?.user?.superfan_data?.perks
                      : ""}
                  </h5>
                </span>
                <button onClick={() => {}}>
                  <span className="flex items-center justify-center w-fit gap-2 px-4 h-full  bg-slate-300 dark:bg-slate-600">
                    <SolanaToken size={24}></SolanaToken>

                    <h3 className="text-xl font-semibold text-brand2">
                      {State.database.userData.data?.user?.superfan_data?.price
                        ? State.database.userData.data?.user?.superfan_data
                            ?.price
                        : "0"}
                    </h3>
                  </span>
                </button>
              </div>
              {selectedPlan === 1 && (
                <div className=" w-full gap-2 flex flex-col">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm mt-2">
                      Price per month{" "}
                    </span>
                    <label className="input-group w-full">
                      <input
                        type="number"
                        className="input w-full"
                        placeholder={
                          State.database.userData.data?.user?.superfan_data
                            ?.price
                        }
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            superfanPlans.price = e.target.value;
                          } else {
                            superfanPlans.price =
                              State.database.userData.data?.user?.superfan_data?.price;
                          }
                        }}
                      />
                      <span className="bg-slate-300 dark:bg-slate-600">
                        <SolanaToken size={16}></SolanaToken>
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm">Perks </span>
                    <textarea
                      className="textarea w-full"
                      placeholder={
                        State.database.userData.data?.user?.superfan_data?.perks
                      }
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          superfanPlans.perks = e.target.value;
                        } else {
                          superfanPlans.perks =
                            State.database.userData.data?.user?.superfan_data?.perks;
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={() => setselectedPlan(2)}
              className={`${
                selectedPlan === 2 && "ring-2"
              } cursor-pointer p-1 -m-1 ring-primary dark:ring-brand rounded-lg`}
            >
              <div className="flex w-full bg-slate-200 dark:bg-slate-700 h-fit rounded-lg overflow-hidden ">
                <img
                  src={planImage}
                  className=" w-32 bg-red-600 object-cover"
                  onClick={() => {
                    handlePlanImageUpdate("silver");
                  }}
                />
                <span className="p-2 h-full flex-grow ">
                  <h3 className="text-xl font-semibold text-primary dark:text-brand">
                    Silver
                  </h3>
                  <h5 className="w-full text-sm font-medium text-brand4">
                    {State.database.userData.data?.user?.superfan_data?.perks2
                      ? State.database.userData.data?.user?.superfan_data
                          ?.perks2
                      : ""}
                  </h5>
                </span>
                <button onClick={() => {}}>
                  <span className="flex items-center justify-center w-fit gap-2 px-4 h-full  bg-slate-300 dark:bg-slate-600">
                    <SolanaToken size={24}></SolanaToken>

                    <h3 className="text-xl font-semibold text-brand2">
                      {State.database.userData.data?.user?.superfan_data?.price2
                        ? State.database.userData.data?.user?.superfan_data
                            ?.price2
                        : "0"}
                    </h3>
                  </span>
                </button>
              </div>
              {selectedPlan === 2 && (
                <div className=" w-full gap-2 flex flex-col">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm mt-2">
                      Price per month{" "}
                    </span>
                    <label className="input-group w-full">
                      <input
                        type="number"
                        className="input w-full"
                        placeholder={
                          State.database.userData.data?.user?.superfan_data
                            ?.price2
                        }
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            superfanPlans.price2 = e.target.value;
                          } else {
                            superfanPlans.price2 =
                              State.database.userData.data?.user?.superfan_data?.price2;
                          }
                        }}
                      />
                      <span className="bg-slate-300 dark:bg-slate-600">
                        <SolanaToken size={16}></SolanaToken>
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm">Perks </span>
                    <textarea
                      className="textarea w-full"
                      placeholder={
                        State.database.userData.data?.user?.superfan_data
                          ?.perks2
                      }
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          superfanPlans.perks2 = e.target.value;
                        } else {
                          superfanPlans.perks2 =
                            State.database.userData.data?.user?.superfan_data?.perks2;
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div
              onClick={() => setselectedPlan(3)}
              className={`${
                selectedPlan === 3 && "ring-2"
              } cursor-pointer p-1 -m-1 ring-primary dark:ring-brand rounded-lg`}
            >
              <div className="flex w-full bg-slate-200 dark:bg-slate-700 h-fit rounded-lg overflow-hidden ">
                <img
                  src={planImage}
                  className=" w-32 bg-red-600 object-cover"
                  onClick={() => {
                    handlePlanImageUpdate("gold");
                  }}
                />
                <span className="p-2 h-full flex-grow ">
                  <h3 className="text-xl font-semibold text-primary dark:text-brand">
                    Gold
                  </h3>
                  <h5 className="w-full text-sm font-medium text-brand4">
                    {State.database.userData.data?.user?.superfan_data?.perks3
                      ? State.database.userData.data?.user?.superfan_data
                          ?.perks3
                      : ""}
                  </h5>
                </span>
                <button onClick={() => {}}>
                  <span className="flex items-center justify-center w-fit gap-2 px-4 h-full  bg-slate-300 dark:bg-slate-600">
                    <SolanaToken size={24}></SolanaToken>

                    <h3 className="text-xl font-semibold text-brand2">
                      {State.database.userData.data?.user?.superfan_data?.price3
                        ? State.database.userData.data?.user?.superfan_data
                            ?.price3
                        : "0"}
                    </h3>
                  </span>
                </button>
              </div>
              {selectedPlan === 3 && (
                <div className=" w-full gap-2 flex flex-col">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm mt-2">
                      Price per month
                    </span>
                    <label className="input-group w-full">
                      <input
                        type="number"
                        className="input w-full"
                        placeholder={
                          State.database.userData.data?.user?.superfan_data
                            ?.price3
                        }
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            superfanPlans.price3 = e.target.value;
                          } else {
                            superfanPlans.price3 =
                              State.database.userData.data?.user?.superfan_data?.price3;
                          }
                        }}
                      />
                      <span className="bg-slate-300 dark:bg-slate-600">
                        <SolanaToken size={16}></SolanaToken>
                      </span>
                    </label>
                  </div>
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="text-brand4 text-sm">Perks </span>
                    <textarea
                      className="textarea w-full"
                      placeholder={
                        State.database.userData.data?.user?.superfan_data
                          ?.perks3
                      }
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          superfanPlans.perks3 = e.target.value;
                        } else {
                          superfanPlans.perks3 =
                            State.database.userData.data?.user?.superfan_data?.perks3;
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {warning && (
              <div className="flex gap-2 bg-rose-600 rounded-md p-2 text-white">
                <AlertTriangle />
                {warning}
              </div>
            )}
            {success && (
              <div className="flex gap-2 bg-green-600 rounded-md p-2 text-white">
                <CircleCheck />
                {success}
              </div>
            )}
            <button
              className="btn btn-brand gap-2 capitalize "
              onClick={(e) => {
                e.preventDefault();
                handleUpdateSuperfanPlans();
              }}
            >
              <DeviceFloppy /> Save Changes
            </button>
          </div>
        )}
        {activeTab === "account" && (
          <ListNavigation
            list={["Verify Account"]}
            content={[
              <div className="flex flex-col gap-2 p-4 w-full  justify-center">
                <span className="text-base text-brand4 font-semibold">
                  Step 1 : Collect vouches
                </span>
                <span className="text-base text-brand4 font-semibold">
                  Step 2 : ENS Domain Name
                </span>
                <input
                  type="text"
                  className="input  w-full"
                  placeholder={"Enter your ENS domain name"}

                  //   onChange={(e) =>
                  //   value={}
                />
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-base text-brand4 font-semibold">
                      Step 3: Social links
                    </span>
                  </label>
                  {socialLinks.map((link, index) => (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        className="input input-sm flex-grow"
                        placeholder={"Enter link"}
                        onChange={(e) => socialLinks[(index, e.target.value)]}
                        //   value={}
                      />
                      <button
                        onClick={() =>
                          setsocialLinks(
                            socialLinks.filter((item, i) => {
                              return index !== i;
                            })
                          )
                        }
                        className="btn btn-square btn-sm  btn-error"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setsocialLinks([...socialLinks, ""])}
                    className="btn btn-outline btn-primary btn-sm capitalize"
                  >
                    Add Link
                  </button>
                </div>
                <button className="btn btn-brand gap-2 capitalize ">
                  <Upload size={16} /> Submit
                </button>
              </div>,
            ]}
          />
        )}
      </div>
      <div
        className={`${
          showCoverImageModal && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <CoverImageModal setShowCoverImageModal={setShowCoverImageModal} />
      </div>
      <div
        className={`${
          showProfileImageModal && "modal-open"
        } modal  modal-bottom sm:modal-middle`}
      >
        <ProfileImageModal
          setShowProfileImageModal={setShowProfileImageModal}
        />
      </div>
      <ConfirmationModal
        icon={<Unlink className="text-error " />}
        title="Unlink wallet"
        content="Do you want to unlink {wallet address} this wallet?"
        open={unlinkWalletModal}
        setOpen={setunlinkWalletModal}
        buttonLable="Unlink"
      />
      <LinkNewWalletModal
        open={linkNewWalletModalopen}
        setOpen={setlinkNewWalletModalopen}
      />
    </div>
  );
}

export default SettingsModal;
