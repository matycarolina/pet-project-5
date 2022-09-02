import React, { useEffect, useState } from "react";
import "./App.css";
import {
  fill,
  orderAlpha,
  filterNames,
  countFilterNames,
  BASE_URL,
} from "./controller/functions";

interface User {
  id: number;
  email: string;
  name: string;
  age: number;
}

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      fill().then((user) => setUsers(user));
    };

    fetchData().catch(console.error);
  }, []);

  console.log(users);

  return (
    <div>
      {users.map((user: User, index) => {
        return (
          <div key={index}>
            <h2>name: {user.name}</h2>
            <h2>email: {user.email}</h2>

            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default App;
