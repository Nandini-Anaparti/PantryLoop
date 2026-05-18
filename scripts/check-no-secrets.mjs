import { execFileSync } from "node:child_process";

const trackedFiles = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean)
  .filter((file) => !file.startsWith(".git/") && !file.includes("node_modules/"));

const forbiddenFilePatterns = [
  /^\.env(\..*)?$/,
  /firebase-service-account\.json$/,
  /serviceAccountKey\.json$/,
  /\.pem$/,
  /\.key$/,
];

const forbiddenContentPatterns = [
  /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
];

const violations = [];

for (const file of trackedFiles) {
  if (file === ".env.example") {
    continue;
  }

  if (forbiddenFilePatterns.some((pattern) => pattern.test(file))) {
    violations.push(`Forbidden secret-like file is tracked or unignored: ${file}`);
    continue;
  }

  let content;
  try {
    content = execFileSync("git", ["show", `:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    try {
      content = execFileSync("cat", [file], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      continue;
    }
  }

  if (forbiddenContentPatterns.some((pattern) => pattern.test(content))) {
    violations.push(`Potential secret-like content found in: ${file}`);
  }
}

if (violations.length > 0) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("No obvious committed secrets found.");
