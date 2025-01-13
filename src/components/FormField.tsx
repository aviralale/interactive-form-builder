import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useFormStore } from "../store/formStore";
import { FormField as FormFieldType } from "../lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Trash2, GripVertical } from "lucide-react";

interface FormFieldProps {
  field: FormFieldType;
  index: number;
}

const FormField: React.FC<FormFieldProps> = ({ field, index }) => {
  const updateField = useFormStore((state) => state.updateField);
  const removeField = useFormStore((state) => state.removeField);
  const moveField = useFormStore((state) => state.moveField);
  const [isEditing, setIsEditing] = React.useState(false);

  // Drag and drop configuration
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: "FIELD_SORT",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "FIELD_SORT",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const handleUpdate = (updates: Partial<FormFieldType>) => {
    updateField(field.id, updates);
  };

  const addNewOption = () => {
    const currentOptions = field.options || [];
    const nextNumber = currentOptions.length + 1;
    const newOptionName = `Option ${nextNumber}`;

    // Check if the generated name already exists
    let uniqueOptionName = newOptionName;
    let counter = nextNumber;
    while (currentOptions.includes(uniqueOptionName)) {
      counter++;
      uniqueOptionName = `Option ${counter}`;
    }

    const newOptions = [...currentOptions, uniqueOptionName];
    handleUpdate({ options: newOptions });
  };

  const renderFieldEditor = () => (
    <div className="space-y-4 mt-4">
      <Input
        value={field.label}
        onChange={(e) => handleUpdate({ label: e.target.value })}
        placeholder="Field Label"
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Required:</span>
          <Switch
            checked={field.required}
            onCheckedChange={(checked) => handleUpdate({ required: checked })}
          />
        </div>

        {(field.type === "text" || field.type === "textarea") && (
          <Input
            value={field.placeholder || ""}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder text"
            className="flex-1"
          />
        )}
      </div>

      {(field.type === "select" || field.type === "radio") && (
        <div className="space-y-2">
          <span className="text-sm">Options:</span>
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(field.options || [])];
                    newOptions[i] = e.target.value;
                    handleUpdate({ options: newOptions });
                  }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const newOptions = field.options?.filter(
                      (_, index) => index !== i
                    );
                    handleUpdate({ options: newOptions });
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addNewOption}>
              Add Option
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div ref={drop}>
      <Card
        ref={dragPreview}
        className={`mb-4 ${isDragging ? "opacity-50" : ""}`}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div ref={drag} className="cursor-move">
              <GripVertical size={20} className="text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium">{field.label}</h3>
              <p className="text-sm text-gray-500">Type: {field.type}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeField(field.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardHeader>
        {isEditing && <CardContent>{renderFieldEditor()}</CardContent>}
      </Card>
    </div>
  );
};

export default FormField;
