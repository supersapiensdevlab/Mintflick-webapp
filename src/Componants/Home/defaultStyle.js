export default {
  control: {
    fontSize: 14,
    fontWeight: "medium",
    fontFamily: "Sans-Serif",
    "&focused": {
      outline: "none !important",
      border: 0,
    },
  },

  "&multiLine": {
    control: {
      fontFamily: "Gilroy",
      minHeight: 63,
      "&focused": {
        outline: "none !important",
        border: 0,
      },
    },
    input: {
      padding: "9px 15px",
      "&focused": {
        outline: "none !important",
      },
    },
  },

  "&singleLine": {
    display: "inline-block",
    width: 180,
    "&focused": {
      outline: "none !important",
      border: 0,
    },
    input: {
      padding: 1,
      borderTopStyle: "hidden",
      "&focused": {
        outline: "none !important",
      },
    },
  },

  suggestions: {
    borderRadius: "0.6rem",
    list: {
      backgroundColor: "rgb(51, 65, 85)",
      color: "white",
      fontSize: 14,
      width: "18rem",
      maxHeight: "16rem",
      overflowY: "scroll",
      borderRadius: "0.5rem",
      border: "1px solid rgb(30, 41, 59)",
    },
    item: {
      padding: "5px 15px",
      "&focused": {
        backgroundColor: "rgb(30, 41, 59)",
      },
    },
  },
};
