import stringWidth from "string-width";

/**
 * 格式化运行时长为 HH:MM:SS
 */
export function formatEtime(etime: string): string {
	const parts = etime.trim().split(/[-:]/);
	if (parts.length === 2) {
		// MM:SS
		return `00:${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
	}
	if (parts.length === 3) {
		// HH:MM:SS
		return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
	}
	if (parts.length === 4) {
		// DD-HH:MM:SS
		const hours = Number.parseInt(parts[0]) * 24 + Number.parseInt(parts[1]);
		return `${String(hours).padStart(2, "0")}:${parts[2].padStart(2, "0")}:${parts[3].padStart(2, "0")}`;
	}
	return "00:00:00";
}

/**
 * 根据显示宽度填充字符串
 */
export function padEndByWidth(str: string, targetWidth: number): string {
	const currentWidth = stringWidth(str);
	const padding = Math.max(0, targetWidth - currentWidth);
	return str + " ".repeat(padding);
}
