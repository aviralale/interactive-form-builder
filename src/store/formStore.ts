import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { FormField, FormTemplate } from "../lib/types";

interface FormStore {
  fields: FormField[];
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  updateField: (id: string, field: Partial<FormField>) => void;
  moveField: (dragIndex: number, hoverIndex: number) => void;
  loadTemplate: (template: FormTemplate) => void;
}

export const useFormStore = create<FormStore>()(
  devtools((set) => ({
    fields: [],
    addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
    removeField: (id) =>
      set((state) => ({
        fields: state.fields.filter((field) => field.id !== id),
      })),
    updateField: (id, updatedField) =>
      set((state) => ({
        fields: state.fields.map((field) =>
          field.id === id ? { ...field, ...updatedField } : field
        ),
      })),
    moveField: (dragIndex, hoverIndex) =>
      set((state) => {
        const newFields = [...state.fields];
        const dragField = newFields[dragIndex];
        newFields.splice(dragIndex, 1);
        newFields.splice(hoverIndex, 0, dragField);
        return { fields: newFields };
      }),
    loadTemplate: (template) => set({ fields: template.fields }),
  }))
);
