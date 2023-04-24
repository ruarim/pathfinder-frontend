interface ButtonProps {
  children: string | JSX.Element | JSX.Element[];
  onClick: () => void;
  colour: "red" | "blue" | "green";
}

export default function Button({ children, onClick, colour }: ButtonProps) {
  const colours = new Map([
    ["red", "bg-red-200  hover:bg-red-300 text-red-700"],
    ["blue", "bg-blue-200  hover:bg-blue-300 text-blue-700"],
    ["green", "bg-green-200  hover:bg-green-300 text-green-700"],
  ]);

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 mt-2 rounded-full transition text-sm ${colours.get(
        colour
      )}`}
    >
      {children}
    </button>
  );
}
