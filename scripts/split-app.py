#!/usr/bin/env python3
"""
split-app.py — 将 app.js 拆分为 src/modules/ 下的 9 个模块文件。

模块划分（按行号区间，1-based，inclusive，无重叠）：

  00-config.js   全局变量声明 + storageKeys + 数据容器 + achievements + ranks + state + PAGE_IDS + PAGE_META + 路由函数 + renderCurrentPageContent
  01-utils.js    工具函数（safeParseJson ~ escapeMarkdownLine, copyText, toTrimmed, formatReportDate）
  02-gamelogic.js 游戏逻辑核心函数（getTodayKey, ensureMonthExists, getXp, getRank, getNextRank, updateProgress, updateGameHud, renderDailyChallenge, renderBadges, persistGameState, showToast, refreshGame, getProjectUnlockXp, difficultyLabel）
  03-render.js   内容渲染函数（renderStarter, renderShowcase, renderResourceRadar, renderTrack, renderWeeks, renderMonthOptions, renderMonthlyUpdate, renderModels, renderProjects, renderTemplate, renderContact, renderAgentRoles, renderAgentDailyChallenge, renderWorldview*, buildResourceRadarText, buildResourceContributionText, copyResourceCard, copyResourceContribution, buildProjectChallengeText, copyProjectChallenge, buildAgentRolePrompt, getDailyAgentRole, getAgentQualityTier, AGENT_PAGE_SIZE, copyAgentRoleByName, renderModelDecisionTree, renderPrereqCheck, renderSelfCheck, updateSelfCheckFeedback）
  04-social.js   社交功能（invite system + XP shop）
  05-admin.js    管理/报告（generateProgressReport ~ clearAllLocalData, getLeadDraft ~ openLeadEmailDraft, generateHeatmapData ~ downloadEnhancedReport, renderAdminDashboard, downloadAllData）
  06-search.js   全局搜索（searchIndex ~ closeSearch + search event listeners）
  07-ai-tutor.js AI 辅导 + 云同步（aiTutorState ~ toggleCodeEditor, syncState ~ autoSync）
  08-init.js     初始化 + DOM 事件 + bootstrap（initSectionRevealAnimations ~ window exports, 所有 DOMContentLoaded 事件监听器, loadAllData, nav toggle, mobile tab bar, loading skeleton, GA4, feedback XP, share image, loadQRCode, roundRect, bootstrap）

规则：
  - 每个模块文件以 "use strict"; 开头
  - 全局变量声明（let/const 顶层）归 00-config.js
  - DOM querySelector 事件绑定归 08-init.js
  - 保留所有代码，不删不改
  - 拼接顺序 = 文件名前缀数字升序（00~08）
  - 拼接结果（去掉各模块 "use strict" 行）必须与原始 app.js 一致

用法：
  python3 scripts/split-app.py
"""

import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
APP_JS = os.path.join(ROOT, "app.js")
MODULES_DIR = os.path.join(ROOT, "src", "modules")

# ── Module line ranges (1-based, inclusive, NO overlaps, CONTIGUOUS) ──
# Each module is a single contiguous range of lines from app.js.
# Script tags load in order 00→01→...→08, so concatenation = original app.js.
#
# Design principle: all function declarations are hoisted in JS, so order
# within the concatenated file only matters for:
#   - let/const declarations (not hoisted) → must precede their usage
#   - top-level DOM event bindings → must come after DOM is ready (they're in 08-init)
#   - top-level code that runs immediately → must be last (bootstrap call)
MODULES = {
    "00-config.js": (1, 633),
    # Contains: global var declarations, storageKeys, utility functions,
    # data containers, achievements, ranks, state, PAGE_IDS, PAGE_META,
    # routing functions, renderCurrentPageContent

    "01-gamelogic.js": (634, 1874),
    # Contains: getTodayKey, ensureMonthExists, renderStarter, renderShowcase,
    # renderResourceRadar, renderTrack, renderWeeks, renderMonthOptions,
    # renderMonthlyUpdate, renderModels, renderProjects, renderAgentRoles,
    # renderTemplate, renderContact, renderWorldview*, updateProgress,
    # getXp, getRank, getNextRank, updateGameHud, renderDailyChallenge,
    # renderBadges, persistGameState, showToast, refreshGame

    "02-admin.js": (1875, 2222),
    # Contains: invite system, XP shop, initSectionRevealAnimations,
    # setActiveNavItem, updateActiveNav, runActionRegressionChecks,
    # runPreLaunchReadinessChecks, window exports

    "03-events.js": (2223, 2681),
    # Contains: all DOMContentLoaded event listeners, loadAllData,
    # navToggle, updateMobileTabBar

    "04-search.js": (2682, 2809),
    # Contains: search system + search DOM event listeners

    "05-report.js": (2810, 2915),
    # Contains: enhanced report functions (heatmap, XP chart, badge timeline)

    "06-ai-tutor.js": (2916, 3122),
    # Contains: AI Tutor, code editor embed, cloud sync

    "07-misc.js": (3123, 3339),
    # Contains: loading skeleton, GA4, feedback XP, model decision tree,
    # prereq check, self-check, admin dashboard, downloadAllData

    "08-init.js": (3340, 3565),
    # Contains: share image generator, loadQRCode, roundRect, bootstrap
}


