import React from "react";

export default function Button({
  name,
  onClick,
}: {
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      className="relative mt-4 my-2 px-6 py-2 font-bold text-primary group"
      onClick={onClick}
    >
      <span className="absolute inset-0 transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-contrast/50 group-hover:translate-x-0 group-hover:translate-y-0"></span>
      <span className="absolute inset-0 border-2 border-primary"></span>
      <span className="relative">{name}</span>
    </button>
  );
}
