import chalk from "chalk";
import { ProcessService } from "../services/ProcessService.js";

export function killCommand(pid?: string) {
	const service = new ProcessService();
	const result = service.selectProcess(pid);

	if ("error" in result) {
		if (result.error === "NO_PROCESSES") {
			console.log(chalk.yellow("未找到运行中的 Claude Code 进程"));
		} else if (result.error === "PID_NOT_FOUND") {
			console.log(chalk.red(`未找到 PID 为 ${result.pid} 的进程`));
		} else if (result.error === "MULTIPLE_PROCESSES") {
			console.log(chalk.yellow("存在多个进程，请指定 PID："));
			for (const proc of result.processes) {
				console.log(`  ${proc.pid} - ${proc.projectName}`);
			}
		}
		return;
	}

	service.killProcess(result.process.pid);
	console.log(chalk.green(`✓ 已终止进程 ${result.process.pid}`));
}
