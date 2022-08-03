import React, { useState } from "react";

function useLocalStorage() {
  const [data, setdata] = useState({});
  return function storage(action, key, data) {
    action === "post" && localStorage.setItem(key, JSON.stringify(data));
    action === "get" && setdata(localStorage.getItem(key));
    return data;
  };
}

export default useLocalStorage;
