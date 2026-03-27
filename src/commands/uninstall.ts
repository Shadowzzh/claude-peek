import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import {
	CCPEEK_DIR,
	CCPEEK_HOOKS_DIR,
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
	[key: string]: unknown;
}

export function uninstallCommand() {
	// Delete script directory
	if (existsSync(CCPEEK_HOOKS_DIR)) {
		rmSync(CCPEEK_HOOKS_DIR, { recursive: true, force: true });
		console.log(t("uninstall.dirRemoved", { path: CCPEEK_HOOKS_DIR }));
	} else {
		console.log(t("uninstall.dirNotFound", { path: CCPEEK_HOOKS_DIR }));
	}

	// Delete ccpeek data directory
	if (existsSync(CCPEEK_DIR)) {
		rmSync(CCPEEK_DIR, { recursive: true, force: true });
		console.log(t("uninstall.dirRemoved", { path: CCPEEK_DIR }));
	} else {
		console.log(t("uninstall.dirNotFound", { path: CCPEEK_DIR }));
	}

	// Clean up settings.json
	if (!existsSync(SETTINGS_FILE)) {
		console.log(t("uninstall.configNotFound", { path: SETTINGS_FILE }));
		return;
	}

	try {
		const settings: Settings = JSON.parse(readFileSync(SETTINGS_FILE, "utf-8"));

		if (!settings.hooks) {
			console.log(t("uninstall.noHooksConfig"));
			return;
		}

		let modified = false;

		// Clean SessionStart hooks
		if (settings.hooks.SessionStart) {
			const filtered = settings.hooks.SessionStart.map((entry) => ({
				hooks: entry.hooks.filter((h) => !h.command.includes("ccpeek")),
			})).filter((entry) => entry.hooks.length > 0);

			if (filtered.length !== settings.hooks.SessionStart.length) {
				settings.hooks.SessionStart = filtered;
				modified = true;
			}
		}

		// Clean SessionEnd hooks
		if (settings.hooks.SessionEnd) {
			const filtered = settings.hooks.SessionEnd.map((entry) => ({
				hooks: entry.hooks.filter((h) => !h.command.includes("ccpeek")),
			})).filter((entry) => entry.hooks.length > 0);

			if (filtered.length !== settings.hooks.SessionEnd.length) {
				settings.hooks.SessionEnd = filtered;
				modified = true;
			}
		}

		if (modified) {
			writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
			console.log(t("uninstall.configUpdated", { path: SETTINGS_FILE }));
		}

		console.log(t("uninstall.complete"));
	} catch (error) {
		console.error(`✗ Error: ${error}`);
	}
}
