import {
	chmodSync,
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

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
	const targetDir = join(homedir(), ".claude", "hooks", "claude-ps");
	const sourceDir = resolve(process.cwd(), "hooks");
	const settingsFile = join(homedir(), ".claude", "settings.json");
	const mappingFile = join(homedir(), ".claude", "session-mappings.jsonl");

	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	if (existsSync(mappingFile)) {
		writeFileSync(mappingFile, "");
		console.log("✓ 已清空旧的映射文件");
	}

	const scripts = ["record-session.sh", "cleanup-session.sh"];

	for (const script of scripts) {
		const source = join(sourceDir, script);
		const target = join(targetDir, script);
		copyFileSync(source, target);
		chmodSync(target, 0o755);
		console.log(`✓ 已安装: ${target}`);
	}

	let settings: Settings = {};
	if (existsSync(settingsFile)) {
		settings = JSON.parse(readFileSync(settingsFile, "utf-8"));
	}

	settings.hooks = settings.hooks || {};
	settings.hooks.SessionStart = settings.hooks.SessionStart || [];
	settings.hooks.SessionEnd = settings.hooks.SessionEnd || [];

	const recordHook: Hook = {
		type: "command",
		command: "~/.claude/hooks/claude-ps/record-session.sh",
	};
	const cleanupHook: Hook = {
		type: "command",
		command: "~/.claude/hooks/claude-ps/cleanup-session.sh",
	};

	const startEntry = settings.hooks.SessionStart.find((e) =>
		e.hooks.some((h) => h.command.includes("claude-ps")),
	);
	if (startEntry) {
		const idx = startEntry.hooks.findIndex((h) =>
			h.command.includes("claude-ps"),
		);
		startEntry.hooks[idx] = recordHook;
	} else {
		settings.hooks.SessionStart.push({ hooks: [recordHook] });
	}

	const endEntry = settings.hooks.SessionEnd.find((e) =>
		e.hooks.some((h) => h.command.includes("claude-ps")),
	);
	if (endEntry) {
		const idx = endEntry.hooks.findIndex((h) =>
			h.command.includes("claude-ps"),
		);
		endEntry.hooks[idx] = cleanupHook;
	} else {
		settings.hooks.SessionEnd.push({ hooks: [cleanupHook] });
	}

	settings.SessionStart = undefined;
	settings.SessionEnd = undefined;

	writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
	console.log(`\n✓ 已更新配置: ${settingsFile}`);
}
