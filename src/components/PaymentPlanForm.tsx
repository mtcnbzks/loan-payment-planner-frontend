"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import {
  fetchGroups,
  fetchTypeFromGroup,
  fetchTypeFromName,
  getGroupIdFromName,
} from "@/lib/actions";
import { createStringArray } from "@/lib/helper";
import { loan_group, loan_type } from "@prisma/client";
import { useEffect, useState } from "react";
import { DatePickerForm } from "./DatePickerForm";
import InputForm from "./InputForm";
import { RadioGroupForm } from "./RadioGroupForm";
import SelectForm from "./SelectForm";
import { Label } from "./ui/label";

const formSchema = z.object({
  loan_group: z.string(),
  loan_type: z.string(),
  installment_count: z.coerce.number().int(),
  customer_type: z.string(),
  currency_type: z.coerce.string(),
  interest_rate: z.coerce.number(),
  cost: z.coerce.number(),
  kkdf_rate: z.coerce.number().optional(),
  bsmv_rate: z.coerce.number().optional(),
  credit_amount: z.coerce.number().positive(),
  period_frequency: z.coerce.number().int().positive(),
  period_frequency_type: z.string(),
  first_installment_date: z.date(),
  payment_type: z.string(),
});

export default function ProfileForm() {
  const [loanGroups, setLoanGroups] = useState<loan_group[]>();
  const [loanTypes, setLoanTypes] = useState<loan_type[]>();
  const [installmentCountValues, setInstallmentCountValues] =
    useState<string[]>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loan_group: undefined,
      loan_type: undefined,
      installment_count: 1,
      customer_type: "1- Gerçek Müşteri",
      currency_type: "TL",
      interest_rate: 0,
      cost: 0,
      kkdf_rate: 0,
      bsmv_rate: 0,
      credit_amount: 0,
      period_frequency: undefined,
      period_frequency_type: "M- Ayda",
      first_installment_date: new Date(),
      payment_type: "Düzenli",
    },
  });
  const { watch } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  useEffect(() => {
    async function init() {
      // TODO: its not necessary to fetch groups every time. CHANGE IT
      const loanGroups = await fetchGroups();
      setLoanGroups(loanGroups);

      if (!form.getValues("loan_group")) return;

      const id = await getGroupIdFromName(form.getValues("loan_group"));
      if (!id) return;

      const loanTypes = await fetchTypeFromGroup(id.id);
      setLoanTypes(loanTypes);

      const selectedTypeName = form.getValues("loan_type");
      if (!selectedTypeName) return;
      const selectedType = await fetchTypeFromName(selectedTypeName);

      if (selectedType) {
        formSchema.shape.installment_count = z.coerce
          .number()
          .positive()
          .int()
          .min(selectedType.min_installment_count)
          .max(selectedType.max_installment_count);
        form.setValue("interest_rate", selectedType.interest_rate);
        form.setValue("cost", selectedType?.cost || 0);
        form.setValue("kkdf_rate", selectedType?.kkdf_rate || 0);
        form.setValue("bsmv_rate", selectedType?.bsmv_rate || 0);

        setInstallmentCountValues(
          createStringArray(
            selectedType.min_installment_count,
            selectedType.max_installment_count
          )
        );
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("loan_group"), watch("loan_type")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {loanGroups ? (
          <div>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-4 justify-center">
                <SelectForm
                  name="loan_group"
                  label="Ürün Grubu"
                  control={form.control}
                  values={
                    loanGroups
                      ? loanGroups.map((loanType) => loanType.name)
                      : []
                  }
                />

                {loanTypes && (
                  <SelectForm
                    name="loan_type"
                    label="Ürün"
                    control={form.control}
                    values={
                      loanTypes
                        ? loanTypes.map((loanType) => loanType.name)
                        : []
                    }
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

              <div className="flex flex-col gap-4 justify-center">
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
                  name="cost"
                  label="Masraf"
                  control={form.control}
                  type="number"
                />
              </div>

              <div className="flex flex-col gap-4 justify-center">
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
            <div className="mt-12 flex flex-col gap-4">
              <InputForm
                name="credit_amount"
                label="Kredi"
                control={form.control}
                type="number"
              />
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <SelectForm
                    name="period_frequency"
                    label="Periyot"
                    control={form.control}
                    values={createStringArray(1, 11)}
                  />
                  <SelectForm
                    name="period_frequency_type"
                    label="Periyot Tipi"
                    control={form.control}
                    values={["M- Ayda", "Y- Yılda"]}
                  />
                  <Label className="mt-7">Bir Eşit Ödemeli</Label>
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
            </div>
          </div>
        ) : (
          <FormMessage>Loading...</FormMessage>
        )}
        <Button type="submit">Planı Yazdır</Button>
      </form>
    </Form>
  );
}
