import { Search } from "lucide-react";
import { Button } from "./ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getLoanNames } from "@/lib/actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function LoanSearchDialog() {
  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loanNames, setLoanNames] = useState<string[]>([]);

  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("loanName", term);
    } else {
      params.delete("loanName");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    async function fetchLoans() {
      const loanNamesResponse = await getLoanNames(searchQuery);
      const loanNames = loanNamesResponse
        .map((loan) => loan.search_name)
        .filter((name) => name !== null) as string[];
      setLoanNames(loanNames);
    }

    fetchLoans();
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Kredi Kaydı Ara">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kredi Kaydı Ara</DialogTitle>
          <DialogDescription>
            Kaydedilmiş kayıtlarda arama yapın.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center">
            {/* <Label htmlFor="name" className="text-right">
              Name
            </Label> */}
            <Input
              id="query"
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ul className="mt-4">
              {loanNames?.map((name) => (
                <li
                  key={name}
                  className="underline cursor-pointer"
                  onClick={() => {
                    handleSearch(name);
                    setOpen(false);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
