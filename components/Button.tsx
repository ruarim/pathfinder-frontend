interface ButtonProps {
  children: string | JSX.Element | JSX.Element[];
  onClick?: () => void;
  colour: "red" | "blue" | "green" | "gray";
  isLoading?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  colour,
  isLoading,
  type,
  disabled,
}: ButtonProps) {
  const colours = new Map([
    ["red", "bg-red-200  hover:bg-red-300 text-red-700"],
    ["blue", "bg-blue-200  hover:bg-blue-300 text-blue-700"],
    ["green", "bg-green-200  hover:bg-green-300 text-green-700"],
    ["gray", "bg-gray-200  hover:bg-gray-300 text-gray-700"],
  ]);

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2 mt-2 rounded-full transition text-sm whitespace-nowrap flex ${colours.get(
        colour
      )}`}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
