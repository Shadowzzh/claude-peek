#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import { render } from "ink";
import React from "react";
import { listCommand } from "./commands/list.js";
import { App } from "./components/App.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

program
	.name("claude-ps")
	.description("TUI application for viewing and managing Claude Code processes")
	.version(version);

program
	.command("list")
	.description("列出所有 Claude Code 进程")
	.option("--json", "以 JSON 格式输出")
	.action((options) => {
		listCommand(options);
	});

// 默认命令：启动 TUI
program.action(() => {
	render(<App />);
});

program.parse();
