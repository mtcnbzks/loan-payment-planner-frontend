"use client";

import { installment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<installment>[] = [
  {
    accessorKey: "lineNo",
    header: "Sıra No",
  },
  {
    accessorKey: "paymentDate",
    header: "Ödeme Tarihi",
    cell: (row) => {
      const value = row.cell.getValue() as Date;
      const date = new Date(value);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "remainingCapital",
    header: "Kalan Anapara",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
  {
    accessorKey: "capitalPayment",
    header: "Anapara Ödemesi",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
  {
    accessorKey: "interestAmount",
    header: "Faiz Tutarı",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
  {
    accessorKey: "kkdfAmount",
    header: "KKDF Tutarı",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
  {
    accessorKey: "bsmvAmount",
    header: "BSMV Tutarı",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
  {
    accessorKey: "installmentAmount",
    header: "Taksit Tutarı",
    cell: (row) => {
      const value = row.cell.getValue() as Number;
      // show as money format
      return value.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      });
    },
  },
];
