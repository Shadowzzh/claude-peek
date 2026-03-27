// Colors
export const COLORS = {
	PRIMARY: "cyan",
	DANGER: "red",
	WARNING: "yellow",
	SUCCESS: "green",
	INFO: "blue",
	HIGHLIGHT: "magenta",
} as const;

// Border styles
export const BORDER_STYLE = "round" as const;

// Message type colors
export const MESSAGE_TYPE_COLORS = {
	THINKING: "yellow",
	TOOL: "cyan",
	TOOL_RESULT: "magenta",
	USER: "green",
	AI: "blue",
} as const;

// Table column widths
export const COLUMN_WIDTHS = {
	PID: 10,
	CPU: 10,
	MEM: 10,
	UPTIME: 10,
	PROJECT: 20,
	SESSION: 40,
} as const;

// List row settings
export const LIST_ROW_WIDTH = 10;
