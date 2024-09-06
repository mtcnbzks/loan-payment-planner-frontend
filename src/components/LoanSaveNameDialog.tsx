import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllLoanNames, saveLoanName } from "@/lib/actions";
import { Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function LoanSaveNameDialog({ loanId }: { loanId: number }) {
  const [open, setOpen] = useState(false);
  const [loanSearchName, setLoanSearchName] = useState("");

  const searchParams = useSearchParams();
  const loanName = searchParams.get("loanName");

  async function onSubmit() {
    if (loanName) {
      toast("Bu plan zaten kaydedilmiş.", {
        description: "Bu kredi planı farklı bir isimle zaten kaydedilmiş.",
        duration: 3000,
      });
      return;
    }

    if (!(loanId > 0)) {
      toast("Kredi planı kaydedilemedi.", {
        description: "Lütfen önce kredi planı oluşturun.",
        duration: 3000,
      });
      return;
    }

    const response = await getAllLoanNames();
    const loanNames = response.map((loan) => loan.search_name) as string[];
    if (loanNames.includes(loanSearchName)) {
      toast("Kredi planı kaydedilemedi.", {
        description: "Bu isimde bir kredi planı zaten mevcut.",
        duration: 3000,
      });
      return;
    }
    await saveLoanName(loanId, loanSearchName);
    setOpen(false);
    toast("Kredi planı başarıyla kaydedildi.", {
      description: `Planı daha sonra ${loanSearchName} adıyla aratabilirsiniz.`,
      duration: 3000,
    });
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Save className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Kredi Planını Kaydet</DialogTitle>
            <DialogDescription>
              Kredi planını kaydetmek için bir isim girin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* <Label htmlFor="name" className="text-right">
              Name
            </Label> */}
            <Input
              id="query"
              onChange={(e) => {
                setLoanSearchName(e.target.value);
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={onSubmit}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
