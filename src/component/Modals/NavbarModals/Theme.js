export function theme({ darkMode }) {
  return [
    {
      chipsContainer: {
        display: 'flex',
        position: 'relative',
        backgroundColor: darkMode ? '#101010' : '#fff',
        color: !darkMode ? '#101010' : '#fff',
        font: '14px',
        minHeight: 24,
        width: '17rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '2.5px',
        borderRadius: 5,
      },
      container: {
        flex: 1,
      },
      containerOpen: {},
      input: {
        border: 0,
        width: '100px',
        minWidth: '20px',
        padding: 5,
        margin: '2px',
        backgroundColor: darkMode ? '#151515' : '#fff',
        color: !darkMode ? '#151515' : '#fff',
      },
      suggestionsContainer: {},
      suggestionsList: {
        position: 'absolute',
        zIndex: 10,
        left: 0,
        top: '100%',
        width: '100%',
        backgroundColor: darkMode ? '#101010' : '#fff',
        color: !darkMode ? '#101010' : '#fff',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        marginTop: '4px',
        borderRadius: '6px',
        boxShadow: '1px 1px 10px #000',
      },
      suggestion: {
        padding: '5px 15px',
      },
      suggestionHighlighted: {
        borderRadius: '6px',
        background: !darkMode ? '#4f46e5' : '#fff',
        color: darkMode ? '#101010' : '#fff',
        cursor: 'pointer',
      },
      sectionContainer: {},
      sectionTitle: {},
    },
  ];
}

export function chipTheme({ darkMode }) {
  return [
    {
      chip: {
        padding: 5,
        background: darkMode ? '#151515' : '#ccc',
        color: !darkMode ? '#101010' : '#fff',
        margin: '2.5px 5px 2.5px 2.5px',
        borderRadius: 3,
        cursor: 'default',
      },
      chipSelected: {
        background: '#888',
      },
      chipRemove: {
        fontWeight: 'bold',
        cursor: 'pointer',
        ':hover': {
          color: 'red',
        },
      },
    },
  ];
}
