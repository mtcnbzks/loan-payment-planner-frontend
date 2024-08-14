import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface InputFormProps {
  name: string;
  label: string;
  disabled?: boolean;
  type: "email" | "number" | "text";
  control: Control<any>;
}

export default function InputForm({
  name,
  label,
  disabled,
  type,
  control,
}: InputFormProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-64">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              disabled={disabled}
              className="text-right"
              type={type}
              {...field}
            />
          </FormControl>
          {/* <FormDescription>This is your public display name.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
