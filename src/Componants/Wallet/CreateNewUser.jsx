import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, X } from "tabler-icons-react";
import { UserContext } from "../../Store";

function CreateNewUser() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [loader, setloader] = useState(false);
  const [error, seterror] = useState(false);

  async function createNewUser(walletAddress) {
    setloader(true);
    console.log(walletAddress);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
        email: email,
        name: name,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data == "Email") {
          seterror("Email Already Exists");
          setloader(false);
        } else {
          State.updateDatabase({
            userData: response,
          });
          console.log("user data saved in state");
          localStorage.setItem("authtoken", response.data.jwtToken);
          console.log("auth token saved in storage");
          localStorage.setItem("walletAddress", walletAddress);
          console.log("wallet address saved in storage");
          setloader(false);
          seterror("");
          let questId = localStorage.getItem("questId");

          if (questId && localStorage.getItem("taskId")) {
            localStorage.setItem("questFlow", false);
            navigateTo("/quest-details/" + questId);
          } else {
            navigateTo("/homescreen/home");
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        seterror("Server error");
        setloader(false);
        error.response.status === 400 && seterror("Invalid Email");
      });
  }
  return (
    <div className="flex flex-col justify-start w-fit lg:w-1/2 space-y-6 p-6 lg:p-12">
      <p className="text-5xl font-bold text-brand-gradient">Create Account</p>
      <div className="text-brand4 text-lg font-medium">
        <p className="text-xl font-semibold text-brand2">
          Just enter your email!
        </p>
        MintFlick will send important notifications to this email.
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          name && email && State.database.walletAddress
            ? createNewUser(State.database.walletAddress)
            : seterror("Enter name and email!");
        }}
        className="w-full max-w-lg flex flex-col  space-y-4   pt-4"
      >
        {error && (
          <div className="flex justify-between items-center p-3 bg-rose-600 text-slate-100 rounded-lg font-mediumtext-sm">
            <div className="flex items-center gap-4">
              <AlertTriangle></AlertTriangle> {error}
            </div>
            <X
              className="cursor-pointer"
              onClick={() => seterror("")}
              size={16}
            ></X>
          </div>
        )}
        <input
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Name"
          className="input w-full"
        />
        <input
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Email"
          className="input w-full "
        />
        <button
          type="submit"
          className={`btn  w-full ${loader ? "loading" : "btn-brand"}`}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default CreateNewUser;
