const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const errors = [];

function fail(message) {
  errors.push(message);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed: ${(result.stderr || result.stdout).trim()}`);
  }
}

function parseJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    fail(`${relativePath} 不是合法 JSON：${error.message}`);
    return null;
  }
}

function isValidDate(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch (error) {
    return false;
  }
}

function validateMonthlyUpdates() {
  const updates = parseJson("assets/monthly-updates.json");
  if (!Array.isArray(updates)) {
    fail("assets/monthly-updates.json 顶层必须是数组");
    return;
  }

  const seen = new Set();
  updates.forEach((update, index) => {
    const prefix = `monthly-updates[${index}]`;
    ["id", "label", "status", "title", "summary"].forEach((field) => {
      if (!update[field]) fail(`${prefix}.${field} 缺失`);
    });
    if (seen.has(update.id)) fail(`${prefix}.id 重复：${update.id}`);
    seen.add(update.id);
    if (!["published", "draft"].includes(update.status)) {
      fail(`${prefix}.status 必须是 published 或 draft`);
    }
    if (!Array.isArray(update.cards) || update.cards.length === 0) {
      fail(`${prefix}.cards 必须至少包含一张卡片`);
    }
    (update.cards || []).forEach((card, cardIndex) => {
      if (!card.title) fail(`${prefix}.cards[${cardIndex}].title 缺失`);
      if (!Array.isArray(card.items) || card.items.length === 0) {
        fail(`${prefix}.cards[${cardIndex}].items 必须至少包含一条内容`);
      }
    });

    if (update.status === "published") {
      ["updatedAt", "lastVerified", "confidence"].forEach((field) => {
        if (!update[field]) fail(`${prefix}.${field} 是 published 内容的必填字段`);
      });
      if (!isValidDate(update.updatedAt)) fail(`${prefix}.updatedAt 必须是 YYYY-MM-DD`);
      if (!isValidDate(update.lastVerified)) fail(`${prefix}.lastVerified 必须是 YYYY-MM-DD`);
      if (!["low", "medium", "high"].includes(update.confidence)) {
        fail(`${prefix}.confidence 必须是 low、medium 或 high`);
      }
      if (!Array.isArray(update.sources) || update.sources.length === 0) {
        fail(`${prefix}.sources 必须至少包含一个来源`);
      }
      (update.sources || []).forEach((source, sourceIndex) => {
        if (!source.label) fail(`${prefix}.sources[${sourceIndex}].label 缺失`);
        if (!isValidUrl(source.url)) fail(`${prefix}.sources[${sourceIndex}].url 必须是 http/https URL`);
      });
      if (!Array.isArray(update.testedTasks) || update.testedTasks.length === 0) {
        fail(`${prefix}.testedTasks 必须至少包含一个实测任务`);
      }
    }
  });
}

function validateKeyFiles() {
  ["index.html", "app.js", "styles.css", "robots.txt", "sitemap.xml", "llms.txt", "README.md"].forEach((file) => {
    if (!fs.existsSync(path.join(root, file))) fail(`关键文件缺失：${file}`);
  });

  const html = readText("index.html");
  ["FAQPage", "LearningResource", "SoftwareSourceCode"].forEach((schemaType) => {
    if (!html.includes(`\"@type\": \"${schemaType}\"`)) fail(`index.html 缺少 ${schemaType} 结构化数据`);
  });

  const sitemap = readText("sitemap.xml");
  if (!sitemap.includes("https://ai.mynaxis.com/")) {
    fail("sitemap.xml 缺少站点 canonical URL");
  }
}

