import { Client } from "typesense";

export function getTypesenseClient() {
  const host = process.env.TYPESENSE_HOST;
  const apiKey = process.env.TYPESENSE_API_KEY;
  if (!host && !apiKey) return null;
  if (!host || !apiKey) {
    throw new Error("TYPESENSE_HOST y TYPESENSE_API_KEY deben configurarse juntos.");
  }

  const port = Number(process.env.TYPESENSE_PORT ?? 443);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("TYPESENSE_PORT debe ser un puerto válido.");
  }

  return new Client({
    nodes: [
      {
        host,
        port,
        protocol: process.env.TYPESENSE_PROTOCOL ?? "https"
      }
    ],
    apiKey,
    connectionTimeoutSeconds: 3
  });
}
