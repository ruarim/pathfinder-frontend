import { useFieldArray, useFormContext } from "react-hook-form";
import ControlledInput from "./LineInput";

export default function FieldArrayInput({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const { control } = useFormContext();

  const {
    remove,
    fields: fields,
    append,
  } = useFieldArray({
    control: control,
    name: name,
  });

  return (
    <div>
      {fields.map((field, index) => {
        const fieldName = `${name}[${index}]`;
        return (
          <fieldset name={fieldName} key={fieldName}>
            <div className="pb-3">
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  {label} {index + 1}
                </label>
                <div className="flex">
                  <div className="mt-1 w-full">
                    <ControlledInput placeholder={label} name={fieldName} />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-100 text-red-800 p-1 px-2 rounded-lg ml-2 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </fieldset>
        );
      })}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => append("")}
          className="bg-blue-100 text-blue-800 p-3 rounded-lg mr-2"
        >
          Add {name}
        </button>
        <button
          type="button"
          onClick={() => remove()}
          className="bg-blue-100 text-blue-800 p-3 rounded-lg ml-2"
        >
          Clear {name}
        </button>
      </div>
    </div>
  );
}
