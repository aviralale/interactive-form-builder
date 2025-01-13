import React from "react";
import { useDrop } from "react-dnd";
import { useFormStore } from "../store/formStore";
import { FormField as FormFieldTypes } from "../lib/types";
import FormField from "./FormField";

const FieldList: React.FC<{ fields: FormFieldTypes[] }> = ({ fields }) => {
  const addField = useFormStore((state) => state.addField);

  const [, drop] = useDrop({
    accept: "FIELD",
    drop: (item: { type: string }) => {
      addField({
        id: `field-${Date.now()}`,
        type: item.type as FormFieldTypes["type"],
        label: `New ${item.type} field`,
        required: false,
      });
    },
  });

  return (
    <div
      ref={drop}
      className="min-h-[400px] p-4 border-2 border-dashed rounded"
    >
      {fields.map((field, index) => (
        <FormField key={field.id} field={field} index={index} />
      ))}
      {fields.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Drag fields here to build your form
        </div>
      )}
    </div>
  );
};

export default FieldList;
