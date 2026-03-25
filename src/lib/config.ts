import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface Config {
	language?: "zh" | "en";
}

const CONFIG_DIR = join(homedir(), ".claude", "ccpeek");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function readConfig(): Config {
	if (!existsSync(CONFIG_FILE)) {
		return {};
	}
	try {
		return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
	} catch {
		return {};
	}
}

export function writeConfig(config: Config): void {
	if (!existsSync(CONFIG_DIR)) {
		mkdirSync(CONFIG_DIR, { recursive: true });
	}
	writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
