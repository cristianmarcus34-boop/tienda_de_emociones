import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import type { Metadata } from "next";
import { importMap } from "../importMap.js";

type AdminPageProps = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export const generateMetadata = (props: AdminPageProps): Promise<Metadata> =>
  generatePageMetadata({ config, ...props });

export default function AdminPage(props: AdminPageProps) {
  return RootPage({ config, ...props, importMap });
}
