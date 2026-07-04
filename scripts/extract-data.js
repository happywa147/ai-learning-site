#!/usr/bin/env node
/**
 * Extracts all hardcoded data from app.js into JSON files under assets/data/
 * Run: node scripts/extract-data.js
 */
const fs = require("fs");
const path = require("path");

const appJsPath = path.join(__dirname, "..", "app.js");
const outDir = path.join(__dirname, "..", "assets", "data");

const source = fs.readFileSync(appJsPath, "utf-8");

// Extract a const declaration by name (handles objects and arrays)
function extractConst(name) {
  // Match: const name = { ... } or const name = [ ... ]
  // We need to find the matching closing bracket
  const patterns = [
    new RegExp(`const ${name}\\s*=\\s*\\{`),
    new RegExp(`const ${name}\\s*=\\s*\\[`)
  ];
  
  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (!match) continue;
    
    const startIdx = match.index + match[0].length - 1; // points to { or [
    const openChar = source[startIdx];
    const closeChar = openChar === "{" ? "}" : "]";
    
    let depth = 0;
    let endIdx = startIdx;
    let inString = false;
    let stringChar = null;
    let escaped = false;
    
    for (let i = startIdx; i < source.length; i++) {
      const ch = source[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      
      if (inString) {
        if (ch === stringChar) {
          inString = false;
        }
        continue;
      }
      
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        continue;
      }
      
      if (ch === openChar) {
        depth++;
      } else if (ch === closeChar) {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    
    const fullDecl = source.substring(startIdx, endIdx + 1);
    return fullDecl;
  }
  
  return null;
}

// List of data constants to extract
const dataSets = [
  { name: "tracks", file: "tracks.json" },
  { name: "weeks", file: "weeks.json" },
  { name: "starterSteps", file: "starter-steps.json" },
  { name: "showcaseItems", file: "showcase.json" },
  { name: "resourceRadarItems", file: "resource-radar.json" },
  { name: "agentRoleCategories", file: "agent-role-categories.json" },
  { name: "agentRoles", file: "agent-roles.json" },
  { name: "monthlyFallbackUpdates", file: "monthly-fallback.json" },
  { name: "worldviewItems", file: "worldview-items.json" },
  { name: "worldviewRoadmap", file: "worldview-roadmap.json" },
  { name: "worldview30DayPlan", file: "worldview-30day.json" },
  { name: "dailyChallenges", file: "daily-challenges.json" },
  { name: "models", file: "models.json" },
  { name: "projects", file: "projects.json" },
  { name: "ranks", file: "ranks.json" },
  { name: "PROJECT_UNLOCK_XP", file: "project-unlock-xp.json" },
  { name: "templates", file: "templates.json" },
  { name: "ownerContact", file: "site-config.json" },
  { name: "repoLinks", file: "repo-links.json" },
];

let extracted = 0;
let failed = 0;

for (const ds of dataSets) {
  const raw = extractConst(ds.name);
  if (!raw) {
    console.error(`FAILED: ${ds.name} - could not extract`);
    failed++;
    continue;
  }
  
  try {
    // Use eval to parse the JS object literal (it's valid JS)
    const data = eval(`(${raw})`);
    const outPath = path.join(outDir, ds.file);
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    const size = fs.statSync(outPath).size;
    console.log(`OK: ${ds.name} -> ${ds.file} (${(size / 1024).toFixed(1)}KB)`);
    extracted++;
  } catch (err) {
    console.error(`ERROR parsing ${ds.name}: ${err.message}`);
    failed++;
  }
}

// Special: ownerContact and repoLinks go together into site-config.json
// Re-do site-config.json with combined data
try {
  const ownerRaw = extractConst("ownerContact");
  const repoRaw = extractConst("repoLinks");
  if (ownerRaw && repoRaw) {
    const ownerData = eval(`(${ownerRaw})`);
    const repoData = eval(`(${repoRaw})`);
    const combined = { owner: ownerData, repo: repoData };
    fs.writeFileSync(
      path.join(outDir, "site-config.json"),
      JSON.stringify(combined, null, 2) + "\n",
      "utf-8"
    );
    // Remove repo-links.json since it's merged
    const repoLinksPath = path.join(outDir, "repo-links.json");
    if (fs.existsSync(repoLinksPath)) fs.unlinkSync(repoLinksPath);
    console.log("OK: merged ownerContact + repoLinks -> site-config.json");
  }
} catch (err) {
  console.error(`ERROR merging site config: ${err.message}`);
}

console.log(`\nDone: ${extracted} extracted, ${failed} failed.`);
