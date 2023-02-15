import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <>
      <h1>Utiliti</h1>
      <p className="lead">
        A collection of{" "}
        <a
          href="https://github.com/mnara-solutions/utiliti.dev"
          target="_blank"
          rel="noreferrer"
        >
          open source
        </a>{" "}
        utilities.
      </p>
      <h2 className="mt-16">Standards</h2>
      <ul>
        <li>A set of fast and well-designed utilities.</li>
        <li>
          All compute will be done in-browser so that no data is sent back to
          us.
        </li>
        <li>
          If data needs to be sent to us (private notes), it will be end-to-end
          encrypted.
        </li>
        <li>No tracking.</li>
      </ul>

      <div className="xl:max-w-none">
        <h2 className="mt-16">Popular Utilities</h2>

        <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t pt-5 border-white/5 sm:grid-cols-2 xl:grid-cols-4">
          <PopularUtility
            name="Private Notes"
            description="Share private notes securely via a link."
            path="/private-note/"
          />
          <PopularUtility
            name="JSON"
            description="View complex JSON documents as a tree structure."
            path="/json"
          />
          <PopularUtility
            name="Base64"
            description="Easily encode and decode base64 content."
            path="/base64"
          />
          <PopularUtility
            name="URL"
            description="Encodes or decodes a string so that it conforms to the URL Specification."
            path="/url"
          />
        </div>
      </div>
    </>
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
        >
          Try
          <ArrowSmallRightIcon
            className="h-4 w-4 relative top-px -mr-1"
            aria-hidden="true"
          />
        </Link>
      </p>
    </div>
  );
}
