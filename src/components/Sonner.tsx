"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface SonnerProps {
  title: string;
  description: string;
}

export default function Sonner({ title, description }: SonnerProps) {
  return (
    <div
      onClick={() =>
        toast(title, {
          description: description,
          duration: 3000,
        })
      }
    />
  );
}
