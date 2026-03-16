import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { SessionMessage, SessionStats } from "../types.js";

export function getSessionFilePath(
	projectPath: string,
	sessionId: string,
): string {
	const projectKey = projectPath.replace(/\//g, "-");
	return join(
		homedir(),
		".claude",
		"projects",
		projectKey,
		`${sessionId}.jsonl`,
	);
}

export function parseSessionMessages(
	projectPath: string,
	sessionId: string,
): SessionMessage[] {
	const filePath = getSessionFilePath(projectPath, sessionId);
	if (!existsSync(filePath)) return [];

	const content = readFileSync(filePath, "utf-8");
	const lines = content.trim().split("\n");
	const messages: SessionMessage[] = [];

	for (const line of lines) {
		try {
			const record = JSON.parse(line);
			if (record.type === "user" || record.type === "assistant") {
				messages.push(record);
			}
		} catch {
			// ignore parse errors
		}
	}

	return messages;
}

export function calculateStats(messages: SessionMessage[]): SessionStats {
	const stats: SessionStats = {
		totalMessages: messages.length,
		userMessages: 0,
		assistantMessages: 0,
		totalInputTokens: 0,
		totalOutputTokens: 0,
		toolCalls: {},
		thinkingCount: 0,
		startTime: "",
		endTime: "",
	};

	for (const msg of messages) {
		if (msg.type === "user") stats.userMessages++;
		if (msg.type === "assistant") {
			stats.assistantMessages++;
			if (msg.message?.usage) {
				stats.totalInputTokens += msg.message.usage.input_tokens || 0;
				stats.totalOutputTokens += msg.message.usage.output_tokens || 0;
			}

			if (Array.isArray(msg.message?.content)) {
				for (const item of msg.message.content) {
					if (item.type === "tool_use" && item.name) {
						stats.toolCalls[item.name] = (stats.toolCalls[item.name] || 0) + 1;
					} else if (item.type === "thinking") {
						stats.thinkingCount++;
					}
				}
			}
		}

		if (msg.timestamp) {
			if (!stats.startTime) stats.startTime = msg.timestamp;
			stats.endTime = msg.timestamp;
		}
	}

	return stats;
}
