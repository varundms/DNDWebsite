import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");

function resolveImagesBase() {
  const explicit = process.env.PUBLIC_SITE_IMAGES_BASE?.trim();
  if (explicit) {
    return explicit.endsWith("/") ? explicit : `${explicit}/`;
  }
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.STORAGE_PUBLIC_BUCKET?.trim();
  if (url && bucket) {
    return `${url}/storage/v1/object/public/${bucket}/`;
  }
  return null;
}

const imagesBase = resolveImagesBase();
const supabaseUrl = process.env.SUPABASE_URL?.trim() || "";
const supabaseAnon = process.env.SUPABASE_ANON_KEY?.trim() || "";

if (!imagesBase) {
  console.error(
    "Missing image CDN base. Set in Vercel → Settings → Environment Variables (or build.env in vercel.json):\n" +
      "  PUBLIC_SITE_IMAGES_BASE (optional full URL ending with /), or\n" +
      "  SUPABASE_URL + STORAGE_PUBLIC_BUCKET (e.g. dnd-site-images)."
  );
  process.exit(1);
}

if (!supabaseUrl || !supabaseAnon) {
  const missing = [
    !supabaseUrl && "SUPABASE_URL",
    !supabaseAnon && "SUPABASE_ANON_KEY",
  ].filter(Boolean);
  console.error(
    `Missing: ${missing.join(", ")}.\n` +
      "Vercel Git builds do not use your local .env file. Add these under Project → Settings → Environment Variables for Production and Preview (same project if you moved teams)."
  );
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const htmlFiles = fs
  .readdirSync(root)
  .filter((f) => f.endsWith(".html") && fs.statSync(path.join(root, f)).isFile());

for (const file of htmlFiles) {
  const srcPath = path.join(root, file);
  let html = fs.readFileSync(srcPath, "utf8");

  html = html.replaceAll("images/", imagesBase);
  html = html.replaceAll("__SUPABASE_URL__", supabaseUrl);
  html = html.replaceAll("__SUPABASE_ANON_KEY__", supabaseAnon);

  if (html.includes("__SUPABASE")) {
    console.error(`Unresolved Supabase placeholders in ${file}`);
    process.exit(1);
  }

  fs.writeFileSync(path.join(outDir, file), html, "utf8");
  console.log(`Wrote out/${file}`);
}

console.log(`Build complete (${htmlFiles.length} pages). Images are loaded from CDN, not bundled.`);
