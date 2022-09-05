import axios from "axios";

export const BASE_URL = `http://localhost:3001/users`;
const username = "malesuada.id@hotmail.org";
const password = "WFE64VTJ1BB";

const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

interface User {
  id: number;
  email: string;
  name: string;
}

export const fill = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });
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
  //fix with forEach or reduce, both with dicts
  return list.reduce(
    (letters: { [key: string]: number }, elem) => {
      const i = elem.name.charAt(0).toLocaleLowerCase();
      if (Object.keys(letters).includes(i)) {
        letters[i]++;
      }
      return letters;
    },
    { a: 0, b: 0, c: 0 }
  );
};
