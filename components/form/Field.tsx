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
      <p className={clsx({ "bg-red-500  text-white shadow": error })}>
        {error ?? helpText}
      </p>
    </div>
  );
}
