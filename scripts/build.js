const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const esbuild = require('esbuild');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DATA_DIR = path.join(ROOT, 'assets', 'data');

function hash(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

async function build() {
  console.log('[1/9] Cleaning dist/...');
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  // ── Step 2: Merge all JSON files ──────────────────────────────
  console.log('[2/9] Merging JSON data files...');
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  const merged = {};
  for (const file of jsonFiles) {
    const key = file.replace(/\.json$/, '');
    try {
      merged[key] = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
    } catch (e) {
      console.warn(`  ⚠  Skipping ${file}: ${e.message}`);
    }
  }
  const dataJson = JSON.stringify(merged);
  const dataHash = hash(dataJson);
  const dataFileName = `data.${dataHash}.json`;
  fs.writeFileSync(path.join(DIST, dataFileName), dataJson);
  console.log(`  → ${dataFileName} (${jsonFiles.length} files merged)`);

  // ── Step 2.5: Concatenate JS modules ────────────────────────
  console.log('[2.5/9] Concatenating JS modules...');
  const moduleDir = path.join(ROOT, 'src', 'modules');
  const moduleOrder = [
    '00-config.js', '01-gamelogic.js', '02-admin.js', '03-events.js',
    '04-search.js', '05-report.js', '06-ai-tutor.js', '07-misc.js', '08-init.js'
  ];
  let concatenatedJs = '';
  for (const modName of moduleOrder) {
    const modPath = path.join(moduleDir, modName);
    if (!fs.existsSync(modPath)) {
      console.warn(`  ⚠ Module ${modName} not found, skipping`);
      continue;
    }
    let modContent = fs.readFileSync(modPath, 'utf-8');
    // Strip "use strict" header (first line) since the concatenated file will have one
    if (modContent.startsWith('"use strict";\n')) {
      modContent = modContent.slice('"use strict";\n'.length);
    } else if (modContent.startsWith('"use strict";')) {
      modContent = modContent.slice('"use strict";'.length);
      if (modContent.startsWith('\n')) modContent = modContent.slice(1);
    }
    concatenatedJs += modContent;
  }
  // Write concatenated file as app.js equivalent for downstream steps
  const concatJsPath = path.join(ROOT, 'app.concat.js');
  fs.writeFileSync(concatJsPath, '"use strict";\n' + concatenatedJs);
  console.log(`  → app.concat.js (${(concatenatedJs.length / 1024).toFixed(1)} KB)`);

  // ── Step 3: Minify JS ─────────────────────────────────────────
  console.log('[3/9] Minifying app.js...');
  const jsSrc = fs.readFileSync(path.join(ROOT, 'app.concat.js'), 'utf-8');
  const jsResult = await esbuild.transform(jsSrc, {
    minify: true,
    sourcemap: true,
    target: 'es2020',
    loader: 'js',
  });
  const jsHash = hash(jsResult.code);
  const jsName = `app.${jsHash}.min.js`;
  const jsMapName = `${jsName}.map`;
  fs.writeFileSync(path.join(DIST, jsName), jsResult.code);
  if (jsResult.map) {
    // Fix sourcemap source reference
    const mapObj = JSON.parse(jsResult.map);
    mapObj.sources = ['src/modules/*.js → app.concat.js'];
    fs.writeFileSync(path.join(DIST, jsMapName), JSON.stringify(mapObj));
  }
  console.log(`  → ${jsName}`);

  // ── Step 4: Minify CSS ────────────────────────────────────────
  console.log('[4/9] Minifying styles.css...');
  const cssSrc = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf-8');
  const cssResult = await esbuild.transform(cssSrc, {
    minify: true,
    sourcemap: true,
    target: 'es2020',
    loader: 'css',
  });
  const cssHash = hash(cssResult.code);
  const cssName = `styles.${cssHash}.min.css`;
  const cssMapName = `${cssName}.map`;
  fs.writeFileSync(path.join(DIST, cssName), cssResult.code);
  if (cssResult.map) {
    const mapObj = JSON.parse(cssResult.map);
    mapObj.sources = ['styles.css'];
    fs.writeFileSync(path.join(DIST, cssMapName), JSON.stringify(mapObj));
  }
  console.log(`  → ${cssName}`);

  // ── Step 5: Generate index.html ────────────────────────────────
  console.log('[5/9] Generating index.html...');
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  html = html.replace(/href="\.\/styles\.css"/, `href="./${cssName}"`);
  // Replace all module script tags with single minified bundle
  const moduleTagPattern = '<script src="./src/modules/';
  const lines = html.split('\n');
  const filteredLines = lines.filter(line => !line.includes(moduleTagPattern));
  // Find the line before the SW registration script and insert bundled script there
  const swScriptIdx = filteredLines.findIndex(line => line.includes('if ("serviceWorker"'));
  if (swScriptIdx >= 0) {
    filteredLines.splice(swScriptIdx, 0, `    <script src="./${jsName}"></script>`);
  }
  html = filteredLines.join('\n');
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  console.log('  → index.html');

  // ── Step 6: Copy static assets ─────────────────────────────────
  console.log('[6/9] Copying static assets...');
  const staticFiles = ['manifest.json', 'robots.txt', 'sitemap.xml', '.nojekyll', 'privacy.html'];
  for (const file of staticFiles) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
      console.log(`  → ${file}`);
    }
  }

  // Copy entire assets/ directory (preserves fetch paths for app.js)
  if (fs.existsSync(path.join(ROOT, 'assets'))) {
    copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
    console.log('  → assets/');
  }

  // ── Step 7: SSG generation ────────────────────────────────
  console.log('[7/9] Generating SSG pages...');
  try {
    execSync('node scripts/generate-ssg.js', {
      cwd: ROOT,
      stdio: 'inherit'
    });
    console.log('  ✅ SSG pages generated');
  } catch (e) {
    console.warn('  ⚠ SSG generation failed:', e.message);
  }

  // ── Step 8: Split data into smaller files ─────────────────
  console.log('[8/9] Splitting data into chunks...');
  const dataDir = path.join(DIST, 'data');
  ensureDir(dataDir);

  // Define data chunks (keys match merged JSON dash-case format)
  const chunks = {
    'data-home.json':         ['site-config', 'starter-steps', 'showcase', 'worldview-items', 'worldview-30day', 'worldview-roadmap'],
    'data-tracks.json':       ['tracks'],
    'data-models.json':      ['models', 'daily-challenges'],
    'data-agent.json':       ['agent-roles', 'agent-role-categories'],
    'data-resources.json':   ['resource-radar', 'weeks', 'projects', 'templates', 'project-unlock-xp', 'ranks'],
    'data-monthly.json':    ['monthly-fallback'],
  };

  const mergedData = JSON.parse(dataJson);
  for (const [chunkFile, keys] of Object.entries(chunks)) {
    const chunkData = {};
    for (const key of keys) {
      if (mergedData[key] !== undefined) {
        chunkData[key] = mergedData[key];
      }
    }
    const chunkJson = JSON.stringify(chunkData);
    fs.writeFileSync(path.join(dataDir, chunkFile), chunkJson);
    console.log(`  → data/${chunkFile} (${(chunkJson.length / 1024).toFixed(1)} KB)`);
  }

  // ── Step 9: Brotli compression ──────────────────────────────────
  console.log('[9/9] Generating Brotli (.br) files...');
  const compressables = [
    jsName, cssName, 'index.html', dataFileName, 'manifest.json', 'privacy.html'
  ];
  // Add all JSON files in dist/data/
  const dataFiles = fs.existsSync(dataDir) ? fs.readdirSync(dataDir).filter(f => f.endsWith('.json')) : [];
  for (const f of dataFiles) {
    compressables.push(path.join('data', f));
  }
  // Add SSG HTML files
  const ssgDir = path.join(DIST, 'ssg');
  if (fs.existsSync(ssgDir)) {
    const ssgFiles = fs.readdirSync(ssgDir).filter(f => f.endsWith('.html'));
    for (const f of ssgFiles) {
      compressables.push(path.join('ssg', f));
    }
  }

  for (const f of compressables) {
    const filePath = path.join(DIST, f);
    if (fs.existsSync(filePath)) {
      const original = fs.readFileSync(filePath);
      const br = zlib.brotliCompressSync(original, {
        params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 }
      });
      fs.writeFileSync(filePath + '.br', br);
      const ratio = ((1 - br.length / original.length) * 100).toFixed(1);
      console.log(`  → ${f}.br (${(original.length/1024).toFixed(1)}KB → ${(br.length/1024).toFixed(1)}KB, -${ratio}%)`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────
  console.log('\n========== Build Complete ==========');
  const distFiles = fs.readdirSync(DIST).filter(f => f !== 'assets');
  for (const f of distFiles.sort()) {
    const stat = fs.statSync(path.join(DIST, f));
    const kb = (stat.size / 1024).toFixed(1);
    console.log(`  ${f.padEnd(40)} ${kb} KB`);
  }
  // Cleanup temp file
  const concatTemp = path.join(ROOT, 'app.concat.js');
  if (fs.existsSync(concatTemp)) fs.unlinkSync(concatTemp);
  console.log('====================================');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
