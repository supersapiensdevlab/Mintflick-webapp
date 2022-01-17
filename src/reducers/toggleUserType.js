const initialState = 0;

const toggleDarkMode = (state = initialState, action) => {
  switch (action.type) {
    case 'USERTYPETOGGLE':
      if (action.payload) {
        return action.payload;
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default toggleDarkMode;
