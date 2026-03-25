import { readConfig } from "../lib/config.js";
import en from "./en.js";
import zh from "./zh.js";

type Language = "zh" | "en";

const translations = { zh, en };
let currentLang: Language = "en";

function detectLanguage(cliLang?: string): Language {
	// 1. CLI parameter
	if (cliLang === "zh") return "zh";
	if (cliLang === "en") return "en";

	// 2. Config file (higher priority than system env)
	const config = readConfig();
	if (config?.language === "zh") return "zh";
	if (config?.language === "en") return "en";

	// 3. System environment
	const lang = process.env.LANG || process.env.LC_ALL || "";
	if (lang.startsWith("zh")) return "zh";

	// 4. Default to English
	return "en";
}

export function initLanguage(lang?: string): void {
	currentLang = detectLanguage(lang);
}

export function t(
	key: string,
	params?: Record<string, string | number>,
): string {
	const keys = key.split(".");
	let value: unknown = translations[currentLang];

	for (const k of keys) {
		value = (value as Record<string, unknown>)?.[k];
	}

	if (typeof value !== "string") return key;

	// Replace parameters
	if (params) {
		return value.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));
	}

	return value;
}

export function getCurrentLanguage(): Language {
	return currentLang;
}
