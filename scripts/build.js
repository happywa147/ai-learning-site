const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const esbuild = require('esbuild');

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
  console.log('[1/6] Cleaning dist/...');
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  // ── Step 1: Merge all JSON files ──────────────────────────────
  console.log('[2/6] Merging JSON data files...');
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

  // ── Step 2: Minify JS ─────────────────────────────────────────
  console.log('[3/6] Minifying app.js...');
  const jsSrc = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf-8');
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
    mapObj.sources = ['app.js'];
    fs.writeFileSync(path.join(DIST, jsMapName), JSON.stringify(mapObj));
  }
  console.log(`  → ${jsName}`);

  // ── Step 3: Minify CSS ────────────────────────────────────────
  console.log('[4/6] Minifying styles.css...');
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

  // ── Step 4: Generate index.html ────────────────────────────────
  console.log('[5/6] Generating index.html...');
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  html = html.replace(/href="\.\/styles\.css"/, `href="./${cssName}"`);
  html = html.replace(/src="\.\/app\.js"/, `src="./${jsName}"`);
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  console.log('  → index.html');

  // ── Step 5: Copy static assets ─────────────────────────────────
  console.log('[6/6] Copying static assets...');
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

  // ── S4: Brotli compression ──────────────────────────────────
  console.log('[7/7] Generating Brotli (.br) files...');
  const compressables = [
    jsName, cssName, 'index.html', dataFileName, 'manifest.json', 'privacy.html'
  ];
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
  console.log('====================================');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
