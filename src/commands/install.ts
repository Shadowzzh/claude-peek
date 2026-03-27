import {
	chmodSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
	CCPEEK_DIR,
	CCPEEK_HOOKS_DIR,
	CLEANUP_SESSION_HOOK_PATH,
	CLEANUP_SESSION_SCRIPT,
	RECORD_SESSION_HOOK_PATH,
	RECORD_SESSION_SCRIPT,
	SESSION_MAPPINGS_FILE,
	SETTINGS_FILE,
} from "../constants/index.js";
import { t } from "../i18n/index.js";

interface Hook {
	type: string;
	command: string;
}

interface HookEntry {
	hooks: Hook[];
}

interface Settings {
	hooks?: {
		SessionStart?: HookEntry[];
		SessionEnd?: HookEntry[];
	};
	SessionStart?: unknown;
	SessionEnd?: unknown;
}

export function installCommand() {
	// Create hooks directory
	if (!existsSync(CCPEEK_HOOKS_DIR)) {
		mkdirSync(CCPEEK_HOOKS_DIR, { recursive: true });
		console.log(t("install.dirCreated", { path: CCPEEK_HOOKS_DIR }));
	} else {
		console.log(t("install.dirExists", { path: CCPEEK_HOOKS_DIR }));
	}

	// Create ccpeek data directory
	if (!existsSync(CCPEEK_DIR)) {
		mkdirSync(CCPEEK_DIR, { recursive: true });
		console.log(t("install.dataCreated", { path: CCPEEK_DIR }));
	} else {
		console.log(t("install.dataExists", { path: CCPEEK_DIR }));
	}

	// Initialize mapping file
	if (existsSync(SESSION_MAPPINGS_FILE)) {
		writeFileSync(SESSION_MAPPINGS_FILE, "");
		console.log(t("install.mappingCleared", { path: SESSION_MAPPINGS_FILE }));
	} else {
		writeFileSync(SESSION_MAPPINGS_FILE, "");
		console.log(t("install.mappingCreated", { path: SESSION_MAPPINGS_FILE }));
	}

	const scripts = [
		{ name: "record-session.sh", content: RECORD_SESSION_SCRIPT },
		{ name: "cleanup-session.sh", content: CLEANUP_SESSION_SCRIPT },
	];

	for (const { name, content } of scripts) {
		const target = join(CCPEEK_HOOKS_DIR, name);
		writeFileSync(target, content, { mode: 0o755 });
		console.log(t("install.scriptInstalled", { path: target }));
	}

	let settings: Settings = {};
	if (existsSync(SETTINGS_FILE)) {
		settings = JSON.parse(readFileSync(SETTINGS_FILE, "utf-8"));
	}

	settings.hooks = settings.hooks || {};
	settings.hooks.SessionStart = settings.hooks.SessionStart || [];
	settings.hooks.SessionEnd = settings.hooks.SessionEnd || [];

	const recordHook: Hook = {
		type: "command",
		command: RECORD_SESSION_HOOK_PATH,
	};
	const cleanupHook: Hook = {
		type: "command",
		command: CLEANUP_SESSION_HOOK_PATH,
	};

	const startEntry = settings.hooks.SessionStart.find((e) =>
		e.hooks.some((h) => h.command.includes("ccpeek")),
	);
	if (startEntry) {
		const idx = startEntry.hooks.findIndex((h) => h.command.includes("ccpeek"));
		startEntry.hooks[idx] = recordHook;
	} else {
		settings.hooks.SessionStart.push({ hooks: [recordHook] });
	}

	const endEntry = settings.hooks.SessionEnd.find((e) =>
		e.hooks.some((h) => h.command.includes("ccpeek")),
	);
	if (endEntry) {
		const idx = endEntry.hooks.findIndex((h) => h.command.includes("ccpeek"));
		endEntry.hooks[idx] = cleanupHook;
	} else {
		settings.hooks.SessionEnd.push({ hooks: [cleanupHook] });
	}

	settings.SessionStart = undefined;
	settings.SessionEnd = undefined;

	writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
	console.log(t("install.configUpdated", { path: SETTINGS_FILE }));
}
