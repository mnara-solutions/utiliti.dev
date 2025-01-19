import type { ActionFunction } from "react-router";
import { createId } from "@paralleldrive/cuid2";
import { noteExpiries } from "~/routes/private-note/index";

export type CreateActionData = {
  readonly id: string;
};

/**
 * This file is only responsible for saving the ciphertext into Cloudflare KV and returning the id.
 *
 * It is placed in a file that returns no UI component, because we don't want this functionality to work
 * without javascript enabled, otherwise it would potentially post plaintext to us, and we never want that data.
 *
 * @param request
 * @param context
 */
export const action: ActionFunction = async ({
  request,
  context,
}): Promise<CreateActionData> => {
  const privateNotesNs: KVNamespace = context.cloudflare.env.PRIVATE_NOTES;

  // grab submitted data
  const formData = await request.formData();
  const id = createId();
  const expiry = formData.get("expiry") as string;
  const ciphertext = formData.get("input") as string;
  const expiryObject = noteExpiries.find((it) => it.id === expiry);

  if (!expiryObject) {
    throw new Response("Invalid Expiry", { status: 400 });
  }

  // store ciphertext in kv store
  const expiration = Math.floor(Date.now() / 1000) + expiryObject.ttl;
  await privateNotesNs.put(id, ciphertext, {
    expiration,
    metadata: {
      deleteAfterRead: expiryObject.id === "0",
      expiration,
    },
  });

  // return only the id back to the frontend
  return { id };
};
