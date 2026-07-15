import fs from "node:fs";
import path from "node:path";

const registryPath = path.join(process.cwd(), "repository_registry", "repositories.json");
const token = process.env.GITHUB_TOKEN;

if (!fs.existsSync(registryPath)) {
  console.error(`Repository registry not found: ${registryPath}`);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
if (!Array.isArray(registry)) {
  console.error("Repository registry must be a JSON array.");
  process.exit(1);
}

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "AI-Learning-Portfolio-Registry-Sync",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const syncedAt = new Date().toISOString();
let failedCount = 0;
const updatedRegistry = [];

for (const item of registry) {
  const endpoint = `https://api.github.com/repos/${item.fullName}`;

  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) {
      failedCount += 1;
      console.warn(`[skip] ${item.fullName}: GitHub API ${response.status}`);
      updatedRegistry.push(item);
      continue;
    }

    const repository = await response.json();
    updatedRegistry.push({
      ...item,
      id: String(repository.id),
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url,
      defaultBranch: repository.default_branch,
      visibility: repository.private ? "private" : "public",
      archived: Boolean(repository.archived),
      sizeKb: Number(repository.size || 0),
      lastSyncedAt: syncedAt,
      syncSource: "github_api",
    });
    console.log(`[ok] ${repository.full_name}`);
  } catch (error) {
    failedCount += 1;
    console.warn(`[skip] ${item.fullName}: ${error instanceof Error ? error.message : String(error)}`);
    updatedRegistry.push(item);
  }
}

updatedRegistry.sort((a, b) => a.name.localeCompare(b.name, "en"));
fs.writeFileSync(registryPath, `${JSON.stringify(updatedRegistry, null, 2)}\n`, "utf8");

console.log(`Repository registry updated: ${updatedRegistry.length} records, ${failedCount} failed.`);
if (failedCount > 0) process.exitCode = 2;
