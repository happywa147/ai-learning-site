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
  if (!sitemap.includes("https://happywa147.github.io/ai-learning-site/")) {
    fail("sitemap.xml 缺少站点 canonical URL");
  }
}

run("node", ["--check", "app.js"]);
validateMonthlyUpdates();
validateKeyFiles();

if (errors.length) {
  console.error("内容校验失败：");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("内容校验通过：JS、月更 JSON、结构化数据和关键 SEO 文件均有效。");
