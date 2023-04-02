import clsx from "clsx";
import { Controller, useFormContext } from "react-hook-form";

interface LineInputProps {
  name: string;
  type?: string;
  placeholder?: string;
  label?: string;
  helpText?: string;
  trailing?: any;
  error?: string;
}

function LineInput({
  name,
  type = "text",
  placeholder,
  label,
  helpText,
  trailing,
  error,
  ...rest
}: LineInputProps) {
  return (
    <div className="w-full">
      {label}
      <div className="flex text-black">
        <input
          className={clsx(
            { "border-2 border-red-500": error },
            "block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          )}
          placeholder={placeholder}
          type={type}
          name={name}
          id={name}
          {...rest}
        />
        {trailing && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-semibold text-black">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

interface ControllerInputProps extends LineInputProps {
  defaultValue?: string;
}

export default function ControlledInput({
  name,
  defaultValue = "",
  placeholder,
  type,
  label,
}: ControllerInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ field }) => (
        <LineInput
          {...field}
          name={name}
          placeholder={placeholder}
          type={type}
          label={label}
        />
      )}
    />
  );
}
