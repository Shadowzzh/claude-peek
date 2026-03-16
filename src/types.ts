export interface SessionInfo {
	sessionId: string;
	summary: string;
	messageCount: number;
	created: string;
	modified: string;
}

export interface ProcessInfo {
	pid: number;
	cpu: string;
	mem: string;
	etime: string;
	cwd: string;
	command: string;
	projectName: string;
	claudeProjectPath: string;
	session?: SessionInfo;
}

export interface SessionMessage {
	type: "user" | "assistant";
	timestamp: string;
	message?: {
		content: string | MessageContent[];
		usage?: {
			input_tokens?: number;
			output_tokens?: number;
		};
	};
}

export interface MessageContent {
	type: "text" | "tool_use" | "thinking";
	text?: string;
	thinking?: string;
	name?: string;
	input?: Record<string, unknown>;
}

export interface SessionStats {
	totalMessages: number;
	userMessages: number;
	assistantMessages: number;
	totalInputTokens: number;
	totalOutputTokens: number;
	toolCalls: Record<string, number>;
	thinkingCount: number;
	startTime: string;
	endTime: string;
}
