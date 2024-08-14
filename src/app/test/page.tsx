"use client";

import { DatePickerForm } from "@/components/DatePickerForm";
import ThemeToggle from "@/components/ThemeToggle";
import * as React from "react";

export default function SampleDatePicker() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ThemeToggle />
      <br />
    </div>
  );
}
