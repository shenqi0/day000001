import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 *
 * TODO: 把下面的占位信息替换成你自己的。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	// 头像：以 "/" 开头表示相对 public 目录，否则相对 src 目录。
	// 换成自己的头像：把图片放进 src/assets/images/（例如 my-avatar.webp），
	// 这里写 "assets/images/my-avatar.webp"；也可以直接写远程 URL。
	avatar: "assets/images/demo-avatar.webp",
	name: "你的昵称",
	bio: "一句话介绍自己。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // 图标名可在 https://icones.js.org/ 查
			url: "https://github.com/your-username",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/your-uid",
		},
		{
			name: "邮箱",
			icon: "fa6-solid:envelope",
			url: "mailto:your-email@example.com",
		},
	],
});
