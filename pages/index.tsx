import Button from "../components/Button";

export default function Home() {
  return (
    <main>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="text-gray-600">
                  Announcing our next round of funding.{" "}
                  <a id="about" className="font-semibold text-indigo-600">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                Welcome to pathfinder, a place where you can plan your perfect
                evening.
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary sm:text-center">
                Find venues to suit your needs be it a pool table, live music,
                darts, food, wine and more.
              </p>
              <p className="mt-6 text-lg leading-8 text-primary sm:text-center">
                Plan routes to take you through the city finding places that
                spark your interest.
              </p>
              <div className="mt-8 flex gap-x-4 sm:justify-center">
                <Button href="paths" name="Create your route" />
                <Button href="venues" name="Find venues that you love" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
