import chalk from "chalk";
import { getClaudeProcesses } from "../lib/process.js";
import type { ProcessInfo } from "../types.js";

export function listCommand(options: { json?: boolean }) {
	const processes = getClaudeProcesses();

	if (options.json) {
		console.log(JSON.stringify(processes, null, 2));
		return;
	}

	if (processes.length === 0) {
		console.log(chalk.yellow("未找到运行中的 Claude Code 进程"));
		return;
	}

	console.log(chalk.bold("\nClaude Code 进程:\n"));

	// 表头
	console.log(
		chalk.cyan(
			`${"PID".padEnd(8)}${"CPU".padEnd(8)}${"MEM".padEnd(8)}${"运行时长".padEnd(12)}${"项目名".padEnd(20)}会话`,
		),
	);
	console.log(chalk.gray("─".repeat(80)));

	// 进程列表
	for (const proc of processes) {
		console.log(
			`${String(proc.pid).padEnd(8)}${proc.cpu.padEnd(8)}${proc.mem.padEnd(8)}${proc.etime.padEnd(12)}${proc.projectName.padEnd(20)}${chalk.dim(proc.session?.summary || "N/A")}`,
		);
	}

	console.log(chalk.gray(`\n${"─".repeat(80)}`));
	console.log(chalk.green(`\n总计: ${processes.length} 个进程\n`));
}
