"use server";

import prisma from "../db";

// **Loan Group Functions**

// Fetch all loan groups
export async function fetchGroups() {
  return await prisma.loan_group.findMany({});
}

// Get a loan group's ID by its name
export async function getGroupIdFromName(groupName: string) {
  return await prisma.loan_group.findFirst({
    where: { name: groupName },
    select: { id: true },
  });
}

// Get a loan group's name by its ID
export async function getGroupNameFromId(groupId: number) {
  return await prisma.loan_group.findFirst({
    where: { id: groupId },
    select: { name: true },
  });
}

// Get loan group details by its ID
export async function getGroupFromId(groupId: number) {
  return await prisma.loan_group.findFirst({
    where: { id: groupId },
  });
}

// Fetch loan types associated with a specific loan group
export async function fetchTypeFromGroup(groupId: number) {
  return await prisma.loan_type.findMany({
    where: { loan_group_id: groupId },
    orderBy: [{ name: "asc" }],
  });
}

// **Loan Type Functions**

// Fetch a loan type by its name
export async function fetchTypeFromName(typeName: string) {
  return await prisma.loan_type.findFirst({
    where: { name: typeName },
  });
}

// **Loan Functions**

// Fetch a loan's ID by its search name
export async function fetchLoanIdFromName(loanName: string | null) {
  return await prisma.loan.findFirst({
    where: { search_name: loanName },
    select: { id: true },
  });
}

// Fetch loan details by loan ID
export async function getLoan(loanId: number) {
  return await prisma.loan.findFirst({
    where: { id: loanId },
  });
}

// Save or update loan's search name
export async function saveLoanName(loanId: number, loanSearchName: string) {
  return await prisma.loan.update({
    where: { id: loanId },
    data: { search_name: loanSearchName },
  });
}

// Fetch all loan names (search names)
export async function getAllLoanNames() {
  return await prisma.loan.findMany({
    select: { search_name: true },
  });
}

// Fetch loan names that match a search query
export async function getLoanNames(query: string) {
  if (!query) return [];
  console.log({ query });

  return await prisma.loan.findMany({
    where: {
      search_name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: { search_name: true },
  });
}

// **Loan Installment Functions**

// Fetch installments for a specific loan from the backend service
export async function fetchInstallmentsFromLoanId(loanId: number) {
  const url = `${process.env.BACKEND_INSTALLMENT_URL}/${loanId}`;

  if (!url) throw new Error("Backend URL is not defined.");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch installments:", error);
    throw error;
  }
}

// Post installments for a specific loan to the backend service
export async function postInstallments(loanId: number) {
  const url = `${process.env.BACKEND_INSTALLMENT_URL}/${loanId}`;

  if (!url) {
    throw new Error("Backend URL is not defined.");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to post installments:", error);
    throw error;
  }
}

// Delete installments for a specific loan
export async function deleteInstallments(loanId: number) {
  const url = `${process.env.BACKEND_INSTALLMENT_URL}/${loanId}`;

  if (!url) throw new Error("Backend URL is not defined.");

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    console.log("Installments deleted successfully.");
  } catch (error) {
    console.error("Failed to delete installments:", error);
    throw error;
  }
}

// **Backend Interaction Functions**

// Fetch all loans from the backend service
export async function getLoans() {
  const url = process.env.BACKEND_URL;

  if (!url) {
    throw new Error("Backend URL is not defined.");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch loans:", error);
    throw error;
  }
}

// Post a new loan to the backend service
export async function postLoan(loan: any) {
  const url = process.env.BACKEND_LOAN_URL;

  if (!url) throw new Error("Backend URL is not defined.");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loan),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return response.headers.get("Location");
  } catch (error) {
    console.error("Failed to post loan:", error);
    throw error;
  }
}

// Delete a loan from the backend service
export async function deleteLoan(loanId: number) {
  const url = `${process.env.BACKEND_LOAN_URL}/${loanId}`;

  if (!url) throw new Error("Backend URL is not defined.");

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    console.log("Loan deleted successfully.");
  } catch (error) {
    console.error("Failed to delete loan:", error);
    throw error;
  }
}
