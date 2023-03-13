import React from "react";

interface LoadingButtonProps {
  isLoading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
}
export default function LoadingButton({
  onClick,
  isLoading,
  children,
  type,
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className="bg-indigo-500 hover:bg-indigo-700 max-w-min flex items-center whitespace-nowrap justify-center px-5 py-2 rounded-md shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed w-full"
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
