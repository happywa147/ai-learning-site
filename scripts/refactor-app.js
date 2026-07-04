#!/usr/bin/env node
/**
 * Refactors app.js to load data from JSON files instead of hardcoding.
 * - Replaces const data declarations with let + empty defaults
 * - Adds loadAllData() async function
 * - Modifies bootstrap() to await loadAllData()
 */
const fs = require("fs");
const path = require("path");

const appJsPath = path.join(__dirname, "..", "app.js");
const source = fs.readFileSync(appJsPath, "utf-8");

// Data constants to replace with let + empty defaults
const dataConsts = [
  { name: "tracks", default: "{}" },
  { name: "ownerContact", default: "{}" },
  { name: "repoLinks", default: "{}" },
  { name: "weeks", default: "[]" },
  { name: "starterSteps", default: "[]" },
  { name: "showcaseItems", default: "[]" },
  { name: "resourceRadarItems", default: "[]" },
  { name: "agentRoleCategories", default: "[]" },
  { name: "agentRoles", default: "[]" },
  { name: "monthlyFallbackUpdates", default: "[]" },
  { name: "worldviewItems", default: "[]" },
  { name: "worldviewRoadmap", default: "[]" },
  { name: "worldview30DayPlan", default: "[]" },
  { name: "dailyChallenges", default: "[]" },
  { name: "models", default: "[]" },
  { name: "projects", default: "[]" },
  { name: "ranks", default: "[]" },
  { name: "PROJECT_UNLOCK_XP", default: "{}" },
  { name: "templates", default: "{}" },
];

let result = source;

