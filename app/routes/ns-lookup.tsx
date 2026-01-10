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
  "Look up DNS records for any domain. Query A, AAAA, MX, TXT, NS, CNAME, and SPF records using Cloudflare's DNS-over-HTTPS API.",
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

      <h2>What is NS Lookup?</h2>
      <p>
        NS Lookup (Name Server Lookup) is a tool used to query the Domain Name
        System (DNS) to obtain information about domain names. DNS is the
        internet&apos;s phonebook—it translates human-readable domain names like
        &quot;utiliti.dev&quot; into IP addresses that computers use to
        communicate.
      </p>
      <p>
        When you perform an NS lookup, you&apos;re asking DNS servers for
        specific records associated with a domain. This information is crucial
        for troubleshooting network issues, verifying DNS configurations, and
        understanding how a domain is set up.
      </p>

      <h2>How This Tool Works</h2>
      <p>
        Utiliti uses Cloudflare&apos;s DNS-over-HTTPS (DoH) service to perform
        lookups. DoH encrypts DNS queries, providing privacy benefits over
        traditional DNS lookups. Your queries go directly from your browser to
        Cloudflare—we don&apos;t proxy or log your lookups.
      </p>

      <h2>DNS Record Types Explained</h2>
      <ul>
        <li>
          <strong>A Record</strong>: Maps a domain to an IPv4 address (e.g.,
          93.184.216.34). The most fundamental DNS record type.
        </li>
        <li>
          <strong>AAAA Record</strong>: Maps a domain to an IPv6 address. The
          modern equivalent of A records for IPv6.
        </li>
        <li>
          <strong>CNAME Record</strong>: Creates an alias from one domain to
          another. Often used for subdomains like www.
        </li>
        <li>
          <strong>MX Record</strong>: Specifies mail servers responsible for
          receiving email for the domain.
        </li>
        <li>
          <strong>TXT Record</strong>: Holds text information. Used for domain
          verification, SPF, DKIM, and other purposes.
        </li>
        <li>
          <strong>NS Record</strong>: Indicates which name servers are
          authoritative for the domain.
        </li>
        <li>
          <strong>SPF Record</strong>: Specifies which servers are allowed to
          send email on behalf of the domain.
        </li>
      </ul>

      <h2>How to Use</h2>
      <ol>
        <li>
          <strong>Enter a domain</strong>: Type the domain name you want to look
          up (e.g., &quot;example.com&quot;)
        </li>
        <li>
          <strong>Click Search</strong>: The tool will query multiple record
          types simultaneously
        </li>
        <li>
          <strong>Review results</strong>: See all DNS records in a table with
          record type, TTL, and data
        </li>
        <li>
          <strong>Copy values</strong>: Use the copy button to grab specific
          record values
        </li>
      </ol>

      <h2>Common Use Cases</h2>
      <ul>
        <li>
          <strong>Domain Migration</strong>: Verify DNS records before and after
          migrating to a new host
        </li>
        <li>
          <strong>Email Troubleshooting</strong>: Check MX records when email
          isn&apos;t being delivered
        </li>
        <li>
          <strong>SSL Verification</strong>: Confirm DNS records for SSL
          certificate validation
        </li>
        <li>
          <strong>Domain Verification</strong>: Look up TXT records for service
          verifications (Google, Microsoft 365, etc.)
        </li>
        <li>
          <strong>Network Debugging</strong>: Check if DNS is resolving
          correctly when websites aren&apos;t loading
        </li>
        <li>
          <strong>Security Audits</strong>: Review SPF and DKIM records for
          email security
        </li>
      </ul>

      <h2>Understanding TTL</h2>
      <p>
        TTL (Time To Live) is shown in seconds and indicates how long DNS
        resolvers should cache the record before checking for updates. Lower
        TTLs mean changes propagate faster but increase DNS query load. Common
        values are 300 (5 minutes) for frequently changing records and 86400 (24
        hours) for stable records.
      </p>
    </ContentWrapper>
  );
}
