import { z } from "zod";

export type FormField = {
  id: string;
  type: "text" | "select" | "textarea" | "checkbox" | "radio";
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: z.ZodType<any>;
  conditions?: {
    field: string;
    operator: "equals" | "notEquals";
    value: string;
  }[];
};

export type FormTemplate = {
  id: string;
  name: string;
  fields: FormField[];
};
