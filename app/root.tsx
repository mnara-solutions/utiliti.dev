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
import { ArrowSmallLeftIcon } from "@heroicons/react/24/solid";

export const meta: MetaFunction = () => {
  const title = "Utiliti";
  const description =
    "A collection of high quality, secure, and open source utilities.";
  return {
    charset: "utf-8",
    title,
    description,
    keywords:
      "utiliti, json, base64, url, dataurl, private note, secure note, self-destructing note, utilities, offline",
    viewport: "width=device-width,initial-scale=1",
    "theme-color": "#f97316",
    "application-TileColor": "#f97316",
    "application-config": "/assets/browserconfig.xml",
    "og:title": title,
    "og:description": description,
    "og:type": "website",
    "og:image": "https://utiliti.dev/assets/android-chrome-512x512.png",
  };
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
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7171176134175232"
          crossOrigin="anonymous"
        ></script>
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
