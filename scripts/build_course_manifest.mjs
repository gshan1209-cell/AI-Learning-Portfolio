import fs from "node:fs";
import path from "node:path";

const directories = ["course_chunks", "course_chunks_archive"];
const manifest = [];

for (const directory of directories) {
  const absoluteDirectory = path.join(process.cwd(), directory);
  if (!fs.existsSync(absoluteDirectory)) continue;

  for (const fileName of fs.readdirSync(absoluteDirectory).filter((name) => name.endsWith(".json"))) {
    const filePath = path.join(absoluteDirectory, fileName);
    const records = JSON.parse(fs.readFileSync(filePath, "utf8"));
    manifest.push({
      directory,
      fileName,
      records: Array.isArray(records) ? records.length : 1,
    });
  }
}

fs.mkdirSync(path.join(process.cwd(), "public", "data"), { recursive: true });
fs.writeFileSync(
  path.join(process.cwd(), "public", "data", "course-manifest.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), files: manifest }, null, 2),
);

console.log(`Course manifest created for ${manifest.length} files.`);