def split_app():
    with open(APP_JS, "r", encoding="utf-8") as f:
        lines = f.readlines()

    total = len(lines)
    print(f"Read app.js: {total} lines")

    # ── Validate: check for overlaps and coverage ─────────────
    covered = set()
    for name, (start, end) in MODULES.items():
        for ln in range(start, end + 1):
            if ln in covered:
                print(f"ERROR: Line {ln} is covered by multiple modules!")
                sys.exit(1)
            covered.add(ln)

    uncovered = sorted(set(range(1, total + 1)) - covered)
    if uncovered:
        print(f"ERROR: {len(uncovered)} uncovered lines!")
        for ln in uncovered[:20]:
            print(f"  Line {ln}: {lines[ln-1].rstrip()}")
        sys.exit(1)

    # ── Write module files ────────────────────────────────────
    os.makedirs(MODULES_DIR, exist_ok=True)

    module_order = sorted(MODULES.keys())

    for mod_name in module_order:
        start, end = MODULES[mod_name]
        mod_lines = lines[start - 1:end]  # slice is 0-based, exclusive end

        content = '"use strict";\n' + "".join(mod_lines)
        mod_path = os.path.join(MODULES_DIR, mod_name)
        with open(mod_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  → {mod_name}: {len(mod_lines)} lines")

    # ── Verify: concatenation should match original ────────────
    # Concatenate in module order (which = line order since ranges are contiguous and sequential)
    concat_lines = []
    for mod_name in module_order:
        start, end = MODULES[mod_name]
        concat_lines.extend(lines[start - 1:end])

    original = "".join(lines)
    concat = "".join(concat_lines)

    if original == concat:
        print("✅ Verification PASSED: concatenation matches original app.js")
    else:
        print("❌ Verification FAILED!")
        # Find differences
        orig_lines = original.split("\n")
        concat_lines = concat.split("\n")
        for i, (o, c) in enumerate(zip(orig_lines, concat_lines)):
            if o != c:
                print(f"   First diff at line {i+1}:")
                print(f"   Original: {o[:80]}")
                print(f"   Concat:   {c[:80]}")
                break
        if len(orig_lines) != len(concat_lines):
            print(f"   Line count: original={len(orig_lines)}, concat={len(concat_lines)}")

    # ── Update index.html ─────────────────────────────────────
    index_path = os.path.join(ROOT, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()

    old_tag = '<script src="./app.js"></script>'
    new_tags = "\n".join(
        f'    <script src="./src/modules/{m}"></script>'
        for m in module_order
    )

    if old_tag in html:
        html = html.replace(old_tag, new_tags)
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  → index.html: replaced single script tag with {len(module_order)} module tags")
    else:
        print("  ⚠ Could not find '<script src=\"./app.js\"></script>' in index.html")

    # ── Update build.js: add module concatenation step ────────
    build_path = os.path.join(ROOT, "scripts", "build.js")
    with open(build_path, "r", encoding="utf-8") as f:
        build = f.read()

    # Insert concatenation step between step 2 (merge JSON) and step 3 (minify JS)
    concat_step = '''
  // ── Step 2.5: Concatenate JS modules ────────────────────────
  console.log('[2.5/9] Concatenating JS modules...');
  const moduleDir = path.join(ROOT, 'src', 'modules');
  const moduleOrder = [
    '00-config.js', '01-utils.js', '02-gamelogic.js', '03-render.js',
    '04-social.js', '05-admin.js', '06-search.js', '07-ai-tutor.js', '08-init.js'
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
    if (modContent.startsWith('"use strict";\\n')) {
      modContent = modContent.slice('"use strict";\\n'.length);
    } else if (modContent.startsWith('"use strict";')) {
      modContent = modContent.slice('"use strict";'.length);
      if (modContent.startsWith('\\n')) modContent = modContent.slice(1);
    }
    concatenatedJs += modContent;
  }
  // Write concatenated file as app.js equivalent for downstream steps
  const concatJsPath = path.join(ROOT, 'app.concat.js');
  fs.writeFileSync(concatJsPath, '"use strict";\\n' + concatenatedJs);
  console.log(`  → app.concat.js (${(concatenatedJs.length / 1024).toFixed(1)} KB)`);
'''

    # Replace the step 3 JS minification to use concatenated file instead of app.js
    if '// ── Step 3: Minify JS' in build and 'fs.readFileSync(path.join(ROOT, \'app.js\'), \'utf-8\')' in build:
        # Insert concat step before step 3
        build = build.replace(
            "\n  // ── Step 3: Minify JS",
            concat_step + "\n  // ── Step 3: Minify JS"
        )
        # Change app.js to app.concat.js in the minify step
        build = build.replace(
            "fs.readFileSync(path.join(ROOT, 'app.js'), 'utf-8')",
            "fs.readFileSync(path.join(ROOT, 'app.concat.js'), 'utf-8')"
        )
        # Add cleanup of concat file at the end
        build = build.replace(
            "console.log('====================================');",
            "// Cleanup temp file\n  const concatTemp = path.join(ROOT, 'app.concat.js');\n  if (fs.existsSync(concatTemp)) fs.unlinkSync(concatTemp);\n  console.log('====================================');"
        )
        # Update sourcemap reference
        build = build.replace(
            "mapObj.sources = ['app.js'];",
            "mapObj.sources = ['src/modules/*.js → app.concat.js'];"
        )

        with open(build_path, "w", encoding="utf-8") as f:
            f.write(build)
        print(f"  → build.js: added module concatenation step")
    else:
        print("  ⚠ Could not update build.js (pattern not found)")

    print(f"\n✅ Split complete: {len(module_order)} modules in {MODULES_DIR}/")


if __name__ == "__main__":
    split_app()
