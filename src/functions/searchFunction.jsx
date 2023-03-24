import axios from "axios";

export async function filterData(value, list, func, isNew = false) {
  list.filter(async (item) => {
    const filteredData = list.filter((item) => {
      return JSON.stringify(Object.values(item))
        .toLowerCase()
        .replace(/[{,},",]/g, "")
        .includes(value.toLowerCase());
    });
    let alldata = [];
    for (var i = 0; i < filteredData.length; i++) {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/user/shortDataUsername/${
          filteredData[i].username ? filteredData[i].username : filteredData[i]
        }`
      );
      if (res.data) {
        alldata.push({
          ...res.data,
          plan: filteredData[i].plan,
          boughtOn: filteredData[i]?.boughtOn,
        });
      }
    }

    func(alldata);
    // func(filteredData);
  });
}
