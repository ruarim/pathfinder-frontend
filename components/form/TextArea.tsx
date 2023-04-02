import { Controller, useFormContext } from "react-hook-form";

interface TextAreaProps {
  name: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  rows?: number;
  error?: string;
}

export function TextArea({
  name,
  placeholder,
  label,
  helpText,
  rows = 3,
  error,
  ...rest
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label}
      <div className="text-black">
        <textarea
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          name={name}
          id={name}
          rows={rows}
          placeholder={placeholder}
          {...rest}
        />
      </div>
    </div>
  );
}

interface ControllerTextAreaProps extends TextAreaProps {
  name: string;
  defaultValue?: any;
}

export default function ControlledTextArea({
  name,
  defaultValue = "",
  ...rest
}: ControllerTextAreaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => <TextArea {...field} {...rest} />}
    />
  );
}
