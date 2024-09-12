"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";

interface RadioGroupFormProps {
  name: string;
  label: string;
  values: string[];
  control: Control<any>;
}

export function RadioGroupForm({
  name,
  label,
  values,
  control,
}: RadioGroupFormProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
              aria-label={label}
            >
              {values.map((value) => (
                <FormItem
                  key={value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={value} aria-label={value} />
                  </FormControl>
                  <FormLabel className="font-normal">{value}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
