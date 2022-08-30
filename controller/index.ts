import { fill, orderAlpha, filterNames, countFilterNames } from "./functions";

(function () {
  const list = fill().then((user) => {
    const usersAlpha = orderAlpha(user);
    const filteredNames = filterNames(user)
    const countNames = countFilterNames(user)
    console.log("Alphabetical users", usersAlpha);
    console.log("Users whose name start with a, b and c", filteredNames);
    console.log("How many users have names that start with a, b and c for each one", countNames);
  });
})();
