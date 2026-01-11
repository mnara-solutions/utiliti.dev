import type { LinksFunction, MetaFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import Layout from "~/components/layout";
import tailwind from "./styles/tailwind.css?url";
import dark from "../node_modules/highlight.js/styles/stackoverflow-dark.css?url";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

// @ts-expect-error hack to get around react-dnd + vite issue
globalThis.global = typeof window !== "undefined" ? window : {};

export const meta: MetaFunction = () => {
  const title = "Utiliti";
  const description =
    "A collection of high quality, secure, and open source utilities.";
  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "utiliti, json, base64, url, dataurl, private note, secure note, self-destructing note, utilities, offline",
    },
    { name: "theme-color", content: "#f97316" },
    { name: "application-TileColor", content: "#f97316" },
    { name: "application-config", content: "/assets/browserconfig.xml" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: "https://utiliti.dev/assets/android-chrome-512x512.png",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "icon", href: "/assets/logo.svg", type: "image/svg+xml" },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/assets/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/assets/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/assets/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "512x512",
    href: "/assets/android-chrome-512x512.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "192x192",
    href: "/assets/android-chrome-192x192.png",
  },
  { rel: "shortcut icon", href: "/assets/favicon.ico" },
  { rel: "manifest", href: "/assets/site.webmanifest" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
  },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: dark },
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="antialiased bg-zinc-900">
        <Layout>{children}</Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let title = "An uncaught exception occurred.";
  let message = "Oops! Something bad happened.";

  if (isRouteErrorResponse(error)) {
    title = error.statusText;

    switch (error.status) {
      case 401:
        message =
          "Oops! Looks like you tried to visit a page that you do not have access to.";
        break;
      case 404:
        message =
          "Oops! Looks like you tried to visit a page that does not exist.";
        break;
    }
  }

  return (
    <Document>
      <h1>{title}</h1>

      <p className="lead">{message}</p>

      <div className="not-prose flex flex-col items-start gap-3 lg:mb-16">
        <Link
          className="inline-flex gap-0.5 justify-center items-center text-sm font-medium transition rounded-full py-1 px-3 bg-orange-500/10 text-orange-500 ring-1 ring-inset ring-orange-600/20 hover:bg-orange-600/10 hover:text-orange-600 hover:ring-orange-600"
          to="/"
        >
          <ArrowLeftIcon className="h-4 w-4 -ml-1" aria-hidden="true" />
          Home
        </Link>
      </div>
    </Document>
  );
}
