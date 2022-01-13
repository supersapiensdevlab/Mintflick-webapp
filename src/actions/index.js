export const toggleAudius = () => {
  return {
    type: 'AUDIUSTOGGLE',
  };
};

export const toggleDarkMode = (value) => {
  return {
    type: 'DARKMODETOGGLE',
    payload: value,
  };
};

export const toggleUserType = (value) => {
  return {
    type: 'USERTYPETOGGLE',
    payload: value,
  };
};
