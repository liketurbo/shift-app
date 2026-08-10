import fs from "node:fs";

const generatedPath = "artifacts/ozon-job-openapi.generated.json";
const verifiedPath = "artifacts/ozon-job-openapi.verified.json";
const outputPath = "artifacts/ozon-job-openapi.json";

function merge(base, overlay) {
  if (
    base && overlay &&
    typeof base === "object" && typeof overlay === "object" &&
    !Array.isArray(base) && !Array.isArray(overlay)
  ) {
    const result = { ...base };
    for (const [key, value] of Object.entries(overlay)) {
      result[key] = key in result ? merge(result[key], value) : value;
    }
    return result;
  }
  return overlay;
}

const generated = JSON.parse(fs.readFileSync(generatedPath, "utf8"));
const verified = JSON.parse(fs.readFileSync(verifiedPath, "utf8"));
const bundled = merge(generated, verified);

fs.writeFileSync(outputPath, `${JSON.stringify(bundled, null, 2)}\n`);
console.log(`Built ${outputPath}`);
