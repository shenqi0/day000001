import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import shirones from "shirones-test";

// Site-level settings (site URL, base, title, theme colour, fonts, …) live in
// `shirones/config/` so they stay typed and version-controlled with your
// content. This file only wires the theme in.

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Windows 路径修复：Pagefind 站内搜索索引
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * 背景：主题（shirones-test@0.1.10）内置的 Pagefind 步骤用的是 `dir.pathname`。
 * 在 Windows 上 `dir.pathname` 会得到 "/C:/Users/..." 这种带前导斜杠的路径，
 * Pagefind 会把它解析成 "C:\C:\Users\..."，于是创建输出目录时失败：
 *
 *   thread 'main' panicked at pagefind\src\output\mod.rs:422:46:
 *   ... Os { code: 123, kind: InvalidFilename }
 *
 * 结果：`pnpm build` 以退出码 1 结束，站内搜索没有生成。
 *
 * 解法：关掉主题自带的这一步（pagefind: false），在这里用 `fileURLToPath()`
 * 正确转换后自己做一遍同样的索引工作。
 *
 * 等主题上游修好后，可以删掉下面整段，并把 `pagefind: false` 去掉。
 */
const pagefindWindowsPathFix = {
	name: "pagefind-windows-path-fix",
	hooks: {
		"astro:build:done": async ({ dir, logger }) => {
			try {
				const outDir = fileURLToPath(dir);
				const pagefind = await import("pagefind");
				const { index } = await pagefind.createIndex({});
				if (!index) throw new Error("Pagefind failed to create an index");
				await index.addDirectory({ path: outDir });
				await index.writeFiles({ outputPath: join(outDir, "pagefind") });
				logger.info("pagefind index generated");
			} catch (error) {
				logger.warn(`skipped Pagefind indexing: ${error.message}`);
			}
		},
	},
};

export default defineConfig({
	integrations: [
		shirones({
			// 由下面的 pagefindWindowsPathFix 接管索引生成，见上方注释。
			pagefind: false,
			// Override individual components by mirroring the theme's structure in
			// `src/components/`, or point at them explicitly:
			// components: { "atoms/blog/PostCard": "./src/components/PostCard.astro" },
		}),
		pagefindWindowsPathFix,
	],
});
