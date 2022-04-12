import type { Spend, Tag, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Spend } from "@prisma/client";

export function getSpend({
  id,
  userId,
}: Pick<Spend, "id"> & {
  userId: User["id"];
}) {
  return prisma.spend.findFirst({
    where: { id, userId },
  });
}

export function getSpendListItems({ userId }: { userId: User["id"] }) {
  return prisma.spend.findMany({
    where: { userId },
    select: { id: true, memo: true, amount: true },
    orderBy: { createdAt: "desc" },
  });
}

export function createSpend({
  memo,
  amount,
  userId,
  tags,
}: Pick<Spend, "memo" | "amount"> & {
  userId: User["id"];
  tags: Tag["name"][];
}) {
  return prisma.spend.create({
    data: {
      memo,
      amount,
      user: {
        connect: {
          id: userId,
        },
      },
      tags: {
        connectOrCreate: tags.map((t) => ({
          where: {
            name: t,
          },
          create: {
            name: t,
          },
        })),
      },
    },
  });
}

export function deleteSpend({
  id,
  userId,
}: Pick<Spend, "id"> & { userId: User["id"] }) {
  return prisma.spend.deleteMany({
    where: { id, userId },
  });
}
