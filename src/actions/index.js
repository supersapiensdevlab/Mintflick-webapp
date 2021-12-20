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
