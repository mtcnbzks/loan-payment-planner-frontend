import {
  fetchInstallmentsFromLoanId,
  getGroupNameFromId,
  getLoan,
} from "@/lib/actions";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { utils, writeFileXLSX } from "xlsx";
import { Button } from "./ui/button";

export default function LoanDownloadButton({ loanId }: { loanId: number }) {
  const [table, setTable] = useState<HTMLTableElement | null>(null);

  useEffect(() => {
    const table = document.querySelector("table");
    if (table) setTable(table);
  }, []);

  async function xport() {
    if (!loanId) {
      console.error("Loan ID not found!");
      return;
    }

    if (!table) {
      console.error("Table not found!");
      return;
    }

    const installments = await fetchInstallmentsFromLoanId(loanId);
    if (!installments) {
      console.error("Installments not found!");
      return;
    }

    const loan = await getLoan(Number(loanId));
    if (!loan) console.error("Loan not found!");

    const exportInstallments: {
      "Sıra No": any;
      "Ödeme Tarihi": any;
      "Kalan Anapara": any;
      "Anapara Ödemesi": any;
      "Faiz Tutarı": any;
      "KKDF Tutarı": any;
      "BSMV Tutarı": any;
      "Taksit Tutarı": any;
    }[] = [];

    console.log(installments[0]);

    installments.forEach((installment: any, index: number) => {
      exportInstallments.push({
        "Sıra No": installment.lineNo,
        "Ödeme Tarihi": new Date(installment.paymentDate).toLocaleDateString(),
        "Kalan Anapara": installment.remainingCapital,
        "Anapara Ödemesi": installment.capitalPayment,
        "Faiz Tutarı": installment.interestAmount,
        "KKDF Tutarı": installment.kkdfAmount,
        "BSMV Tutarı": installment.bsmvAmount,
        "Taksit Tutarı": installment.installmentAmount,
      });
    });

    const result = await getGroupNameFromId(loan?.loan_group_id || 0);
    const exportLoan = {
      "Oluşturulma Tarihi": loan?.created_at,
      "Ürün Grubu": result?.name,
      Ürün: loan?.type,
      "Taksit Sayısı": loan?.installment_count,
      "Faiz Oranı": loan?.interest_rate,
      Masraf: loan?.expense,
      "KKDF Oranı": loan?.kkdf_rate,
      "BSMV Oranı": loan?.bsmv_rate,
      Tutar: loan?.amount,
      "İlk Ödeme Tarihi": loan?.first_installment_date,
      "Periyot Tipi": loan?.period_frequency_type == "MONTH" ? "AY" : "YIL",
    };

    const workbook = utils.book_new();
    const loanData = utils.json_to_sheet([exportLoan]);
    const installmentsData = utils.json_to_sheet(exportInstallments);

    utils.book_append_sheet(workbook, loanData, "Kredi");
    utils.book_append_sheet(workbook, installmentsData, "Plan");

    writeFileXLSX(workbook, "plan.xlsx");
  }

  return (
    <Button onClick={xport} variant="outline">
      <Download className="h-5 w-5" />
    </Button>
  );
}
