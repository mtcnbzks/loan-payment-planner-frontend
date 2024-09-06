"use client";

import { Dialog } from "@/components/Dialog";
import PaymentPlanForm from "@/components/form/PaymentPlanForm";
import LoanDownloadButton from "@/components/LoanDownloadButton";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  deleteInstallments,
  deleteLoan,
  fetchInstallmentsFromLoanId,
} from "@/lib/actions";
import { installment } from "@prisma/client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { columns } from "../components/table/columns";

export default function Home() {
  const [loanId, setLoanId] = useState(0);
  const [data, setData] = useState<installment[]>([]);

  async function deleteLoanAndInstallment() {
    await deleteInstallments(loanId);
    await deleteLoan(loanId);

    setLoanId(0);

    // delete loanName search param from url
    const url = new URL(window.location.href);
    url.searchParams.delete("loanName");
    window.history.pushState({}, "", url.toString());

    window.location.reload();
  }

  const fetchData = useCallback(async () => {
    if (loanId > 0) {
      const fetchedData = await fetchInstallmentsFromLoanId(loanId);
      console.log(fetchedData);

      setData(fetchedData);
    }
  }, [loanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col md:items-center justify-center gap-4 p-4 mt-12">
      <Suspense>
        <PaymentPlanForm
          loanId={loanId}
          setLoanId={(id: number) => setLoanId(id)}
        />
      </Suspense>

      {loanId > 0 && data.length > 0 && (
        <div>
          <DataTable data={data} columns={columns} />
          <div className="flex justify-end gap-4">
            <Dialog
              title="Silmek istediğinizden emin misiniz?"
              description="Bu işlem oluşturduğunuz kaydı silecek."
              triggerButton={<Button variant="destructive">Kaydı Sil</Button>}
              action={deleteLoanAndInstallment}
            />
            <LoanDownloadButton loanId={loanId} />
          </div>
        </div>
      )}
    </div>
  );
}
