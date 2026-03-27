// File size limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Preview lengths
export const MAX_THINKING_PREVIEW = 100;
export const MAX_TOOL_RESULT_PREVIEW = 200;
export const MAX_TOOL_PARAMS_PREVIEW = 100;
export const MAX_TEXT_SUMMARY_LENGTH = 50;

// Session view preview lengths
export const SESSION_PREVIEW_LENGTHS = {
	SHORT: 20,
	MEDIUM: 50,
	LONG: 100,
	EXTRA_LONG: 200,
} as const;

// Time intervals (in milliseconds)
export const INTERVALS = {
	PROCESS_REFRESH: 3000,
	PROCESS_CHECK: 1000,
	COPY_SUCCESS_NOTIFICATION: 2000,
} as const;

// Display settings
export const SEPARATOR_LENGTH = 80;
export const FILE_EXTENSION = ".jsonl";
