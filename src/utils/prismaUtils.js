// Creating the sort object to pass onto the query function
// Basically just replaces the symbols with the appropriate sorting order, while creating it in the object syntax
module.exports.createSortingFromQuery = (query) => {
  const sortObj = {};
  if (!!query.sort) {
    console.log(query.sort);
    console.log(query.sort.split(","));
    let arr = query.sort.split(",");
    arr.forEach((item) => {
      let sort;
      let symbol = item.slice(0, 1);
      let key = item.slice(1, item.length);
      console.log(symbol);
      console.log(key);
      if (symbol === "+" || symbol === " ") {
        sort = "asc";
      } else if (symbol === "-") {
        sort = "desc";
      } else {
        sort = "undefined";
      }
      sortObj[key] = sort;
    });
  }
  return sortObj;
};