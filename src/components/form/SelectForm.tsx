import { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFormProps {
  name: string;
  label: string;
  values: string[];
  initialSelect?: boolean;
  control: Control<any>;
}

export default function SelectForm({
  name,
  label,
  values,
  initialSelect,
  control,
}: SelectFormProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-64">
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={initialSelect ? values[0].toString() : field.value}
          >
            <FormControl>
              <SelectTrigger aria-label={label}>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {values.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
