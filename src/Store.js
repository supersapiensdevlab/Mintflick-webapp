import React, { useState } from "react";

function Store() {
  const [store, setstore] = useState({});
  const updateStore = (data) => {
    setstore({
      ...store,
      ...data,
    });
  };
}

export default Store;
