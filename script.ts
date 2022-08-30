import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const userCreate = await prisma.user.create({
  //   data: {
  //     name: "Bob",

  //     email: "bob@prisma.io",
  //   },
  // });

  // console.log("Created new user: ", userCreate);

  // By ID
  const userFindID = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });

  console.log("User by ID: ", userFindID);

  const allUsers = await prisma.user.findMany();
  console.log("All users: ", allUsers);

  // const updateUser = await prisma.user.update({
  //   where: {
  //     email: "alice@prisma.io",
  //   },
  //   data: {
  //     name: "Alice the Magnificent",
  //   },
  // });

  // console.log("Updated user: ", updateUser);

  // const deleteUser = await prisma.user.delete({
  //   where: {
  //     email: "sinach@sinachmusic.com",
  //   },
  // });

  //console.log("Deleted user: ", deleteUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
