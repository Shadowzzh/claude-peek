import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import chalk from "chalk";
import { t } from "../i18n/index.js";
import { ProcessService } from "../services/ProcessService.js";
import type { SessionData } from "../services/ProcessService.js";

function formatTime(isoString: string): string {
	return new Date(isoString).toLocaleTimeString("zh-CN", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
}

function formatDate(isoString: string): string {
	return new Date(isoString).toLocaleString("zh-CN", {
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

function formatDuration(start: string, end: string): string {
	const duration = new Date(end).getTime() - new Date(start).getTime();
	const minutes = Math.floor(duration / 60000);
	const seconds = Math.floor((duration % 60000) / 1000);
	return `${minutes} 分 ${seconds} 秒`;
}

interface SessionOptions {
	md?: boolean;
	save?: string | boolean;
	copy?: boolean;
}

interface SessionCommandOptions extends SessionOptions {
	sessionId?: string;
}

/**
 * Display session data (common logic for running and history sessions)
 */
async function displaySessionData(
	sessionData: SessionData,
	source: { pid?: number; sourceType: "running" | "history" },
	options: SessionOptions,
): Promise<void> {
	const { messages, stats, session, projectName } = sessionData;

	// Determine output mode
	let outputMode: string | null = null;
	if (options.md) {
		outputMode = "md";
	} else if (options.save) {
		outputMode = "save";
	} else if (options.copy) {
		outputMode = "copy";
	}

	const service = new ProcessService();

	if (outputMode) {
		const markdown = service.generateMarkdown(sessionData);

		if (outputMode === "md") {
			console.log(markdown);
			return;
		}

		if (outputMode === "save") {
			const saveFilePath =
				typeof options.save === "string"
					? options.save
					: `/tmp/ccpeek_session_${source.pid ?? session.sessionId}_${Date.now()}.md`;

			try {
				const dir = dirname(saveFilePath);
				if (dir && dir !== ".") {
					mkdirSync(dir, { recursive: true });
				}
				writeFileSync(saveFilePath, markdown, "utf-8");
				console.log(
					chalk.green(t("session.success.saved", { path: saveFilePath })),
				);
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				console.error(
					chalk.red(t("session.errors.saveFailed", { error: error.message })),
				);
				process.exit(1);
			}
			return;
		}

		if (outputMode === "copy") {
			const { default: clipboardy } = await import("clipboardy");
			try {
				await clipboardy.write(markdown);
				console.log(chalk.green(t("session.success.copied")));
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				console.error(
					chalk.red(t("session.errors.copyFailed", { error: error.message })),
				);
				process.exit(1);
			}
			return;
		}
	}

	// Default: terminal output
	const sourceLabel =
		source.sourceType === "running"
			? chalk.gray(
					t("session.display.sourceRunning", { pid: source.pid ?? "" }),
				)
			: chalk.gray(t("session.display.sourceHistory"));

	console.log(
		chalk.bold.cyan(
			t("session.display.sessionTitle", {
				summary: session.summary,
				source: sourceLabel,
			}),
		),
	);

	// Statistics
	console.log(chalk.bold(t("session.display.statistics")));
	console.log(
		t("session.display.messages", {
			total: stats.totalMessages,
			user: stats.userMessages,
			ai: stats.assistantMessages,
		}),
	);
	console.log(
		t("session.display.tokens", {
			input: stats.totalInputTokens.toLocaleString(),
			output: stats.totalOutputTokens.toLocaleString(),
		}),
	);
	if (stats.startTime && stats.endTime) {
		const duration = formatDuration(stats.startTime, stats.endTime);
		const minutes = Math.floor(
			(new Date(stats.endTime).getTime() -
				new Date(stats.startTime).getTime()) /
				60000,
		);
		const seconds = Math.floor(
			((new Date(stats.endTime).getTime() -
				new Date(stats.startTime).getTime()) %
				60000) /
				1000,
		);
		console.log(t("session.display.duration", { minutes, seconds }));
	}
	if (stats.thinkingCount > 0) {
		console.log(t("session.display.thinking", { count: stats.thinkingCount }));
	}
	if (Object.keys(stats.toolCalls).length > 0) {
		const tools = Object.entries(stats.toolCalls)
			.map(([name, count]) => `${name}(${count})`)
			.join(", ");
		console.log(t("session.display.tools", { tools }));
	}

	console.log(
		chalk.bold(t("session.display.history", { count: messages.length })),
	);

	// 对话历史
	for (const msg of messages) {
		// 检查是否为工具结果消息
		const isToolResult =
			Array.isArray(msg.message?.content) &&
			msg.message.content.some((item) => item.type === "tool_result");

		const roleLabel = isToolResult
			? "TOOL_RESULT"
			: msg.type === "user"
				? "USER"
				: "AI";
		const roleColor = isToolResult
			? chalk.magenta
			: msg.type === "user"
				? chalk.green
				: chalk.blue;
		console.log(roleColor(`[${roleLabel}] ${formatTime(msg.timestamp)}`));

		if (typeof msg.message?.content === "string") {
			console.log(msg.message.content);
		} else if (Array.isArray(msg.message?.content)) {
			for (const item of msg.message.content) {
				if (item.type === "text" && item.text) {
					console.log(item.text);
				} else if (item.type === "thinking" && item.thinking) {
					console.log(
						chalk.yellow(
							`[THINKING] ${item.thinking.substring(0, 100)}${item.thinking.length > 100 ? "..." : ""}`,
						),
					);
				} else if (item.type === "tool_use" && item.name) {
					const params = item.input
						? ` ${JSON.stringify(item.input).substring(0, 100)}`
						: "";
					console.log(chalk.cyan(`[TOOL] ${item.name}${params}`));
				} else if (item.type === "tool_result") {
					const resultContent =
						typeof item.content === "string"
							? item.content.substring(0, 200)
							: JSON.stringify(item.content).substring(0, 200);
					console.log(
						chalk.gray(
							resultContent + (resultContent.length >= 200 ? "..." : ""),
						),
					);
				}
			}
		}
		console.log();
	}
}

/**
 * Show history sessions list
 */
function showHistorySessions(
	projectPath: string,
	sessions: ReturnType<ProcessService["getHistorySessions"]>,
): void {
	if (!sessions || sessions.length === 0) {
		console.log(chalk.yellow(t("session.errors.noHistorySessions")));
		return;
	}

	console.log(
		chalk.bold(
			t("session.display.historyTitle", { project: basename(projectPath) }),
		),
	);
	for (let i = 0; i < sessions.length; i++) {
		const s = sessions[i];
		const num = chalk.cyan((i + 1).toString().padStart(2, " "));
		const modified = chalk.gray(formatDate(s.modified));
		const summary = s.summary;
		console.log(`  ${num} ${modified} - ${summary}`);
	}
	console.log();
}

export async function sessionCommand(
	input?: string,
	options: SessionCommandOptions = {},
): Promise<void> {
	const { sessionId, ...outputOptions } = options;

	// Ensure at most one output option is used
	const outputModes = [
		outputOptions.md && "md",
		outputOptions.save && "save",
		outputOptions.copy && "copy",
	].filter(Boolean);

	if (outputModes.length > 1) {
		console.log(chalk.red(t("session.errors.multipleOutputModes")));
		return;
	}

	const service = new ProcessService();

	// If sessionId is provided, directly search history sessions
	if (input && sessionId) {
		const historySessions = service.getHistorySessions(input);
		if (!historySessions) {
			console.log(
				chalk.red(t("session.errors.projectNotFound", { path: input })),
			);
			return;
		}
		if (historySessions.length === 0) {
			console.log(chalk.yellow(t("session.errors.noHistorySessions")));
			return;
		}
		// Find by exact match or prefix
		const matched = historySessions.find(
			(s) => s.id === sessionId || s.id.startsWith(sessionId),
		);
		if (matched) {
			const sessionData = service.getHistorySessionData(input, matched.id);
			if (sessionData) {
				await displaySessionData(
					sessionData,
					{ sourceType: "history" },
					outputOptions,
				);
			}
			return;
		}
		console.log(chalk.red(t("session.errors.sessionNotFound", { sessionId })));
		showHistorySessions(input, historySessions);
		return;
	}

	// 1. Try running processes first
	const runningResult = service.selectProcess(input);
	if ("process" in runningResult) {
		const sessionData = service.getSessionData(runningResult.process);
		if (!sessionData) {
			console.log(chalk.yellow(t("session.errors.noSessionInfo")));
			return;
		}
		await displaySessionData(
			sessionData,
			{ pid: runningResult.process.pid, sourceType: "running" },
			outputOptions,
		);
		return;
	}

	// 2. If input is provided, try history sessions
	if (input) {
		const historySessions = service.getHistorySessions(input);

		if (!historySessions) {
			console.log(
				chalk.red(t("session.errors.projectNotFound", { path: input })),
			);
			return;
		}

		if (historySessions.length === 0) {
			console.log(chalk.yellow(t("session.errors.noHistorySessions")));
			return;
		}

		// No sessionId provided, use the latest (first in sorted list)
		const latest = historySessions[0];
		const sessionData = service.getHistorySessionData(input, latest.id);
		if (sessionData) {
			await displaySessionData(
				sessionData,
				{ sourceType: "history" },
				outputOptions,
			);
		}
		return;
	}

	// 3. Handle error cases from running processes
	if (runningResult.error === "NO_PROCESSES") {
		console.log(chalk.yellow(t("session.errors.noRunningProcesses")));
	} else if (runningResult.error === "PID_NOT_FOUND") {
		console.log(
			chalk.red(
				t("session.errors.processNotFound", { input: runningResult.pid }),
			),
		);
	} else if (runningResult.error === "MULTIPLE_PROCESSES") {
		console.log(chalk.yellow(t("session.errors.multipleProcesses")));
		for (const p of runningResult.processes) {
			console.log(`  ${p.pid} - ${p.cwd}`);
		}
	}
}
