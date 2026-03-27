import { homedir } from "node:os";
import { join } from "node:path";

// Base directories
export const CLAUDE_DIR = join(homedir(), ".claude");
export const CCPEEK_DIR = join(CLAUDE_DIR, "ccpeek");
export const HOOKS_DIR = join(CLAUDE_DIR, "hooks");
export const PROJECTS_DIR = join(CLAUDE_DIR, "projects");

// Config files
export const CONFIG_DIR = CCPEEK_DIR;
export const CONFIG_FILE = join(CCPEEK_DIR, "config.json");
export const SESSION_MAPPINGS_FILE = join(CCPEEK_DIR, "session-mappings.jsonl");
export const HISTORY_FILE = join(CLAUDE_DIR, "history.jsonl");
export const SETTINGS_FILE = join(CLAUDE_DIR, "settings.json");

// Hook files
export const CCPEEK_HOOKS_DIR = join(HOOKS_DIR, "ccpeek");
export const RECORD_SESSION_HOOK = join(CCPEEK_HOOKS_DIR, "record-session.sh");
export const CLEANUP_SESSION_HOOK = join(
	CCPEEK_HOOKS_DIR,
	"cleanup-session.sh",
);

// Hook paths for config (with ~)
export const RECORD_SESSION_HOOK_PATH =
	"~/.claude/hooks/ccpeek/record-session.sh";
export const CLEANUP_SESSION_HOOK_PATH =
	"~/.claude/hooks/ccpeek/cleanup-session.sh";

// Helper function
export function getProjectDir(projectKey: string): string {
	return join(PROJECTS_DIR, projectKey);
}
