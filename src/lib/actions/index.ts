"use server";

import prisma from "../db";

export async function fetchGroups() {
  return await prisma.loan_group.findMany();
}

export async function fetchTypeFromName(typeName: string) {
  return await prisma.loan_type.findFirst({
    where: {
      name: typeName,
    },
  });
}

export async function getGroupIdFromName(groupName: string) {
  return await prisma.loan_group.findFirst({
    where: {
      name: groupName,
    },
    select: {
      id: true,
    },
  });
}

export async function fetchTypeFromGroup(groupId: number) {
  return await prisma.loan_type.findMany({
    where: {
      loan_group_id: groupId,
    },
    orderBy: [{ name: "asc" }],
  });
}
