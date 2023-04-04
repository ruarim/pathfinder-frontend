import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import client from "../../axios/apiClient";

export default function Plans() {
  const { data: randomPlan } = useQuery<
    unknown,
    unknown,
    { data: { path_id: number } }
  >(["random_venue"], () => client.get("paths/public/random"), {
    retry: false,
  });

  const random = randomPlan?.data.path_id;

  const router = useRouter();

  const planOptions = [
    {
      title: "Create",
      subTitle: "Plan your perfect evening.",
      icon: "🍻",
      href: "plans/create",
      bgColour: "bg-contrast/50",
    },
    {
      title: "Plans",
      subTitle: "Search through the plans you've created.",
      icon: "📚",
      href: "plans/plans",
      bgColour: "bg-notice/50",
    },
    {
      title: "Explore",
      subTitle: "Explore plans created by other users.",
      icon: "🌍",
      href: "plans/explore",
      bgColour: "bg-contrast/50 md:bg-notice/50",
    },
    {
      title: "Random",
      subTitle: "Find some inspiration with a random plan.",
      icon: "🎲",
      href: `plans/${random}`,
      bgColour: "bg-notice/50 md:bg-contrast/50",
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
        {random &&
          planOptions.map((option) => {
            return (
              <button
                key={option.href}
                className="relative mt-4 my-2 px-6 py-2 font-bold text-primary group w-full h-full hover:animate-pulse"
                onClick={() => router.push(option.href)}
              >
                <span
                  className={`absolute inset-0 transition duration-300 ease-out transform -translate-x-2 -translate-y-2 ${option.bgColour} group-hover:translate-x-0 group-hover:translate-y-0`}
                ></span>
                <span className="absolute inset-0 border-2 border-primary"></span>
                <div className="space-x-2">
                  <span className="relative text-3xl">{option.title}</span>
                  <span className="relative text-3xl">{option.icon}</span>
                </div>
                <span>{option.subTitle}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
