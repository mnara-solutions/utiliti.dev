# Private Notes

We provide a utility that allows you to send anyone a private note via a URL. The features we deemed a requirement for a secure experience were:

- End-to-end encryption so that it is impossible to know the contents of the note without having the URL.
- Automatic expiry of the note so that even if the link gets compromised, the content will have been deleted.

## Use cases

- The most common use case is for sharing credentials via email. If you are going to do this, we urge you to set the note to self-destruct after the receiver reads it.

## Implementation Details

- Uses AES encryption ([source](app/utils/aes.ts)) with primitives provided by the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).
- All encryption is performed in the browser ([source](app/routes/private-note._index.tsx#L68-L71)).
- The cipher key is never sent to the backend when creating a private note ([source](app/routes/private-note._index.tsx#L74-L80)).
- The cipher key is stored in the URL after the `#`. Fragment identifiers are not considered to be part of the URL and thus never sent to the backend.
- All decryption is performed in the browser ([source](app/routes/private-note.$id.tsx#L102-L111)) and the cipher key is never sent to the backend.
- When viewing a private note, the cipher key is redacted in the URL after the page loads so that it does not leak via the browser history.

## Source

The relevant files are linked in the implementation details above, but if you would like to read all code related to private notes, here is a brief overview:

- Utility functions to encrypt / decryption: [app/utils/aes.ts](app/utils/aes.ts)
- Backend API that creates a private note: [app/routes/private-note.create.tsx](app/routes/private-note.create.tsx)
- Frontend code related to creating a private note: [app/routes/private-note.\_index.tsx](app/routes/private-note._index.tsx)
- Frontend code related to viewing a private note: [app/routes/private-note.$id.tsx](app/routes/private-note.$id.tsx)
- Layout shared by all frontend pages: [app/routes/private-note.tsx](app/routes/private-note.tsx)
