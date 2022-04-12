import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.spend.create({
    data: {
      memo: "My first spend",
      userId: user.id,
      amount: 100.0,
      tags: {
        connectOrCreate: [
          {
            where: {
              name: "Ada toys",
            },
            create: {
              name: "Ada toys",
            },
          },
          {
            where: {
              name: "amazon",
            },
            create: {
              name: "amazon",
            },
          },
        ],
      },
    },
  });

  await prisma.spend.create({
    data: {
      memo: "My second spend",
      userId: user.id,
      amount: 50.95,
      tags: {
        connectOrCreate: [
          {
            where: {
              name: "clothing",
            },
            create: {
              name: "clothing",
            },
          },
          {
            where: {
              name: "amazon",
            },
            create: {
              name: "amazon",
            },
          },
        ],
      },
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