// Find and replace each const declaration
for (const dc of dataConsts) {
  // Pattern: const name = { or const name = [
  const patterns = [
    new RegExp(`^const ${dc.name}\\s*=\\s*\\{`, "m"),
    new RegExp(`^const ${dc.name}\\s*=\\s*\\[`, "m"),
  ];
  
  let found = false;
  for (const pattern of patterns) {
    const match = result.match(pattern);
    if (!match) continue;
    
    const startIdx = match.index;
    const openChar = result[startIdx + match[0].length - 1];
    const closeChar = openChar === "{" ? "}" : "]";
    
    // Find the matching closing bracket
    let depth = 0;
    let endIdx = startIdx + match[0].length - 1;
    let inString = false;
    let stringChar = null;
    let escaped = false;
    
    for (let i = endIdx; i < result.length; i++) {
      const ch = result[i];
      
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (inString) {
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (ch === openChar) depth++;
      else if (ch === closeChar) {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }
    
    // Find the semicolon after the closing bracket
    let semiEnd = endIdx + 1;
    while (semiEnd < result.length && result[semiEnd] !== "\n") {
      if (result[semiEnd] === ";") { semiEnd++; break; }
      semiEnd++;
    }
    
    const replacement = `let ${dc.name} = ${dc.default};`;
    result = result.substring(0, startIdx) + replacement + result.substring(semiEnd);
    console.log(`Replaced: const ${dc.name} -> let ${dc.name} = ${dc.default}`);
    found = true;
    break;
  }
  
  if (!found) {
    console.error(`WARNING: Could not find const ${dc.name}`);
  }
}

// Add loadAllData() function before the bootstrap() call
// Find the existing loadMonthlyUpdates function to understand the pattern
const loadFunctionCode = `
async function loadAllData() {
  const dataFiles = {
    tracks: "assets/data/tracks.json",
    weeks: "assets/data/weeks.json",
    starterSteps: "assets/data/starter-steps.json",
    showcaseItems: "assets/data/showcase.json",
    resourceRadarItems: "assets/data/resource-radar.json",
    agentRoleCategories: "assets/data/agent-role-categories.json",
    agentRoles: "assets/data/agent-roles.json",
    monthlyFallbackUpdates: "assets/data/monthly-fallback.json",
    worldviewItems: "assets/data/worldview-items.json",
    worldviewRoadmap: "assets/data/worldview-roadmap.json",
    worldview30DayPlan: "assets/data/worldview-30day.json",
    dailyChallenges: "assets/data/daily-challenges.json",
    models: "assets/data/models.json",
    projects: "assets/data/projects.json",
    ranks: "assets/data/ranks.json",
    PROJECT_UNLOCK_XP: "assets/data/project-unlock-xp.json",
    templates: "assets/data/templates.json",
    ownerContact: null,  // loaded from site-config.json
    repoLinks: null,     // loaded from site-config.json
  };

  const entries = Object.entries(dataFiles);
  const results = await Promise.all(
    entries.map(async ([key, file]) => {
      if (!file) return [key, null];
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        return [key, data];
      } catch (err) {
        console.warn(\`Failed to load \${file}:\`, err.message);
        return [key, null];
      }
    })
  );

  // Assign loaded data
  for (const [key, data] of results) {
    if (data !== null) {
      const target = dataConstsMap[key] || key;
      if (typeof window !== "undefined" && window[target] !== undefined) {
        window[target] = data;
      }
    }
  }

  // Load site config (owner + repo links)
  try {
    const res = await fetch("assets/data/site-config.json");
    if (res.ok) {
      const config = await res.json();
      if (config.owner) ownerContact = config.owner;
      if (config.repo) repoLinks = config.repo;
    }
  } catch (err) {
    console.warn("Failed to load site-config.json:", err.message);
  }
}

// Map JSON keys to variable names (for dynamic assignment)
const dataConstsMap = {
  tracks: "tracks",
  weeks: "weeks",
  starterSteps: "starterSteps",
  showcaseItems: "showcaseItems",
  resourceRadarItems: "resourceRadarItems",
  agentRoleCategories: "agentRoleCategories",
  agentRoles: "agentRoles",
  monthlyFallbackUpdates: "monthlyFallbackUpdates",
  worldviewItems: "worldviewItems",
  worldviewRoadmap: "worldviewRoadmap",
  worldview30DayPlan: "worldview30DayPlan",
  dailyChallenges: "dailyChallenges",
  models: "models",
  projects: "projects",
  ranks: "ranks",
  PROJECT_UNLOCK_XP: "PROJECT_UNLOCK_XP",
  templates: "templates",
};
`;

// Insert loadAllData before bootstrap
const bootstrapMatch = result.match(/^async function bootstrap\(\)/m);
if (bootstrapMatch) {
  result = result.substring(0, bootstrapMatch.index) + 
           loadFunctionCode + "\n" + 
           result.substring(bootstrapMatch.index);
  console.log("Added loadAllData() function before bootstrap()");
} else {
  console.error("WARNING: Could not find bootstrap() function");
}

// Modify bootstrap to call loadAllData first
// Find: async function bootstrap() {\n  await loadMonthlyUpdates();
// Replace with: async function bootstrap() {\n  await loadAllData();\n  await loadMonthlyUpdates();
const oldBootstrap = "async function bootstrap() {\n  await loadMonthlyUpdates();";
const newBootstrap = "async function bootstrap() {\n  await loadAllData();\n  await loadMonthlyUpdates();";
if (result.includes(oldBootstrap)) {
  result = result.replace(oldBootstrap, newBootstrap);
  console.log("Modified bootstrap() to call loadAllData() first");
} else {
  console.error("WARNING: Could not modify bootstrap() - pattern not found");
  // Try alternative pattern
  const altOld = "async function bootstrap() {\n  await loadMonthlyUpdates();";
  if (result.includes(altOld)) {
    result = result.replace(altOld, newBootstrap);
    console.log("Modified bootstrap() (alt pattern)");
  }
}

// Write the modified file
fs.writeFileSync(appJsPath, result, "utf-8");
console.log("\napp.js has been refactored!");
console.log("New size:", (result.length / 1024).toFixed(1) + "KB");
