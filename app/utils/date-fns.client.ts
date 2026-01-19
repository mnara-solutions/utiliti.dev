// Re-export date-fns functions for client-side only usage
// This file is marked as .client.ts to exclude it from the server bundle

export { format, formatDistanceToNow } from "date-fns";
