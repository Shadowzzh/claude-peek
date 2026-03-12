import { createRequire } from "node:module";
import { Command } from "commander";
import { listCommand } from "./commands/list.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

export function createCli() {
	const program = new Command();

	program
		.name("claude-ps")
		.description(
			"TUI application for viewing and managing Claude Code processes",
		)
		.version(version);

	program
		.command("list")
		.description("列出所有 Claude Code 进程")
		.option("--json", "以 JSON 格式输出")
		.action((options) => {
			listCommand(options);
		});

	return program;
}
