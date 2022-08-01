import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Store";

function CreateNewUser() {
  const State = useContext(UserContext);
  const navigateTo = useNavigate();
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [loader, setloader] = useState(false);

  async function createNewUser(walletAddress) {
    setloader(true);
    await axios({
      method: "post",
      url: `${process.env.REACT_APP_API_BASE_URL}/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
        email: email,
        name: name,
      },
    })
      .then((response) => {
        console.log(response);
        State.updateDatabase({
          userData: response.config.data,
        });
        setloader(false);
        navigateTo("/homescreen");
      })
      .catch(function (error) {
        console.log(error);
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

      <div className="w-full max-w-lg flex flex-col  space-y-4   pt-4">
        <input
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Enter your name here."
          className="input w-full"
        />
        <input
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter your email here."
          className="input w-full "
        />
        <button
          onClick={() => {
            createNewUser(State.database.walletAddress);
          }}
          className={`btn btn-brand w-full ${loader ? "loading" : ""}`}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default CreateNewUser;