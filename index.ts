import { PrismaClient } from "@prisma/client";
import express from "express";
import basicAuth from "express-basic-auth";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const cryptPassword = (password: string) =>
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hash) => hash);

const comparePassword = (password: string, hashPassword: string) =>
  bcrypt.compare(password, hashPassword).then((resp) => resp);

async function myAuthorizer(username: string, password: string, cb: any) {
  const cryptPass = await cryptPassword(password);
  console.log(cryptPass);
  const user = prisma.user
    .findFirst({
      where: { email: String(username) },
    })
    .then(async (user) => {
      cb(null, await comparePassword(String(user?.password), cryptPass));
      console.log(await comparePassword(String(user?.password), cryptPass));
    })
    .catch((error) => cb(error, false));
}

app.use(
  basicAuth({
    authorizer: myAuthorizer,
    authorizeAsync: true,
  })
);

//POSTS CRUD
//* 1. Creates a new post (unpublished)
app.post(`/post`, async (req, res) => {
  const { title, content, userEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: userEmail } },
    },
  });
  res.json({
    success: true,
    payload: result,
  });
});

//* 2. Sets the published field of a post to true.
app.put("/post/publish/:id", async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json({
    success: true,
    payload: post,
  });
});

//* 3. Deletes a post by ID.
app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });
  res.json({
    success: true,
    payload: post,
  });
});

//* 4. Fetches a specific post by ID.
app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json({
    success: true,
    payload: post,
  });
});

//* 5. Fetches all published posts.
app.get("/posts", async (req, res) => {
  const post = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  res.json({
    success: true,
    payload: post,
  });
});

//USERS CRUD
//* 1. Creates a new user.
app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json({
    success: true,
    payload: result,
  });
});

//* 2. Deletes a user by ID.
app.delete(`/user/:id`, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: { id: Number(id) },
  });
  res.json({
    success: true,
    payload: user,
  });
});

//* 3. Updates the email field of a user.
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { ...req.body },
  });
  res.json({
    success: true,
    payload: user,
  });
});

//* 4. Fetches a specific user by ID.
app.get(`/user/:id`, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  res.json({
    success: true,
    payload: user,
  });
});

//* 5. Fetches all users.
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    success: true,
    payload: users,
  });
});

app.use((req, res, next) => {
  res.status(404);
  return res.json({
    success: false,
    payload: null,
    message: `API SAYS: Endpoint not found for path: ${req.path}`,
  });
});

app.listen(3000, () =>
  console.log("REST API server ready at: http://localhost:3000")
);

//test API routes

//* 1. Fetches all published posts.

// $ curl http://localhost:3000/posts -u <USERNAME>

//* 2. Fetches a specific user by ID.

// $ curl http://localhost:3000/user/1 -u <USERNAME>

//* 3. Creates a new user.

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Billy Husk", "email":"husk@email.com", "password":"secret"}' http://localhost:3000/user -u <USERNAME>

//* 4. Creates a new post (unpublished)

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Take my hand", "userEmail":"contact@barnes.com"}' http://localhost:3000/post

//* 5. Sets the published field of a post to true.

// curl -X PUT http://localhost:3000/post/publish/2

//* 6. Deletes a user by ID.

// curl -X DELETE http://localhost:3000/user/1

//* 7. Fetches all users.

// curl http://localhost:3000/users
