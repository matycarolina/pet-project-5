import axios from "axios";
export const BASE_URL = "http://localhost:3000/users";

interface User {
  id: number;
  email: string;
  name: string;
}

export const fill = async () => {
  try {
    const response = await axios.get(BASE_URL);
    const usersList = response.data.payload;
    return usersList;
  } catch (error) {
    return [];
  }
};

// Order Alphabetically by name. Show last name in capital letters
// Show the users whose name start with "a", "b" and "c"
// Show how many users have names that start with "a", "b" and "c" for each one

export const orderAlpha = (list: User[]) => {
  return list
    .map((user: User) => user.name.split(/\s/)[1].toUpperCase())
    .sort((n1, n2) => n1.localeCompare(n2));
};

export const filterNames = (list: User[]) => {
  return list.filter((user: User) => user.name.match(/^[abc]/i));
};

export const countFilterNames = (list: User[]) => {
  const aNames = list.filter((user: User) => user.name.match(/^a/i)).length;
  const bNames = list.filter((user: User) => user.name.match(/^b/i)).length;
  const cNames = list.filter((user: User) => user.name.match(/^c/i)).length;
  return [aNames, bNames, cNames];
};
