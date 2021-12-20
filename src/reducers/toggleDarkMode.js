const initialState = true;

const toggleDarkMode = (state = initialState, action) => {
  switch (action.type) {
    case 'DARKMODETOGGLE':
      if (action.payload) {
        return action.payload;
      } else {
        return state ? false : true;
      }

    default:
      return state;
  }
};

export default toggleDarkMode;
