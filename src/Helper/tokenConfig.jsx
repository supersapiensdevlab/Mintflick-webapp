// Setup config/headers and token
export const tokenConfig = () => {
  //Get token from local storage
  const token = JSON.stringify(localStorage.getItem('authtoken'));

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  if (token) {
    config.headers["auth-token"] = token;
  }
  return config;
};
