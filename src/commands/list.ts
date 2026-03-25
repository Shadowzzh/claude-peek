import chalk from "chalk";
import { t } from "../i18n/index.js";
import { padEndByWidth, truncateAndPad } from "../lib/format.js";
import { ProcessService } from "../services/ProcessService.js";

export function listCommand(options: { json?: boolean }) {
	const service = new ProcessService();
	const processes = service.getAllProcesses();

	if (options.json) {
		console.log(JSON.stringify(processes, null, 2));
		return;
	}

	if (processes.length === 0) {
		console.log(chalk.yellow(t("tui.messages.noProcess")));
		return;
	}

	console.log(chalk.bold("\nClaude Code:\n"));

	// 表头
	console.log(
		chalk.cyan(
			`${padEndByWidth(t("tui.table.pid"), 8)}${padEndByWidth(t("tui.table.cpu"), 8)}${padEndByWidth(t("tui.table.mem"), 8)}${padEndByWidth(t("tui.table.uptime"), 12)}${padEndByWidth(t("tui.table.project"), 20)}${t("tui.table.session")}`,
		),
	);
	console.log(chalk.gray("─".repeat(80)));

	// 进程列表
	for (const proc of processes) {
		const summary = (proc.session?.summary || "N/A").replace(/\s+/g, " ");
		const truncated = truncateAndPad(summary, 40).trimEnd();
		console.log(
			`${padEndByWidth(String(proc.pid), 8)}${padEndByWidth(proc.cpu, 8)}${padEndByWidth(proc.mem, 8)}${padEndByWidth(proc.etime, 12)}${padEndByWidth(proc.projectName, 20)}${chalk.dim(truncated)}`,
		);
	}

	console.log(chalk.gray(`\n${"─".repeat(80)}`));
	console.log(
		chalk.green(`\n${t("tui.messages.total", { count: processes.length })}\n`),
	);
}