function validateResourceRadar() {
  const app = readText("app.js");
  const dataPath = "assets/data/resource-radar.json";
  if (fs.existsSync(path.join(root, dataPath))) {
    const items = parseJson(dataPath);
    if (!Array.isArray(items)) {
      fail(`${dataPath} 顶层必须是数组`);
      return;
    }
    if (items.length < 10) fail("resource-radar 至少应包含 10 个资源");
    items.forEach((item, index) => {
      const prefix = `resource-radar[${index}]`;
      ["name", "url", "type", "license", "licenseSpdx", "lastVerified", "source", "action", "useFor", "adapt"].forEach((field) => {
        if (!item[field]) fail(`${prefix}.${field} 缺失`);
      });
      if (!isValidUrl(item.url)) fail(`${prefix}.url 必须是 http/https URL`);
      if (!isValidDate(item.lastVerified)) fail(`${prefix}.lastVerified 必须是 YYYY-MM-DD`);
    });
  } else {
    const match = app.match(/const resourceRadarItems = \[([\s\S]*?)\n\];\n\nconst agentRoleCategories/);
    if (!match) {
    fail("app.js 缺少 resourceRadarItems 数据");
    return;
    }

    const body = match[1];
    const itemBlocks = body.split(/\n  \{/).slice(1);
    if (itemBlocks.length < 10) fail("resourceRadarItems 至少应包含 10 个资源");
    itemBlocks.forEach((block, index) => {
      const prefix = `resourceRadarItems[${index}]`;
      ["name", "url", "type", "license", "licenseSpdx", "lastVerified", "source", "action", "useFor", "adapt"].forEach((field) => {
        if (!new RegExp(`${field}:\\s*\"[^\"]+\"`).test(block)) fail(`${prefix}.${field} 缺失`);
      });
      const url = block.match(/url:\s*"([^"]+)"/)?.[1];
      if (!isValidUrl(url)) fail(`${prefix}.url 必须是 http/https URL`);
      const verified = block.match(/lastVerified:\s*"([^"]+)"/)?.[1];
      if (!isValidDate(verified)) fail(`${prefix}.lastVerified 必须是 YYYY-MM-DD`);
    });
  }

  const html = readText("index.html");
  [
    "resourceSearch",
    "resourceCount",
    "data-resource-action",
    "data-resource-license",
    "copy-resource-card",
    "copy-resource-contribution",
    "buildResourceRadarText",
    "buildResourceContributionText"
  ].forEach((needle) => {
    if (!html.includes(needle) && !app.includes(needle)) fail(`资源雷达缺少筛选或复制能力：${needle}`);
  });
}

function validateCopywritingBoundaries() {
  ["index.html", "app.js", "README.md", "llms.txt"].forEach((file) => {
    const text = readText(file);
    if (text.includes("可搬运改写")) fail(`${file} 不应使用“可搬运改写”，请改为“可按许可证复用”一类的边界表达`);
  });
}

function validateProjectChallenges() {
  const app = readText("app.js");
  const html = readText("index.html");
  const dataPath = "assets/data/projects.json";
  if (fs.existsSync(path.join(root, dataPath))) {
    const projects = parseJson(dataPath);
    if (!Array.isArray(projects)) {
      fail(`${dataPath} 顶层必须是数组`);
      return;
    }
    if (projects.length < 12) fail("projects 至少应包含 12 个项目挑战");
    projects.forEach((project, index) => {
      const prefix = `projects[${index}]`;
      ["title", "level", "time", "desc", "check"].forEach((field) => {
        if (!project[field]) fail(`${prefix}.${field} 缺失`);
      });
      ["tools", "tasks", "deliverables"].forEach((field) => {
        if (!Array.isArray(project[field]) || project[field].length === 0) fail(`${prefix}.${field} 必须是非空数组`);
      });
    });
  } else {
    const match = app.match(/const projects = \[([\s\S]*?)\n\];\n\nconst ranks/);
    if (!match) {
    fail("app.js 缺少 projects 挑战数据");
    return;
    }

    const blocks = match[1].split(/\n  \{/).slice(1);
    if (blocks.length < 12) fail("projects 至少应包含 12 个项目挑战");
    blocks.forEach((block, index) => {
      const prefix = `projects[${index}]`;
      ["title", "level", "time", "desc", "check"].forEach((field) => {
        if (!new RegExp(`${field}:\\s*\"[^\"]+\"`).test(block)) fail(`${prefix}.${field} 缺失`);
      });
      ["tools", "tasks", "deliverables"].forEach((field) => {
        if (!new RegExp(`${field}:\\s*\\[[^\\]]+\\]`).test(block)) fail(`${prefix}.${field} 必须是非空数组`);
      });
    });
  }

  ["projectSearch", "data-project-level", "copy-project-challenge", "buildProjectChallengeText"].forEach((needle) => {
    if (!html.includes(needle) && !app.includes(needle)) fail(`项目挑战库缺少交互入口或逻辑：${needle}`);
  });
}

run("node", ["--check", "app.js"]);
validateMonthlyUpdates();
validateKeyFiles();
validateResourceRadar();
validateCopywritingBoundaries();
validateProjectChallenges();

if (errors.length) {
  console.error("内容校验失败：");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("内容校验通过：JS、月更 JSON、结构化数据和关键 SEO 文件均有效。");
