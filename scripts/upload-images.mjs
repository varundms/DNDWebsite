import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "images");

const url = process.env.SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const bucket = process.env.STORAGE_PUBLIC_BUCKET?.trim() || "dnd-site-images";

if (!url || !serviceKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (service role is server-side only; never commit it).");
  process.exit(1);
}

const extMime = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".JPG": "image/jpeg",
  ".PNG": "image/png",
  ".JPEG": "image/jpeg",
};

function guessMime(filePath) {
  const ext = path.extname(filePath);
  return extMime[ext] || "application/octet-stream";
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const files = fs.readdirSync(imagesDir).filter((name) => {
  const full = path.join(imagesDir, name);
  return fs.statSync(full).isFile() && name !== ".DS_Store";
});

let ok = 0;
let fail = 0;

for (const name of files) {
  const full = path.join(imagesDir, name);
  const body = fs.readFileSync(full);
  const contentType = guessMime(full);

  const { error } = await supabase.storage.from(bucket).upload(name, body, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error(`FAIL ${name}:`, error.message);
    fail++;
  } else {
    console.log(`OK   ${name}`);
    ok++;
  }
}

console.log(`\nDone. ${ok} uploaded, ${fail} failed. Public base (set in Vercel / .env):`);
console.log(`${url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/`);
