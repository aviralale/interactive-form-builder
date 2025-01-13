import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "../lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Form,
  FormControl,
  FormField as FormFieldUI,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface PreviewFormProps {
  fields: FormField[];
}

const PreviewForm: React.FC<PreviewFormProps> = ({ fields }) => {
  const schema = z.object(
    fields.reduce((acc, field) => {
      acc[field.id] = field.validation || z.any();
      return acc;
    }, {} as Record<string, z.ZodType<any>>)
  );

  const form = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  const watchedFields = form.watch();

  const renderFieldControl = (field: FormField, formField: any) => {
    switch (field.type) {
      case "text":
        return <Input {...formField} placeholder={field.placeholder} />;
      case "textarea":
        return <Textarea {...formField} placeholder={field.placeholder} />;
      case "select":
        return (
          <Select
            onValueChange={formField.onChange}
            defaultValue={formField.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{field.label}</SelectLabel>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
              id={field.id}
            />
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            onValueChange={formField.onChange}
            defaultValue={formField.value}
            className="space-y-2"
          >
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => {
          const shouldDisplay =
            !field.conditions ||
            field.conditions.every((condition) => {
              const value = watchedFields[condition.field];
              return condition.operator === "equals"
                ? value === condition.value
                : value !== condition.value;
            });

          if (!shouldDisplay) return null;

          return (
            <FormFieldUI
              key={field.id}
              control={form.control}
              name={field.id}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {renderFieldControl(field, formField)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default PreviewForm;
