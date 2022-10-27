export function filterData(value, list, func) {
  list.filter((item) => {
    const filteredData = list.filter((item) => {
      return JSON.stringify(Object.values(item))
        .toLowerCase()
        .replace(/[{,},",]/g, "")
        .includes(value.toLowerCase());
    });
    func(filteredData);
  });
}
