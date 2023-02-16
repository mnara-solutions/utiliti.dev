import React from "react";
import { useLocation } from "react-router";
import { Link } from "@remix-run/react";
import Routes from "~/routes";

export const navigation = [
  {
    name: "Utilities",
    children: [
      {
        name: "Private Notes",
        url: Routes.PRIVATE_NOTES,
      },
      {
        name: "JSON",
        url: Routes.JSON,
      },
    ],
  },
  {
    name: "Encoders & Decoders",
    children: [
      {
        name: "Base64",
        url: Routes.BASE64,
      },
      {
        name: "URL",
        url: Routes.URL,
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <ul>
      {navigation.map((it) => (
        <li key={it.name} className="relative mt-6">
          <h2 className="text-xs font-semibold text-white">{it.name}</h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-white/5"></div>
            <ul className="border-l border-transparent">
              {it.children.map((c) => {
                const current = location.pathname.includes(c.url);
                return (
                  <li key={c.name} className="relative">
                    {current && (
                      <div className="absolute h-6 w-px bg-orange-500 -left-px"></div>
                    )}

                    <Link
                      to={c.url}
                      className={
                        "flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 hover:text-white" +
                        (current ? " text-white" : " text-zinc-400")
                      }
                    >
                      <span className="truncate">{c.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </li>
      ))}
    </ul>
  );
}
