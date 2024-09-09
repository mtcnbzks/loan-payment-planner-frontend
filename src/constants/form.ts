import { z } from "zod";

export const formSchema = z.object({
  loan_group: z.string().min(1, "Lütfen bir ürün grubu seçiniz."),
  loan_type: z.string().min(1, "Lütfen bir ürün seçiniz."),
  installment_count: z.coerce
    .number()
    .int("Lütfen bir taksit sayısı seçiniz.")
    .positive("Lütfen bir taksit sayısı seçiniz.")
    .min(1, "Lütfen bir taksit sayısı seçiniz."),
  customer_type: z.string().min(1, "Lütfen bir müşteri tipi seçiniz."),
  currency_type: z.string().min(1, "Lütfen bir döviz cinsi seçiniz."),
  interest_rate: z.coerce.number().positive("Lütfen bir faiz oranı giriniz."),
  expense: z.coerce.number().positive("Lütfen bir masraf giriniz."),
  kkdf_rate: z.coerce.number(),
  bsmv_rate: z.coerce.number(),
  loan_amount: z.coerce.number().positive("Lütfen bir kredi tutarı giriniz."),
  period_frequency: z.coerce
    .number()
    .int()
    .positive("Lütfen bir periyot seçiniz."),
  period_frequency_type: z.string().min(1, "Lütfen bir periyot tipi seçiniz."),
  first_installment_date: z.date(),
  payment_type: z.string().min(1, "Lütfen bir ödeme tipi seçiniz."),
});

export const defaultValues = {
  loan_group: "",
  loan_type: "",
  installment_count: 0,
  customer_type: "1- Gerçek Müşteri",
  currency_type: "TL",
  interest_rate: 0,
  expense: 0,
  kkdf_rate: 0,
  bsmv_rate: 0,
  loan_amount: 10000,
  period_frequency: 1,
  period_frequency_type: "M- Ayda",
  first_installment_date: new Date(
    new Date().setDate(new Date().getDate() + 1)
  ),
  payment_type: "Düzenli",
};
