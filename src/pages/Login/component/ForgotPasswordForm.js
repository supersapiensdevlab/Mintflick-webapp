import React from 'react';

const ForgotPasswordForm = ({
  loader,
  handleResetPasswordEmail,
  handleResetPassword,
  handleSignIn,
}) => {
  return (
    <div className="  w-full  ">
      <div className="flex flex-col justify-center   2xl:text-lg lg:texr-md px-5 pt-2 lg:pt-0">
        <h1 className="self-center  2xl:text-2xl lg:text-md text-xl font-bold text-gray-900 dark:text-white">
          Forgot Password
        </h1>

        <input
          className={`self-center mt-2 mb-1 rounded w-full mx-5 lg:h-8 2xl:h-10 lg:text-xs 2xl:text-lg
                        border-0  dark:bg-dbeats-dark-primary
                        bg-gray-100 text-gray-900 dark:text-white focus:ring-dbeats-light`}
          type="email"
          placeholder="Enter Email"
          onChange={(e) => handleResetPasswordEmail(e)}
        />

        <div className="flex justify-center ">
          <button
            onClick={handleResetPassword}
            className="flex justify-center w-full  mx-3   flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                        dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                        hover:text-white hover:bg-dbeats-light border  
                        transition-all border-dbeats-light hover:scale-99 transform rounded relative"
          >
            Forgot Password
            <div
              hidden={loader}
              className="w-6 h-6 absolute right-10 align-center border-t-4 border-b-4 border-white rounded-full animate-spin"
            ></div>
          </button>
        </div>
        <hr className="2xl:my-3 lg:my-2 w-2/3 self-center mb-4 lg:mb-0" />

        <div
          className="flex justify-center w-max mx-auto  flex my-3 py-2 2xl:px-24 lg:px-10 2xl:text-lg lg:text-sm  text-dbeats-light 
                      dark:text-white font-bold bg-dbeats-light bg-opacity-5 
                      hover:text-white hover:bg-dbeats-light border  
                      transition-all border-dbeats-light hover:scale-99 transform rounded relative cursor-pointer"
          onClick={handleSignIn}
        >
          Sign In
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
