import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import prism from "app/styles/prism-darcula.css";
import tailwind from "~/styles/tailwind.css";
import Layout from "~/components/layout";
import React from "react";
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Utiliti",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "icon", href: "/assets/logo.svg", type: "image/svg+xml" },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: prism },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  },
];

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="antialiased bg-zinc-900">
        <Layout>{children}</Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p className="lead">
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p className="lead">
          Oops! Looks like you tried to visit a page that does not exist.
        </p>
      );
      break;

    default:
      message = <p className="lead">Oops! Something bad happened.</p>;
  }

  return (
    <Document>
      <h1>{caught.statusText}</h1>

      {message}

      <div className="not-prose flex flex-col items-start gap-3 lg:mb-16">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to="/"
        >
          <ArrowSmallLeftIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
          Home
        </Link>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>An Error Occurred</h1>

      <p className="lead">An uncaught exception occurred.</p>

      <div className="not-prose flex flex-col items-start gap-3 lg:mb-16">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to="/"
        >
          <ArrowSmallLeftIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
          Home
        </Link>
      </div>
    </Document>
  );
}
