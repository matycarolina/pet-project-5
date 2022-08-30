const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const Users = require("./data/users");

interface User {
  id: number;
  email: string;
  name: string;
}

async function runSeeders() {
  // Users

  await Promise.all(
    Users.map(async (user: User) =>
      prisma.user.upsert({
        where: { id: user.id },

        update: {},

        create: user,
      })
    )
  );
}

runSeeders()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);

    process.exit(1);
  })

  .finally(async () => {
    console.log("Successfully seeded database. Closing connection.");

    await prisma.$disconnect();
  });
