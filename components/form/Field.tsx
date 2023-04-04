import clsx from "clsx";

interface FieldProps extends Partial<HTMLDivElement> {
  children: any;
  error?: string;
  helpText?: string;
}

export default function Field({ children, error, helpText }: FieldProps) {
  return (
    <div>
      {children}
      <p
        className={clsx({
          "bg-red-300  text-red-900 shadow rounded-md p-0.5 mt-1 text-center":
            error,
        })}
      >
        {error ?? helpText}
      </p>
    </div>
  );
}
