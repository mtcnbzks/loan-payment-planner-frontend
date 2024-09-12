/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { defaultValues, formSchema } from "@/constants/form";
import {
  fetchGroups,
  fetchLoanIdFromName,
  fetchTypeFromGroup,
  fetchTypeFromName,
  getGroupIdFromName,
  postInstallments,
  postLoan,
} from "@/lib/actions";
import { createStringArray } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { loan_group, loan_type } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingSpinner from "../LoadingSpinner";
import LoanSaveNameDialog from "../LoanSaveNameDialog";
import LoanSearchDialog from "../LoanSearchDialog";
import { Label } from "../ui/label";
import { DatePickerForm } from "./DatePickerForm";
import InputForm from "./InputForm";
import { RadioGroupForm } from "./RadioGroupForm";
import SelectForm from "./SelectForm";

export default function PaymentPlanForm({
  loanId,
  setLoanId,
}: {
  loanId: number;
  setLoanId: (loandId: number) => void;
}) {
  const [loanGroups, setLoanGroups] = useState<loan_group[] | null>(null);
  const [loanTypes, setLoanTypes] = useState<loan_type[] | null>(null);
  const [installmentCountValues, setInstallmentCountValues] = useState<
    string[] | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const { watch, getValues, setValue } = form;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loanName = searchParams.get("loanName");

  useEffect(() => {
    async function setLoanIdFromSearch() {
      const loan = await fetchLoanIdFromName(loanName);
      if (!loan) return;

      setLoanId(Number(loan.id));

      // scroll to bottom
      setTimeout(() => {
        const table = document.getElementById("table");
        table?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }

    if (loanName) {
      setLoanIdFromSearch();
    } else {
      setLoanId(0);
    }
  }, [loanName]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!loanGroups) {
          const groups = await fetchGroups();
          setLoanGroups(groups);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    }

    fetchData();
  }, [loanGroups]);

  useEffect(() => {
    async function loadLoanTypes() {
      const loanGroupName = getValues("loan_group");
      if (!loanGroupName) return;

      const loanGroup = await getGroupIdFromName(loanGroupName);
      if (!loanGroup) return;

      const loanTypes = await fetchTypeFromGroup(loanGroup.id);
      setLoanTypes(loanTypes);
    }

    loadLoanTypes();
  }, [watch("loan_group")]);

  useEffect(() => {
    async function loadDetails() {
      const loanTypeName = getValues("loan_type");
      if (!loanTypeName) return;

      const selectedType = await fetchTypeFromName(loanTypeName);
      if (selectedType) {
        setValue("interest_rate", selectedType.interest_rate);
        setValue("kkdf_rate", selectedType.kkdf_rate || 0);
        setValue("bsmv_rate", selectedType.bsmv_rate || 0);

        const values = createStringArray(
          selectedType.min_installment_count,
          selectedType.max_installment_count
        );
        setInstallmentCountValues(values);

        formSchema.shape.installment_count = z.coerce
          .number()
          .min(
            selectedType.min_installment_count,
            "Lütfen bir taksit sayısı seçiniz."
          )
          .max(
            selectedType.max_installment_count,
            "Lütfen bir taksit sayısı seçiniz."
          );
      }
    }

    loadDetails();
  }, [watch("loan_type")]);

  useEffect(() => {
    function setExpenseLimit() {
      const maxExpense = getValues("loan_amount") * 0.005;
      formSchema.shape.expense = z.coerce
        .number()
        .positive("Lütfen bir masraf giriniz.")
        .max(maxExpense, "Masraf kredi tutarının maksimum %0.05 olabilir.");

      setValue("expense", maxExpense);
    }

    setExpenseLimit();
  }, [watch("loan_amount")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(searchParams);
    if (params.get("loanName")) {
      params.delete("loanName");
      window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
    }
    console.log(values);

    const groupId = await getGroupIdFromName(values.loan_group);
    console.log(new Date()); // TODO: 3h problem

    const loanData = {
      createdAt: new Date(),
      loanGroup: groupId,
      type: values.loan_type,
      installmentCount: values.installment_count,
      customerType:
        values.customer_type === "1- Gerçek Müşteri"
          ? "INDIVIDUAL"
          : "CORPORATE",
      currencyType: values.currency_type,
      interestRate: values.interest_rate,
      expense: values.expense,
      kkdfRate: values.kkdf_rate,
      bsmvRate: values.bsmv_rate,
      amount: values.loan_amount,
      firstInstallmentDate: values.first_installment_date,
      periodFrequency: values.period_frequency,
      periodFrequencyType:
        values.period_frequency_type === "M- Ayda" ? "MONTH" : "YEAR",
      paymentType: values.payment_type === "Düzenli" && "REGULAR",
    };

    const uriFromResponse = await postLoan(loanData);
    if (!uriFromResponse) return;

    const loanIdFromUri = uriFromResponse.split("/").pop();
    setLoanId(Number(loanIdFromUri));

    await postInstallments(Number(loanIdFromUri));

    setTimeout(() => {
      const table = document.getElementById("table");
      table?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {loanGroups ? (
          <>
            {/* Form Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Column 1 */}
              <div className="space-y-2">
                <SelectForm
                  name="loan_group"
                  label="Ürün Grubu"
                  control={form.control}
                  values={loanGroups.map((loanGroup) => loanGroup.name)}
                />
                {loanTypes && (
                  <SelectForm
                    name="loan_type"
                    label="Ürün"
                    control={form.control}
                    values={loanTypes.map((loanType) => loanType.name)}
                  />
                )}
                {form.getValues("loan_type") && (
                  <SelectForm
                    name="installment_count"
                    label="Taksit Sayısı"
                    control={form.control}
                    values={installmentCountValues || []}
                  />
                )}
                <SelectForm
                  name="customer_type"
                  label="Müşteri Tipi"
                  control={form.control}
                  values={["1- Gerçek Müşteri", "2- Tüzel Müşteri"]}
                />
              </div>

              {/* Column 2 */}
              <div className="space-y-2">
                <SelectForm
                  name="currency_type"
                  label="Döviz Cinsi"
                  control={form.control}
                  values={["TL"]}
                />
                <InputForm
                  name="interest_rate"
                  label="Faiz Oranı"
                  control={form.control}
                  type="number"
                />
                <InputForm
                  name="expense"
                  label="Masraf"
                  control={form.control}
                  type="number"
                />
              </div>

              {/* Column 3 */}
              <div className="space-y-2">
                <InputForm
                  name="kkdf_rate"
                  label="KKDF Oranı"
                  disabled
                  control={form.control}
                  type="number"
                />
                <InputForm
                  name="bsmv_rate"
                  label="BSMV Oranı"
                  disabled
                  control={form.control}
                  type="number"
                />
              </div>
            </div>

            {/* Form Row 2 */}
            <div className="space-y-3">
              <InputForm
                name="loan_amount"
                label="Kredi Tutarı"
                control={form.control}
                type="number"
              />

              {/* Form Row 3 */}
              <div className="flex gap-4">
                <SelectForm
                  name="period_frequency"
                  label="Periyot"
                  control={form.control}
                  initialSelect
                  values={createStringArray(1, 11)}
                />
                <SelectForm
                  name="period_frequency_type"
                  label="Periyot Tipi"
                  control={form.control}
                  values={["M- Ayda", "Y- Yılda"]}
                />
                <div className="flex items-center mt-8">
                  <Label>Bir Eşit Ödemeli</Label>
                </div>
              </div>

              <DatePickerForm
                name="first_installment_date"
                label="İlk Taksit Tarihi"
                control={form.control}
              />

              <RadioGroupForm
                name="payment_type"
                label="Ödeme Şekli"
                control={form.control}
                values={["Düzenli"]}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit">Planı Yazdır</Button>
              <LoanSearchDialog />
              <LoanSaveNameDialog loanId={loanId} />
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </form>
    </Form>
  );
}
