import React from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function AutoComplete(props) {
  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results);
  };

  //   const handleOnHover = (result) => {
  //     // the item hovered
  //     console.log(result);
  //   };

  const handleOnSelect = (item) => {
    // the item selected
    props.setValue(item.name);
    console.log(item);
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <>
        {/* <span style={{ display: "block", textAlign: "left" }}>
          id: {item.id}
        </span> */}
        <span
          style={{ cursor: "pointer", display: "block", textAlign: "left" }}
        >
          {item.name}
        </span>
      </>
    );
  };

  return (
    <>
      <ReactSearchAutocomplete
        items={props.items}
        onSearch={handleOnSearch}
        // onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        formatResult={formatResult}
        showIcon={props.showIcon}
        placeholder={props.placeholder}
        styling={{
          height: "48px",
          borderRadius: "8px",
          border: "0px solid darkgreen",
          backgroundColor: props.dark ? "#334155" : "white",
          boxShadow: "none",
          hoverBackgroundColor: props.dark ? "#64748b" : "#94a3b8",
          color: props.dark ? "#e2e8f0" : "#0f172a",
          fontSize: "14px",
          fontFamily: "Courier",
          iconColor: props.dark ? "#cbd5e1" : "#0f172a",
          lineColor: props.dark ? "#cbd5e1" : "#0f172a",
          placeholderColor: props.dark ? "#94a3b8" : "#475569",
          clearIconMargin: "2px 8px 0 0",
          zIndex: 2,
        }}
      />
    </>
  );
}

export default AutoComplete;
