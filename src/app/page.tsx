"use client";

import { Dialog } from "@/components/Dialog";
import PaymentPlanForm from "@/components/form/PaymentPlanForm";
import Header from "@/components/Header";
import LoanDownloadButton from "@/components/LoanDownloadButton";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  deleteInstallments,
  deleteLoan,
  fetchInstallmentsFromLoanId,
} from "@/lib/actions";
import { installment } from "@prisma/client";
import { Suspense, useEffect, useState } from "react";
import { columns } from "../components/table/columns";

export default function Home() {
  const [loanId, setLoanId] = useState(0);
  const [data, setData] = useState<installment[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (loanId > 0) {
        const fetchedData = await fetchInstallmentsFromLoanId(loanId);
        setData(fetchedData);
      }
    }

    fetchData();
  }, [loanId]);

  async function deleteLoanAndInstallment() {
    if (loanId > 0) {
      await Promise.all([deleteInstallments(loanId), deleteLoan(loanId)]);
      setLoanId(0);
      setData([]);

      const url = new URL(window.location.href);
      url.searchParams.delete("loanName");
      window.history.pushState({}, "", url.toString());
    }
  }

  return (
    <div className="flex flex-col md:items-center justify-center gap-4 p-4 mt-12">
      <Header />
      <Suspense>
        <PaymentPlanForm
          loanId={loanId}
          setLoanId={(loanId: number) => {
            setLoanId(loanId);
          }}
        />
      </Suspense>
      {loanId > 0 && data.length > 0 && (
        <LoanDataSection
          data={data}
          loanId={loanId}
          onDelete={deleteLoanAndInstallment}
        />
      )}
    </div>
  );
}

function LoanDataSection({
  data,
  loanId,
  onDelete,
}: {
  data: installment[];
  loanId: number;
  onDelete: () => void;
}) {
  return (
    <div>
      <DataTable data={data} columns={columns} />
      <div className="flex justify-end gap-4">
        <Dialog
          title="Silmek istediğinizden emin misiniz?"
          description="Bu işlem oluşturduğunuz kaydı silecek."
          triggerButton={<Button variant="destructive">Kaydı Sil</Button>}
          action={onDelete}
        />
        <LoanDownloadButton loanId={loanId} />
      </div>
    </div>
  );
}
