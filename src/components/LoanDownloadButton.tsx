import { getLoan } from "@/lib/actions";
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

    const loan = await getLoan(Number(loanId));

    const loanData = utils.json_to_sheet([loan]);
    const workbook = utils.table_to_book(table, { sheet: "Plan" });
    utils.book_append_sheet(workbook, loanData, "Kredi");
    writeFileXLSX(workbook, "plan.xlsx");
  }

  return (
    <Button onClick={xport} variant="outline">
      <Download className="h-5 w-5" />
    </Button>
  );
}
