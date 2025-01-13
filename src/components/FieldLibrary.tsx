import React from "react";
import { useDrag } from "react-dnd";
import { Card } from "./ui/card";
const fieldTypes = [
  { type: "text", label: "Text Input" },
  { type: "select", label: "Select Dropdown" },
  { type: "radio", label: "Radio Group" },
  { type: "checkbox", label: "Checkbox" },
  { type: "textarea", label: "Text Area" },
];

const FieldLibrary: React.FC = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Field Types</h2>
      {fieldTypes.map((field) => (
        <DraggableField key={field.type} {...field} />
      ))}
    </div>
  );
};

const DraggableField: React.FC<{ type: string; label: string }> = ({
  type,
  label,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      className={`p-4 cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      {label}
    </Card>
  );
};

export default FieldLibrary;
