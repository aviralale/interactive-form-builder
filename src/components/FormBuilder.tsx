import { FC, useMemo, useState } from "react";
import { useFormStore } from "../store/formStore";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "./ui/button";
import { Download, Eye } from "lucide-react";
import PreviewForm from "./PreviewForm";
import FieldLibrary from "./FieldLibrary";
import FieldList from "./FieldList";
import { ModeToggle } from "./themes/mode-toggle";
import { z } from "zod";

const FormBuilder: FC = () => {
  const fields = useFormStore((state) => state.fields);
  const [previewMode, setPreviewMode] = useState(false);

  const schema = useMemo(() => {
    return fields.reduce<Record<string, z.ZodType<any>>>((acc, field) => {
      if (field.validation) {
        acc[field.id] = field.validation;
      }
      return acc;
    }, {});
  }, [fields]);

  const handleExport = () => {
    const formSchema = {
      fields,
      schema,
    };
    const blob = new Blob([JSON.stringify(formSchema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
  };

  return (
    <>
      <div className="fixed right-10 bottom-10">
        <ModeToggle />
      </div>
      <DndProvider backend={HTML5Backend}>
        <div className="container flex flex-col justify-center mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl text-center font-bold">Form Builder</h1>
            <div className="flex space-x-2">
              <Button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye size={16} />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export Schema
              </Button>
            </div>
          </div>

          {previewMode ? (
            <PreviewForm fields={fields} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <FieldLibrary />
              </div>
              <div className="md:col-span-3">
                <FieldList fields={fields} />
              </div>
            </div>
          )}
        </div>
      </DndProvider>
    </>
  );
};

export default FormBuilder;
