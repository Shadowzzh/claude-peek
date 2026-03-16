import stringWidth from "string-width";

export interface TruncateOptions {
	max: number;
	ellipsis?: string;
	rtl?: boolean;
}

export function truncate(text: string, options: TruncateOptions): string {
	const { max, ellipsis = "…", rtl = false } = options;

	if (max < 1) return "";

	const width = stringWidth(text);
	if (width <= max) return text;

	const ellipsisWidth = stringWidth(ellipsis);
	const threshold = max - ellipsisWidth;

	if (threshold < 1) return ellipsis;

	let result = "";
	let currentWidth = 0;

	if (rtl) {
		// 从右向左截断
		const chars = Array.from(text);
		for (let i = chars.length - 1; i >= 0; i--) {
			const charWidth = stringWidth(chars[i]);
			if (currentWidth + charWidth > threshold) break;
			result = chars[i] + result;
			currentWidth += charWidth;
		}
		return ellipsis + result;
	}

	// 从左向右截断
	for (const char of text) {
		const charWidth = stringWidth(char);
		if (currentWidth + charWidth > threshold) break;
		result += char;
		currentWidth += charWidth;
	}
	return result + ellipsis;
}
