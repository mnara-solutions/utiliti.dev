export type NoteMetadata = {
  readonly deleteAfterRead: boolean;
  readonly expiration: number;
};

export const noteExpiries = [
  {
    id: "0",
    label: "after reading it",
    ttl: 30 * 24 * 60 * 60,
  },
  {
    id: "1",
    label: "1 hour from now",
    ttl: 1 * 60 * 60,
  },
  {
    id: "24",
    label: "24 hours from now",
    ttl: 24 * 60 * 60,
  },
  {
    id: "168",
    label: "7 days from now",
    ttl: 7 * 24 * 60 * 60,
  },
  {
    id: "720",
    label: "30 days from now",
    ttl: 30 * 24 * 60 * 60,
  },
];
