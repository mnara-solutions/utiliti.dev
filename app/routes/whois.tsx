import ContentWrapper from "~/components/content-wrapper";
import { metaHelper } from "~/utils/meta";
import { utilities } from "~/utilities";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "~/components/button";
import type { ActionFunction } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";
import { Transition } from "@headlessui/react";
import Box, { BoxContent, BoxTitle } from "~/components/box";
import Copy from "~/components/copy";

export const meta = metaHelper(
  utilities.whois.name,
  utilities.whois.description,
);

type Response = {
  result: {
    domain: string;
    created_date: string;
    updated_date: string;
    registrant: string;
    registrant_org: string;
    registrant_country: string;
    registrant_email: string;
    registrar: string;
    nameservers: string[];
  };
  success: boolean;
  errors: { code: number; message: string }[];
  messages: { code: number; message: string }[];
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<Response> => {
  const formData = await request.formData();
  const domain = formData.get("domain") as string;
  const CF_WHOIS_KEY = context.cloudflare.env.CF_WHOIS_KEY;

  return fetch(
    `https://api.cloudflare.com/client/v4/accounts/3dc234b4097803f4dfbdfdcaf8dc029b/intel/whois?domain=${domain}`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${CF_WHOIS_KEY}`,
      },
    },
  ).then((it) => it.json<Response>());
};

export default function Whois() {
  const data = useActionData<Response>();
  const navigation = useNavigation();

  return (
    <ContentWrapper>
      <h1>Whois</h1>

      <p>
        Whenever a domain is registered, the International Corporation for
        Assigned Names and Numbers (ICANN) requires that these individuals,
        businesses or organizations provide up-to-date personal contact
        information to their domain registrars. This information, which may
        include the name, address, email, phone number and associated IP
        addresses, is collected and displayed in the ICANN WHOIS Database, which
        acts similarly to an international address book for the public.
      </p>

      <p>
        Utiliti uses Cloudflare&apos;s{" "}
        <a
          href="https://developers.cloudflare.com/api/operations/whois-record-get-whois-record"
          target="_blank"
          rel="noreferrer"
        >
          Whois API
        </a>{" "}
        to return information about the domain name.
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
        {data && !data.success && (
          <Box>
            <BoxTitle title="Error" />
            <BoxContent isLast={true} className="px-3 py-2 text-red-400">
              Could not find any information about the domain.
            </BoxContent>
          </Box>
        )}
        {data && data.success && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
              <tbody>
                <Header title="Registrar" />
                <Row title="Name" value={data.result.registrar} />

                <Header title="Registrant" />
                <Row title="Name" value={data.result.registrant} />
                <Row title="Organization" value={data.result.registrant_org} />
                <Row title="Country" value={data.result.registrant_country} />
                <Row title="Email" value={data.result.registrant_email} />

                <Header title="Important Dates" />
                <Row title="Registered On" value={data.result.created_date} />
                <Row title="Updated On" value={data.result.updated_date} />

                <Header title="Nameservers" />
                {data.result.nameservers.map((it) => (
                  <Row key={it} title="" value={it} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Transition>
    </ContentWrapper>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return (
    <tr className="border-b bg-zinc-800 border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium">
        {title}
      </th>
      <td className="px-6 py-4 text-white">{value}</td>
      <td className="pr-2">
        <Copy content={value} />
      </td>
    </tr>
  );
}

function Header({ title }: { title: string }) {
  return (
    <tr className="bg-zinc-700 text-gray-400">
      <th scope="row" colSpan={3} className="px-6 py-4 text-uppercase">
        {title}
      </th>
    </tr>
  );
}
