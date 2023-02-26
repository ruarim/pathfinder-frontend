import { useRouter } from "next/router";
import Button from "../components/Button";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Welcome to pathfinder,
              </h1>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                a place where you can plan your perfect evening.
              </h1>
              <p className="mt-6 text-xl leading-8 text-primary sm:text-center">
                Find venues to suit your needs be it a pool table, live music,
                darts, food, wine and more.
              </p>
              <p className="mt-6 text-xl leading-8 text-primary sm:text-center">
                Plan routes to take you through the city finding places that
                spark your interest.
              </p>
              <div className="mt-8 flex gap-x-4 sm:justify-center">
                <Button
                  onClick={() => {
                    router.push("/plans");
                  }}
                  name="Create your route"
                />
                <Button
                  onClick={() => {
                    router.push("/venues");
                  }}
                  name="Find venues that you love"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
