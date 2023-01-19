import React, { useContext, useEffect } from "react";
import { UserContext } from "../../Store";

function CreateEventModal() {
  const State = useContext(UserContext);

  useEffect(() => {
    State.updateDatabase({ showHeader: false });
    State.updateDatabase({ showBottomNav: false });
  }, []);
  return <div>CreateEventModal</div>;
}

export default CreateEventModal;
