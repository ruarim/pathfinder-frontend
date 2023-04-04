import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();

  const options = [
    { title: "View Venues", href: "/admin/venues", bgColour: "bg-contrast/50" },
    { title: "Create Venue", href: "/admin/create", bgColour: "bg-notice/50" },
  ];

  return (
    <div className="place-items-center p-12 h-screen grid md:grid-cols-2 md:pl-36 md:pr-36 md:pt-12 md:pb-36 gap-4 rounded-lg">
      {options.map((option) => (
        <button
          className="relative mt-4 my-2 px-6 py-2 font-bold text-primary group w-full h-full hover:animate-pulse"
          onClick={() => router.push(option.href)}
        >
          <span
            className={`absolute inset-0 transition duration-300 ease-out transform -translate-x-2 -translate-y-2 ${option.bgColour} group-hover:translate-x-0 group-hover:translate-y-0`}
          ></span>
          <span className="absolute inset-0 border-2 border-primary"></span>
          <div className="space-x-2">
            <span className="relative text-3xl">{option.title}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
