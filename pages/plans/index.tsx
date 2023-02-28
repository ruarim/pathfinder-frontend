import { MapIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

export default function Plans() {
  const router = useRouter();

  const planOptions = [
    {
      title: "Plan🍻",
      href: "plans/create",
      icon: MapIcon,
    },
    {
      title: "Collection📚",
      href: "plans/collection",
    },
    {
      title: "Explore🌍",
      href: "plans/explore",
    },
    {
      title: "Random🎲",
      href: "plans/random",
    },
  ];

  return (
    <div>
      <div className="flex justify-center pt-8 px-12 space-y-2">
        <p className="text-3xl font-bold">
          "Plan your perfect night out or find some inspiration"
        </p>
      </div>
      <div className="place-items-center p-12 h-screen grid md:grid-cols-2 md:pl-36 md:pr-36 md:pt-12 md:pb-36 gap-4 rounded-lg">
        {planOptions.map((option) => {
          return (
            <button
              className="relative mt-4 my-2 px-6 py-2 font-bold text-primary group w-full h-full hover:animate-pulse"
              onClick={() => router.push(option.href)}
            >
              {/*@dev make boxes alternate between bg-contrast/50 bg-notice/50  */}
              <span className="absolute rounded-md inset-0 transition duration-300 ease-out transform -translate-x-2 -translate-y-2 bg-contrast/50 group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute rounded-md inset-0 border-2 border-primary"></span>
              <span className="relative text-3xl">{option.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
