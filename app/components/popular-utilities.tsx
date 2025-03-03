import { Link } from "react-router";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { utilities } from "~/utilities";
import { ClientOnly } from "~/components/client-only";

/**
 * Uses the Fisher-Yates algorithm to reorder the elements of an array.
 *
 * @param arr
 */
function shuffle<T>(arr: T[]) {
  let m = arr.length;

  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }

  return arr;
}

/**
 * Since we are using a random() function to show popular utilities, react router fails to match server side
 * rendered content with what the client does and throws a bunch of errors. We wrap it with <ClientOnly />
 * to only render fully on the client side.
 *
 * @constructor
 */
export default function PopularUtilities() {
  return (
    <ClientOnly
      fallback={
        <div className="xl:max-w-none">
          <h2 className="mt-16">Popular Utilities</h2>
        </div>
      }
    >
      {() => <InnerPopularUtilities />}
    </ClientOnly>
  );
}

function InnerPopularUtilities() {
  const popular = shuffle(Object.values(utilities)).slice(0, 4);

  return (
    <div className="xl:max-w-none">
      <h2 className="mt-16">Popular Utilities</h2>

      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t pt-5 border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {popular.map((u) => (
          <PopularUtility
            key={u.name}
            name={u.name}
            description={u.description}
            path={u.url}
          />
        ))}
      </div>
    </div>
  );
}

interface PopularUtilityProps {
  readonly name: string;
  readonly description: string;
  readonly path: string;
}

function PopularUtility({ name, description, path }: PopularUtilityProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
        {name}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <p className="mt-4">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition text-orange-500 hover:text-orange-600"
          to={path}
          viewTransition={true}
        >
          Try
          <ArrowRightIcon
            className="h-4 w-4 relative top-px -mr-1"
            aria-hidden="true"
          />
        </Link>
      </p>
    </div>
  );
}
