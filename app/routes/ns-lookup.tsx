import ContentWrapper from "~/components/content-wrapper";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "~/components/button";
import type { ActionFunction } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";
import { Transition } from "@headlessui/react";
import Copy from "~/components/copy";

export const meta = metaHelper(
  utilities.nsLookup.name,
  utilities.nsLookup.description,
);

type Response = [
  string,
  [
    {
      name: string;
      type: number;
      TTL: number;
      data: string;
    },
  ],
];

function getDnsDetail(url: string, type: string): Promise<Response> {
  return fetch(
    `https://cloudflare-dns.com/dns-query?name=${url}&type=${type}`,
    {
      headers: {
        accept: "application/dns-json",
      },
    },
  )
    .then((it) =>
      it.json<{
        Status: number;
        TC: boolean;
        RD: boolean;
        RA: boolean;
        AD: boolean;
        CD: boolean;
        Question: [
          {
            name: string;
            type: number;
          },
        ];
        Answer: [
          {
            name: string;
            type: number;
            TTL: number;
            data: string;
          },
        ];
      }>(),
    )
    .then((it) => [type, it.Answer]);
}

/**
 * https://www.iana.org/assignments/dns-parameters/dns-parameters.xhtml#dns-parameters-4
 * @param type
 */
function typeToString(type: number): string {
  switch (type) {
    case 1:
      return "A";
    case 28:
      return "AAAA";
    case 2:
      return "NS";
    case 5:
      return "CNAME";
    case 15:
      return "MX";
    case 16:
      return "TXT";
    case 99:
      return "SPF";

    default:
      return "O";
  }
}

export const action: ActionFunction = async ({
  request,
}): Promise<Response[]> => {
  const formData = await request.formData();
  const domain = formData.get("domain") as string;
  const a = getDnsDetail(domain, "a");
  const aaaa = getDnsDetail(domain, "aaaa");
  const cname = getDnsDetail(domain, "cname");
  const txt = getDnsDetail(domain, "txt");
  const spf = getDnsDetail(domain, "spf");
  const ns = getDnsDetail(domain, "ns");
  const mx = getDnsDetail(domain, "mx");

  return Promise.all([a, aaaa, cname, txt, spf, ns, mx]);
};

export default function NsLookup() {
  const data = useActionData<Response[]>();
  const navigation = useNavigation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isEmpty = data && data.every(([_, rows]) => rows === null);

  return (
    <ContentWrapper>
      <h1>NS Lookup</h1>

      <p>
        Uses Cloudflare&apos;s DNS-over-HTTPS (DOH){" "}
        <a
          href="https://developers.cloudflare.com/1.1.1.1/encryption/dns-over-https/make-api-requests/dns-json/"
          target="_blank"
          rel="noreferrer"
        >
          endpoint
        </a>{" "}
        to return information about the domains DNS records.
      </p>

      <Form method="post" viewTransition={true}>
        <label
          htmlFor="domain"
          className="mb-2 text-sm font-medium sr-only text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="search"
            id="domain"
            name="domain"
            className="block w-full p-4 pl-10 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-zinc-700 border-zinc-600 placeholder-gray-400 text-white"
            placeholder="utiliti.dev"
            required={true}
          />
          <Button
            label="Search"
            className="absolute right-2.5 bottom-2 py-2"
            type="submit"
            disabled={navigation.state === "submitting"}
          />
        </div>
      </Form>

      <Transition
        show={!!data}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        className="not-prose mt-6"
        as="div"
      >
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-zinc-700 text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  TTL
                </th>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Copy
                </th>
              </tr>
            </thead>
            <tbody>
              {isEmpty && (
                <tr className="border-b bg-zinc-800 border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap:text-white"
                  >
                    No data
                  </th>
                  <td />
                  <td />
                  <td />
                </tr>
              )}
              {data &&
                data.map(([type, it]) => {
                  return !it
                    ? []
                    : it.map((r) => {
                        return (
                          <tr
                            key={`${type}-${r.data}`}
                            className="border-b bg-zinc-800 border-gray-700"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium whitespace-nowrap:text-white"
                            >
                              {typeToString(r.type)}
                            </th>
                            <td className="px-6 py-4">{r.TTL}</td>
                            <td className="px-6 py-4">{r.data}</td>
                            <td className="px-6">
                              <Copy content={r.data} />
                            </td>
                          </tr>
                        );
                      });
                })}
            </tbody>
          </table>
        </div>
      </Transition>
    </ContentWrapper>
  );
}
