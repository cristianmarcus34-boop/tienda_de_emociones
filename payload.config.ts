import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import { es } from "@payloadcms/translations/languages/es";
import sharp from "sharp";
import { Media } from "./src/collections/Media";
import { Orders } from "./src/collections/Orders";
import { Products } from "./src/collections/Products";
import { Feedback } from "./src/collections/Feedback";
import { Users } from "./src/collections/Users";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: process.cwd()
    },
    components: {
      beforeLogin: ["@/components/admin/storefront-nav-link#BackToStoreLink"],
      beforeNavLinks: ["@/components/admin/storefront-nav-link#StorefrontNavLink"]
    }
  },
  i18n: {
    fallbackLanguage: "es",
    supportedLanguages: { es }
  },
  collections: [Users, Products, Media, Orders, Feedback],
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disableLocalStorage: true
        }
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      //clientUploads: true
    })
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: "./payload-types.ts"
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL ?? ""
    },
    migrationDir: "./src/migrations"
  }),
  sharp
});